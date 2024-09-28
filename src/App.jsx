import React, { useState, useEffect } from "react";
import "./App.css";
import StockContext from "./contexts/StockContext.js";
import StockForm from "./components/StockForm.jsx";

function App() {
  const [stockList, setStockList] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toLocaleString()
  );
  const value = { stockList, setStockList };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000); // Update the date and time every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <StockContext.Provider value={value}>
      <div>
        <h1>Finance Dashboard</h1>
        <h2>Stock Management Application</h2>
        <div className="clock">Current Date and Time: {currentDateTime}</div>
        <StockForm />
      </div>
    </StockContext.Provider>
  );
}

export default App;
