import requests
from requests.auth import HTTPBasicAuth
from requests import Response
import json
from typing import Dict
from . errors import HTTPError
import settings
from datetime import datetime
import base64


class Daraja:
    def __init__(self):
        self.consumer_key = settings.CONSUMER_KEY
        self.consumer_secret = settings.CONSUMER_SECRET
        self.access_token = None
        self.base_url = "https://sandbox.safaricom.co.ke"

    def authenticate(self):
        url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
        response = requests.get(url, auth=HTTPBasicAuth(self.consumer_key, self.consumer_secret))
        if response.status_code != 200:
            raise HTTPError.internal_server_error("Failed to authenticate")
        self.access_token = response.json().get("access_token")

    def send(self, url: str, method: str, data: Dict = None):
        if not self.access_token:
            self.authenticate()

        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }

        response = requests.request(method, url, headers=headers, json=data)
        return response

    def register_url(self, shortcode: str, response_type: str, confirmation_url: str, validation_url: str):
        url = f"{self.base_url}/mpesa/c2b/v1/registerurl"
        data = {
            "ShortCode": shortcode,
            "ResponseType": response_type,
            "ConfirmationURL": confirmation_url,
            "ValidationURL": validation_url
        }
        response = self.send(url, "POST", data)
        return response

    def simulate_c2b(self, shortcode: str, command_id: str, amount: str, msisdn: str, bill_ref_number: str):
        url = f"{self.base_url}/mpesa/c2b/v1/simulate"
        data = {
            "ShortCode": shortcode,
            "CommandID": command_id,
            "Amount": amount,
            "Msisdn": msisdn,
            "BillRefNumber": bill_ref_number
        }
        response = self.send(url, "POST", data)
        return response
    
    def lipa_na_mpesa_password(self, shortcode: str, passkey: str):
        lipa_time = datetime.now().strftime('%Y%m%d%H%M%S')

        data_to_encode = shortcode + passkey + lipa_time

        online_password = base64.b64encode(data_to_encode.encode())
        decode_password = online_password.decode('utf-8')
        return decode_password

    def lipa_na_mpesa_online(
            self, shortcode: str,
            amount: str, phone_number: str,
            callback_url: str, account_reference: str, 
            transaction_desc: str
            ):
        url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
        data = {
            "BusinessShortCode": shortcode,
            "Password": self.lipa_na_mpesa_password(shortcode, settings.DARAJA_PASSKEY),
            "Timestamp": datetime.now().strftime('%Y%m%d%H%M%S'),
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone_number,
            "PartyB": shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": callback_url,
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc
        }
        response = self.send(url, "POST", data)
        return response
    
    def query_stk_status(self, shortcode: str):
        url = f"{self.base_url}/mpesa/stkpushquery/v1/query"
        checkout_request_id = self.lipa_na_mpesa_online(shortcode).json().get("CheckoutRequestID")
        data = {
            "BusinessShortCode": shortcode,
            "Password": self.lipa_na_mpesa_password(shortcode, settings.DARAJA_PASSKEY),
            "Timestamp": datetime.now().strftime('%Y%m%d%H%M%S'),
            "CheckoutRequestID": checkout_request_id
        }
        response = self.send(url, "POST", data)
        return response
    
# daraja = Daraja()
# daraja.lipa_na_mpesa_online("174379", "1", "254768325056", "https://mydomain.com/path", "PascalShop", "test")