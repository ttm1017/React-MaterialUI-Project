/*  eslint-disable */
var express = require('express');
var path = require('path');
var router = express.Router();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://root:123456@localhost:3306/express');
/* GET home page. */
//define data model
var delivery = sequelize.define('parkingcarinformation', {
  license: { type: Sequelize.STRING,  unique: true },
  parkingPlace: Sequelize.STRING,
  arriveTime: Sequelize.DATEONLY
});
//create the table and insert the first record
delivery.sync({force: true}).then(function () {
  return delivery.create({
    license: 'GK12001',
    parkingPlace: 'C12',
    arriveTime:  new Date(Date.now())
  }).then(function(){
    delivery.upsert({
      license: '浙A1063',
      parkingPlace: 'K48',
      arriveTime:  new Date(2019,6,14)
    });
    delivery.upsert({
      license: 'KU13XXX',
      parkingPlace: 'J48',
      arriveTime:  new Date(2019,6,10)
    })
  });
});

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../views/main.html'));
});
router.get('/inputRecord', function(req, res) {
  const recordInfo = req.query;
  const today = new Date();
  recordInfo.arriveTime = today;
  recordInfo.date = today;
  delivery.upsert(recordInfo);
  res.send('success');
});
router.get('/SimpleQueryType', function(req,res) {
  const type = req.query.value;
  if (type == 1 ) {
    delivery.findAll({
      where: {
        type: '易碎'
      }
    }).then(function(record){
      res.send(record);
    });
  }
   else if (type == 2 ) {
    delivery.findAll({
      where: {
        type: '易燃'
      }
    }).then(function(record){
      res.send(record);
    });
  }
   else {
    delivery.findAll({
      where: {
        type: '其他'
      }
    }).then(function(record){
      res.send(record);
    });
  }
});
router.get('/SimpleQueryDate', function(req,res) {
  let date = (new Date(req.query.value)).toISOString();
  date = date.match(/(\w+-\w+-\w+)T/)[1];
  console.log(date);
  delivery.count({ where: { inToTime: date } }).
    then(function(c){
    console.log(c);
    res.send([{ Number: c }]);
  });
});
router.get('/queryComplexData', function(req,res) {
  //req.query like this: { value: '1', condition: 'jk' }
  //type 取值：1为按编号查询,2为按日期查询
  //condition need be 2016-06-10
  const { value, condition } = req.query;
  let response;
  if( value == 1 ){
    delivery.findOne({ where: { Number: condition } }).
      then(function (record){
      if (record == null ){
        res.send(null);
      }
      else {
        response = [record];
        res.send(response);
      }
    })
  }
  else {
    delivery.findAll({ where: { inToTime: condition } }).
    then(function (record){
      response = record;
      res.send(response);
    })
  }
});
router.get('/queryOutWarehouse', function (req, res) {
  const {value, condition} = req.query;//value:1 license,value:2 parking place
  if (value == 1) {
  delivery.findAll({
    where: {
      license: condition
    }
  }).then(function(record){
    res.send(record);
  });
  }
  if(value == 2) {
    console.log(condition);
    delivery.findAll({
      where: {
        parkingPlace: condition
      }
    }).then(function(record){
      res.send(record);
    });
  }
});
//deliveryNumber is a Array like this:[ '0124816' ]
router.get('/OutWarehouse', function (req, res) {
  console.log( req.query);
  const { itemNumber } = req.query;
    delivery.destroy({
      where: {
        license: itemNumber
      }
    }).then(function() {
        res.send('success');
    });
  res.send( req.query);
});
router.get('/getNumberWillExpired', function (req,res) {
  let today = new Date(Date.now());
  today.setDate(today.getDate()+8);
  today = today.toISOString();
  today = today.match(/(\w+-\w+-\w+)T/)[1];
  delivery.findAll({
    where: {
      deadTime: {
        $lt: today
      }
    }
  }).then(function(record){
    res.send(record);
  });
});
module.exports = router;
