import strawberry
from typing import List, Optional
from datetime import datetime
from ..database.mongodb import create_mongo_client
from ..authentication.authenticate_user import get_current_user
from strawberry.types import Info


@strawberry.input
class TransactionItemInput:
    item_name: str
    item_code: str
    quantity: float
    transaction_type: str
    transaction_date: datetime
    remarks: str
    department: str

@strawberry.type
class Mutation:
    @strawberry.mutation
    async def manage_inventory_transaction(self,info: Info, transaction_items: List[TransactionItemInput]) -> str:
        request = info.context['request']
        username = get_current_user(request)
        mydb = create_mongo_client()

        if username:
            try:

                transaction_collection = mydb['inventory_transactions']
                
                transactions_to_insert = []
                for item in transaction_items:
                    transactions_to_insert.append({
                        'item_code': item.item_code,
                        'item_name': item.item_name,
                        'quantity': item.quantity,
                        'transaction_type': item.transaction_type,
                        'transaction_date': item.transaction_date,
                        'department': item.department,
                        'remarks': item.remarks,
                        'created_at': datetime.now(),
                        'updated_at': datetime.now()
                    })

                if transactions_to_insert:
                    try:
                        print(f"Inserting {len(transactions_to_insert)} documents into inventory_transactions")
                        transaction_collection.insert_many(transactions_to_insert)
                        print("Successfully inserted documents")
                    except Exception as e:
                        print(f"Error inserting documents into inventory_transactions: {e}")
                        return f"Error: {e}"

                return "Inventory transactions recorded successfully."

            except Exception as e:
                return f"Unexpected Error: {str(e)}"
        
