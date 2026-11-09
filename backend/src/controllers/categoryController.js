const prisma = require('../utils/prisma');

exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });

    const formatted = categories.map((c) => ({
      ...c,
      productCount: c._count.products,
    }));

    return res.json({ success: true, categories: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          include: {
            images: { orderBy: { sortOrder: 'asc' } },
            variants: true,
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    return res.json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch category.' });
  }
};
