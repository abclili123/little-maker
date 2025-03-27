import React, { useState } from 'react';
import Ideas from './Ideas.js'; // ideas is a child component of table

const Table = ( {addToEncyclopedia, checkOverlap, setPlayAreaItems}) => {
    //tracks materials dropped onto table
    const [showIdeas, setShowIdeas] = useState(false); // for showing and hiding generated ideas
    const [ideas, setIdeas] = useState([]); // table will hold ideas since it is the parent component and ideas will be passed as prop

    // Function to handle "Make it!" button click
    const handleMakeIt = () => {
      let items = checkOverlap();
      console.log('Materials on the table:', items);
    
      // reset the items before generating ideas
      setPlayAreaItems([]);
    
      // Send the items array to the server
      fetch('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: items }) // Send the items as part of the request body
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // When API returns, process the data and update the component
        console.log(data);
        setIdeas(data); // Assuming you have a state to hold the ideas
        setShowIdeas(true); // Show the ideas
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
    };
    

    return (
      <div class="left-content">
        <div class="workspace">
          <div
            class="dropzone table-grid"
          >

          </div>
          <button onClick={handleMakeIt} class="make-button">
            Make It!
          </button>
        </div>

        {/* only show ideas when true */}
        {showIdeas && <Ideas ideas={ideas} setIdeas={setIdeas} addToEncyclopedia={addToEncyclopedia} onClose={() => setShowIdeas(false)} />} 
      </div>
    );
};
    
export default Table;