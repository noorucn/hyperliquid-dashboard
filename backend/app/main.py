import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.market_data import start_market_data
from app.state import market_state

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Start websocket when backend starts
@app.on_event("startup")
async def startup_event():

    asyncio.create_task(start_market_data())

# API endpoint
@app.get("/market")
async def get_market():

    return {
        "price": market_state["price"],
        "buy_volume": market_state["buy_volume"],
        "sell_volume": market_state["sell_volume"],
        "last_trade": market_state["last_trade"]
    }