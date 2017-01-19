import React from 'react';
import TestUtils from 'react-addons-test-utils';
import expect from 'expect';
import SearchTable from '../lib/reactable-search.js';


var rows = [
  {a: 1, b: 2},
  {a: 2, b: 3}
]

describe('SearchTable', function () {
  it('renders without problems', function () {
    //var root = TestUtils.renderIntoDocument(<SearchTable rows={rows}/>);
    var root = TestUtils.renderIntoDocument(React.createElement('SearchTable', {rows: rows}));
    expect(root).toExist();
  });
});
