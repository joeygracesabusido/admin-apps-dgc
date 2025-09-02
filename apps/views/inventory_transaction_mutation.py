import strawberry
from typing import List, Optional
from datetime import datetime
from ..database.mongodb import create_mongo_client

mydb = create_mongo_client()

@strawberry.input
class TransactionItemInput:
    item_code: str
    quantity: float
    transaction_type: str
    transaction_date: datetime
    department: str

@strawberry.type
class Mutation:
    @strawberry.mutation
    async def manage_inventory_transaction(self, transaction_items: List[TransactionItemInput]) -> str:
        inventory_collection = mydb['inventory_supply_item']
        transaction_collection = mydb['inventory_transactions']

        for item in transaction_items:
            # Find the inventory item
            inventory_item = inventory_collection.find_one({'item_code': item.item_code})

            if not inventory_item:
                raise Exception(f"Inventory item with code {item.item_code} not found.")

            # Update quantity_in_stock
            if item.transaction_type == 'in':
                new_quantity = inventory_item['quantity_in_stock'] + item.quantity
            elif item.transaction_type == 'out':
                new_quantity = inventory_item['quantity_in_stock'] - item.quantity
            else:
                raise Exception(f"Invalid transaction type: {item.transaction_type}")

            inventory_collection.update_one(
                {'item_code': item.item_code},
                {'$set': {'quantity_in_stock': new_quantity}}
            )

            # Insert transaction record
            transaction_collection.insert_one({
                'item_code': item.item_code,
                'quantity': item.quantity,
                'transaction_type': item.transaction_type,
                'transaction_date': item.transaction_date,
                'department': item.department,
                'created_at': datetime.now()
            })

        return "Inventory transactions recorded successfully."
