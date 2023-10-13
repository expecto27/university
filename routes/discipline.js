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

router.get('/discipline/:id', function(req, res){
   var id = req.params.id;
 
   db.get(`SELECT * FROM discipline WHERE id=?`, [id], (err, rows) => {
       if (err) {
           throw err;
       }
       res.render("discipline/discipline", {
           discipline: rows
       });
   });
});

router.post('/updateDiscipline/:id', (req, res)=>{
    db.run(
        'UPDATE discipline SET name=? WHERE id =?',
        [req.body.name, req.params.id],
        (err)=>{
            if(err){
                throw err;
            }
            res.redirect('/listDisciplines');
        }
    );
});
router.post('/deleteDiscipline/:id', (req, res)=>{
    db.run('DELETE FROM discipline WHERE id=?', [req.params.id],
        (err) => {
            if(err){
                throw err;
            }
            res.redirect('/listDisciplines');
        }
    );
});


router.route('/addDiscipline')
    .get((req, res) => {
        db.all('SELECT * FROM discipline', (err, rows)=>{
            if(err){
                throw err;
            }
            res.render("discipline/addDiscipline",{
                title:'Добавление дисциплины'
            });
        });

    })

    .post( (req, res) => {
        db.run(
            'INSERT INTO discipline(name) VALUES (?)',
            [req.body.name],
            (err) =>{
                if(err){
                    throw err;
                }
                res.redirect('/listDisciplines');    
            }
        );
    });