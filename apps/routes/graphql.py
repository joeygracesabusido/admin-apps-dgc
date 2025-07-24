import strawberry
from fastapi import FastAPI
from strawberry.asgi import GraphQL

from apps.views.graphql_views import Query as BasicQuery


from apps.views.inventory_supplies_mutation import Mutation as InsertItems

from apps.views.get_inventory_query  import Query as GetInventory

#from apps.views.mutation import Mutatior


from apps.views.supplier_invt_supply import Mutation as Supply


@strawberry.type
class Query(BasicQuery, GetInventory):
    pass

class Mutation(InsertItems, Supply):
    pass

# Create a Strawberry schema
schema = strawberry.Schema(query=Query,mutation=Mutation)
 
graphql_app = GraphQL(schema)




