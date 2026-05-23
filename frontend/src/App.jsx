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

  return (

    <div style={{
      padding: "40px",
      fontFamily: "Arial"
    }}>

      <h1>Hyperliquid Dashboard</h1>

      {!market ? (

        <p>Loading...</p>

      ) : (

        <div>

          <h2>BTC Price</h2>
          <p>{market.price}</p>

          <h2>Buy Volume</h2>
          <p>{market.buy_volume}</p>

          <h2>Sell Volume</h2>
          <p>{market.sell_volume}</p>

          <h2>Last Trade</h2>

          <pre>
            {JSON.stringify(
              market.last_trade,
              null,
              2
            )}
          </pre>

        </div>
      )}

    </div>
  );
}

export default App;