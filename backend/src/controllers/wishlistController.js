const prisma = require('../utils/prisma');

async function getOrCreateWishlist(userId) {
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
              category: true,
            },
          },
        },
      },
    },
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                category: true,
              },
            },
          },
        },
      },
    });
  }

  return wishlist;
}

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user.id);
    return res.json({ success: true, wishlist });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve wishlist.' });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const wishlist = await getOrCreateWishlist(req.user.id);
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    let isAdded = false;
    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      isAdded = false;
    } else {
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
        },
      });
      isAdded = true;
    }

    const updated = await getOrCreateWishlist(req.user.id);
    return res.json({
      success: true,
      isAdded,
      message: isAdded ? 'Added to your curated wishlist.' : 'Removed from wishlist.',
      wishlist: updated,
    });
  } catch (error) {
    console.error('toggleWishlist Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update wishlist.' });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await getOrCreateWishlist(req.user.id);

    await prisma.wishlistItem.deleteMany({
      where: {
        wishlistId: wishlist.id,
        productId,
      },
    });

    const updated = await getOrCreateWishlist(req.user.id);
    return res.json({ success: true, wishlist: updated, message: 'Item removed from wishlist.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to remove from wishlist.' });
  }
};
