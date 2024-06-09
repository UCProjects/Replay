import {
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ReactNode,
} from 'react';

import Expand from '../../../../components/Expand';
import './nav.css';

export default function Search(): ReactNode {
  // TODO: convert showMore to useState
  // TODO: Make search work
  // TODO: MUIfy
  const theme = useTheme();
  const open = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <Box
      component="section"
    >
      <Expand
        initialState={open}
        title={(
          <Box
            component="h1"
            textAlign="center"
            width="100%"
          >
            Search
          </Box>
        )}
      >
        <input className="toggleMore hidden" id="showMore" type="checkbox" />
        <input data-bwignore data-lpignore id="searchName" maxLength={15} placeholder="Username" type="text" />
        <div className="flex-break showMore" />
        <input className="showMore" data-bwignore data-lpignore data-tippy-content="Overrides Username" id="searchID" min="0" placeholder="User ID" type="number" />
        <div className="flex-break" />
        <label className="spaced" htmlFor="searchMode">Mode:</label>
        <select id="searchMode">
          <option>Any</option>
          <option>Ranked</option>
          <option>Standard</option>
          <option>Custom</option>
        </select>
        <div className="flex-break showMore" />
        <label className="showMore spaced" htmlFor="searchSoul">Soul:</label>
        <select
          className="showMore"
          id="searchSoul"
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
        <label className="stylized" htmlFor="showMore" />
        <input id="searchButton" type="submit" />
      </Expand>
    </Box>
  );
}
