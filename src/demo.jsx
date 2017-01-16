import React from 'react';
import ReactDOM from 'react-dom';
import SearchTable from './reactable.jsx';

console.log(SearchTable)

ReactDOM.render(
  <SearchTable
    label="Type to search"
    columns={["a", "b", "c"]}
    rows={
      [
        {a: "bananas", b: 8, c: 3},
        {a: 4, b: 5, c: {sort: 9, render: <a href="http://media.riffsy.com/images/806fa85fc55a55de66ab310e500b5f0f/raw">9</a>}},
        {a: 7, b: 2, c: 6}
      ]
    }/>,
  document.getElementById('root'));
