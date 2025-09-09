from fastapi import APIRouter, Body, HTTPException, Depends, Request, Response, status
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse
from typing import Union, List, Optional
from datetime import datetime, date , timedelta
from fastapi.responses import JSONResponse

from pydantic import BaseModel

from  ..database.mongodb import create_mongo_client
mydb = create_mongo_client()

from bson import ObjectId

from  ..authentication.authenticate_user import get_current_user

import logging

logging.basicConfig(level=logging.INFO)

api_supplier_temp= APIRouter(include_in_schema=False)
templates = Jinja2Templates(directory="apps/templates")


@api_supplier_temp.get("/supplier/", response_class=HTMLResponse)
async def api_ticketing(request: Request):
    try:
        username = get_current_user(request)
        return templates.TemplateResponse("inventory_supply/invt_supplier.html", {"request": request, "username": username})
    except Exception as e:
        logging.error(f"An error occurred in /supplier/ route: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# @api_supplier_temp.get("/inventory-supply", response_class=HTMLResponse)
# async def api_inventory_supply(request: Request, username: str = Depends(get_current_user)):
#     return templates.TemplateResponse("inventory_supply/inventory_supply.html",{"request":request})

@api_supplier_temp.get("/inventory-supply", response_class=HTMLResponse)
async def api_inventory_supply(request: Request, username: str = Depends(get_current_user)):
    return templates.TemplateResponse("inventory_supply/inventory_supply_clean.html",{"request":request})

@api_supplier_temp.get("/test-enhanced", response_class=HTMLResponse)
async def test_enhanced_template(request: Request):
    return templates.TemplateResponse("inventory_supply/inventory_supply_clean.html",{"request":request})

