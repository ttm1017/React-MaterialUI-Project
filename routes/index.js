/*  eslint-disable */
var express = require('express');
var path = require('path');
var router = express.Router();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://root:123456@localhost:3306/subjectexam');
/* GET home page. */
//define data model
var user = sequelize.define('user', {
    userName: {type: Sequelize.STRING, unique: true},
    password: Sequelize.STRING
});
var student = sequelize.define('student', {
    studentId: {type: Sequelize.INTEGER, unique: true},
    studentName: Sequelize.STRING,
    classId: Sequelize.INTEGER
});
var course = sequelize.define('course', {
    courseId: Sequelize.INTEGER,
    courseName: Sequelize.STRING,
    credit: Sequelize.DECIMAL
});
var score = sequelize.define('score', {
    courseId: Sequelize.INTEGER,
    studentId: Sequelize.INTEGER,
    work_score: Sequelize.DECIMAL,
    attendance_score: Sequelize.DECIMAL,
    grade: Sequelize.DECIMAL
});

//create user table and init data
user.sync({force: true}).then(function () {
    return user.create({
        userName: "administrator",
        password: "123456"
    }).catch(function (error) {
        console.log(error)
    });
});
//create student table and init data
student.sync({force: true}).then(function () {
    return student.create({
        studentId: 1,
        studentName: "张三",
        classId: 1
    }).then(function () {
        student.upsert({
             studentId: 2,
             studentName: "李四",
             classId: 1
         });
        student.upsert({
            studentId: 3,
            studentName: "王五",
            classId: 2
        });
    }).catch(function (error) {
        console.log(error)
    });
});
//create course table and init data
course.sync({force: true}).then(function () {
    return course.create({
        courseId: 1,
        courseName: "science",
        credit: 5.2
    }).then(function () {
        course.upsert({
            courseId: 2,
            courseName: "math",
            credit: 2.2
        });
        course.upsert({
            courseId:3,
            courseName: "chinese",
            credit: 4.2
        });
    }).catch(function (error) {
        console.log(error)
    });
});
//create score table and init data
score.sync({force: true}).then(function () {
    return user.create({
        courseId: 1,
        studentId: 1,
        work_score: 89.1,
        attendance_score: 87.2,
        grade: 88.2
    }).catch(function (error) {
        console.log(error)
    });
});

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../views/main.html'));
});

router.get('/insert', function (req, res) {
    const recordInfo = req.query;
    score.upsert(recordInfo);
    res.send('success');
});
router.get('/SimpleQueryType', function (req, res) {
    const type = req.query.value;
    if (type == 1) {
        delivery.findAll({
            where: {
                type: '易碎'
            }
        }).then(function (record) {
            res.send(record);
        });
    }
    else if (type == 2) {
        delivery.findAll({
            where: {
                type: '易燃'
            }
        }).then(function (record) {
            res.send(record);
        });
    }
    else {
        delivery.findAll({
            where: {
                type: '其他'
            }
        }).then(function (record) {
            res.send(record);
        });
    }
});
router.get('/SimpleQueryDate', function (req, res) {
    let date = (new Date(req.query.value)).toISOString();
    date = date.match(/(\w+-\w+-\w+)T/)[1];
    console.log(date);
    delivery.count({where: {inToTime: date}}).then(function (c) {
        console.log(c);
        res.send([{Number: c}]);
    });
});
router.get('/queryComplexData', function (req, res) {
    //req.query like this: { value: '1', condition: 'jk' }
    //type 取值：1为按编号查询,2为按日期查询
    //condition need be 2016-06-10
    const {value, condition} = req.query;
    let response;
    if (value == 1) {
        delivery.findOne({where: {Number: condition}}).then(function (record) {
            if (record == null) {
                res.send(null);
            }
            else {
                response = [record];
                res.send(response);
            }
        })
    }
    else {
        delivery.findAll({where: {inToTime: condition}}).then(function (record) {
            response = record;
            res.send(response);
        })
    }
});
router.get('/queryOutWarehouse', function (req, res) {
    let today = new Date(Date.now());
    today.setDate(today.getDate() + 8);
    today = today.toISOString();
    today = today.match(/(\w+-\w+-\w+)T/)[1];
    delivery.findAll({
        where: {
            deadTime: {
                $lt: today
            }
        }
    }).then(function (record) {
        res.send(record);
    });
});
router.get('/OutWarehouse', function (req, res) {
    const {itemNumber: deliveryNumber} = req.query;
    let today = new Date(Date.now());
    today.setDate(today.getDate() + 8);
    today = today.toISOString();
    today = today.match(/(\w+-\w+-\w+)T/)[1];
    //deliveryNumber is a Array like this:[ '0124816' ]
    console.log(deliveryNumber);
    delivery.destroy({
        where: {
            Number: deliveryNumber
        }
    }).then(function () {
        delivery.findAll({
            where: {
                deadTime: {
                    $lt: today
                }
            }
        }).then(function (record) {
            res.send(record);
        });
    });
});
router.get('/getNumberWillExpired', function (req, res) {
    let today = new Date(Date.now());
    today.setDate(today.getDate() + 8);
    today = today.toISOString();
    today = today.match(/(\w+-\w+-\w+)T/)[1];
    delivery.findAll({
        where: {
            deadTime: {
                $lt: today
            }
        }
    }).then(function (record) {
        res.send(record);
    });
});
module.exports = router;
