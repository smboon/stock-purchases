import React, { useEffect, useState, useContext, useCallback } from "react";
import "./StockStyling.css";
import StockContext from "../contexts/StockContext";

function StockForm() {
  const [StockSymbol, setStockSymbol] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [PurchasePrice, setPurchasePrice] = useState("");
  const [CurrentPrice, setCurrentPrice] = useState("");
  const [error, setError] = useState(null);
  const contextValue = useContext(StockContext);
  const [displayedStocks, setDisplayedStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateStockWithPrice = useCallback(
    (symbol, currentPrice) => {
      const lastStock =
        contextValue.stockList[contextValue.stockList.length - 1];
      if (lastStock && lastStock.symbol === symbol) {
        const profitLoss = (
          (currentPrice - lastStock["purchase-price"]) *
          lastStock["quantity"]
        ).toFixed(2);
        const updatedStock = {
          ...lastStock,
          "current-price": currentPrice.toFixed(2),
          "profit-loss": profitLoss,
        };
        setDisplayedStocks((prevStocks) => [...prevStocks, updatedStock]); // Append new stock data
      }
    },
    [contextValue.stockList]
  );

  function addStock(newStock) {
    const updatedStockList = [...contextValue.stockList, newStock];
    contextValue.setStockList(updatedStockList);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (StockSymbol && Quantity && PurchasePrice) {
      const quantityNum = Number(Quantity);
      const purchasePriceNum = Number(PurchasePrice);

      if (quantityNum <= 0 || purchasePriceNum <= 0) {
        alert("Quantity and Purchase Price must be positive numbers.");
        return;
      }

      const newStock = {
        symbol: StockSymbol,
        quantity: quantityNum,
        "purchase-price": purchasePriceNum,
        "current-price": "",
        "profit-loss": "",
      };
      addStock(newStock);
      setStockSymbol("");
      setQuantity("");
      setPurchasePrice("");
    }
  }

  const APIcall = useCallback(
    async (latestSymbol) => {
      setIsLoading(true);
      setError(null); // Reset error state before the call
      try {
        const response = await fetch(
          "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" +
            latestSymbol +
            "&apikey=OQ8KEA7N6QA2YA70"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const currentPrice = parseFloat(data["Global Quote"]["05. price"]);
        setCurrentPrice(currentPrice);
        updateStockWithPrice(latestSymbol, currentPrice);
      } catch (error) {
        setError("Error fetching data: " + error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [updateStockWithPrice]
  );

  useEffect(() => {
    if (contextValue.stockList.length > 0) {
      const latestSymbol =
        contextValue.stockList[contextValue.stockList.length - 1]["symbol"];
      APIcall(latestSymbol);
    }
  }, [contextValue.stockList, APIcall]);

  return (
    <div>
      <form id="user-input" onSubmit={handleSubmit} className="for-submission">
        <input
          type="text"
          value={StockSymbol}
          id="symbol"
          onChange={(event) => setStockSymbol(event.target.value)}
          placeholder="Stock Symbol"
          required
        />
        <input
          type="number"
          value={Quantity}
          id="quantity"
          onChange={(event) => setQuantity(event.target.value)}
          placeholder="Quantity"
          required
        />
        <input
          type="number"
          value={PurchasePrice}
          id="purchase-price"
          onChange={(event) => setPurchasePrice(event.target.value)}
          placeholder="Purchase Price"
          required
        />
        <button onClick={handleSubmit} type="submit" id="submission-button">
          Add Stock
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <h2>Stock List</h2>
      {contextValue.stockList.length === 0 && <p>No stocks added yet</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        displayedStocks.length > 0 && (
          <div>
            {displayedStocks.map((stock, index) => (
              <div key={`${stock.symbol}-${index}`} className="results">
                <span>Symbol: {stock.symbol}</span>
                <span>Quantity: {stock.quantity}</span>
                <span>Purchase Price: {stock["purchase-price"]}</span>
                <span>Current Price: {stock["current-price"]}</span>
                <span
                  className={
                    stock["profit-loss"] >= 0 ? "stock-profit" : "stock-loss"
                  }
                >
                  Profit/Loss: {stock["profit-loss"]}
                </span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default StockForm;
