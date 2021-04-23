const {
  asClass, asFunction, asValue, createContainer,
} = require('awilix');

const container = createContainer();

const StartUp = require('./startup');
const Server = require('./server');

const UserController = require('./controllers/users/user.controller');
const BookController = require('./controllers/books/book.controller');

// const UserService = require('./services/users/user.service');
// const BookService = require('./services/books/book.service');

const RootRoute = require('./routes/root/root.routes');
const DefaultRoute = require('./routes/default/default.routes');
const UserRoutes = require('./routes/users/user.routes');
const BookRoutes = require('./routes/books/book.routes');

const Routes = require('./routes');
const Config = require('../config/environments');

container
  // App
  .register({
    app: asClass(StartUp).singleton(),
    server: asClass(Server).singleton(),
  })
  // Config
  .register({
    config: asValue(Config),
  })
  // Router
  .register({
    router: asFunction(Routes).singleton(),
  })
  // Routes
  .register({
    rootRoute: asFunction(RootRoute).singleton(),
    defaultRoute: asFunction(DefaultRoute).singleton(),
    userRoutes: asFunction(UserRoutes).singleton(),
    bookRoutes: asFunction(BookRoutes).singleton(),
  })
  // Controllers
  .register({
    userController: asClass(UserController).singleton(),
    bookController: asClass(BookController).singleton(),
  });
// Services
// .register({
//     userService: asClass(UserService).singleton(),
//     bookService: asClass(BookService).singleton(),
// });

module.exports = container;
