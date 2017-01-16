import React from 'react';
import ReactDOM from 'react-dom';
import Reactables from './reactable.js';


var init = [
  {
    fruit: "apples", 
    price: 8, 
    quantity: 3
  },
  {
    fruit: {
      display: "<a target='_blank' href='https://www.google.com/search?site=imghp&q=bananas'>bananas</a>",
      sortVal: "bananas",
    },
    price: 5, 
    quantity: 2
  },
  {
    fruit: "grapes", 
    price: 2, 
    quantity: {
      sortVal: 1, 
      display: "I'm editable!", 
      onChange: "(e) => { console.log('You can watch my changes:', e) }"
    }
  }
];

class DemoTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: init,
      value: JSON.stringify(init, null, 2),
      error: false
    };
  }

  render() {
    return (
        <div style={{margin: "10px", maxWidth:"800px"}}>
          <Reactables.SearchTable
            label="Type to search"
            rows={this.state.rows}
            className="table table-bordered table-striped"/>

          <hr/> 

          <div className="row" style={{margin:"auto"}}>
            <h3 className="col-md-8">Table contents (play around!)</h3>
            {this.state.error ? 
              <h3 className="col-md-4"><span className="label label-danger">Invalid JSON</span></h3> :
              <h3 className="col-md-4"><span className="label label-success">Valid JSON</span></h3> 
            }
          </div>
          <textarea 
            rows="20" 
            style={{width: "100%"}} 
            value={this.state.value}
            onChange={(e) => this.updateRows(e)}>
          </textarea>
          
      </div>
    )
  }

  updateRows(e) {
    this.setState({value: e.target.value});
    try {
      var rows = eval(e.target.value);
      rows.forEach(function(r) {
        if (r.onChange) {
          r.onChange = eval(r.onChange);
        }
      });

      this.setState({
        rows: rows, 
        error: false
      });
    }
    catch (e) {
      this.setState({error: true})
    } 
  }
};

ReactDOM.render(<DemoTable/>, document.getElementById("root"))
