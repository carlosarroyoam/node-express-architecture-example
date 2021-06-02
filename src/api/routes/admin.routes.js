const { Router } = require('express');
const validateMiddleware = require('../middlewares/validate.middleware');
const createAdminDto = require('../dtos/admins/create.dto');
const updateAdminDto = require('../dtos/admins/update.dto');

module.exports = ({ adminController, verifyJwtMiddleware }) => {
  const router = Router();

  router.get('/', verifyJwtMiddleware, adminController.index.bind(adminController));
  router.get('/:id', adminController.show.bind(adminController));
  router.post('/', validateMiddleware(createAdminDto), adminController.store.bind(adminController));
  router.put('/:id', validateMiddleware(updateAdminDto), adminController.update.bind(adminController));
  router.put('/:id/restore', adminController.restore.bind(adminController));
  router.delete('/:id', adminController.destroy.bind(adminController));

  return router;
};