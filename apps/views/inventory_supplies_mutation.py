from datetime import datetime
from enum import unique
import strawberry

from strawberry.types import Info

from strawberry import asdict

from typing import Optional,List

from ..authentication.authenticate_user import get_current_user


from ..database.mongodb import create_mongo_client
mydb = create_mongo_client()


@strawberry.input
class InventoryItems:
    item_code: str
    name: str
    category: str
    description: str
    quantity_in_stock: float
    unit: str
    reorder_level: int
    price_per_unit: float
    supplier_id: str
    user: Optional[str] = None
    created: Optional[datetime] = None
    updated: Optional[datetime] = None



@strawberry.input
class supplierInput:
    name: str
    contact_person: str
    email: str
    phone: str
    address: str
    user: Optional[str] = None
    created: Optional[datetime] = None
    updated: Optional[datetime] = None



inventory_item_collection = mydb['inventory_supply_item']
inventory_item_collection.create_index('item_code', unique=True)
inventory_item_collection.create_index('name', unique=True)


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def insert_inventory_supply_item(self,info: Info, inventory_items: InventoryItems) -> str:
        request: Request = info.context['request']
        username = get_current_user(request)
        try:
            data = {

            **inventory_items.__dict__,

                'created':inventory_items.created or datetime.utcnow(),
            'updated': datetime.utcnow(),
            'user': username
            
            }


            inventory_item_collection.insert_one(data)
            return f"Items inserted"
        except Exception as e:

            return f"Unexpected Error: {str(e)}"

    # @strawberry.mutation
    # async def insert_supplier_ivt_supply(self, int_supplier: supplierInput) -> str:
    #
    #     try:
    #
    #         invt_supplier_collection = mydb['inventory_supplier']
    #         invt_supplier_collection.create_index('name', unique=True)            
    #                     # data = {
    #         #
    #         # **int_supplier.__dict__,
    #         #
    #         #     'created_at':int_supplier.created_at or datetime.utcnow(),
    #         #     'updated_at': datetime.utcnow()
    #         # 
    #         # }
    #
    #         data = asdict(int_supplier)
    #         data['created_at'] = int_supplier.created_at or datetime.utcnow(),
    #         data['update_at'] = datetime.utcnow()
    #
    #         invt_supplier_collection.insert_one(data)
    #         return f"Items inserted"
    #
    #
    #     except Exception as e:
    #
    #         return f"Unexpected Error: {str(e)}"
    #
    #

    


