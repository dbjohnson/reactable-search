import React from 'react';
import ReactDOM from 'react-dom';
import SearchTable from '../dist/reactable-search.js';


const applegif = 'http://i.giphy.com/wJRhcjWc7fKIE.gif';

const rows = [
  {
    cells: {
      fruit: 'apples',
      price: 8,
      quantity: 0
    },
    onClick: (selected) => console.log('selected:', selected),
    children: [{
      cells: {
        gif: {
          display: <img src={applegif} style={{display: 'block', margin: 'auto'}}/>,
          searchTerm: 'donald',
        }
      }},
    ]
  },
  {
    cells: {
      fruit: <a target='_blank' href='https://www.google.com/search?site=imghp&q=bananas'>bananas</a>,
      price: 5,
      quantity: 2
    }
  },
  {
    cells: {
      fruit: 'grapes',
      price: 12,
      quantity: {
        display: 'I\'m editable!',
        onChange: (e) => { console.log('You can watch my changes:', e) }
      }
    }
  }
];


const DemoTable = (props) => {
  return (
    <div style={{margin: '10px', maxWidth:'800px'}}>
      <SearchTable
        rows={rows}
        searchPrompt='Type to search'
        showExportCSVBtn={true}
        showExportJSONBtn={true}
        className='table table-bordered table-striped'/>
    </div>
  )
};

ReactDOM.render(<DemoTable/>, document.getElementById('root'))
