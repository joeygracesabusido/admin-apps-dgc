from datetime import datetime
from enum import unique
import strawberry

from typing import Optional,List

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
    created: Optional[datetime] = None
    updated: Optional[datetime] = None


@strawberry.type

class Mutation:
    @strawberry.mutation
    async def insert_inventory_supply_item(self, inventory_items: InventoryItems) -> str:

        try:
            inventory_item_collection = mydb['inventory_supply_item']
            inventory_item_collection.create_index('item_code', unique=True)
            inventory_item_collection.create_index('name', unique=True)

            data = {

            **inventory_items.__dict__,

                'created':inventory_items.created or datetime.utcnow(),
            'updated': datetime.utcnow()
            
            }


            inventory_item_collection.insert_one(data)
            return f"Items inserted"
        except Exception as e:

            return f"Unexpected Error: {str(e)}"


