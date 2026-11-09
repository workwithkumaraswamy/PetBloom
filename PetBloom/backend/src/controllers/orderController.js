const prisma = require('../utils/prisma');

// Helper to generate luxury order reference e.g. PR-2024-9182
function generateOrderNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PR-${year}-${random}`;
}

exports.createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      paymentMethod = 'COD',
      couponCode,
      notes,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your shopping bag is empty.' });
    }

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
      return res.status(400).json({ success: false, message: 'Please provide full contact and delivery details.' });
    }

    // Verify products and calculate subtotal
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product || !product.isActive) {
        return res.status(400).json({ success: false, message: `Product ${item.productName || ''} is unavailable.` });
      }

      let price = product.price;
      let variantInfo = null;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (variant) {
          price += variant.priceAdjustment;
          variantInfo = `${variant.name}: ${variant.value}`;
        }
      }

      const itemTotal = price * (item.quantity || 1);
      subtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        price,
        quantity: item.quantity || 1,
        total: itemTotal,
        variantInfo,
      });
    }

    // Calculate Shipping (Free above ₹999, else ₹99)
    const shippingFee = subtotal >= 999 ? 0 : 99;

    // Validate Coupon if applied
    let discountAmount = 0;
    let validatedCoupon = null;

    if (couponCode) {
      validatedCoupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });

      if (validatedCoupon && validatedCoupon.isActive) {
        if (subtotal >= validatedCoupon.minOrderValue) {
          if (validatedCoupon.discountType === 'PERCENTAGE') {
            discountAmount = (subtotal * validatedCoupon.discountValue) / 100;
            if (validatedCoupon.maxDiscount && discountAmount > validatedCoupon.maxDiscount) {
              discountAmount = validatedCoupon.maxDiscount;
            }
          } else {
            discountAmount = validatedCoupon.discountValue;
          }
          discountAmount = Math.min(discountAmount, subtotal);
        }
      }
    }

    const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user ? req.user.id : null,
        customerName: customerName.trim(),
        customerEmail: customerEmail.toLowerCase().trim(),
        customerPhone: customerPhone.trim(),
        status: 'PENDING',
        paymentMethod: paymentMethod.toUpperCase(),
        paymentStatus: 'PENDING',
        subtotal,
        shippingFee,
        discountAmount,
        totalAmount,
        couponCode: validatedCoupon ? validatedCoupon.code : null,
        notes: notes ? notes.trim() : null,
        shippingAddressSnapshot: JSON.stringify(shippingAddress),
        items: {
          create: validatedItems,
        },
        payment: {
          create: {
            paymentMethod: paymentMethod.toUpperCase(),
            amount: totalAmount,
            currency: 'INR',
            status: 'PENDING',
          },
        },
      },
      include: {
        items: true,
        payment: true,
      },
    });

    // Update coupon usage count if used
    if (validatedCoupon) {
      await prisma.coupon.update({
        where: { id: validatedCoupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Update inventory for each product
    for (const item of validatedItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });

      await prisma.inventory.create({
        data: {
          productId: item.productId,
          quantity: -item.quantity,
          type: 'SALE',
          notes: `Order ${orderNumber}`,
        },
      });
    }

    // Clear cart if logged in
    if (req.user) {
      const userCart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
      if (userCart) {
        await prisma.cartItem.deleteMany({ where: { cartId: userCart.id } });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order,
    });
  } catch (error) {
    console.error('createOrder Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process order.' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
        payment: true,
      },
    });

    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve orders.' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
        payment: true,
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Only allow owner or admin or guest with valid session
    if (req.user && req.user.role !== 'ADMIN' && order.userId && order.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch order details.' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    if (order.status === 'SHIPPED' || order.status === 'DELIVERED') {
      return res.status(400).json({
        success: false,
        message: 'Dispatched orders cannot be cancelled online. Please contact concierge support.',
      });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    // Restock items
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
      await prisma.inventory.create({
        data: {
          productId: item.productId,
          quantity: item.quantity,
          type: 'RESTOCK',
          notes: `Restock from cancelled order ${order.orderNumber}`,
        },
      });
    }

    return res.json({ success: true, message: 'Order has been cancelled.', order: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to cancel order.' });
  }
};
