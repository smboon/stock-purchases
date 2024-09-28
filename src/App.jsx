import React, { useState, useEffect } from "react";
import "./App.css";
import StockContext from "./contexts/StockContext.js";
import StockForm from "./components/StockForm.jsx";
import icon from "./components/icon.jpg"; // Import the logo

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
      <div className="app-container">
        <div className="header">
          <img src={icon} alt="App Logo" className="logo" />
          <div className="titles">
            <h1>Finance Dashboard</h1>
            <h2>Stock Management Application</h2>
          </div>
        </div>
        <div className="clock">Current Date and Time: {currentDateTime}</div>
        <StockForm />
      </div>
    </StockContext.Provider>
  );
}

export default App;
