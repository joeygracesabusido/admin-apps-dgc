import strawberry
from fastapi import FastAPI
from strawberry.asgi import GraphQL

from apps.views.graphql_views import Query as BasicQuery


from apps.views.get_inventory_query  import Query as GetInventory
from apps.views.supplier_grapghql_query import Query as getSupplier

#from apps.views.mutation import Mutation

 
from apps.views.inventory_supplies_mutation import Mutation as InsertItems
from ..views.supplier_invt_supply import insertSupplierInvt




@strawberry.type
class Query(BasicQuery, GetInventory, getSupplier):
    pass

@strawberry.type
class Mutation(InsertItems, insertSupplierInvt):
    pass

# Create a Strawberry schema
schema = strawberry.Schema(query=Query,mutation=Mutation)
 
graphql_app = GraphQL(schema)




