import {
  Box,
} from '@mui/material';
import {
  ReactNode,
} from 'react';

export default function Search(): ReactNode {
  // TODO: convert showMore to useState
  // TODO: Make search work
  // TODO:
  return (
    <Box
      component="section"
    >
      <h1>Search</h1>
      <input type="checkbox" id="showMore" className="toggleMore hidden" />
      <input type="text" id="searchName" placeholder="Username" maxLength="15" data-bwignore data-lpignore />
      <div className="flex-break showMore" />
      <input type="number" id="searchID" placeholder="User ID" className="showMore" data-tippy-content="Overrides Username" min="0" data-bwignore data-lpignore />
      <div className="flex-break" />
      <label htmlFor="searchMode" className="spaced">Mode:</label>
      <select id="searchMode">
        <option>Any</option>
        <option>Ranked</option>
        <option>Standard</option>
        <option>Custom</option>
      </select>
      <div className="flex-break showMore" />
      <label htmlFor="searchSoul" className="showMore spaced">Soul:</label>
      <select
        id="searchSoul"
        className="showMore"
        onChange={(e) => {
          e.target.dataset.value = e.target.value;
        }}
      >
        <option>Any</option>
        <option className="KINDNESS">Kindness</option>
        <option className="DETERMINATION">Determination</option>
        <option className="PATIENCE">Patience</option>
        <option className="BRAVERY">Bravery</option>
        <option className="INTEGRITY">Integrity</option>
        <option className="PERSEVERANCE">Perseverance</option>
        <option className="JUSTICE">Justice</option>
      </select>
      <div className="flex-break" />
      <label htmlFor="showMore" className="stylized" />
      <input type="submit" id="searchButton" />
    </Box>
  );
}
