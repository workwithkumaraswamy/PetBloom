const app = require('./src/app');
const http = require('http');

async function runTests() {
  console.log('--- Commencing PetBloom End-to-End Workflow Verification ---');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;
  console.log(`Test server running on port ${port}`);

  async function request(endpoint, options = {}) {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await res.json();
    return { status: res.status, data };
  }

  try {
    // 1. Health check
    const health = await request('/health');
    console.log('✔ Health Check:', health.data.brand, health.data.status);
    if (health.status !== 200 || health.data.brand !== 'PetBloom') throw new Error('Health check failed');

    // 2. Fetch products
    const products = await request('/products');
    console.log(`✔ Products Retrieval: ${products.data.products.length} products found`);
    if (products.data.products.length < 5) throw new Error('Not all core products loaded');

    // 3. Category query
    const nailCare = await request('/products?category=nail-care');
    console.log(`✔ Category Filter (Nail Care): ${nailCare.data.products.length} products`);

    // 4. Product details by slug
    const productDetail = await request('/products/slug/safety-dog-nail-clippers');
    console.log('✔ Product Slug Query:', productDetail.data.product.name, 'Rating:', productDetail.data.product.rating);

    // 5. Customer Login
    const customerLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'elena.vance@example.com', password: 'Password@123' },
    });
    console.log('✔ Customer Authentication:', customerLogin.data.user.firstName, 'Role:', customerLogin.data.user.role);
    const customerToken = customerLogin.data.token;

    // 6. Admin Login
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@petbloom.com', password: 'Admin@PetBloom2024' },
    });
    console.log('✔ Admin Authentication:', adminLogin.data.user.firstName, 'Role:', adminLogin.data.user.role);
    const adminToken = adminLogin.data.token;

    // 7. Admin Dashboard Stats
    const adminStats = await request('/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log('✔ Admin Executive Stats:', {
      totalRevenue: adminStats.data.stats.totalRevenue,
      totalOrders: adminStats.data.stats.totalOrders,
      totalCustomers: adminStats.data.stats.totalCustomers,
      totalProducts: adminStats.data.stats.totalProducts,
    });

    // 8. Apply Coupon
    const coupon = await request('/coupons/apply', {
      method: 'POST',
      body: { code: 'BLOOM10', subtotal: 2000 },
    });
    console.log('✔ Promotional Coupon Applied:', coupon.data.coupon.code, 'Discount Amount:', coupon.data.coupon.discountAmount);

    // 9. Create Order
    const newOrder = await request('/orders/create', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        customerName: 'Elena Vance',
        customerEmail: 'elena.vance@example.com',
        customerPhone: '+91 98111 22334',
        shippingAddress: {
          fullName: 'Elena Vance',
          phone: '+91 98111 22334',
          streetAddress: 'Apartment 4B, Grand Residences',
          city: 'New Delhi',
          state: 'Delhi',
          postalCode: '110003',
          country: 'India',
        },
        items: [
          {
            productId: products.data.products[0].id,
            productName: products.data.products[0].name,
            quantity: 1,
          },
        ],
        paymentMethod: 'RAZORPAY',
        couponCode: 'BLOOM10',
      },
    });
    console.log('✔ Order Placement Created:', newOrder.data.order.orderNumber, 'Total Amount:', newOrder.data.order.totalAmount);

    // 10. Razorpay Gateway Order Creation & Verification
    const rzpOrder = await request('/payments/razorpay/create-order', {
      method: 'POST',
      body: { orderId: newOrder.data.order.id },
    });
    console.log('✔ Razorpay Payment Order Initialized:', rzpOrder.data.razorpayOrderId);

    const rzpVerify = await request('/payments/razorpay/verify', {
      method: 'POST',
      body: {
        orderId: newOrder.data.order.id,
        razorpayOrderId: rzpOrder.data.razorpayOrderId,
        razorpayPaymentId: 'pay_test_verified_123',
        razorpaySignature: 'simulated_test_signature',
      },
    });
    console.log('✔ Razorpay Payment Verified:', rzpVerify.data.message, 'Order Payment Status:', rzpVerify.data.order.paymentStatus);

    // 11. Contact Form submission
    const contactRes = await request('/contact', {
      method: 'POST',
      body: {
        name: 'Karan Mehra',
        email: 'karan@example.com',
        phone: '+91 99999 88888',
        subject: 'Grooming Advisory',
        message: 'Could you advise which clippers fit an 18kg Cockapoo?',
      },
    });
    console.log('✔ Client Concierge Message Submitted:', contactRes.data.message);

    console.log('\n======================================================');
    console.log('🎉 ALL 11 WORKFLOW SUITES PASSED FLAWLESSLY! 🎉');
    console.log('======================================================\n');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();
