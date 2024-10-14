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



api_check_printing = APIRouter()
templates = Jinja2Templates(directory="apps/templates")


class CheckPrinterDetails(BaseModel):
    trans_date: str
    check_no: str
    payee: str
    amount: float
    amount_in_words: str
    user: Optional[str] = None
    date_created: Optional[date] = None
    date_updated: Optional[datetime] = None  # Make it optional
   

@api_check_printing.get("/check-printing/", response_class=HTMLResponse)
async def api_login(request: Request,username: str = Depends(get_current_user)):
    return templates.TemplateResponse("check_printing/check_printing_per_bank.html", {"request": request})



@api_check_printing.post('/api-insert-check-printing/')
async def insert_check_printing_item(items: List[CheckPrinterDetails], username: str = Depends(get_current_user)):
    # Prepare a list of data entries to insert
    checkPrinting_collection = mydb['check_printing']
    checkPrinting_collection.create_index("check_no", unique=True)
   
    
    data_to_insert = []
    for item in items:
        dataInsert = {
            "trans_date": item.trans_date,
            "check_no": item.check_no,
            "payee": item.payee,
            "amount": item.amount,
            "amount_in_words": item.amount_in_words,
            "user": username,
            "date_created": datetime.now().isoformat(),
            "date_updated": item.date_updated.isoformat() if item.date_updated else None
        }
        data_to_insert.append(dataInsert)

    if data_to_insert:
        mydb.check_printing.insert_many(data_to_insert)
    return {"message": "Check printing items have been saved successfully"}


@api_check_printing.get('/api-get-check-printing')
async def find_check_details(username: str = Depends(get_current_user)):
    """This function is querying all inventory data"""

    result = mydb.check_printing.find().sort("trans_date", 1)
    
    inventory_data = [
        {
        "id": str(items['_id']),   
        "trans_date": items['trans_date'],
        "check_no": items['check_no'],
        "payee": items['payee'],
        "amount": items['amount'],
        "amount_in_words": items['amount_in_words'],
        "user": items['user'],
        "date_created": items['date_created'],
        "date_updated": items['date_updated']

        }
        for items in result
    ]

    return inventory_data


@api_check_printing.put("/api-check-printing-update/{id}")
async def api_update_inventory(id: str,
                               items: CheckPrinterDetails,
                               username: str = Depends(get_current_user)):
    
    try:
        

        obj_id = ObjectId(id)

        update_data = {
            "trans_date": items.trans_date,
            "check_no": items.check_no,
            "payee": items.payee,
            "amount": items.amount,
            "amount_in_words": items.amount_in_words,
            "user": username,
            "date_updated": datetime.now()
        }

        mydb.check_printing.update_one({'_id': obj_id}, {'$set': update_data})

        return ('Data has been Update')
        
      
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))






