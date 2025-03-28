import React, { useState } from 'react';
import Ideas from './Ideas.js'; // ideas is a child component of table

const Table = ( {addToEncyclopedia, checkOverlap, setPlayAreaItems}) => {
    const [showIdeas, setShowIdeas] = useState(false);
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(false); // Track loading state

    const handleMakeIt = () => {
      let items = checkOverlap();
      console.log('Materials on the table:', items);
    
      setPlayAreaItems([]);
      setLoading(true); // Set loading state to true

      fetch('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: items })
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setIdeas(data); // Update the ideas
        setShowIdeas(true); // Show ideas
        setLoading(false); // Set loading state to false
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        setLoading(false); // Set loading state to false in case of an error
      });
    };

    return (
      <div className="left-content">
        <div className="workspace">
          <div className="dropzone table-grid"></div>
          <button onClick={handleMakeIt} className="make-button">
            Make It!
          </button>
        </div>

        {/* Show loading card while data is being fetched */}
        {loading && (
          <div className="d-flex justify-content-center align-items-center position-absolute w-100 h-100" style={{ top: 0, left: 0 }}>
              <div className="card" style={{ width: '18rem' }}>
                  <div className="card-body text-center">
                      <div className="spinner-border text-primary" role="status">
                      </div>
                      <p className="mt-3">Generating ideas...</p>
                  </div>
              </div>
          </div>
        )}

        {/* Only show ideas when they are available */}
        {showIdeas && <Ideas ideas={ideas} setIdeas={setIdeas} addToEncyclopedia={addToEncyclopedia} onClose={() => setShowIdeas(false)} />} 
      </div>
    );
};
    
export default Table;
