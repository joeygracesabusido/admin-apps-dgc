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

api_jo_temp= APIRouter(include_in_schema=False)
templates = Jinja2Templates(directory="apps/templates")


@api_jo_temp.get("/ticketing/", response_class=HTMLResponse)
async def api_ticketing(request: Request,username: str = Depends(get_current_user)):
    return templates.TemplateResponse("job_order/ticketing.html", {"request": request})

@api_jo_temp.get("/-job-order/{id}", response_class=HTMLResponse)
async def api_update_inventory_html(id: str, request: Request, username: str = Depends(get_current_user)):

    try:
        if username == 'joeysabusido' or username == 'Dy':
            # Convert id to ObjectId
            obj_id = ObjectId(id)

            # Query for the specific inventory item
            item = mydb.job_order.find_one({'_id': obj_id})
            
            if item:
                # Convert ObjectId to string and prepare data for template
                inventory_data = {
                    "id": str(item['_id']),
                    "jo_offices": item['jo_offices'],
                    "jo_department": item['jo_department'],
                    "jo_ticket_no": item['jo_ticket_no'],
                    "jo_particular":item['jo_particular'],
                    "jo_status": item['jo_status'],
                    "jo_turn_overtime": item['jo_turn_overtime'],
                    "jo_remarks": item['jo_remarks'],
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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authorized",
            # headers={"WWW-Authenticate": "Basic"},
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



