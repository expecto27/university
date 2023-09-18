var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();

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
    
    res.render( commonPath , {
        courses: courses
    });
});

router.get('/course/:id', function(req, res){
    var courseId = req.params.id
    var course = courses.find(c => courseId == c.id);
    res.render('course', {
        course: course
    });
});