import React from "react";
import "../search/Search.scss";

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="searchBoxWrap">
      <input
        className="form-control"
        type="search"
        placeholder="Search here"
        value={searchTerm}
        onChange={onSearchChange}
      />
    </div>
  );
};

export default SearchBox;
