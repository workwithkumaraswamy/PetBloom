const prisma = require('../utils/prisma');

// 1. Dashboard Statistics & Reports
exports.getStats = async (req, res) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalCustomers,
      totalProducts,
      lowStockCount,
      allCompletedOrders,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { stock: { lte: 20 }, isActive: true } }),
      prisma.order.findMany({
        where: { paymentStatus: 'PAID' },
        select: { totalAmount: true, createdAt: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          payment: true,
        },
      }),
      prisma.product.findMany({
        where: { stock: { lte: 20 }, isActive: true },
        select: { id: true, name: true, sku: true, stock: true, price: true },
        take: 5,
      }),
    ]);

    const totalRevenue = allCompletedOrders.reduce((acc, o) => acc + o.totalAmount, 0);

    // Monthly sales aggregation for chart
    const monthlySalesMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize default months
    const currentMonthIdx = new Date().getMonth();
    for (let i = 5; i >= 0; i--) {
      const idx = (currentMonthIdx - i + 12) % 12;
      monthlySalesMap[months[idx]] = 0;
    }

    allCompletedOrders.forEach((o) => {
      const m = months[new Date(o.createdAt).getMonth()];
      if (monthlySalesMap[m] !== undefined) {
        monthlySalesMap[m] += o.totalAmount;
      }
    });

    const monthlySales = Object.keys(monthlySalesMap).map((m) => ({
      month: m,
      revenue: Math.round(monthlySalesMap[m]),
    }));

    return res.json({
      success: true,
      stats: {
        totalRevenue: Math.round(totalRevenue),
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders,
        completedOrders: deliveredOrders,
        lowStockCount,
        monthlySales,
        recentOrders,
        lowStockProducts,
      },
    });
  } catch (error) {
    console.error('getStats Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate admin statistics.' });
  }
};

// 2. Product Management CRUD
exports.getAdminProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });
    return res.json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch admin products.' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      sku,
      shortDescription,
      fullDescription,
      price,
      compareAtPrice,
      stock = 50,
      categoryId,
      isFeatured = false,
      isBestseller = false,
      isEmergencyKit = false,
      ingredients,
      directions,
      safetyInfo,
      images = [],
      variants = [],
    } = req.body;

    if (!name || !sku || !price || !categoryId) {
      return res.status(400).json({ success: false, message: 'Name, SKU, Price, and Category are required.' });
    }

    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        name,
        slug: cleanSlug,
        sku,
        shortDescription: shortDescription || name,
        fullDescription: fullDescription || name,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        stock: parseInt(stock, 10),
        categoryId,
        isFeatured: Boolean(isFeatured),
        isBestseller: Boolean(isBestseller),
        isEmergencyKit: Boolean(isEmergencyKit),
        ingredients,
        directions,
        safetyInfo,
        images: {
          create: images.map((img, idx) => ({
            url: typeof img === 'string' ? img : img.url,
            altText: img.altText || name,
            isPrimary: idx === 0,
            sortOrder: idx,
          })),
        },
        variants: {
          create: variants.map((v) => ({
            name: v.name || 'Size',
            value: v.value,
            priceAdjustment: parseFloat(v.priceAdjustment || 0),
            stock: parseInt(v.stock || stock, 10),
            sku: v.sku || `${sku}-${v.value}`,
          })),
        },
        inventoryLogs: {
          create: {
            quantity: parseInt(stock, 10),
            type: 'INITIAL',
            notes: 'Product created by admin',
          },
        },
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    return res.status(201).json({ success: true, message: 'Product created successfully.', product });
  } catch (error) {
    console.error('createProduct Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      sku,
      shortDescription,
      fullDescription,
      price,
      compareAtPrice,
      stock,
      categoryId,
      isFeatured,
      isBestseller,
      isEmergencyKit,
      isActive,
      ingredients,
      directions,
      safetyInfo,
      images,
      variants,
    } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Update base fields
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        sku,
        shortDescription,
        fullDescription,
        price: price !== undefined ? parseFloat(price) : undefined,
        compareAtPrice: compareAtPrice !== undefined ? (compareAtPrice ? parseFloat(compareAtPrice) : null) : undefined,
        stock: stock !== undefined ? parseInt(stock, 10) : undefined,
        categoryId,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        isBestseller: isBestseller !== undefined ? Boolean(isBestseller) : undefined,
        isEmergencyKit: isEmergencyKit !== undefined ? Boolean(isEmergencyKit) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        ingredients,
        directions,
        safetyInfo,
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    // If new images provided, update them
    if (images && Array.isArray(images) && images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await prisma.productImage.create({
          data: {
            productId: id,
            url: typeof img === 'string' ? img : img.url,
            altText: img.altText || name,
            isPrimary: i === 0,
            sortOrder: i,
          },
        });
      }
    }

    return res.json({ success: true, message: 'Product updated.', product: updated });
  } catch (error) {
    console.error('updateProduct Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
};

// 3. Order Management
exports.getAdminOrders = async (req, res) => {
  try {
    const { status, paymentStatus, search } = req.query;

    const where = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customerName: { contains: search } },
        { customerEmail: { contains: search } },
        { customerPhone: { contains: search } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        payment: true,
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, trackingNumber, notes } = req.body;

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        trackingNumber: trackingNumber !== undefined ? trackingNumber : undefined,
        notes: notes !== undefined ? notes : undefined,
      },
      include: {
        items: true,
        payment: true,
      },
    });

    return res.json({ success: true, message: 'Order status updated.', order: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
};

// 4. Customer Management
exports.getCustomers = async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
        },
        addresses: true,
      },
    });

    const formatted = customers.map((c) => ({
      ...c,
      totalOrders: c.orders.length,
      totalSpend: c.orders.reduce((sum, o) => sum + o.totalAmount, 0),
    }));

    return res.json({ success: true, customers: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch customers.' });
  }
};

// 5. Coupon Management
exports.getAdminCoupons = async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, coupons });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch coupons.' });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderValue, maxDiscount, validUntil, usageLimit } = req.body;

    if (!code || !discountValue) {
      return res.status(400).json({ success: false, message: 'Coupon code and discount value are required.' });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        discountType: discountType || 'PERCENTAGE',
        discountValue: parseFloat(discountValue),
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        usageLimit: usageLimit ? parseInt(usageLimit, 10) : 100,
        isActive: true,
      },
    });

    return res.status(201).json({ success: true, message: 'Coupon created.', coupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create coupon.' });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.coupon.delete({ where: { id } });
    return res.json({ success: true, message: 'Coupon deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete coupon.' });
  }
};

// 6. Contact Messages & Subscribers
exports.getContactMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
  }
};

exports.markMessageRead = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
    return res.json({ success: true, message: 'Marked as read.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update message.' });
  }
};

exports.getNewsletterSubscribers = async (req, res) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, subscribers });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch subscribers.' });
  }
};
