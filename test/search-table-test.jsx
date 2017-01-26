import React from 'react';
import TestUtils from 'react-addons-test-utils';
import expect from 'expect';
import SearchTable from 'reactable-search';


const rows = [
  {a: 1, b: 2},
  {a: 2, b: 3}
]

describe('SearchTable', function () {
  it('renders without problems', function () {
    const root = TestUtils.renderIntoDocument(<SearchTable rows={rows}/>);
    expect(root).toExist();
  });
});
