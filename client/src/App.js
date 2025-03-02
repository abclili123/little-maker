import './App.css';
import Materials from "./components/Materials.js";
// import React, { useState, useEffect } from "react";

function App() {
  return (
    <div className="App">
      {/* This is a comment inside JSX */}
      {/* div for left side container idk what we named it on the figma */}
        {/* div for table-container */}
          {/* put the table component inside here */}
      {/* div for sidebar-container */}
        {/* put the tools component in here */}
        <Materials/>
    </div>
  );
}

export default App;
