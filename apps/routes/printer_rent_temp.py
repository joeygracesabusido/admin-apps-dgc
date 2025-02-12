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



from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

oauth_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="token")

# oauth_scheme = OAuth2PasswordBearer(tokenUrl="token")



api_rental_printer = APIRouter()
templates = Jinja2Templates(directory="apps/templates")


class RentalPrint(BaseModel):
    company: str
    printer_model: str
    serial_no: str
    location: str
    validity_date: str
    monthly_rent: float
    user: Optional[str] = None
    date_created: Optional[datetime] = datetime.now()
    date_updated: Optional[datetime] = datetime.now()
   

@api_rental_printer.get("/rental-printer/", response_class=HTMLResponse)
async def api_login(request: Request,username: str = Depends(get_current_user)):
    return templates.TemplateResponse("rent_printer/rent_printer.html", {"request": request})



@api_rental_printer.post('/api-insert-printer-rent/')
async def insert_check_printing_item(items: List[RentalPrint], username: str = Depends(get_current_user)):
    # Prepare a list of data entries to insert
    checkPrinting_collection = mydb['printer_rental']
    checkPrinting_collection.create_index("serial_no", unique=True)
   
    
    data_to_insert = []
    for item in items:
        dataInsert = {
            "company": item.company,
            "printer_model": item.printer_model,
            "serial_no": item.serial_no,
            "location": item.location,
            "validity_date": item.validity_date,
            "monthly_rent": item.monthly_rent,
            "user": username,
            "date_created": item.date_created,
            "date_updated": item.date_updated
        }
        data_to_insert.append(dataInsert)

    if data_to_insert:
        mydb.printer_rental.insert_many(data_to_insert)
    return {"message": "Check printing items have been saved successfully"}


@api_rental_printer.get('/api-get-printer-rental')
async def find_check_details(username: str = Depends(get_current_user)):
    """This function is querying all inventory data"""

    result = mydb.printer_rental.find().sort("date_created", 1)
    
    rental_data = [
        {
        "id": str(items['_id']),   
        "company": items['company'],
        "printer_model": items['printer_model'],
        "serial_no": items['serial_no'],
        "location": items['location'],
        "validity_date": items['validity_date'],
        "monthly_rent": items['monthly_rent'],
        "user": items['user'],
        "date_created": items['date_created'],
        "date_updated": items['date_updated']

        }
        for items in result
    ]

    return rental_data


@api_rental_printer.put("/api-update-printer-rental/{id}")
async def api_update_inventory(id: str,
                               item: RentalPrint,
                               username: str = Depends(get_current_user)):
    
    try:
        

        obj_id = ObjectId(id)

        update_data = {
              "company": item.company,
            "printer_model": item.printer_model,
            "serial_no": item.serial_no,
            "location": item.location,
            "validity_date": item.validity_date,
            "monthly_rent": item.monthly_rent,
            "user": username,
            "date_updated": item.date_updated
      }

        print(update_data)

        mydb.printer_rental.update_one({'_id': obj_id}, {'$set': update_data})

        return ('Data has been Update')
        
      
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


