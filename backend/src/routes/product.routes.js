import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';

const router = Router();

router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/new-arrivals', productController.getNewArrivals);
router.get('/categories', productController.getCategories);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id/related', productController.getRelatedProducts);
router.get('/:id', productController.getProductById);

export default router;
