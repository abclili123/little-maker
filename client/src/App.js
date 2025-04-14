import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Materials, Material } from "./components/Materials.js";
import { Tools, Tool } from "./components/Tools.js";
import Encyclopedia from "./components/Encyclopedia.js";
import Table from "./components/Table.js";
import React, { useState, useEffect, useRef } from "react";

function App() {
  const [encyclopediaIdeas, setEncyclopediaIdeas] = useState([]);
  const [playAreaItems, setPlayAreaItems] = useState([]);
  const playAreaRef = useRef(null);

  useEffect(() => {
    if (playAreaRef.current) {
      console.log("Play area div is mounted:", playAreaRef.current);
    }
  }, []);

  const addToEncyclopedia = (idea) => {
    setEncyclopediaIdeas((prev) => [...prev, idea]);
  };

  const checkOverlap = (check=null) => {
    console.log('Checking overlap...');
    console.log(playAreaItems)
    
    const playArea = playAreaRef.current;
    if (!playArea) return []; 
    
    const dropZone = document.querySelector('.dropzone');
    if (!dropZone) {
      console.warn("No dropzone found!");
      return [];
    }

    // Get dropzone dimensions
    const zoneRect = dropZone.getBoundingClientRect();
    console.log("Dropzone Rect:", zoneRect);
    
    if (!check) {
      const overlappingItems = [];
      
      playAreaItems.forEach((item) => {
        console.log(`Checking element with ID: ${item.id}`);
        const itemElement = document.getElementById(`${item.id}`);
    
        if (!itemElement) {
          console.warn(`Element not found: ${item.id}`);
          return;
        }
    
        const itemRect = itemElement.getBoundingClientRect();
        console.log(`Item Rect for ${item.name}:`, itemRect);
    
        // Check for overlap with the single dropzone
        const isOverlapping =
          itemRect.left < zoneRect.right &&
          itemRect.right > zoneRect.left &&
          itemRect.top < zoneRect.bottom &&
          itemRect.bottom > zoneRect.top;
    
        if (isOverlapping) {
          overlappingItems.push(item);
          console.log(`✅ ${item.name} is overlapping with the dropzone`);
        }
      });
    
      console.log("Final overlapping items:", overlappingItems);
      return overlappingItems;
    }
    else {
      console.log(`Checking element with ID: ${check}`);
      const itemElement = document.getElementById(`${check}`);

      if (!itemElement) {
        console.warn(`Element not found: ${check}`);
        return;
      }
  
      const itemRect = itemElement.getBoundingClientRect();
      console.log(`Item Rect for ${check}:`, itemRect);
  
      // Check for overlap with the single dropzone
      const isOverlapping =
        itemRect.left < zoneRect.right &&
        itemRect.right > zoneRect.left &&
        itemRect.top < zoneRect.bottom &&
        itemRect.bottom > zoneRect.top;
  
      if (isOverlapping) {
        itemElement.style.background = "rgb(255, 255, 195)"; // need to change to nicer color
        itemElement.style.border = "1.5px solid rgb(9, 84, 70)"
        itemElement.style.fontWeight = "475";
      }
      else {
        itemElement.style.background = "white";
        itemElement.style.border = "1px solid rgb(204, 204, 204)"
        itemElement.style.fontWeight = "400";
      }
    }
  }; 

  const handleMaterialClick = (material) => {
    // Get the play area position and dimensions
    const playArea = document.getElementById('play-area');
    const rect = playArea.getBoundingClientRect();
    
    // Calculate center position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Add random offset (-50 to +50 pixels)
    const randomOffset = () => Math.random() * 300 - 300;
    
    const newMaterial = {
      ...material,
      id: 'material-' + Date.now(),
      x: centerX + randomOffset(),
      y: centerY + randomOffset()
    };

    setPlayAreaItems(prev => {
      const updatedItems = [...prev, newMaterial];
      
      // Run checkOverlap with the new material's ID after the state updates
      setTimeout(() => checkOverlap(newMaterial.id), 0);

      return updatedItems;
    });
  };

  const handleToolClick = (tool) => {
    // Get the play area position and dimensions
    const playArea = document.getElementById('play-area');
    const rect = playArea.getBoundingClientRect();
    
    // Calculate center position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Add random offset (-50 to +50 pixels)
    const randomOffset = () => Math.random() * 300 - 300;
    
    const newTool = {
      ...tool,
      id: 'tool-' + Date.now(),
      x: centerX + randomOffset(),
      y: centerY + randomOffset()
    };

    setPlayAreaItems(prev => {
      const updatedItems = [...prev, newTool];
      
      // Run checkOverlap with the new tool's ID after the state updates
      setTimeout(() => checkOverlap(newTool.id), 0);

      return updatedItems;
    });
  };

  return (
    <div className="App container-fluid">
      <div className="row flex-grow-1" style={{ minHeight: '90vh' }}>
        {/* Left Column - Workspace */}
        <div id="play-area" ref={playAreaRef} className="col-md-7 border-end" style={{ position: 'relative' }}>
          <div className="row align-items-center header">
            <div className="col">
              <h1>Little Maker</h1>
            </div>
            <div className="col-auto">
              <button className="btn btn-secondary rounded-circle">?</button>
            </div>
          </div>

          {playAreaItems.map((item) => (
            item.id.startsWith("material") ? (
              <Material
                key={item.id}
                id={item.id}
                emoji={item.emoji}
                name={item.name}
                onDragEnd = {() => checkOverlap(item.id)}
                style={{
                  position: 'absolute',
                  left: item.x,
                  top: item.y,
                  zIndex: 10
                }}
                inPlayArea={true}
                drag={true}
              />
            ) : item.id.startsWith("tool") ? (
              <Tool
                key={item.id}
                id={item.id} // this one
                img={item.img}
                name={item.name}
                classes={'text-center'}
                onDragEnd = {() => checkOverlap(item.id)}
                style={{
                  position: 'absolute',
                  left: item.x,
                  top: item.y,
                  zIndex: 10, 
                  background: 'white', 
                  borderRadius: '3px', 
                  border: 'solid #ccc 1px',
                  padding: '8px',
                  paddingBottom: '0px',
                  marginBottom: '0px'
                }}
                inPlayArea={true}
                drag={true}
              />
            ) : null // In case id doesn't match any known type
          ))}

          <Table addToEncyclopedia={addToEncyclopedia} checkOverlap={checkOverlap} setPlayAreaItems={setPlayAreaItems}/>
        </div>

        {/* Right Column - Sidebar */}
        <div className="col-5 p-3 d-flex flex-column">
          <div className="row tool-section border-bottom">
            <Tools onToolClick={handleToolClick} />
          </div>
          <div className="row flex-grow-1 border-bottom">
            <Materials onMaterialClick={handleMaterialClick} />
          </div>
          <div className="row encyclopedia">
            <Encyclopedia ideas={encyclopediaIdeas} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
