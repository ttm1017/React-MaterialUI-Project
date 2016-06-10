var express = require('express');
var router = express.Router();
var path = require('path');
/* GET users listing. */
router.get('/loading', function (req, res) {
  res.sendFile(path.join(__dirname, '../views/loading.html'));
});
router.get('/prove', function (req, res) {
  const user = req.query;
  console.log(req.query);
  if (user.username == 'ttm' && user.password==0 ) {
    res.redirect('/');
  }
  else {
    res.send('error user');
  }
})
module.exports = router;
