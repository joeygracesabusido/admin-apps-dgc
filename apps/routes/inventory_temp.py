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

api_inventory= APIRouter(include_in_schema=False)
templates = Jinja2Templates(directory="apps/templates")


@api_inventory.get("/employee-list/", response_class=HTMLResponse)
async def api_login(request: Request,username: str = Depends(get_current_user)):
    return templates.TemplateResponse("inventory/employee.html", {"request": request})


@api_inventory.get("/api-update-employee-list/{id}", response_class=HTMLResponse)
async def api_update_employee_html(request: Request,username: str = Depends(get_current_user)):
    return templates.TemplateResponse("inventory/update_employee.html", {"request": request})

@api_inventory.get("/inventory-list/", response_class=HTMLResponse)
async def api_update_employee_html(request: Request,username: str = Depends(get_current_user)):
    return templates.TemplateResponse("inventory/inventory_list.html", {"request": request})


@api_inventory.get("/inventory-update/{id}", response_class=HTMLResponse)
async def api_update_inventory_html(id: str, request: Request, username: str = Depends(get_current_user)):

    # Convert id to ObjectId
    obj_id = ObjectId(id)

    # Query for the specific inventory item
    item = mydb.inventory.find_one({'_id': obj_id})
    
    if item:
        # Convert ObjectId to string and prepare data for template
        inventory_data = {
            "id": str(item['_id']),
            "inventory_company": item['inventory_company'],
            "inventory_item": item['inventory_item'],
            "inventory_purchase_date": item['inventory_purchase_date'],
            "inventory_si_no": item['inventory_si_no'],
            "inventory_quantity": item['inventory_quantity'],
            "inventory_brand": item['inventory_brand'],
            "inventory_amount": item['inventory_amount'],
            "inventory_serial_no": item['inventory_serial_no'],
            "inventory_user": item['inventory_user'],
            "inventory_department": item['inventory_department'],
            "inventory_date_issue": item['inventory_date_issue'].strftime('%Y-%m-%d'),
            "inventory_description": item['inventory_description'],
            "user": item['user'],
            "date_created": item['date_created'],
            "date_updated": item['date_updated']
        }


        # Format date fields
        # if 'inventory_date_issue' in inventory_data and inventory_data['inventory_date_issue']:
        #     inventory_data['inventory_date_issue'] = datetime.strptime(
        #         inventory_data['inventory_date_issue'], '%Y-%m-%dT%H:%M:%S'
        #     ).strftime('%Y-%m-%d')

        return templates.TemplateResponse("inventory/update_inventory.html", {"request": request, "inventory_data": inventory_data})
    else:
        # Handle case where item with given id is not found (optional)
        return JSONResponse(status_code=404, content={"message": "Inventory item not found"})
        
    
    