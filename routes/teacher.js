var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();

// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router

var teachers = [
    { 
        id: 1,
        firstname: "Константин",
        secondname: "Дмитриевич",
        lastname: "Кириченко"
    },
    {
        id: 2,
        firstname: "Леонид",
        secondname: "Владимирович",
        lastname: "Рябец"
    },
    
    {
        id: 3,
        firstname: "Борис",
        secondname: "Петрович",
        lastname: "Ильин",
    },
    
    {
        id: 4,
        firstname: "Евгений",
        secondname: "Александрович",
        lastname: "Черкашин",
    }

];


router.get('/listTeachers', function(req, res){
    res.render( "listTeachers" , {
        teachers: teachers,
        title: 'Список преподавателей'
    });
});

router.get('/teacher/:id', function(req, res){
    
    var teacherId = req.params.id;

    var teacher = teachers.find(item => item.id == teacherId);
    res.render("teacher", {
        teacher: teacher,
        title: teacher.lastname
    });
});