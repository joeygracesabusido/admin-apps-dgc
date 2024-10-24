from fastapi import APIRouter, Body, HTTPException, Depends, Request, Response, status
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from typing import Union, List, Optional
from pydantic import BaseModel
from bson import ObjectId

from datetime import datetime, timedelta


from  ..database.mongodb import create_mongo_client
mydb = create_mongo_client()


from ..authentication.utils import OAuth2PasswordBearerWithCookie

from jose import jwt

JWT_SECRET = 'myjwtsecret'
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

api = APIRouter()
templates = Jinja2Templates(directory="apps/templates")



from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

oauth_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="token")

# oauth_scheme = OAuth2PasswordBearer(tokenUrl="token")



from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


from ..authentication.utils import OAuth2PasswordBearerWithCookie
from  ..authentication.authenticate_user import get_current_user


class SignUpModel(BaseModel):
    fullname: str
    username: str
    password: str
    created: Union[datetime, None] = None
    status: Optional[str] = None
    role: Optional[str] = None


class UpdateUser(BaseModel):
    status: str
    role: Optional[str] = None



def get_password_hash(password):
    return pwd_context.hash(password)

password1 = ""
def authenticate_user(username, password):
    
    user = mydb.login.find({
                            '$and':
                            [{"username":username}
                            ]})
    
    
    for i in user:
       
        username = i['username']
        password1 = i['password']
        
   
        if user:
            
            password_check = pwd_context.verify(password,password1)
            
            return password_check

            
        else :
            False



def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()

    expire = datetime.utcnow() + expires_delta

    to_encode.update({"exp": expire})

    
    return to_encode


@api.post('/token')
def login(response:Response,form_data: OAuth2PasswordRequestForm = Depends()):
    username = form_data.username
    password = form_data.password


    user = authenticate_user(username,password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": username},
        expires_delta=access_token_expires,
    )

    data = {"sub": username}
    jwt_token = jwt.encode(data,JWT_SECRET,algorithm=ALGORITHM)
    response.set_cookie(key="access_token", value=f'Bearer {jwt_token}',httponly=True)
    
    return {"access_token": jwt_token, "token_type": "bearer"}
    # return {"access_token": access_token, "token_type": "bearer"}
    # return(access_token)


@api.post('/sign-up')
def sign_up(data: SignUpModel):
    """This function is for inserting """
    #,token: str = Depends(oauth_scheme)

    login_collection = mydb['login']
    login_collection.create_index("username", unique=True)
    login_collection.create_index("fullname", unique=True)


    dataInsert = {
        "fullname": data.fullname,
        "username": data.username,
        "password": get_password_hash(data.password),
        "status": data.status,
        "created": data.created
    }
    mydb.login.insert_one(dataInsert)
    return {"message": "User has been saved"}


    # dataInsert = dict()
    # dataInsert = {
    #     "fullname": fullname,
    #     "username": username,
    #     "password": get_password_hash(password),
    #     "status": status,
    #     "created": created
    #     }
    # mydb.login.insert_one(dataInsert)
    # return {"message":"User has been save"} 


@api.get('/api-get-user')
async def find_all_user(username: str = Depends(get_current_user)):
    """This function is querying all user account"""
    result = mydb.login.find()

    user_data = [
        {
            "id": str(i['_id']), 
            "fullname": i["fullname"],
            "username": i["username"],
            "password": i['password'],
            "status": i['status'],
            "role": i['role'],
            "created": i["created"]

        }
        for i in result
    ]

    return user_data

@api.put("/api-update-user-status/{id}")
async def api_update_user_status(id: str,
                               item: UpdateUser,
                               username: str = Depends(get_current_user)):
    
       
    try:
        if username:

            obj_id = ObjectId(id)

            update_data = {
              "status": item.status,
              "role": item.role,
            }

            result = mydb.login.update_one({'_id': obj_id}, {'$set': update_data})

            return ('Data has been Update')
    
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authorized",
            # headers={"WWW-Authenticate": "Basic"},
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

  




