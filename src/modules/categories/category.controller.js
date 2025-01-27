import categoryService from '#modules/categories/category.service.js';
import categoryMapper from '#modules/categories/category.mapper.js';

/**
 * CategoryController class.
 */
class CategoryController {
  /**
   * Handles incoming request from the /categories endpoint.
   *
   * @param {*} request The express.js request object.
   * @param {*} response The express.js response object.
   * @param {*} next The express.js next object.
   */
  async index(request, response, next) {
    try {
      const { page, size, sort } = request.query;

      const result = await categoryService.findAll({ page, size, sort });

      response.json({
        message: 'Ok',
        categories: result.categories.map((category) => categoryMapper.toDto(category)),
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles incoming request from the /categories/:category_id endpoint.
   *
   * @param {*} request The express.js request object.
   * @param {*} response The express.js response object.
   * @param {*} next The express.js next object.
   */
  async show(request, response, next) {
    try {
      const { category_id } = request.params;

      const categoryById = await categoryService.findById(category_id);

      response.json({
        message: 'Ok',
        category: categoryMapper.toDto(categoryById),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles incoming request from the /categories endpoint.
   *
   * @param {*} request The express.js request object.
   * @param {*} response The express.js response object.
   * @param {*} next The express.js next object.
   */
  async store(request, response, next) {
    try {
      const { title } = request.body;

      const createdCategory = await categoryService.store({
        title,
      });

      response.status(201).json({
        message: 'Ok',
        category: categoryMapper.toDto(createdCategory),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles incoming request from the /categories/:category_id endpoint.
   *
   * @param {*} request The express.js request object.
   * @param {*} response The express.js response object.
   * @param {*} next The express.js next object.
   */
  async update(request, response, next) {
    try {
      const { category_id } = request.params;
      const { title } = request.body;

      const updatedCategory = await categoryService.update(category_id, {
        title,
      });

      response.json({
        message: 'Ok',
        category: categoryMapper.toDto(updatedCategory),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles incoming request from the /categories/:category_id endpoint.
   *
   * @param {*} request The express.js request object.
   * @param {*} response The express.js response object.
   * @param {*} next The express.js next object.
   */
  async destroy(request, response, next) {
    try {
      const { category_id } = request.params;

      const deletedCategoryId = await categoryService.deleteById(category_id);

      response.json({
        message: 'Ok',
        category: {
          id: deletedCategoryId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles incoming request from the /categories/:category_id/restore endpoint.
   *
   * @param {*} request The express.js request object.
   * @param {*} response The express.js response object.
   * @param {*} next The express.js next object.
   */
  async restore(request, response, next) {
    try {
      const { category_id } = request.params;

      const restoredCategoryId = await categoryService.restore(category_id);

      response.json({
        message: 'Ok',
        category: {
          id: restoredCategoryId,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
