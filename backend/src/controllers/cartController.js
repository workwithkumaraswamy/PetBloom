const prisma = require('../utils/prisma');

// Helper to get or create cart
async function getOrCreateCart(userId) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
          variant: true,
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
            variant: true,
          },
        },
      },
    });
  }

  return cart;
}

exports.getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    return res.json({ success: true, cart });
  } catch (error) {
    console.error('getCart Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve cart.' });
  }
};

exports.syncCart = async (req, res) => {
  try {
    const { items = [] } = req.body;
    const cart = await getOrCreateCart(req.user.id);

    for (const item of items) {
      if (!item.productId) continue;

      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: item.productId,
          variantId: item.variantId || null,
        },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + (item.quantity || 1) },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity || 1,
          },
        });
      }
    }

    const updatedCart = await getOrCreateCart(req.user.id);
    return res.json({ success: true, cart: updatedCart });
  } catch (error) {
    console.error('syncCart Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to synchronize cart.' });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const cart = await getOrCreateCart(req.user.id);

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity,
        },
      });
    }

    const updatedCart = await getOrCreateCart(req.user.id);
    return res.json({ success: true, cart: updatedCart, message: 'Product added to your grooming bag.' });
  } catch (error) {
    console.error('addItem Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to add item to bag.' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id } });
    } else {
      await prisma.cartItem.update({
        where: { id },
        data: { quantity },
      });
    }

    const updatedCart = await getOrCreateCart(req.user.id);
    return res.json({ success: true, cart: updatedCart });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update item.' });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cartItem.delete({ where: { id } });
    const updatedCart = await getOrCreateCart(req.user.id);
    return res.json({ success: true, cart: updatedCart, message: 'Item removed from bag.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to remove item.' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    const emptyCart = await getOrCreateCart(req.user.id);
    return res.json({ success: true, cart: emptyCart, message: 'Cart cleared.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to clear cart.' });
  }
};
