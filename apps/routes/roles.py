from fastapi import APIRouter, Body, HTTPException, Depends, Request, Response, status
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from typing import Union, List, Optional
from pydantic import BaseModel
from bson import ObjectId

from decimal import Decimal


from pymongo import  DESCENDING


from datetime import datetime, timedelta, date
from  ..authentication.authenticate_user import get_current_user


from  ..database.mongodb import create_mongo_client
mydb = create_mongo_client()


from ..authentication.utils import OAuth2PasswordBearerWithCookie

from jose import jwt


api_roles = APIRouter()



class Roles(BaseModel):
    name: str
    description: Optional[str] = None
    roles: List[str]
    user: Optional[str] = None
    date_created: Optional[datetime] = None
    date_updated: Optional[datetime] = None

   

@api_roles.post('/api-insert-roles/')
async def insert_roles(data:Roles, username: str = Depends(get_current_user)):

    user_data = mydb.login.find_one({'username': username})
    
    role_data = mydb.roles.find_one({'name':user_data['role']})

    
    if not role_data:
        raise HTTPException( status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authorized",)
    
    roles = role_data['roles']

    try:
        if 'Role' in roles:
            dataInsert = dict()
            # Get the current year
            roles_collection = mydb['roles']
            roles_collection.create_index("name", unique=True)
        


            dataInsert = {
                "name": data.name,
                "description": data.description,
                "roles":data.roles,
                "user": username,
                "date_created": datetime.now().isoformat(),
                "date_updated": data.date_updated.isoformat() if data.date_updated else None
            
            }
            mydb.roles.insert_one(dataInsert)
            return {"message": "Roles has been saved"}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authorized",
            # headers={"WWW-Authenticate": "Basic"},
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_roles.get('/api-get-roles')
async def find_all_job_order(username: str = Depends(get_current_user)):
    """This function is querying all inventory data"""

    user_data = mydb.login.find_one({'username': username})
    
    role_data = mydb.roles.find_one({'name':user_data['role']})

    
    if not role_data:
        raise HTTPException( status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authorized",)
    
    roles = role_data['roles']
    
  

    # print(roles)


    try:
        

        if 'Role' in roles:

            result = mydb.roles.find().sort("name", 1)

           
            # # Fetch sorted job orders
            # result = mydb.job_order.aggregate(pipeline)

            
            roles_data = [
                {
                "id": str(items['_id']),   
                "name": items['name'],
                "description": items['description'],
                "roles": items['roles'],
                "user": items['user'],
                "date_created": items['date_created'],
                "date_updated": items['date_updated'],

                }
                for items in result
            ]

            return roles_data
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authorized",
            # headers={"WWW-Authenticate": "Basic"},
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@api_roles.put("/api-update-role/{id}")
async def api_roles_update(id: str,
                               data: Roles,
                               username: str = Depends(get_current_user)):
    user_data = mydb.login.find_one({'username': username})
    
    role_data = mydb.roles.find_one({'name':user_data['role']})

    
    if not role_data:
        raise HTTPException( status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authorized",)
    
    roles = role_data['roles']

    try:
        if 'Role' in roles:    
   
    
   

            obj_id = ObjectId(id)

            update_data = {

                "name": data.name,
                "roles": data.roles,
                "user": username,
                "date_updated": datetime.now().isoformat() if data.date_updated else None
               
                
            }

            result = mydb.roles.update_one({'_id': obj_id}, {'$set': update_data})

            return ('Data has been Update')
    
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authorized",
            # headers={"WWW-Authenticate": "Basic"},
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    






  




