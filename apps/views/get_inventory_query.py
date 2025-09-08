from datetime import datetime
from enum import unique
import strawberry

from bson import ObjectId

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
    supplier_id: Optional[str] = None
    user: Optional[str] = None
    created: Optional[datetime] = None
    updated: Optional[datetime] = None

@strawberry.type
class InventoryBalance:
    item_code: str
    item_name: str
    balance: float
    category: Optional[str] = None
    description: Optional[str] = None
    unit: Optional[str] = None
    reorder_level: Optional[int] = None
    price_per_unit: Optional[float] = None
    supplier_name: Optional[str] = None


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
    async def get_inventory_autocomplete(self, search_term: str,
                                         limit: int = 10 ) -> List[InventoryItemsQuery]:
        
        regex = re.compile(search_term, re.IGNORECASE)
        supply = mydb['inventory_supply_item']
        supplies = supply.find({
            'name': {'$regex': regex}
        }).limit(limit)

       
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
        "$addFields": {
            "supplier_id_obj": { "$toObjectId": "$supplier_id" }
        }
    },

            {
                "$lookup": {
                    "from": "inventory_supplier",
                    "localField": "supplier_id_obj",
                    "foreignField": "_id",
                    "as": "supplier"
                }
            },
            { "$unwind": { "path": "$supplier", "preserveNullAndEmptyArrays": True } },
            {
                "$project": {
                    "item_code": 1,
                    "name": 1,
                    "category": 1,
                    "description": 1,
                    "quantity_in_stock": 1,
                    "unit": 1,
                    "reorder_level": 1,
                    "price_per_unit": 1,
                    "updated": 1,
                    "supplier_id": "$supplier.name"
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
                description=item.get('description'),
                quantity_in_stock=item.get('quantity_in_stock', 0.0),
                unit=item.get('unit'),
                reorder_level=item.get('reorder_level'),
                price_per_unit=item.get('price_per_unit'),
                updated=item.get('updated'),
                supplier_id=item.get('supplier_id')
            )
            for item in results
        ]

    @strawberry.field
    async def get_inventory_balance(self) -> List[InventoryBalance]:
        pipeline = [
            {
                "$group": {
                    "_id": {
                        "item_code": "$item_code",
                        "item_name": "$item_name"
                    },
                    "in_quantity": {
                        "$sum": {
                            "$cond": [{"$eq": ["$transaction_type", "in"]}, "$quantity", 0]
                        }
                    },
                    "out_quantity": {
                        "$sum": {
                            "$cond": [{"$eq": ["$transaction_type", "out"]}, "$quantity", 0]
                        }
                    }
                }
            },
            {
                "$project": {
                    "item_code": "$_id.item_code",
                    "item_name": "$_id.item_name",
                    "balance": {"$subtract": ["$in_quantity", "$out_quantity"]},
                    "_id": 0
                }
            },
            {
                "$lookup": {
                    "from": "inventory_supply_item",
                    "localField": "item_code",
                    "foreignField": "item_code",
                    "as": "item_details"
                }
            },
            {
                "$unwind": {
                    "path": "$item_details",
                    "preserveNullAndEmptyArrays": True
                }
            },
            {
                "$addFields": {
                    "supplier_id_obj": { "$toObjectId": "$item_details.supplier_id" }
                }
            },
            {
                "$lookup": {
                    "from": "inventory_supplier",
                    "localField": "supplier_id_obj",
                    "foreignField": "_id",
                    "as": "supplier_details"
                }
            },
            {
                "$unwind": {
                    "path": "$supplier_details",
                    "preserveNullAndEmptyArrays": True
                }
            },
            {
                "$project": {
                    "item_code": 1,
                    "item_name": 1,
                    "balance": 1,
                    "category": "$item_details.category",
                    "description": "$item_details.description",
                    "unit": "$item_details.unit",
                    "reorder_level": "$item_details.reorder_level",
                    "price_per_unit": "$item_details.price_per_unit",
                    "supplier_name": "$supplier_details.name"
                }
            }
        ]
        transaction_collection = mydb['inventory_transactions']
        results = transaction_collection.aggregate(pipeline)
        return [
            InventoryBalance(
                item_code=item.get('item_code'),
                item_name=item.get('item_name'),
                balance=item.get('balance'),
                category=item.get('category'),
                description=item.get('description'),
                unit=item.get('unit'),
                reorder_level=item.get('reorder_level'),
                price_per_unit=item.get('price_per_unit'),
                supplier_name=item.get('supplier_name')
            )
            for item in results
        ]

