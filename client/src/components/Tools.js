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

  // show all tools
  return (
    <div>
      <h1>Tools</h1>
      <ul>
        {data.map((tool, i) => (
          <li key={i}>
            <p>{tool["tool name"]}</p>
            <img src={process.env.PUBLIC_URL + tool.img} alt={tool["tool name"]} width="100" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tools;
