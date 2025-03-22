// follow Materials.js example
import React, { useState, useEffect } from 'react';
import interact from 'interactjs';

function Tools() {
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

  const handleDragStart = (e, tool) => {
    e.dataTransfer.setData("tool", JSON.stringify(tool));
  };  

  // show all tools
  return (
    <div>
      <h1 class="pad-left">Tools</h1>

      <div className="search-bar">
        <input type="text" placeholder="Search Available Tools" />
        <img src="/assets/ui_icons/search.svg" alt="Search" className="search-icon" />
      </div>

      <div class="tools-container">
        <div>
          <div className="row">
            {data.map((tool, i) => (
              <div className="col-4 mb-3 text-center tool-box" 
                   key={i}
                   draggable
                   onDragStart={(e) => handleDragStart(e, tool)}
                   >
                
                <div class="tool-img-container">
                  <img 
                    src={process.env.PUBLIC_URL + tool.img} 
                    alt={tool["tool name"]} 
                    width="100" 
                    class="img-contain"
                  />
                </div>

                <p class="tool-label">{tool["tool name"]}</p>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tools;
