import React, { useState, useEffect } from 'react';

const SearchNames = ({ names, query, setQuery, setId}) => {
  const [filteredNames, setFilteredNames] = useState([]);

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredNames([]);
    } else {
      const results = names.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredNames(results);
    }
  }, [query, names]);

  const handleSelection = (name, id) => {
    setId(id)
    console.log(id)
    setQuery(name);
    setFilteredNames([]); 
  };

  return (
    <div className="relative w-full mb-5">
      <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
        Assign to Employee
      </label>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Search names..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {filteredNames.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded-md max-h-40 overflow-y-auto z-10">
          {filteredNames.map((item, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelection(item.name, item.id)} 
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchNames;
