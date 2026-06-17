const express = require('express');
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');
const UsersController = require('../controllers/usersController');

const router = express.Router();

router.get('/', authMiddleware, tenantMiddleware, UsersController.getUsers);
router.post('/', authMiddleware, tenantMiddleware, UsersController.createUser);

module.exports = router;
