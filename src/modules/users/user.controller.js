/**
 * User controller class.
 */
class UserController {
  /**
   * Constructor for UserController.
   *
   * @param {*} dependencies The dependencies payload
   */
  constructor({ userService, userMapper }) {
    this.userService = userService;
    this.userMapper = userMapper;
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
      const { skip, sort, status, search } = request.query;

      const users = await this.userService.findAll({ skip, sort, status, search });

      const usersDto = users.map((user) => this.userMapper.toDto(user));

      response.send({
        message: 'Ok',
        data: usersDto,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles incoming request from the /users/:id endpoint
   *
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  async show(request, response, next) {
    try {
      const { user_id } = request.params;

      const user = await this.userService.find(user_id);

      const userDto = this.userMapper.toDto(user);

      response.send({
        message: 'Ok',
        data: userDto,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles incoming request from the /users/:user_id endpoint
   *
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  async destroy(request, response, next) {
    try {
      const { user_id } = request.params;
      const { id: auth_user_id } = request.user;

      const userDeletedId = await this.userService.delete(user_id, auth_user_id);

      response.send({
        message: 'The user was successfully deleted',
        data: {
          user_deleted_id: userDeletedId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles incoming request from the /users/:user_id/restore endpoint
   *
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  async restore(request, response, next) {
    try {
      const { user_id } = request.params;
      const { id: auth_user_id } = request.user;

      const userRestoredId = await this.userService.restore(user_id, auth_user_id);

      response.send({
        message: 'The user was successfully restored',
        data: {
          user_restored_id: userRestoredId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles incoming request from the /users/:user_id/change-password endpoint
   *
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  async changePassword(request, response, next) {
    try {
      const { user_id } = request.params;
      const { current_password, new_password } = request.body;
      const { id: auth_user_id } = request.user;

      await this.userService.changePassword({
        user_id,
        auth_user_id,
        current_password,
        new_password,
      });

      response.send({
        message: 'Ok',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
