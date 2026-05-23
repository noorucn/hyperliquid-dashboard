import { useEffect, useState } from "react";

function App() {

  const [market, setMarket] = useState(null);

  async function fetchMarketData() {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/market"
      );

      const data = await response.json();

      setMarket(data);

    } catch (error) {

      console.log(error);
    }
  }

  useEffect(() => {

    fetchMarketData();

    const interval = setInterval(() => {

      fetchMarketData();

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  if (!market) {
    return <h1>Loading...</h1>;
  }

  const delta =
    market.buy_volume - market.sell_volume;

  return (

    <div style={{
      backgroundColor: "#0f172a",
      minHeight: "100vh",
      color: "white",
      padding: "30px",
      fontFamily: "Arial"
    }}>

      <h1 style={{
        marginBottom: "30px"
      }}>
        Hyperliquid Dashboard
      </h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px"
      }}>

        <div style={cardStyle}>
          <h2>BTC Price</h2>

          <p style={bigText}>
            ${market.price}
          </p>
        </div>

        <div style={cardStyle}>
          <h2>Delta</h2>

          <p style={{
            ...bigText,
            color: delta >= 0
              ? "#22c55e"
              : "#ef4444"
          }}>
            {delta.toFixed(4)}
          </p>
        </div>

        <div style={cardStyle}>
          <h2>Buy Volume</h2>

          <p style={{
            ...bigText,
            color: "#22c55e"
          }}>
            {market.buy_volume.toFixed(4)}
          </p>
        </div>

        <div style={cardStyle}>
          <h2>Sell Volume</h2>

          <p style={{
            ...bigText,
            color: "#ef4444"
          }}>
            {market.sell_volume.toFixed(4)}
          </p>
        </div>

      </div>

      <div style={{
        ...cardStyle,
        marginTop: "20px"
      }}>

        <h2>Live Trades</h2>

        <div>

          {market.recent_trades.map(
            (trade, index) => (

            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                padding: "10px 0",
                borderBottom:
                  "1px solid #334155",
                color:
                  trade.side === "B"
                    ? "#22c55e"
                    : "#ef4444"
              }}
            >

              <span>
                {trade.side === "B"
                  ? "BUY"
                  : "SELL"}
              </span>

              <span>
                {trade.sz}
              </span>

              <span>
                ${trade.px}
              </span>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

const cardStyle = {
  backgroundColor: "#1e293b",
  padding: "20px",
  borderRadius: "12px"
};

const bigText = {
  fontSize: "32px",
  fontWeight: "bold"
};

export default App;