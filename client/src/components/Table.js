import React, { useState, useEffect } from 'react';
import interact from 'interactjs';

const Table = () => {
    //tracks materials dropped onto table
    const [droppedMaterials, setDroppedMaterials] = useState([]);

    useEffect(() => {
        //initialize Interact.js dropzone
        interact('.dropzone').dropzone({
            accept: '.draggable', //accepts only elements with class "draggable"
            overlap: 0.75, // requires only 57% overlap for a drop
            
            // event triggered with dragged itemis dropped
            ondrop(event) {
                const materialName = event.relatedTarget.getAttribute('data-name');
                setDroppedMaterials((prev) => [...prev, materialName]); 
            }
        });
    }, []); // runs once when component mounts

    // Function to handle "Make it!" button click
    const handleMakeIt = () => {
        console.log('Materials on the table:', droppedMaterials);
        // TODO: Later, send these materials to the Instructables API
    };

    //havent done more error checks

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
        </div>
    );
};
    
export default Table;








// handles the table drag and drop
// can also put the make this! button here
// will call the api here when button clicked so 
// that would go here
// for now, clicking button can just print whatever
// objects are on the table to the console