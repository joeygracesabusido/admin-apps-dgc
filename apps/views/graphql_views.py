import strawberry
from typing import Optional,List

from datetime import date, datetime


from  ..database.mongodb import create_mongo_client
mydb = create_mongo_client()


@strawberry.type
class User:


    fullname: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    created: Optional[str] = None


@strawberry.type
class EmployeeDetailsQuery:
    _id: Optional[str] = None
    employee_id: Optional[str] = None
    employee_name: Optional[str] = None
    division: Optional[str] = None
    position: Optional[str] = None
    status: bool
    created: Optional[datetime] = None
    updated: Optional[str] = None



@strawberry.type
class InventoryDetailQuery:


    _id: Optional[str] = None
    inventory_company: str
    inventory_item: str
    inventory_purchase_date: Optional[datetime] = None
    inventory_si_no: Optional[str] = None
    inventory_quantity: Optional[float] = None
    inventory_brand: Optional[str] = None
    inventory_amount: Optional[float] = None
    inventory_serial_no: Optional[str] = None
    inventory_user: Optional[str] = None
    inventory_department: Optional[str] = None
    inventory_date_issue: Optional[datetime] = None
    inventory_description: Optional[str] = None
    date_updated: Optional[datetime] = None
    date_created: Optional[datetime] = None



@strawberry.type
class Query:

    @strawberry.field
    async def get_users(self) -> Optional[List[User]]:
        result = mydb.login.find()
        # Convert MongoDB cursor to a list of User objects
        users = [User(fullname=user['fullname'], username=user['username'],
                      password=user['password'], created=user['created']) for user in result]
        return users

    # Define a field to fetch a single user by username
    @strawberry.field
    async def get_user_by_username(self, username: str) -> Optional[User]:
        user = mydb.login.find_one({"username": username})
        if user:
            return User(fullname=user['fullname'], 
                        username=user['username'], password=user['password'], created=user['created'])
        else:
            return None


    @strawberry.field
    async def get_all_employees(self) -> List[EmployeeDetailsQuery]:
        employee_collection = mydb['employee']
        employees = employee_collection.find()

        return [EmployeeDetailsQuery( 
                _id = employee.get('_id'),
                employee_id=employee.get('employee_id'),
                employee_name=employee.get('employee_name'),
                division=employee.get('division'),
                position=employee.get('positioin'),
                status=employee.get('status'),
                created=employee.get('created'),
                updated=employee.get('updated')
            ) for employee in employees]


    @strawberry.field
    async def get_inventory_list(self) -> List[InventoryDetailQuery]:
        inventory_collection = mydb['inventory']
        inventory = inventory_collection.find()

        return [ 
            InventoryDetailQuery( 
                _id = x.get('_id'),
                inventory_company=x.get(' inventory_company'),
                inventory_purchase_date=x.get('inventory_purchase_date'),
                inventory_si_no=x.get(''),
                inventory_quantity=x.get('inventory_quantiry'),
                inventory_brand=x.get('inventory_brand'),
                inventory_amount=x.get('inventory_amount'),     
                inventory_serial_no=x.get('inventory_serial_no'),
                 inventory_user=x.get('inventory_user'),
                 inventory_department=x.get('inventory_department'),
                 inventory_date_issue=x.get('inventory_date_issue'),
                 inventory_description=x.get('inventory_description'),
                 user=x.get('user'),
                 date_created=x.get('date_created'),
                 date_updated=x.get('date_updated'),

            ) for x in inventory
            ]

    

    

