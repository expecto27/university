// Подключение модуля express
var express = require("express");

// Создание объекта  express
var app = express();

// Указание, что каталог public используется для хранения статических файлов
app.use(express.static("public"));

// Подключение шаблонизатора Pug.
app.set("view engine", "pug");

// Указание пути к каталогу, который хранит шаблоны в формате Pug.
app.set("views", "./views");

// Указание номера порта, через который будет запускаться приложение.
app.listen(3000);

app.get("/", function(request, response)  {
   // render() — функция, которая на основе шаблона (в данном случае шаблона index.pug) генерирует страницу html, которая отправляется пользователю.
    response.render("index");
});

// Определение обработчикв для маршрута "/test"
app.get("/test", function(request, response)  {
    response.render("test", {description: "AFSDF"});
});

app.get("/information", function(request, response){
    response.render("test", {description:"На этой странице будет описание проекта"});
});


var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// подключение модуля student.js
var student = require('./routes/student');
app.use('/', student);

var attestationBook = require('./routes/attestationBook');
app.use('/', attestationBook);

var teacher = require('./routes/teacher')
app.use('/', teacher)

var course = require('./routes/discipline')
app.use('/', course)

app.get('/pugPractice', function(req, res){
    res.render( 'pugPractice', {
        title: 'Работа с шаблонизатором Pug'
    });
});

app.get("/ejsPractice", function(request, response)  {   
    response.render("ejsPractice.ejs"); 
});

app.get("/hbsPractice", function(request, response)  {   
    let now = new Date();
    response.render("hbsPractice.hbs", {
        day: now.getDay() == 0 || now.getDate() == 6,
        array: Array.from({length: 100}, (_, i) => i + 1)
    });
});

var studentGroup = require('./routes/studentGroup');
app.use('/', studentGroup);
