import AdminRepository from '#modules/admins/admin.repository.js';
import UserRepository from '#modules/users/user.repository.js';

import userRoles from '#modules/auth/roles.js';

import bcrypt from '#common/lib/bcrypt/index.js';
import sharedErrors from '#common/errors/index.js';
import dbConnectionPool from '#common/lib/mysql/connectionPool.js';
import logger from '#common/lib/winston/logger.js';

/**
 * AdminService class.
 */
class AdminService {
  /**
   * Retrieves all admin users.
   *
   * @param {object} queryOptions The query options.
   * @param {number} queryOptions.page The query page.
   * @param {number} queryOptions.size The query size.
   * @param {string} queryOptions.sort The order for the results.
   * @param {string} queryOptions.status The user status to query.
   * @param {string} queryOptions.search The search criteria.
   * @return {Promise} The list of admins.
   */
  async findAll({ page = 1, size = 50, sort = 'id', status, search }) {
    let connection;

    try {
      connection = await dbConnectionPool.getConnection();
      const adminRepository = new AdminRepository(connection);

      const totalAdmins = await adminRepository.count({
        status,
        search,
      });
      const admins = await adminRepository.findAll({
        page,
        size,
        sort,
        status,
        search,
      });

      connection.release();

      return {
        admins,
        pagination: {
          page,
          size: admins.length,
          totalElements: totalAdmins,
          totalPages: Math.ceil(totalAdmins / size),
        },
      };
    } catch (err) {
      if (connection) connection.release();

      if (!err.status) {
        logger.error({
          message: err.message,
        });

        throw new sharedErrors.InternalServerError('Error while retrieving admins');
      }

      throw err;
    }
  }

  /**
   * Retrieves an admin user by its id.
   *
   * @param {object} admin The admin user object.
   * @param {number} admin.admin_id The id of the admin user to retrieve.
   * @return {Promise} The admin user.
   */
  async findById({ admin_id }) {
    let connection;

    try {
      connection = await dbConnectionPool.getConnection();
      const adminRepository = new AdminRepository(connection);

      const adminById = await adminRepository.findById(admin_id);

      if (!adminById) {
        throw new sharedErrors.ResourceNotFoundError();
      }

      connection.release();

      return adminById;
    } catch (err) {
      if (connection) connection.release();

      if (!err.status) {
        logger.error({
          message: err.message,
        });

        throw new sharedErrors.InternalServerError('Error while retrieving admin');
      }

      throw err;
    }
  }

  /**
   * Stores an admin user.
   *
   * @param {object} admin The admin user to store.
   * @return {Promise} The created admin user.
   */
  async store(admin) {
    let connection;

    try {
      connection = await dbConnectionPool.getConnection();
      const userRepository = new UserRepository(connection);
      const adminRepository = new AdminRepository(connection);

      connection.beginTransaction();

      const userByEmail = await userRepository.findByEmail(admin.email);

      if (userByEmail) {
        throw new sharedErrors.EmailAlreadyTakenError({
          email: admin.email,
        });
      }

      const passwordHash = await bcrypt.hashPassword(admin.password);

      const createdUserId = await userRepository.store({
        ...admin,
        password: passwordHash,
        user_role_id: userRoles.admin.id,
      });

      const createdAdminId = await adminRepository.store({
        is_super: admin.is_super,
        user_id: createdUserId,
      });

      const createdAdmin = await adminRepository.findById(createdAdminId);

      connection.commit();

      connection.release();

      return createdAdmin;
    } catch (err) {
      if (connection) {
        connection.rollback();

        connection.release();
      }

      if (!err.status) {
        logger.error({
          message: err.message,
        });

        throw new sharedErrors.InternalServerError('Error while storing admin');
      }

      throw err;
    }
  }

  /**
   * Updates an admin user by its id.
   *
   * @param {number} admin_id The id of the admin user to update.
   * @param {object} admin The admin user to store.
   * @return {Promise} The updated admin user.
   */
  async update(admin_id, admin) {
    let connection;

    try {
      connection = await dbConnectionPool.getConnection();
      const userRepository = new UserRepository(connection);
      const adminRepository = new AdminRepository(connection);

      connection.beginTransaction();

      const adminById = await adminRepository.findById(admin_id);

      if (!adminById) {
        throw new sharedErrors.ResourceNotFoundError();
      }

      if (adminById.deleted_at !== null) {
        throw new sharedErrors.BadRequestError('The user account is disabled');
      }

      await userRepository.update(
        {
          ...admin,
        },
        adminById.user_id
      );

      const updatedAdmin = await adminRepository.findById(admin_id);

      connection.commit();

      connection.release();

      return updatedAdmin;
    } catch (err) {
      if (connection) {
        connection.rollback();

        connection.release();
      }

      if (!err.status) {
        logger.error({
          message: err.message,
        });

        throw new sharedErrors.InternalServerError('Error while updating admin');
      }

      throw err;
    }
  }
}

export default new AdminService();
