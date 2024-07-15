from fastapi import APIRouter, Body, HTTPException, Depends, Request, Response, status
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from typing import Union, List, Optional
from datetime import datetime, date , timedelta
from fastapi.responses import JSONResponse

from pydantic import BaseModel

from  ..authentication.authenticate_user import get_current_user

api_inventory= APIRouter()
templates = Jinja2Templates(directory="apps/templates")


@api_inventory.get("/employee-list/", response_class=HTMLResponse)
async def api_login(request: Request,username: str = Depends(get_current_user)):
    return templates.TemplateResponse("inventory/employee.html", {"request": request})


@api_inventory.get("/api-update-employee-list/{id}", response_class=HTMLResponse)
async def api_update_employee_html(request: Request,username: str = Depends(get_current_user)):
    return templates.TemplateResponse("inventory/update_employee.html", {"request": request})
        
    
    