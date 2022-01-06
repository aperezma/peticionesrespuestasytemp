var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'Kanamekuran123',
  resave: false,
  saveUninitialized: true,
}));



app.get('/', function (req, res) {
  var conocido = Boolean(req.session.nombre);
   
  res.render('index', {
    title: 'Hermesexpress',
    conocido: conocido,
    nombre: req.session.nombre,
    texto: req.session.texto
  })
});

app.post('/ingresar', function (req, res) {
  if(req.body.nombre && req.body.texto){
    req.session.nombre = req.body.nombre;
    req.session.texto = req.body.texto;
  }
  res.redirect('/');
});

app.get('/salir', function(req, res){
  req.session.destroy();
  res.redirect('/');
});

app.use('/users', usersRouter);


app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
