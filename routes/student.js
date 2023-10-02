var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();
var db = require("./database.js")
// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;

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