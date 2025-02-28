from sqlalchemy import Column, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from database.models import BaseModel


class RefreshToken(BaseModel):
    __tablename__ = "refresh_tokens"

    user_id = Column(String(256), ForeignKey("users.id"), nullable=False)
    token = Column(Text, nullable=False)
    user = relationship("User", back_populates="refresh_tokens")