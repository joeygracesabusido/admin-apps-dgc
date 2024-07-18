from fastapi import APIRouter, Body, HTTPException, Depends, Request, Response, status
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from typing import Union, List, Optional
from pydantic import BaseModel
from bson import ObjectId


from datetime import datetime, timedelta, date
from  ..authentication.authenticate_user import get_current_user


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


class Inventory(BaseModel):
    inventory_company: str
    inventory_item: str
    inventory_brand: Optional[str] = None
    inventory_amount: Optional[float] = None
    inventory_serial_no: Optional[str] = None
    inventory_user: Optional[str] = None
    inventory_department: Optional[str] = None
    inventory_date_issue: Optional[datetime] = None
    inventory_description: Optional[str] = None
    date_updated: Optional[datetime] = None
    date_created: Optional[datetime] = None




@api_invt.post('/api-insert-inventory-item')
async def insert_inventory_item(items:Inventory, username: str = Depends(get_current_user)):
    dataInsert = dict()
    dataInsert = {
        "inventory_company": items.inventory_company,
        "inventory_item": items.inventory_item,
        "inventory_brand": items.inventory_brand,
        "inventory_amount": items.inventory_amount,
        "inventory_serial_no":items.inventory_serial_no,
        "inventory_user": items.inventory_user,
        "inventory_department": items.inventory_department,
        "inventory_date_issue": items.inventory_date_issue,
        "inventory_description": items.inventory_description,
        "user": username,
        "date_created": datetime.now().isoformat(),
        "date_updated": items.date_updated.isoformat() if items.date_updated else None
        }
    mydb.inventory.insert_one(dataInsert)
    return {"message":"Data has been save"} 


@api_invt.get('/api-get-inventory-list')
async def find_all_user(username: str = Depends(get_current_user)):
    """This function is querying all inventory data"""

    result = mydb.inventory.find()
    
    inventory_data = [
        {
        "id": str(items['_id']),   
        "inventory_company": items['inventory_company'],
        "inventory_item": items['inventory_item'],
        "inventory_brand": items['inventory_brand'],
        "inventory_amount": items['inventory_amount'],
        "inventory_serial_no":items['inventory_serial_no'],
        "inventory_user": items['inventory_user'],
        "inventory_department": items['inventory_department'],
        "inventory_date_issue": items['inventory_date_issue'],
        "inventory_description": items['inventory_description'],
        "user": items['user'],
        "date_created": items['date_created'],
        "date_updated": items['date_updated']

        }
        for items in result
    ]

    return inventory_data


@api_invt.put("/inventory-update/{id}")
async def api_update_inventory(id: str,
                               items: Inventory,
                               username: str = Depends(get_current_user)):

    obj_id = ObjectId(id)

    update_data = {
        "inventory_company": items.inventory_company,
        "inventory_item": items.inventory_item,
        "inventory_brand": items.inventory_brand,
        "inventory_amount": items.inventory_amount,
        "inventory_serial_no": items.inventory_serial_no,
        "inventory_user": items.inventory_user,
        "inventory_department": items.inventory_department,
        "inventory_date_issue": items.inventory_date_issue,
        "inventory_description": items.inventory_description,
        "user": username,
        "date_updated": datetime.now()
    }

    result = mydb.inventory.update_one({'_id': obj_id}, {'$set': update_data})

    return ('Data has been Update')


@api_invt.get('/get-user')
async def find_all_user(token: str = Depends(get_current_user)):
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
  




