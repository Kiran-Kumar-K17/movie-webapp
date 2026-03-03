import { useState } from "react";
import { useNavigate } from "react-router-dom";
const SearchBar = ({ className }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    navigate(`/search?q=${query}`);
    setQuery("");
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchBar;
