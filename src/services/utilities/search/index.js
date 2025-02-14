import React, { useState } from "react";

const Index = ({ handleSearch, isLocal = false, isImportant = false }) => {
  const [clue, setClue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    handleSearch(true, clue);
  };

  // removed key press because it is delayed.

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="search"
        name="search"
        pattern=".*\S.*"
        onChange={({ target }) => {
          setClue(target.value);

          // rearranged local searching inside onchange to get updated value everytime
          if (isLocal) handleSearch(true, target.value);
        }}
        required
        className="form-control bg-transparent text-white"
      />
    </form>
    // <div className="search-bar">
    //   <input
    //     type="search"
    //     name="search"
    //     pattern=".*\S.*"
    //     placeholder="Search here..."
    //     autoFocus
    //     onKeyDown={keyPress}
    //     onChange={(e) => isLocal || setClue(e.target.value)}
    //     required
    //   />
    //   <button className="search-btn" onClick={() => handleSubmit()}>
    //     <span>Search</span>
    //   </button>
    // </div>
  );
};

export default Index;
