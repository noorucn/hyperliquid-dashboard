import websockets
import json
import ssl

from app.state import market_state

WS_URL = "wss://api.hyperliquid.xyz/ws"

async def start_market_data():

    ssl_context = ssl._create_unverified_context()

    async with websockets.connect(
        WS_URL,
        ssl=ssl_context
    ) as websocket:

        subscribe_message = {
            "method": "subscribe",
            "subscription": {
                "type": "trades",
                "coin": "BTC"
            }
        }

        await websocket.send(json.dumps(subscribe_message))

        print("Connected to Hyperliquid")

        while True:

            message = await websocket.recv()

            data = json.loads(message)

            if "data" not in data:
                continue

            trades = data["data"]

            if not isinstance(trades, list):
                continue

            for trade in trades:

                if not isinstance(trade, dict):
                    continue

                side = trade.get("side")

                price = float(trade.get("px", 0))

                size = float(trade.get("sz", 0))

                market_state["price"] = price

                market_state["last_trade"] = trade

                if side == "B":
                    market_state["buy_volume"] += size

                elif side == "A":
                    market_state["sell_volume"] += size