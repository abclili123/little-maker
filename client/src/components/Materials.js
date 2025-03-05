import React, { useState, useEffect } from 'react';
import interact from 'interactjs';

function Materials() {
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


  //Initialize Interact.js to make materials draggable
  useEffect(() => {
    interact('.draggable').draggable({
      inertia: true, // smooth dragging
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent', //keep items inside parent containers
          endOnly: true
        })
      ],
      autoScroll: true, // auto-scroll when dragging near edgess
      listeners: {
        //function that moved the dragged element
        move(event) {
          const target = event.target;
          let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          
          //apply translation transform to move the element
          target.style.transform = `translate(${x}px, ${y}px)`;
          
          //store new positions in attributes for tracking
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }
      }
    });
  }, [data]); //Re-run drag setup when new materials are fetched

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
          <li key={i} className="draggable" style={{ cursor: 'grab', display: 'inline-block', padding: '10px', margin: '5px', background: '#ddd' }}>
            {material.emoji} {material.name}
            </li>
        ))}
      </ul>
    </div>
  );
}

export default Materials;
