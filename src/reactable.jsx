import React from 'react';
import ReactDOM from 'react-dom';


class ContentEditable extends React.Component {
	constructor(props) {
		super(props);
		this.lastHTML = this.props.html;
	}
		
	render() {
		return (
			<div
				onBlur={(e) => this.emitChange(e)}
				contentEditable
				dangerouslySetInnerHTML={{__html: this.props.html}}/>
		);
	}

	emitChange(e) {
		var html = e.nativeEvent.target.innerHTML;
    // make sure the value has actually changed before sending any notifications.
    // for example, the user could have just entered the cell then left without
    // changing content - this would still fire the onBlur event
		if (html !== this.lastHTML) {
			this.props.onChange(html);
		}
		this.lastHTML = html;
	}
}


class Cell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			edited: this.props.display
		}
	}

  render() {
    if (this.props.onChange) {
      return (
				<td>
					<ContentEditable
						html={this.state.edited}
						onChange={(e) => this.onChange(e)}/>
				</td>
      );
    }
    else {
      return <td dangerouslySetInnerHTML={{__html: this.props.display}}/>;
    }
  }
	
	onChange(e) {
		this.setState({edited: e});
    this.props.onChange(e);
	}		
}

Cell.defaultProps = {
	onChange: (e) => { console.log('Unhandled Cell onChange event:', e) }
}


export class Table extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      sortBy: this.props.sortBy || Object.keys(this.props.rows[0])[0],
      sortDesc: this.props.sortDesc
    };
  }

  setSort(col) {
    if (this.state.sortBy == col) {
      this.setState({
        sortDesc: !this.state.sortDesc
      })
    }
    else {
      this.setState({
        sortBy: col,
        sortDesc: false
      })
    }
  }


  initCells(rows) {
    // table cells  can either contain raw values that are used for both display and sorting,
    // or they can contain property definitions for Cell objects, which can 
    // use different values for sorting vs. display, and can also be editable.
		// Map default Cell properties for each cell
		var rows = [];
		this.props.rows.forEach(function(r, i) {
			var row = {
        id: i
      };
			Object.keys(r).forEach(function(c, j) {
				var v = r[c];
				row[c] = {
          id: row.id + c + (v.display || v),
					sortVal: v.sortVal || v.display || v,
					display: v.display || v,
          onChange: eval(v.onChange)
				};
			});
			rows.push(row);
		})
    return rows;
  }


  render() {
    // need local sortCol in case the columns have changed since the last render
    var columns = Object.keys(this.props.rows[0]),
        sortCol = (columns.indexOf(this.state.sortBy) < 0) ? columns[0] : this.state.sortBy;

    var rows = this.initCells()

		// sort
    rows.sort((a, b) => {
      var diff = a[sortCol].sortVal > b[sortCol].sortVal; 
      return this.state.sortDesc ? !diff : diff;
    });


		// filter
    var searchTokens = this.props.search.split(/[ ,]+/),
        regexes = searchTokens.map(st => new RegExp(st, 'gi')),
        filtered = rows.filter(r =>
          regexes.every(re =>
            columns.some(c =>
              String(r[c].display).match(re))));

		// render
    return (
      <div style={this.props.style}>
        <table className={this.props.className}>
          <thead>
            <tr>{
							columns.map((col) =>
                <TableHeader
                  key={col}
                  col={col}
                  onClick={() => this.setSort(col)} 
                  sortBy={col == sortCol}
                  sortDesc={this.state.sortDesc}
                  />
							)}
            </tr>
          </thead>
          <tbody>{
            filtered.map((row) =>
							<tr key={row.id}>{
								columns.map((c) =>
									<Cell 
										key={row[c].id}
                    sortVal={row[c].sortVal}
										display={row[c].display} 
                    onChange={row[c].onChange}/>
								)}
							</tr>
            )}
          </tbody>
        </table>
        <div className="row" style={{margin: "0px"}}>
          <ExportButton format="CSV" onClick={()=>this.dump("table.csv")}/>
          <ExportButton format="JSON" onClick={()=>this.dump("table.json")}/>
        </div>
      </div>
    );
  }

  dump(filename) {
    var blob = null, 
        a = document.createElement('a');

    if (filename.endsWith('csv')) {
      var cols = Object.keys(this.props.rows[0]),
          dataRows = this.props.rows.map(r => cols.map(c => r[c].display || r[c])),
          rows = [cols].concat(dataRows),
          csv = rows.map(r => r.join(',')).join('\n');

      blob = new Blob([csv], {type: 'text/csv'});
    }
    else {
      blob = new Blob([JSON.stringify(this.props.rows, null, 2)], {type: 'text/json'});
    }

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.click();
  }
};


Table.defaultProps = {
  className: "table table-bordered table-striped",
  search: ""
};


const TableHeader = (props) => {
  return (
    <th key={props.col} onClick={props.onClick}>
      {props.col}
      {props.sortBy ?
        (props.sortDesc ?
          <i className="fa fa-arrow-down" style={props.arrowStyle}/> :
          <i className="fa fa-arrow-up" style={props.arrowStyle}/>) :
      ""}
    </th>
  );
}

TableHeader.defaultProps = {
  arrowStyle: {marginLeft:"5px"}
}

const SearchBar = (props) => {
  return (
    <form>
      <div className="form-group" style={props.style}>
        <div className="input-group">
          <div className="input-group-addon"><i className="fa fa-search"/></div>
          <input type="text" className="form-control" placeholder={props.label} onChange={props.onChange}/>
        </div>
      </div>
    </form>
  );
};

SearchBar.defaultProps = {
  style: {marginBottom:"10px"},
  label: "Search"
}


const ExportButton = (props) => {
  return (
    <button 
      type="button"
      className="btn btn-primary"
      onClick={props.onClick}
      style={{marginRight: "2px"}}>
      Export to {props.format}
    </button>
  );
}


export default class SearchTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {search: ''};
  }

  render() {
    return (
      <div style={this.props.style}>
        <SearchBar label={this.props.label} onChange={(e) => this.setState({search: e.target.value})}/>
        <Table rows={this.props.rows} search={this.state.search}/>
      </div>
    );
  }
}

SearchTable.defaultProps = {
  label: "Type to search",
  style: {margin:"10px"},
}

module.exports = {
  SearchTable, Table
};
