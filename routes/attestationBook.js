var express = require("express");
var router = express.Router();

var db = require("./database.js");

module.exports = router;


var TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;
var dbTransaction = new TransactionDatabase(db);


router.get("/listSessionRecords", (req, res) => {
    db.all(
        `SELECT student_group_session.semester, student_group_session.mark_date,
        teacher.name, discipline.name AS discipline_name,
        student_group.name AS student_group_name, report_type.name as report_type_name 
        FROM student_group_session
        INNER JOIN teacher_discipline ON teacher_discipline.id=student_group_session.teacher_discipline_id
        INNER JOIN teacher ON teacher.id=teacher_discipline.teacher_id
        INNER JOIN discipline ON discipline.id=teacher_discipline.discipline_id 
        INNER JOIN student_group ON student_group.id=student_group_session.student_group_id
        INNER JOIN report_type ON report_type.id=student_group_session.report_type_id
        ORDER BY student_group.id, student_group_session.semester, student_group_session.mark_date`,
        (err, rows) => {
            if (err) {
                throw err;
            }
            res.render("attestationBook/listSessionRecords", {   
                sessionRecords: rows,
                title: "Данные сессий"
            });
        });
});

router.route("/addSessionRecord")
    .get((req, res) => {
        db.all(
            `SELECT teacher_discipline.id, discipline.id AS discipline_id, discipline.name AS discipline_name, 
            teacher.id AS teacher_id, teacher.name 
            FROM teacher_discipline
            INNER JOIN discipline ON discipline.id=teacher_discipline.discipline_id 
            INNER JOIN teacher ON teacher.id=teacher_discipline.teacher_id`,
            (err, rows) => {
                if (err) {
                    throw err;
                }
                var teacherDiscipline = rows;
                db.all(
                    `SELECT * FROM student_group`,
                    (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        var studentGroups = rows;
                        db.all(`SELECT * FROM report_type`,
                        (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            var reportTypes = rows;
                            res.render("attestationBook/addSessionRecord", {
                                teacherDiscipline: teacherDiscipline,
                                studentGroups: studentGroups,
                                reportTypes: reportTypes,
                                title: "Добавление записи о сессии"
                            });
                        });
                    });
            });
    })
    .post((req, res) => {
        dbTransaction.beginTransaction((err, transaction) => {
            transaction.run(
                `INSERT INTO student_group_session(student_group_id, report_type_id, teacher_discipline_id, mark_date, semester) VALUES (?,?,?,?,?)`,
                [req.body.student_group_id, req.body.report_type_id, req.body.teacher_discipline_id, req.body.mark_date, req.body.semester],
                function(err) { // здесь стрелочную функцию использовать нельзя, так как не сможем далее обратиться к lastID
                    if (err) {
                        throw err;
                    }
                    // получаем идентификатор добавленной записи в student_group_session (этот идентификатор потребуется для добавления записей в attestation_book, поскольку нужно указывать ссылку на запись из таблицы student_group_session)
                    var student_group_session_id = this.lastID;
    
                    // выполним запрос к таблице студентов
                    db.all(`SELECT * FROM student WHERE student_group_id=?`, [req.body.student_group_id], (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        var students = rows;
                        var attestation_book = [];
                        for (var i in students) {
                            // сначала добавляем идентификатор студента
                            attestation_book.push(students[i].id);
                            // добавляем ссылку на таблицу student_group_session
                            attestation_book.push(student_group_session_id);
                        }
    
                        // После конструкции VALUES в запросе необходимо определить шаблон для параметров.
                        // Поскольку добавляем 2 значения для каждой строки, то шаблон будет (?,?).
                        // Шаблон (?,?) должен повторяться столько раз, сколько студентов в массиве.
                        var placeholders = students.map(() => '(?,?)').join(',');
    
                        transaction.run(
                            `INSERT INTO attestation_book(student_id, student_group_session_id) VALUES ` + placeholders,
                            attestation_book,
                            (err) => {
                                if (err) {
                                    throw err;
                                }
                                // фиксируем транзакцию
                                transaction.commit((err) => {
                                    if (err) {
                                        throw err;
                                    }
                                    // в случае успешного выполнения транзакции переходим к странице с данными сессий
                                    res.redirect("/listSessionRecords");
                                });
                            });
                    });
                });
        });
    });