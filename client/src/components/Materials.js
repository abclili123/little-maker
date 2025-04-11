import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

function Materials({ onMaterialClick }) {
  // State variables to store fetched materials, loading state, and errors
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); //track loading
  const [error, setError] = useState(null);

  //fetches materials from flask backend
  useEffect(() => {
    fetch('/materials') //ensures flask server is runnings
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data); //store fetched materials in state
        setLoading(false);
        console.log(data); // confirm data sent
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs once when the component mounts (runs once)

  return (
    <div>
      <h1 className="header light-head">Materials</h1>
  
      <div className="row materials-bar">
        <div className="col-5">
          <div className="materials-search-add" id="filter-by-tag">
            <input type="text" placeholder="Filter by Tag" />
            <img src="/assets/ui_icons/search.svg" alt="Search" className="search-icon" />
          </div>
        </div>
        <div className="col-7">
          <MaterialSearch setData={setData} setLoading={setLoading} />
        </div>
      </div>
  
      {error && <div>Error: {error.message}</div>}
  
      {loading ? (
        <div className="materials-container">Loading...</div>
      ) : data.length === 0 ? (
        <div className="materials-container">No materials found.</div>
      ) : (
        <div className="materials-container">
          {data.map((material, i) => (
            <Material
              key={i}
              id={i}
              emoji={material.emoji}
              name={material.name}
              onClick={() => onMaterialClick(material)}
            />
          ))}
        </div>
      )}
    </div>
  );  
}

const Material = ({ id, emoji, name, onClick, onDragEnd = null, style = {}, inPlayArea = false, drag = false }) => {
  const Component = drag ? motion.div : 'div';
  
  return (
    <Component 
      id={id}
      onClick={onClick}
      drag={drag}
      dragMomentum={false} 
      whileDrag={{ scale: 1.2 }}
      onDragEnd={onDragEnd}
      style={{ 
        cursor: inPlayArea ? 'grab' : 'copy', 
        display: 'inline-block', 
        padding: '10px', 
        margin: '5px', 
        background: 'white', 
        borderRadius: '3px', 
        border: 'solid #ccc 1px',
        ...style
      }}
    >
      {emoji} {name}
    </Component>
  );
};

const MaterialSearch = ({ setData, setLoading }) => {
  const [query, setQuery] = useState("");

  const searchMaterials = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/materials?search=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Search failed");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setData([]); // optional: or show a specific message
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchMaterials();
    }
  };

  return (
    <div className="materials-search-add" id="search-materials">
      <input
        type="text"
        placeholder="Search or Add Materials"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <img
        src="/assets/ui_icons/search.svg"
        alt="Search"
        className="search-icon"
        onClick={searchMaterials}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};


export { Materials, Material };
