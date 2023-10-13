var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();
var db = require("./database.js")
// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router



router.get('/listTeacherDiscipline', function (req, res) {
    db.all('SELECT * FROM teacher_discipline', (err, rows) => {
        res.render("teacher/listTeacherDiscipline", {
            title: "Список дисциплин преподавателей",
            teacherDiscipline: rows

        });
    });
});

router.get('/listTeachers', function (req, res) {
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

router.post('updateTeacher/:id', (req, res) =>{
    db.run(
        'UPDATE teacher SET name=?, WHERE id=?',
        [req.body.name, req.params.id],
        (err) => {
            if(err){
                throw err;
            }
            res.redirect('/listTeacher');
        }
    );
});

router.post('deleteTeacher/:id', (req, res) =>{
    db.run(
        'DELETE FROM teacher where id=?', [req.params.id],
        (err) =>{
            if(err){
                throw err;
            }
        }
    );
});

router.route('/addTeacher')
    .get((req, res) => {

        res.render('teacher/addTeacher', {
            title: "Добавление преподавателя"
        });
    })
    .post((req, res) => {
        db.run(
            'INSERT INTO teacher (name) VALUES (?)',
            [req.body.name],
            (err) => {
                if(err){
                    throw err;
                }
            res.redirect('/listTeachers')
            }
        );
    });


