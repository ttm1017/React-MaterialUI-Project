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
    return score.create({
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
router.get('/query', function (req, res) {
    const {value, queryCondition} = req.query;
    if (value == 1) {
        score.findAll({
            where: {
                studentId: queryCondition
            }
        }).then(function (record) {
            res.send(record);
        });
    }
    else if (value == 2) {
        score.findAll({
            where: {
                courseId: queryCondition
            }
        }).then(function (record) {
            res.send(record);
        });
    }
    else {
        res.send("'don't support the query type");
    }
});
router.get('/delete', function (req, res) {
    let {deleteStudentId, deleteCourseId} = req.query;
    deleteStudentId = parseInt(deleteStudentId);
    deleteCourseId = parseInt(deleteCourseId);
    score.destroy({
        where: {
            studentId: deleteStudentId,
            courseId: deleteCourseId
        }
    }).then(function (result) {
        console.log(result);
        res.send(`the number is${result}`);
    });
});
module.exports = router;
