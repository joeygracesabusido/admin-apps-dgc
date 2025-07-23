from datetime import datetime
from enum import unique
import strawberry

from typing import Optional,List

from ..database.mongodb import create_mongo_client
mydb = create_mongo_client()


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
