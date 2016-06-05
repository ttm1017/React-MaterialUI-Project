import HelloWorld from './HelloWorld.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
console.log(React);
ReactDOM.render(
    <HelloWorld phrase="ES6"/>,
    document.querySelector('.root')
);