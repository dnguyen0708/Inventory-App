const express = require('express');
const router = express.Router();
const category_controller = require('../controllers/categoryController');

//Category Routes

//display all category
router.get('/',category_controller.all_categories);

//GET category create
router.get('/create',category_controller.category_create_get);

//POST category create
router.post('/create',category_controller.category_create_post);

//GET category update
router.get('/:id/update',category_controller.category_update_get);

//POST category update
router.post('/:id/update',category_controller.category_update_post);

//GET category delete
router.get('/:id/delete',category_controller.category_delete_get);

//POST category delete
router.post('/:id/delete',category_controller.category_delete_post);

//GET category detail
router.get('/:id',category_controller.category_detail);

module.exports = router;