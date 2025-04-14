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

  // show all tools
  return (
    <div class="tool-section-container">
      <h1 class="pad-left light-head">Tools</h1>
      <ToolSearch setData={setData} setLoading={setLoading}/>

      {error && <div>Error: {error.message}</div>}
  
      {loading ? (
        <div className="tools-container">Loading...</div>
      ) : data.length === 0 ? (
        <div className="tools-container">No tools found.</div>
      ) : (
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
                classes = "col-3 mb-3 text-center tool-box"
              />
            ))}
          </div>
        </div>
      </div>
      )}
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
      // class=
      style={{ 
        cursor: inPlayArea ? 'grab' : 'copy', ...style
      }}
      className={classes} key={i}> 
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

const ToolSearch = ({ setData, setLoading }) => {
  const [query, setQuery] = useState("");

  const searchTools = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("search", query);
      const response = await fetch(`/tools?${params.toString()}`);
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
      searchTools();
    }
  };

  return (
    <div className="search-bar">
        <input type="text" placeholder="Search Available Tools" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <img src="/assets/ui_icons/search.svg" alt="Search" className="search-icon" />
    </div>
  );
};

export { Tools, Tool };
