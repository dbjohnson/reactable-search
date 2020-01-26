import React from 'react';
import ReactDOM from 'react-dom';
import SearchTable from '../dist/reactable-search.js';


const applegif = 'http://i.giphy.com/wJRhcjWc7fKIE.gif';


class DemoTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render () {
    const rows = [
      {
        selected: this.state.selectedRow == 'apples',
        onClick: () => {this.setState({selectedRow: 'apples'})},
        cells: {
          fruit: 'apples',
          price: 8,
          quantity: 0
        },
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
        selected: this.state.selectedRow == 'bananas',
        onClick: () => {this.setState({selectedRow: 'bananas'})},
        cells: {
          fruit: <a target='_blank' href='https://www.google.com/search?site=imghp&q=bananas'>bananas</a>,
          price: 5,
          quantity: 0
        },
        children: [{
          cells: {
            nada: <div>Nothing to see here</div>
          }
        }]
      },
      {
        selected: this.state.selectedRow == 'grapes',
        onClick: () => {this.setState({selectedRow: 'grapes'})},
        cells: {
          fruit: 'grapes',
          price: 12,
          quantity: {
            display: 'I\'m editable!',
            onChange: (e) => { console.log('You can watch my changes:', e) }
          }
        }
      },
      {
        key: 'footer',
        footer: true,
        cells: {
          fruit: 'I\'m',
          price: 'the',
          quantity: 'footer'
        }
      }
    ];


    return (
      <div style={{margin: '10px', maxWidth:'800px'}}>
        <SearchTable
          rows={rows}
          searchPrompt='Type to search'
          showExportCSVBtn={true}
          showExportJSONBtn={true}
          className='table table-bordered table-striped'
          searchChangeCallback={(searchTerm, keys) => {
            console.log('search term:', searchTerm);
          }}/>
      </div>
    )
  }
};

ReactDOM.render(<DemoTable/>, document.getElementById('root'))
