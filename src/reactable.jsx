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


export class Cell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edited: props.display
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
      if (typeof this.props.display === "string") {
        return <td dangerouslySetInnerHTML={{__html: this.props.display}}/>;
      }
      else {
        return <td>{this.props.display}</td>
      }
    }
  }

  onChange(e) {
    this.setState({edited: e});
    this.props.onChange(e);
  }
}

export const Row = (cols, i) => {
  var cells = [];
  Object.values(cols).forEach(function(c, j) {
    cells.push({
      key: j,
      sortVal: c.sortVal || c,
      display: c.display || c,
      onChange: eval(c.onChange)
    })
  })

  return {
    key: i,
    cells: cells
  };
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

  render() {
    // coerce the rows to standard format so we can sort and filter them
    // before the main render block
    var rows = this.props.rows.map((r, i) => new Row(r, i));

    // sort
    // need local sortCol in case the columns have changed since the last render
    var columns = Object.keys(this.props.rows[0]),
        sortIdx = Math.max(0, columns.indexOf(this.state.sortBy));

    rows.sort((a, b) => {
      var diff = a.cells[sortIdx].sortVal > b.cells[sortIdx].sortVal;
      return this.state.sortDesc ? !diff : diff;
    });


    // filter
    var searchTokens = this.props.search.split(/[ ,]+/),
        regexes = searchTokens.map(st => new RegExp(st, 'gi')),
        filtered = rows.filter(row =>
          regexes.every(re =>
            row.cells.some(c =>
              String(c.display).match(re))));

    // render
    return (
      <div style={this.props.style}>
        <table className={this.props.className}>
          <thead>
            <tr>{
              columns.map((col, j) =>
                <TableHeader
                  key={col}
                  col={col}
                  onClick={() => this.setSort(col)}
                  sortBy={j == sortIdx}
                  sortDesc={this.state.sortDesc}/>
              )}
            </tr>
          </thead>
          <tbody>{
            filtered.map((row) =>
              <tr key={row.key}>{
                row.cells.map((col, j) =>
                  React.createElement(Cell, col))
              }
              </tr>
            )}
          </tbody>
        </table>

        <div className="row" style={{margin: "auto"}}>
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
          <i className="fa fa-arrow-up" style={props.arrowStyle}/> :
          <i className="fa fa-arrow-down" style={props.arrowStyle}/>) :
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
  label: "Type to search"
}


const ExportButton = (props) => {
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={props.onClick}
      style={{marginRight: "5px"}}>
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
        <Table
          rows={this.props.rows}
          search={this.state.search}
          className={this.props.className}/>
      </div>
    );
  }
}

SearchTable.defaultProps = {
  label: "Type to search",
}

module.exports = {
  SearchTable, Table, Cell
};
