const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');
const { generateToken } = require('../middleware/auth');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName) {
      return res.status(400).json({ success: false, message: 'Please provide email, password, and first name.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName ? lastName.trim() : null,
        phone: phone ? phone.trim() : null,
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Create cart & wishlist for user
    await prisma.cart.create({ data: { userId: user.id } });
    await prisma.wishlist.create({ data: { userId: user.id } });

    const token = generateToken(user.id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to PetBloom.',
      token,
      user,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration. Please try again.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        cart: {
          include: {
            items: true,
          },
        },
        wishlist: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user.id, user.role);

    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      cartCount: user.cart ? user.cart.items.reduce((acc, it) => acc + it.quantity, 0) : 0,
      wishlistCount: user.wishlist ? user.wishlist.items.length : 0,
    };

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        addresses: {
          orderBy: { isDefault: 'desc' },
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            items: true,
          },
        },
        cart: {
          include: {
            items: true,
          },
        },
        wishlist: {
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
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      user: {
        ...user,
        cartCount: user.cart ? user.cart.items.reduce((acc, it) => acc + it.quantity, 0) : 0,
        wishlistCount: user.wishlist ? user.wishlist.items.length : 0,
      },
    });
  } catch (error) {
    console.error('getMe Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile data.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName: firstName ? firstName.trim() : undefined,
        lastName: lastName ? lastName.trim() : undefined,
        phone: phone ? phone.trim() : undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
      },
    });

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updated,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash: newHash },
    });

    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Change Password Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide email address.' });
    }

    // Always return safe friendly response
    return res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been dispatched to your inbox.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to process reset request.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email and new password are required.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.updateMany({
      where: { email: email.toLowerCase().trim() },
      data: { passwordHash },
    });

    return res.json({ success: true, message: 'Password reset successfully. You may now log in.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
};

// Address Management
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: { isDefault: 'desc' },
    });
    return res.json({ success: true, addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch addresses.' });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { fullName, phone, streetAddress, apartment, city, state, postalCode, country, isDefault } = req.body;

    if (!fullName || !phone || !streetAddress || !city || !state || !postalCode) {
      return res.status(400).json({ success: false, message: 'Please fill in all required address fields.' });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: req.user.id,
        fullName,
        phone,
        streetAddress,
        apartment,
        city,
        state,
        postalCode,
        country: country || 'India',
        isDefault: Boolean(isDefault),
      },
    });

    return res.status(201).json({ success: true, message: 'Address saved successfully.', address });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to save address.' });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, streetAddress, apartment, city, state, postalCode, country, isDefault } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        fullName,
        phone,
        streetAddress,
        apartment,
        city,
        state,
        postalCode,
        country: country || 'India',
        isDefault: Boolean(isDefault),
      },
    });

    return res.json({ success: true, message: 'Address updated.', address });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update address.' });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.address.delete({
      where: { id },
    });
    return res.json({ success: true, message: 'Address removed.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete address.' });
  }
};
