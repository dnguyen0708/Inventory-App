const express = require('express');
const router = express.Router();
const product_controller = require('../controllers/productController');


//Product Routes

//display all products
router.get('/',product_controller.all_products);

//GET product create
router.get('/create',product_controller.product_create_get);

//POST product create
router.post('/create',product_controller.product_create_post);

//GET product update
router.get('/:id/update',product_controller.product_update_get);

//POST product update
router.post('/:id/update',product_controller.product_update_post);

//GET product delete
router.get('/:id/delete',product_controller.product_delete_get);

//POST product delete
router.post('/:id/delete',product_controller.product_delete_post);

//GET product detail
router.get('/:id',product_controller.product_detail);

module.exports = router;