const prisma = require('../utils/prisma');

exports.getBlogPosts = async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    });
    return res.json({ success: true, posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch journal entries.' });
  }
};

exports.getBlogPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post || !post.isPublished) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    return res.json({ success: true, post });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch article.' });
  }
};
