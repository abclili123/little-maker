import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Materials from "./components/Materials.js";
import Tools from "./components/Tools.js";
import Table from "./components/Table.js";
// import React, { useState, useEffect } from "react";

function App() {
  return (
    <div className="App container-fluid">
      {/* Header */}
      <div className="row align-items-center py-3 border-bottom">
        <div className="col">
          <h1>Little Maker</h1>
        </div>
        <div className="col-auto">
          <button className="btn btn-secondary rounded-circle">?</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="row flex-grow-1" style={{ minHeight: '90vh' }}>
        {/* Left Column - Workspace */}
        <div className="col-md-7 p-3 border-end">
          <Table />
        </div>

        {/* Right Column - Sidebar */}
        <div className="col-md-5 p-3 d-flex flex-column">
          <Tools />
          <Materials />

          {/* Encyclopedia pinned at the bottom */}
          <div className="mt-auto p-3 bg-light border rounded">
            <p className="mb-0">Encyclopedia</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
