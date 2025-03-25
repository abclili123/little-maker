import React, { useState, useEffect } from 'react';
import Ideas from './Ideas.js'; // ideas is a child component of table
import interact from 'interactjs';


function dragMoveListener(event) {
  const target = event.target;
  const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  target.style.transform = `translate(${x}px, ${y}px)`;
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}


const Table = ( {addToEncyclopedia}) => {
    //tracks materials dropped onto table
    const [droppedMaterials, setDroppedMaterials] = useState([]);
    const [showIdeas, setShowIdeas] = useState(false); // for showing and hiding generated ideas
    const [ideas, setIdeas] = useState([]); // table will hold ideas since it is the parent component and ideas will be passed as prop

    useEffect(() => {
        //initialize Interact.js dropzone
        interact('.dropzone').dropzone({
            accept: '.draggable', //accepts only elements with class "draggable"
            overlap: 0.75, // requires only 57% overlap for a drop
            
            // event triggered with dragged itemis dropped
            ondrop(event) {
                const name = event.relatedTarget.getAttribute('data-name');
                const src = event.relatedTarget.getAttribute('src');
                
                //const materialName = event.relatedTarget.getAttribute('data-name');
                setDroppedMaterials((prev) => [...prev, { name, src } /* materialName */]); 
            }
        });
    }, []); // runs once when component mounts

    useEffect(() => {
      interact('.dropped-item').draggable({
        inertia: true,
        autoScroll: true,
        listeners: { move: dragMoveListener }
      });
    }, [droppedMaterials]); // Re-run when new items are dropped

    // Function to handle "Make it!" button click
    const handleMakeIt = () => {
      console.log('Materials on the table:', droppedMaterials);
      // TODO: Later, send these materials to the Instructables API
      // right now just fetches dummy data
      fetch('/generate')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          // when api returns, set show ideas to true to show the ideas
          // this causes re rendering of component to show the ideas
          setIdeas(data);
          setShowIdeas(true)
        })
    };

    const handleDrop = (e) => {
      e.preventDefault();
      const toolData = e.dataTransfer.getData("tool");
      const tool = JSON.parse(toolData);
      console.log("Dropped Tool:", tool);
      // You can now render it on the table or update state
    };
    

    //havent done more error checks

    return (
      <div class="left-content">
        <div class="workspace"
         onDragOver={(e) => e.preventDefault()}
         onDrop={handleDrop}
        >
          <div
            class="dropzone table-grid"
          > 
            {droppedMaterials.map((item, i) => (
              <img 
                key={i} 
                src={item.src}
                alt={item.name}
                className="dropped-item"
              />
                
            ))}


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