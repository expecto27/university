var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();
var db = require("./database.js")
// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router

router.get('/listTeachers', function(req, res){
    db.all(`SELECT * FROM teacher`, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("teacher/listTeachers", {
            teachers: rows,
            title: "Список преподавателей"
        });
    });
});

router.get("/teacher/:id", (req, res) => {
     var teacher_id = req.params.id;
 
     db.get(`SELECT * FROM teacher WHERE id=?`, [teacher_id], (err, rows) => {
         if (err) {
             throw err;
         }
         res.render("teacher/teacher", {
             teacher: rows
         });
     });
 });
