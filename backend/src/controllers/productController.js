const prisma = require('../utils/prisma');

exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      isEmergencyKit,
      isFeatured,
      isBestseller,
      sortBy = 'featured',
      page = 1,
      limit = 12,
    } = req.query;

    const where = {
      isActive: true,
    };

    if (category && category !== 'all') {
      where.category = {
        slug: category,
      };
    }

    if (isEmergencyKit === 'true' || isEmergencyKit === true) {
      where.isEmergencyKit = true;
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (isBestseller === 'true') {
      where.isBestseller = true;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search && search.trim() !== '') {
      const term = search.trim();
      where.OR = [
        { name: { contains: term } },
        { shortDescription: { contains: term } },
        { fullDescription: { contains: term } },
        { ingredients: { contains: term } },
      ];
    }

    // Sort options
    let orderBy = { isFeatured: 'desc' };
    if (sortBy === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (sortBy === 'rating') {
      orderBy = { rating: 'desc' };
    } else if (sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sortBy === 'popularity') {
      orderBy = { reviewCount: 'desc' };
    }

    const take = parseInt(limit, 10) || 12;
    const skip = (parseInt(page, 10) - 1) * take;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          variants: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      success: true,
      products,
      pagination: {
        total: totalCount,
        page: parseInt(page, 10),
        pages: Math.ceil(totalCount / take),
        limit: take,
      },
    });
  } catch (error) {
    console.error('getProducts Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve products.' });
  }
};

exports.getBestsellers = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isBestseller: true,
      },
      take: 6,
      orderBy: { rating: 'desc' },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
    });

    return res.json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch bestsellers.' });
  }
};

exports.getEmergencyKits = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isEmergencyKit: true,
      },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
    });

    return res.json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch emergency kits.' });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { priceAdjustment: 'asc' } },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Related products from the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
    });

    return res.json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error('getProductBySlug Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch product details.' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch product.' });
  }
};
