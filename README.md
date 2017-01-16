# reactable
Searchable table with JSON row definitions

![](demo/demo.png)


## Description
This React component is a simple live-searchable table with support for some basic enhancements:

* Regex search
* Optionally editable cells with callback
* Optional separate values for display vs. sort
* Export to CSV and JSON

Each row definition is a simple JSON object. Each value  specifies a cell in the table, may either be a plain text / number object, or a map describing optional parameters:

**Cell options**

Key|Description
---+-----------
display|display value HTML (can include links, etc)
sortVal|value by which to sort the cell
onChange|callback function triggered on value change (cell will be editable if `onChange` is set)

**Simple row definition**

```js
var rows = [
	{a: 1, b: 2},
	{a: 2, b: 3},
	...
];
```

**Advanced cell definition**

```js
var rows = [
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
```

## Quickstart

task|command
----|-----
install dependencies|`npm install`
build|`webpack`

### Run demo
```
$ npm install
$ webpack
$ cp -r demo/ dist
$ cd dist
$ webpack-dev-server
```




## Example usage

``` js
import Reactables from './reactable.js';
import ReactDOM from 'react-dom';

var rows = [
	{a: 1, b: 2},
	{a: 2, b: 3},
	...
];

ReactDOM.render(
  <Reactables.SearchTable
    label="Type to search"
    rows={rows}/>,
  document.getElementByID("root");
```


## Disclaimer
Please be gentle, this is my first React project, my first webpack project, and my first node project.  I'm sure there are many things that should have been differently - please leave feedback!


## TODO
* Publish to npm
* figure out modular styling in React
* Gather feedback on organization, etc - please leave an issue if you see something obvious!



## Inspiration
[Check out this simplicity](http://jsfiddle.net/dfsq/7BUmG/1133/)