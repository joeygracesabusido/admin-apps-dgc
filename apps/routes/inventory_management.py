from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

router = APIRouter()
templates = Jinja2Templates(directory="apps/templates")

@router.get("/inventory-management/", response_class=HTMLResponse)
async def inventory_management(request: Request):
    return templates.TemplateResponse("inventory_supply/inventory_management.html", {"request": request})

@router.get("/management-transactions/", response_class=HTMLResponse)
async def management_transactions(request: Request):
    return templates.TemplateResponse("inventory_supply/management_transactions.html", {"request": request})
