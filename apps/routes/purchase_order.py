from fastapi import APIRouter, Body, HTTPException, Depends, Request, Response, status
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from typing import Union, List, Optional
from pydantic import BaseModel
from bson import ObjectId

from decimal import Decimal


from pymongo import  DESCENDING


from datetime import datetime, timedelta, date
from  ..authentication.authenticate_user import get_current_user


from  ..database.mongodb import create_mongo_client
mydb = create_mongo_client()


from ..authentication.utils import OAuth2PasswordBearerWithCookie

from jose import jwt

JWT_SECRET = 'myjwtsecret'
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

api_purchase_order = APIRouter()



class PurchaseOrder(BaseModel):
    date: Optional[datetime] = None
    company: str
    po_no: Optional[str] = None
    supplier: str
    
    quantity: float
    description: str
    user: str
    username: Optional[str] = None
    date_updated: Optional[datetime] = None
    date_created: Optional[datetime] = None







@api_purchase_order.post('/api-insert-purchase-orber/')
async def insert_purchase_order(data:PurchaseOrder, username: str = Depends(get_current_user)):

    try:
        if username == 'joeysabusido' or username == 'Dy':
            dataInsert = dict()
            # Get the current year
            # employee_collection = mydb['employee_list']
            # employee_collection.create_index("employee_no", unique=True)

             # Get the current year
            current_year = datetime.now().year

            # Check for the latest job order for the current year
            latest_purchase_order = mydb.purchase_order.find_one(
                {"company": {"$regex": data.company}},
                sort=[("po_no", 1)]
            )

            if latest_purchase_order:
                # Extract the last number from the ticket number and increment it
                last_ticket_no = latest_purchase_order['latest_purchase_order']
                last_number = int(last_ticket_no.split('-')[-1])
                new_ticket_no = f"{data.company}-P.O.No: {current_year}-{last_number + 1}"
            else:
                # If no job order exists for the current year, start with QR-year-1
                new_ticket_no = f"{data.company}-P.O.No:{current_year}-1"
                


            dataInsert = {
                "date": data.date,
                "company": data.company,
                "po_no": new_ticket_no,
                "supplier": data.supplier,
                "quantity": data.quantity,
                "description": data.description,
                "user": data.user,
                "username": username,
                "date_created": datetime.now().isoformat(),
                "date_updated": data.date_updated.isoformat() if data.date_updated else None
            
            }
            mydb.purchase_order.insert_one(dataInsert)
            return {"message": "User has been saved"}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authorized",
            # headers={"WWW-Authenticate": "Basic"},
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@api_purchase_order.get('/api-get-purchase-orders/', response_model=List[PurchaseOrder])
async def get_purchase_orders(  
):
    try:
        
        
        # Fetch the purchase orders from the database
        purchase_orders = list(mydb.purchase_order.find())

        # Convert MongoDB cursor to list of dictionaries
        return purchase_orders

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))