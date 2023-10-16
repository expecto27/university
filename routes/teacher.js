var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();
var db = require("./database.js")
// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router



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

router.post('/updateTeacher/:id', (req, res) =>{
    db.run(
        'UPDATE teacher SET name=? WHERE id=?',
        [req.body.name, req.params.id],
        (err) => {
            if(err){
                throw err;
            }
            res.redirect('/listTeachers');
        }
    );
});

router.post('/deleteTeacher/:id', (req, res) =>{
    db.run(
        'DELETE FROM teacher where id=?', [req.params.id],
        (err) =>{
            if(err){
                throw err;
            }
            res.redirect('/listTeachers');
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
                res.redirect('/listTeachers');
            }
        );
    });

    router.get("/listTeacherDiscipline", (req, res) => {
        db.all(
            `SELECT discipline.id AS discipline_id, discipline.name AS discipline_name, 
            teacher.id AS teacher_id, teacher.name 
            FROM teacher_discipline
            INNER JOIN discipline ON discipline.id=teacher_discipline.discipline_id 
            INNER JOIN teacher ON teacher.id=teacher_discipline.teacher_id`,
            (err, rows) => {
                if (err) {
                    throw err;
                }
                res.render("teacher/listTeacherDiscipline", {
                    teacherDiscipline: rows,
                    title: "Назначение преподавателям учебных дисциплин"
                });
        });
    });

router.route("/addTeacherDiscipline")
    .get((req, res) => {
        db.all(`SELECT * FROM teacher`, (err, rows) => {
            if (err) {
                throw err;
            }
            var teachers = rows;
            db.all(`SELECT * FROM discipline`, (err, rows) => {
                if (err) {
                    throw err;
                }
                var disciplines = rows;
                res.render("teacher/addTeacherDiscipline", {
                    teachers: teachers,
                    disciplines: disciplines,
                    title: "Назначение преподавателям учебных дисциплин"
                });
            });
        });
    })
    .post((req, res) => {
        db.run('INSERT INTO teacher_discipline(teacher_id, discipline_id) VALUES (?, ?)', [req.body.teacher_id, req.body.discipline_id],
            (err) => {
                if (err) {
                    throw err;
                }
                res.redirect('/listTeacherDiscipline');
            }
        );
    });

router.post("/deleteTeacherDiscipline/teacherId=:teacher_id/disciplineId=:discipline_id", (req, res) => {
        db.run(`DELETE FROM teacher_discipline WHERE teacher_id=? AND discipline_id=?`, [req.params.teacher_id, req.params.discipline_id],
            (err) => {
                if (err) {
                    throw err;
                }
                res.redirect('/listTeacherDiscipline');
            }
        );
    });