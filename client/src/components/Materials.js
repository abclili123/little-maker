import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";

function Materials({ onMaterialClick }) {
  // State variables to store fetched materials, loading state, and errors
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); //track loading
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

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

  return (
    <div class="materials-section-container">
      <h1 className="header light-head">Materials</h1>
  
      <div className="row materials-bar">
        <div className="col-5" >
          <TagFilter 
            setData={setData} 
            setLoading={setLoading}
            query={query}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </div>
        <div className="col-7">
          <MaterialSearch 
            setData={setData} 
            setLoading={setLoading} 
            selectedTags={selectedTags}
            query={query}
            setQuery={setQuery}
          />
        </div>
      </div>
  
      {error && <div>Error: {error.message}</div>}
  
      {loading ? (
        <div className="materials-container">Loading...</div>
      ) : data.length === 0 ? (
        <div className="materials-container">No materials found.</div>
      ) : (
        <div className="materials-container">
          {data.map((material, i) => (
            <Material
              key={i}
              id={i}
              emoji={material.emoji}
              name={material.name}
              onClick={() => onMaterialClick(material)}
            />
          ))}
        </div>
      )}
    </div>
  );  
}

const Material = ({ id, emoji, name, onClick, onDragEnd = null, style = {}, inPlayArea = false, drag = false }) => {
  const Component = drag ? motion.div : 'div';
  
  return (
    <Component 
      id={id}
      onClick={onClick}
      drag={drag}
      dragMomentum={false} 
      whileDrag={{ scale: 1.2 }}
      onDragEnd={onDragEnd}
      class="material-block"
      style={{ 
        cursor: inPlayArea ? 'grab' : 'copy',
        ...style
      }}
    >
      {emoji} {name}
    </Component>
  );
};

const MaterialSearch = ({ setData, setLoading, query, setQuery, selectedTags}) => {
  const searchMaterials = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("search", query);
      selectedTags.forEach(tag => params.append("tags", tag));
      const response = await fetch(`/materials?${params.toString()}`);
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
      searchMaterials();
    }
  };

  return (
    <div className="materials-search-add" id="search-materials">
      <input
        type="text"
        placeholder="Search or Add Materials"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <img
        src="/assets/ui_icons/search.svg"
        alt="Search"
        className="search-icon"
        onClick={searchMaterials}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

const TagFilter = ({ setData, setLoading, selectedTags, setSelectedTags, query }) => {
  const [allTags, setAllTags] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Fetch tags from backend
  useEffect(() => {
    fetch('/tags')
      .then(res => res.json())
      .then(tags => setAllTags(tags))
      .catch(err => console.error('Failed to load tags', err));
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTag = (tag) => {
    let updated;
    if (selectedTags.includes(tag)) {
      updated = selectedTags.filter(t => t !== tag);
    } else {
      updated = [...selectedTags, tag];
    }
    setSelectedTags(updated);
    searchByTags(updated);
  };

  const searchByTags = async (tags) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      tags.forEach(tag => params.append("tags", tag));
      if (query.trim() !== "") {
        params.append("search", query);
      }
      const response = await fetch(`/materials?${params.toString()}`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setData([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="materials-search-add" id="filter-by-tag" ref={dropdownRef} style={{ width: '100%', flexShrink: 0, position: 'relative' }} >
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          border: 'none',
          backgroundColor: 'transparent',
          color: '#444',
          fontFamily: 'inherit',
          fontSize: '12px',
          padding: '1px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Filter by Tags {selectedTags.length > 0 ? `(${selectedTags.length})` : ''}</span>
        <span style={{ fontSize: '10px', marginLeft: '4px' }}>{open ? '▲' : '▼'}</span>
      </div>

  
      {open && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'white',
            border: '1px solid #eee',
            borderRadius: '0 0 4px 4px',
            marginTop: '2px',
            zIndex: 100,
            listStyle: 'none',
            padding: '4px 0',
            fontSize: '14px',
            fontFamily: 'inherit',
          }}
        >
          {allTags.map((tag, idx) => (
            <li key={idx} style={{ padding: '4px 12px', textAlign: 'left' }}>
              <label
                style={{
                  display: 'block',
                  cursor: 'pointer',
                  color: '#444',
                }}
              >
                <input
                  type="checkbox"
                  value={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                  style={{ marginRight: '8px' }}
                />
                {tag}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};  


export { Materials, Material };
