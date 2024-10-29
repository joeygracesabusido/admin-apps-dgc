from fastapi import APIRouter, Body, HTTPException, Depends, Request, Response, status
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from typing import Union, List, Optional
from datetime import datetime, date , timedelta
from fastapi.responses import JSONResponse

from pydantic import BaseModel



from  ..database.mongodb import create_mongo_client
mydb = create_mongo_client()

from bson import ObjectId

from  ..authentication.authenticate_user import get_current_user

api_accountability= APIRouter()
templates = Jinja2Templates(directory="apps/templates")

class AccountabilityItem(BaseModel):
    date: datetime
    company: str
    name: str
    position: str
    department: str
    item:str
    item_description: str
    serial_no_model_no: str
    remarks: Optional[str] = None
    user: Optional[str] = None
    date_updated: Optional[datetime] = None
    date_created: Optional[datetime] = None







@api_accountability.get("/api-accountability/", response_class=HTMLResponse)
async def accountability(request: Request,username: str = Depends(get_current_user)):
    return templates.TemplateResponse("inventory/accountability.html", {"request": request})



@api_accountability.post('/api-insert-accountability-item')
async def insert_accountability_item(items:AccountabilityItem, username: str = Depends(get_current_user)):
     dataInsert = dict()
     dataInsert = {
         "date": items.date,
         "company": items.company,
         "name": items.name,
         "position": items.position,
         "department": items.department,
         "item": items.item,
         "item_description": items.item_description,
         "serial_no_model_no":items.serial_no_model_no,
         "remarks":items.remarks,
         "user": username,
         "date_created": datetime.now().isoformat(),
         "date_updated": items.date_updated.isoformat() if items.date_updated else None
         }
     mydb.accountability.insert_one(dataInsert)
     return {"message":"Data has been save"}


@api_accountability.get('/api-get-accountability-list/')
async def find_all_accountability(username: str = Depends(get_current_user)):
    """This function is querying all repair data"""

    result = mydb.accountability.find().sort("repair_date", -1)
    
    repair_data = [
        {
        "id": str(items['_id']),   
        "company": items['company'],
        "date": items['date'],
        "name": items['name'],
        "position": items['position'],
        "department": items['department'],
        "item": items['item'],
        "item_description": items['item_description'],
        "serial_no_model_no":items['serial_no_model_no'],
        "remarks":items['remarks'],
        "user": items['user'],
        "date_created": items['date_created'],
        "date_updated": items['date_updated']

        }
        for items in result
    ]

    return repair_data

@api_accountability.get('/api-update-accountability/{id}')
async def update_accountability_html(id: str,username: str = Depends(get_current_user)):
    """This function is for updating repair"""

    obj_id =  ObjectId(id)
    
    items = mydb.accountability.find_one({'_id': obj_id})

    if items:

        accountability_data ={
                "id": str(items['_id']),   
                "company": items['company'],
                "date": items['date'],
                "name": items['name'],
                "position": items['position'],
                "department": items['department'],
                "item": items['item'],
                "item_description": items['item_description'],
                "serial_no_model_no":items['serial_no_model_no'],
                "remarks":items['remarks'],
                "user": items['user'],
                "date_updated": items['date_updated']

        }

        return accountability_data

        # return templates.TemplateResponse("repair/update_repair.html", 
        #                                {"request": request, "repair_data": repair_data})
    else:
        # Handle case where item with given id is not found (optional)
        return JSONResponse(status_code=404, content={"message": "Repair item not found"})
    
@api_accountability.put("/accountability-update/{id}")
async def api_update_accountability(id: str,
                               items:AccountabilityItem,
                               username: str = Depends(get_current_user)):
    
    
    

    obj_id = ObjectId(id)

    update_data = {
        "date": items.date,
         "company": items.company,
         "name": items.name,
         "position": items.position,
         "department": items.department,
         "item": items.item,
         "item_description": items.item_description,
         "serial_no_model_no":items.serial_no_model_no,
         "remarks":items.remarks,
         "user": username,
         "date_updated": datetime.now().isoformat()
        }
    
    
        

    mydb.accountability.update_one({'_id': obj_id}, {'$set': update_data})

    return ('Data has been Update')
        
        

    



