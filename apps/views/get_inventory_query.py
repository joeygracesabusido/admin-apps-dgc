from datetime import datetime
from enum import unique
import strawberry

from typing import Optional,List

from ..database.mongodb import create_mongo_client
mydb = create_mongo_client()

import re



@strawberry.type
class InventoryItemsQuery:
    id: Optional[str]
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
class Query:
    @strawberry.field
    async def get_inventory_supply_item(self) -> List[InventoryItemsQuery]:
        supply = mydb['inventory_supply_item']
        supplies = supply.find()


        return [InventoryItemsQuery(
                id = item.get('_id'),
                item_code = item.get('item_code'),
                name = item.get('name'),
                category = item.get('category'),
                description = item.get('description'),
                quantity_in_stock = item.get('quantity_in_stock'),
                unit = item.get('unit'),
                reorder_level = item.get('reorder_level'),
                price_per_unit = item.get('price_per_unit'),
                supplier_id = item.get('supplier_id'),
                created = item.get('created'),
                updated = item.get('updated')

        ) for item in supplies]


    @strawberry.field
    async def get_inventory_autocomplete(self, search_term: str) -> List[InventoryItemsQuery]:
        
        regex = re.compile(search_term, re.IGNORECASE)
        supply = mydb['inventory_supply_item']
        supplies = supply.find({
            'name': {'$regex': regex}
        })

       
        return [InventoryItemsQuery(
                id = str(item['_id']),
                item_code = item['item_code'],
                name = item['name'],
                category = item['category'],
                description = item['description'],
                quantity_in_stock = item['quantity_in_stock'],
                unit = item['unit'],
                reorder_level = item['reorder_level'],
                price_per_unit = item['price_per_unit'],
                supplier_id = item['supplier_id'],
                created = item['created'],
                updated = item['updated']

        ) for item in supplies]


