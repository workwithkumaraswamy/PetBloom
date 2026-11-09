const prisma = require('../utils/prisma');

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { productId, authorName, petName, petBreed, rating, title, comment } = req.body;

    if (!productId || !authorName || !rating || !title || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide all required review fields.' });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: req.user ? req.user.id : null,
        authorName: authorName.trim(),
        petName: petName ? petName.trim() : null,
        petBreed: petBreed ? petBreed.trim() : null,
        rating: Math.min(5, Math.max(1, parseInt(rating, 10))),
        title: title.trim(),
        comment: comment.trim(),
        isVerifiedPurchase: true,
        isApproved: true,
      },
    });

    // Recalculate average rating for product
    const allReviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true },
    });

    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for sharing your experience. Your review is published.',
      review,
    });
  } catch (error) {
    console.error('createReview Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
};
