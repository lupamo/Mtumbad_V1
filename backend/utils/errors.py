from fastapi import HTTPException, status
from sqlalchemy.orm import Session


class HTTPError():
    
    @staticmethod
    def not_found(detail: str):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=detail)
    
    @staticmethod
    def unauthorized(detail: str):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)
    
    @staticmethod
    def forbidden(detail: str):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)
    
    @staticmethod
    def bad_request(detail: str):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)
    
    @staticmethod
    def internal_server_error(detail: str):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=detail)
    
    @staticmethod
    def conflict(detail: str):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=detail)
    
    @staticmethod
    def unprocessable_entity(detail: str):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)