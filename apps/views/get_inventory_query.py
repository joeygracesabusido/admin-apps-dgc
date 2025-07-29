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
    user: Optional[str] = None
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






    @strawberry.field
    async def get_inventory_with_supplier(self) -> List[InventoryItemsQuery]:
        pipeline = [
            {
                "$lookup": {
                    "from": "inventory_supplier",
                    "localField": "supplier_id",
                    "foreignField": "_id",
                    "as": "supplier"
                }
            },
            { "$unwind": "$supplier" },
            {
                "$project": {
                    "item_code": 1,
                    "name": 1,
                    "category": 1,
                    "quantity_in_stock": 1,
                    "unit": 1,
                    "reorder_level": 1,
                    "price_per_unit": 1,
                    "updated_at": 1,
                    "supplier_name": "$supplier.name"
                }
            }
        ]

        inventory_collection = mydb['inventory_supply_item']
        results = inventory_collection.aggregate(pipeline)

        return [
            InventoryItemsQuery(
                id=str(item.get('_id')),
                item_code=item.get('item_code'),
                name=item.get('name'),
                category=item.get('category'),
                quantity_in_stock=item.get('quantity_in_stock', 0.0),
                unit=item.get('unit'),
                reorder_level=item.get('reorder_level'),
                price_per_unit=item.get('price_per_unit'),
                updated_at=item.get('updated_at'),
                supplier_name=item.get('supplier_name')
            )
            for item in results
        ]

