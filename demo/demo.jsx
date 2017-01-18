import React from 'react';
import ReactDOM from 'react-dom';
import {SearchTable} from './reactable.js';


var nyancat = "http://media.riffsy.com/images/806fa85fc55a55de66ab310e500b5f0f/raw";

var rows = [
  {
    cells: {
      fruit: {
        sortVal: 3,
        display: 'apples'
      },
      price: 8,
      quantity: 3
    },
    children: [{
      cells: {
        gif: <img src={nyancat} style={{display: "block", margin: "auto"}}/>
      }},
    ]
  },
  {
    cells: {
      fruit: {
        display: "<a target='_blank' href='https://www.google.com/search?site=imghp&q=bananas'>bananas</a>",
        sortVal: "bananas",
      },
      price: 5,
      quantity: 2
    }
  },
  {
    cells: {
      fruit: "grapes",
      price: 2,
      quantity: {
        sortVal: 1,
        display: "I'm editable!",
        onChange: (e) => { console.log('You can watch my changes:', e) }
      }
    }
  }
];


const DemoTable = (props) => {
  return (
    <div style={{margin: "10px", maxWidth:"800px"}}>
      <SearchTable
        label="Type to search"
        rows={rows}
        showExportBtn={true}
        className="table table-bordered table-striped"/>
    </div>
  )
};

ReactDOM.render(<DemoTable/>, document.getElementById("root"))
