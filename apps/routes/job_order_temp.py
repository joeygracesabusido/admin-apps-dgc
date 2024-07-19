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
async def api_login(request: Request,username: str = Depends(get_current_user)):
    return templates.TemplateResponse("job_order/ticketing.html", {"request": request})




