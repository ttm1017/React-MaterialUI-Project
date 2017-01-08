/**
 * Created by ttm on 2016/6/5.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Wrap from './js/wrap.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
ReactDOM.render(
  <Wrap />,
  document.querySelector('.wrap')
);
