import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('petbloom_token') || localStorage.getItem('paw_ritual_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getAddresses: () => api.get('/auth/addresses'),
  addAddress: (data) => api.post('/auth/addresses', data),
  updateAddress: (id, data) => api.put(`/auth/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}`),
};

export const productService = {
  getProducts: (params) => api.get('/products', { params }),
  getBestsellers: () => api.get('/products/bestsellers'),
  getEmergencyKits: () => api.get('/products/emergency-kits'),
  getProductBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getProductById: (id) => api.get(`/products/${id}`),
};

export const categoryService = {
  getCategories: () => api.get('/categories'),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
};

export const cartService = {
  getCart: () => api.get('/cart'),
  syncCart: (items) => api.post('/cart/sync', { items }),
  addItem: (data) => api.post('/cart/items', data),
  updateItem: (id, quantity) => api.put(`/cart/items/${id}`, { quantity }),
  removeItem: (id) => api.delete(`/cart/items/${id}`),
  clearCart: () => api.delete('/cart/clear'),
};

export const wishlistService = {
  getWishlist: () => api.get('/wishlist'),
  toggleWishlist: (productId) => api.post('/wishlist/toggle', { productId }),
  removeItem: (productId) => api.delete(`/wishlist/${productId}`),
};

export const couponService = {
  applyCoupon: (data) => api.post('/coupons/apply', data),
};

export const orderService = {
  createOrder: (data) => api.post('/orders/create', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.post(`/orders/cancel/${id}`),
};

export const paymentService = {
  createRazorpayOrder: (data) => api.post('/payments/razorpay/create-order', data),
  verifyRazorpayPayment: (data) => api.post('/payments/razorpay/verify', data),
  confirmCOD: (data) => api.post('/payments/cod/confirm', data),
};

export const reviewService = {
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  submitReview: (data) => api.post('/reviews', data),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getProducts: () => api.get('/admin/products'),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
  getCustomers: () => api.get('/admin/customers'),
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
  getContactMessages: () => api.get('/admin/contact-messages'),
  markMessageRead: (id) => api.put(`/admin/contact-messages/${id}/read`),
  getNewsletterSubscribers: () => api.get('/admin/newsletter-subscribers'),
};

export const contactService = {
  submitContact: (data) => api.post('/contact', data),
  subscribeNewsletter: (data) => api.post('/contact/newsletter', data),
};

export const blogService = {
  getBlogs: () => api.get('/blogs'),
  getBlogBySlug: (slug) => api.get(`/blogs/${slug}`),
};

export default api;
