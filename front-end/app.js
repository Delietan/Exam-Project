var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

var indexRouter = require('./routes/index');
var productsRouter = require('./routes/products');
var brandsRouter = require('./routes/brands');
var categoriesRouter = require('./routes/categories');
var rolesRouter = require('./routes/roles');
var usersRouter = require('./routes/users');
var ordersRouter = require('./routes/orders');
var membershipsRouter = require('./routes/memberships');
var orderstatusesRouter = require('./routes/orderstatuses');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/', indexRouter);
app.use('/admin/products', productsRouter);
app.use('/admin/brands', brandsRouter);
app.use('/admin/categories', categoriesRouter);
app.use('/admin/roles', rolesRouter);
app.use('/admin/users', usersRouter);
app.use('/admin/orders', ordersRouter);
app.use('/admin/memberships', membershipsRouter);
app.use('/admin/orderstatuses', orderstatusesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
