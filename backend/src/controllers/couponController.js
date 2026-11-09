const prisma = require('../utils/prisma');

exports.applyCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a promo code.' });
    }

    const orderSubtotal = parseFloat(subtotal) || 0;
    const cleanCode = code.toUpperCase().trim();

    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive promotional code.' });
    }

    if (coupon.validUntil && new Date() > new Date(coupon.validUntil)) {
      return res.status(400).json({ success: false, message: 'This promotional code has expired.' });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'This promotional code usage limit has been reached.' });
    }

    if (orderSubtotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum bag value of ₹${coupon.minOrderValue}.`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (orderSubtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, orderSubtotal);
    discountAmount = Math.round(discountAmount * 100) / 100;

    return res.json({
      success: true,
      message: `Promotional code ${coupon.code} applied successfully!`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    });
  } catch (error) {
    console.error('applyCoupon Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to apply coupon.' });
  }
};
