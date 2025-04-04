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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1 class="header light-head">Materials</h1>

      <div class="row materials-bar">
        <div class="col-5">
          <div className="materials-search-add" id="filter-by-tag">
            <input type="text" placeholder="Filter by Tag" />
            <span>{'\u00D7'}</span>
          </div>
        </div>
        <div class="col-7">
          <div className="materials-search-add" id="search-materials">
            <input type="text" placeholder="Search or Add Materials" />
            <span>{'\u00D7'}</span>
          </div>
        </div>
      </div>

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
      class="material-block"
      style={{ 
        cursor: inPlayArea ? 'grab' : 'copy',
        ...style
      }}
    >
      {emoji} {name}
    </Component>
  );
};


export { Materials, Material };
