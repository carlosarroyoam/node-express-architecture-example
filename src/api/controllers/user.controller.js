/**
 * User controller
 */
class UserController {
  constructor({ userService }) {
    this._userService = userService;
  }

  /**
   * Handles incoming request from the /user endpoint
   *
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  async index(request, response, next) {
    try {
      const users = await this._userService.findAll();

      response.send({
        message: 'Ok',
        data: users,
      });
    } catch (error) {
      console.error(error.message);

      if (error.sqlMessage) {
        next(new Error('Error while retrieving users'));
        return;
      }

      next(error);
    }
  }

  /**
   * Handles incoming request from the /user/:id endpoint
   *
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  async show(request, response, next) {
    try {
      const { id } = request.params;

      const user = await this._userService.find(id);

      response.send({
        message: 'Ok',
        data: user,
      });
    } catch (error) {
      console.error(error.message);

      if (error.sqlMessage) {
        next(new Error('Error while retrieving user'));
        return;
      }

      next(error);
    }
  }

  /**
   * Handles incoming request from the /user endpoint
   *
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  async store(request, response, next) {
    try {
      const { first_name, last_name, email } = request.body;

      const createdUser = await this._userService.store({ first_name, last_name, email });

      response.status(201).send({
        message: 'Created',
        data: {
          createdUser,
        },
      });
    } catch (error) {
      console.error(error.message);

      if (error.sqlMessage) {
        next(new Error('Error while storing user'));
        return;
      }

      next(error);
    }
  }

  /**
   * Handles incoming request from the /user/:id endpoint
   *
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  async update(request, response, next) {
    try {
      const { id } = request.params;
      const user = request.body;

      const updatedUser = await this._userService.update(id, user);

      response.send({
        message: 'Updated',
        data: {
          updatedUser,
        },
      });
    } catch (error) {
      console.error(error.message);

      if (error.sqlMessage) {
        next(new Error('Error while updating user'));
        return;
      }

      next(error);
    }
  }
}

module.exports = UserController;
