var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();
var db = require("./database.js")
// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;

var courses = [
    {
        id: 1,
        name: 'Math'
    },
    {
        id: 2,
        name: 'Android'
    },
    {
        id: 3,
        name: 'Algorithm'
    },
    {
        id:4,
        name: 'WEB'
    }
];

var commonPath = 'listCourses'
router.get('/' + commonPath, function(req, res){
    db.all(`SELECT * FROM discipline`, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("listCourses", {
            courses: rows,
            title: "Список курсов"
        });
    });
});

router.get('/course/:id', function(req, res){
    var courseId = req.params.id
    var course = courses.find(c => courseId == c.id);
    res.render('course', {
        course: course
    });
});