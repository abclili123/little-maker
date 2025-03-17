import './App.css';
import Materials from "./components/Materials.js";
import Tools from "./components/Tools.js";
import Table from "./components/Table.js";
// import React, { useState, useEffect } from "react";

function App() {
  return (
    <div className="App">
      {/* This is a comment inside JSX */}
      {/* div for left side container idk what we named it on the figma */}
        {/* div for table-container */}
        <Table/>
      {/* div for sidebar-container */}
        <Tools/>
        <Materials/>
    </div>
  );
}

export default App;
