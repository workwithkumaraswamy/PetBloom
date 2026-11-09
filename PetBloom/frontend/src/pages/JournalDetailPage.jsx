import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, ArrowLeft, ArrowRight, Share2, BookOpen } from 'lucide-react';
import { blogService } from '../services/api';

export const JournalDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    blogService.getBlogBySlug(slug).then((res) => {
      if (res.data.success) {
        setPost(res.data.post);
      }
    }).catch((e) => console.warn('Blog post fetch error:', e)).finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center py-24 text-xs text-charcoal-500">
        Loading journal essay...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-ivory-50 py-24 text-center">
        <h2 className="font-serif text-2xl text-charcoal-800 mb-2">Essay Not Found</h2>
        <Link to="/journal" className="text-xs text-sage-700 underline">Return to Journal</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-50 py-16">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            to="/journal"
            className="inline-flex items-center text-xs text-charcoal-500 hover:text-charcoal-900 mb-6 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            <span>Back to Journal</span>
          </Link>

          <div className="flex items-center space-x-3 text-xs text-sage-700 font-semibold uppercase tracking-wider mb-2">
            <span>{post.category}</span>
            <span>•</span>
            <span className="flex items-center text-charcoal-500 font-normal">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {post.readTime}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal-900 tracking-tight leading-snug">
            {post.title}
          </h1>

          <div className="pt-3 pb-6 border-b border-ivory-300 text-xs text-charcoal-500 flex items-center justify-between">
            <span>By {post.author}</span>
            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Cover Photo */}
        <div className="aspect-16/9 rounded-2xl overflow-hidden bg-ivory-200 border border-ivory-300 shadow-md">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Article Body */}
        <div className="prose prose-stone max-w-none text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light space-y-4">
          <p className="text-base sm:text-lg italic font-serif text-charcoal-800 leading-relaxed">
            "{post.excerpt}"
          </p>

          <div className="pt-4 space-y-4 whitespace-pre-line text-xs sm:text-sm">
            {post.content}
          </div>
        </div>

        {/* Footer Callout */}
        <div className="pt-8 border-t border-ivory-300 flex items-center justify-between">
          <Link
            to="/shop"
            className="inline-flex items-center bg-charcoal-800 text-ivory-50 text-xs uppercase tracking-wider font-semibold px-6 py-3 rounded shadow-md"
          >
            <span>Explore Grooming Apothecary</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </article>
    </div>
  );
};
