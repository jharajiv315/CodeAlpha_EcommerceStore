import { productService } from '../services/product.service.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getProducts = async (req, res, next) => {
  try {
    const { category, brand, search, minPrice, maxPrice, inStockOnly, minRating, sort, page, limit } = req.query;
    const result = await productService.getProducts({
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      inStockOnly,
      minRating,
      sort,
      page,
      limit,
    });
    return sendSuccess(res, result, 'Products retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      return sendError(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');
    }
    return sendSuccess(res, product, 'Product details retrieved');
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await productService.getProductBySlug(slug);
    if (!product) {
      return sendError(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');
    }
    return sendSuccess(res, product, 'Product details retrieved');
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await productService.getCategories();
    return sendSuccess(res, categories, 'Categories retrieved');
  } catch (err) {
    next(err);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 8;
    const products = await productService.getFeaturedProducts(limit);
    return sendSuccess(res, products, 'Featured products retrieved');
  } catch (err) {
    next(err);
  }
};

export const getNewArrivals = async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 8;
    const products = await productService.getNewArrivals(limit);
    return sendSuccess(res, products, 'New arrivals retrieved');
  } catch (err) {
    next(err);
  }
};

export const getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const limit = req.query.limit ? Number(req.query.limit) : 4;
    const products = await productService.getRelatedProducts(id, limit);
    return sendSuccess(res, products, 'Related products retrieved');
  } catch (err) {
    next(err);
  }
};
