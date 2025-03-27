import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

function Tools( {onToolClick} ) {
  // State variables to store fetched tools, loading state, and errors
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); //track loading
  const [error, setError] = useState(null);

  //fetches tools from flask backend
  useEffect(() => {
    fetch('/tools') //ensures flask server is runnings
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data); //store fetched tools in state
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

  // show all tools
  return (
    <div>
      <h1 class="pad-left light-head">Tools</h1>

      <div className="search-bar">
        <input type="text" placeholder="Search Available Tools" />
        <img src="/assets/ui_icons/search.svg" alt="Search" className="search-icon" />
      </div>

      <div class="tools-container">
        <div>
          <div className="row">
            {data.map((tool, i) => (
              <Tool 
                key={i}
                id={i}
                img={tool.img}
                name={tool.name}
                onClick={() => onToolClick(tool)}
                classes = "col-4 mb-3 text-center tool-box"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Tool = ({ id, i, img, name, onClick, classes, onDragEnd = null, style = {}, inPlayArea = false, drag = false }) => {
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
        cursor: inPlayArea ? 'grab' : 'copy', ...style
      }} className={classes} key={i}> 
        <div class="tool-img-container">
          <img 
            src={process.env.PUBLIC_URL + img} 
            alt={name} 
            width="100" 
            class="img-contain"
          />
        </div>
        <p class="tool-label">{name}</p>
    </Component>
  );
};

export { Tools, Tool };
