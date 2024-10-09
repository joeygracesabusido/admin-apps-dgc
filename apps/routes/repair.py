from fastapi import APIRouter, Body, HTTPException, Depends, Request, Response, status
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from typing import Union, List, Optional
from datetime import datetime, date , timedelta
from fastapi.responses import JSONResponse

from pydantic import BaseModel

from  ..database.mongodb import create_mongo_client
mydb = create_mongo_client()

#from bson import ObjectId

from  ..authentication.authenticate_user import get_current_user

api_repair= APIRouter(include_in_schema=False)
templates = Jinja2Templates(directory="apps/templates")

class RepairItem(BaseModel):
    company: str
    srs: Optional[str]
    repair_date: Optional[datetime] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    remarks: Optional[str] = None
    repair_user: Optional[str] = None
    amount: Optional[float] = None
    department: Optional[str] = None
    user: Optional[str] = None
    date_updated: Optional[datetime] = None
    date_created: Optional[datetime] = None







@api_repair.get("/api-repair/", response_class=HTMLResponse)
async def api_ticketing(request: Request,username: str = Depends(get_current_user)):
    return templates.TemplateResponse("repair/printer_repair.html", {"request": request})



@api_repair.post('/api-insert-repair-item')
async def insert_inventory_item(items:RepairItem, username: str = Depends(get_current_user)):
     dataInsert = dict()
     dataInsert = {
         "company": items.company,
         "srs": items.srs,
         "repair_date": items.repair_date,
         "brand": items.brand,
         "model": items.model,
         "serial_number": items.serial_number,
         "remarks": items.remarks,
         "repair_user":items.repair_user,
         "amount":items.amount,
         "department": items.department,
         "user": username,
         "date_created": datetime.now().isoformat(),
         "date_updated": items.date_updated.isoformat() if items.date_updated else None
         }
     mydb.repair.insert_one(dataInsert)
     return {"message":"Data has been save"}


@api_repair.get('/api-get-repair-list/')
async def find_all_repair(username: str = Depends(get_current_user)):
    """This function is querying all repair data"""

    result = mydb.repair.find().sort("repair_date", -1)
    
    repair_data = [
        {
        "id": str(items['_id']),   
        "company": items['company'],
        "repair_date": items['repair_date'],
        "srs": items['srs'],
        "brand": items['brand'],
        "model": items['model'],
        "serial_number": items['serial_number'],
        "remarks": items['remarks'],
        "repair_user":items['repair_user'],
        "amount":items['amount'],
        "department": items['department'],
        "user": items['user'],
        "date_created": items['date_created'],
        "date_updated": items['date_updated']

        }
        for items in result
    ]

    return repair_data



