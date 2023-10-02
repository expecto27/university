var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();
var db = require("./database.js")
// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;

var commonPath = 'listDisciplines'
router.get('/' + commonPath, function(req, res){
    db.all(`SELECT * FROM discipline`, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("discipline/listDisciplines", {
            courses: rows,
            title: "Список курсов"
        });
    });
});

router.get('/course/:id', function(req, res){
   var id = req.params.id;
 
   db.get(`SELECT * FROM discipline WHERE id=?`, [id], (err, rows) => {
       if (err) {
           throw err;
       }
       res.render("discipline/discipline", {
           course: rows
       });
   });
});