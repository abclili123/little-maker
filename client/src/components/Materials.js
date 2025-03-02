import React, { useState, useEffect } from 'react';

function Materials() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/materials')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
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

  // this is just sample, it can be anything really to match what is on the figma
  // will have to wrap the items in something to make them draggable
  // probably better to ignore the fetching data and replace it with some static draggable elements
  // would also add search/ tag in here and include the relevant requests to backend
  // but we can skip that for this week probably
  return (
    <div>
      <h1>Materials</h1>
      <ul>
        {data.map((material, i) => (
          <li key={i}>{material.emoji} {material.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Materials;
