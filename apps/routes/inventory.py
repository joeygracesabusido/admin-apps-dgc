from fastapi import APIRouter, Body, HTTPException, Depends, Request, Response, status
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from typing import Union, List, Optional


from datetime import datetime, timedelta


from  ..database.mongodb import create_mongo_client
mydb = create_mongo_client()


from ..authentication.utils import OAuth2PasswordBearerWithCookie

from jose import jwt

JWT_SECRET = 'myjwtsecret'
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

api_invt = APIRouter()
templates = Jinja2Templates(directory="apps/templates")



from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

oauth_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="token")

# oauth_scheme = OAuth2PasswordBearer(tokenUrl="token")



from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



@api_invt.get('/get-user')
async def find_all_user(token: str = Depends(oauth_scheme)):
    """This function is querying all user account"""
    result = mydb.login.find()

    user_data = [
        {
             "fullname": i["fullname"],
            "username": i["username"],
            "password": i['password'],
            "created": i["created"]

        }
        for i in result
    ]

    return user_data
  




