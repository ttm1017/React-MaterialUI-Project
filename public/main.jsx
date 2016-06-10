/**
 * Created by ttm on 2016/6/5.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Wrap from './js/wrap.jsx';
ReactDOM.render(
  <Wrap />,
  document.querySelector('.wrap')
);
$.get('/getNumberWillExpired', function(data) {
    console.log(Notification.permission);
  console.log(data);
    if (!Notification) {
      alert('Desktop notifications not available in your browser. Try Chromium.');
      return;
    }
    if (Notification.permission !== "granted")
      Notification.requestPermission();
    else {
      var notification = new Notification('过期提醒', {
        body: `有${data.length}件快递存储时间将要过期`
      });
    }
});
