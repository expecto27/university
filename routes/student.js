var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();
var db = require("./database.js")
// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;

var students = [
        { 
            id: 1,
            firstname: "St1",
            secondname: "Studentovich",
            lastname: "Student1",
            number: "89043234",
            data: "23-11-2000"
        },
        {
            id: 2,
            firstname: "St2",
            lastname: "Student2",
            secondname: "Studentovich",
            number: "890432453",
            data:"11-05-1979"
        },
        
        {
            id: 3,
            firstname: "St3",
            lastname: "Student3",
            secondname: "Studentovich",
            number: "823423432534",
            data:"01-12-2009"
        },
        
        {
            id: 4,
            firstname: "St4",
            lastname: "Student4",
            secondname: "Studentovich",
            number: "89043234345",
            data:"07-05-2012"
        }
];

router.get("/listStudents", function(req, res)  {
    db.all(`SELECT * FROM student`, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("student/listStudents", {
            students: rows,
            title: "Список студентов"
        });
    });
});  
// :id — параметр запроса
router.get("/student/:id", (req, res) => {
    // получение id студента из параметров запроса
     var student_id = req.params.id;
 
     db.get(`SELECT * FROM student WHERE id=?`, [student_id], (err, rows) => {
         if (err) {
             throw err;
         }
         res.render("student/student", {
             student: rows
         });
     });
 });

router.post("/student/:id", function(req, res)  {
    // отображение данных в терминале, которые были отправлены из формы 
    console.log(req)
    // переход по адресу localhost:3000/listStudents
    res.redirect("/listStudents");
}); 