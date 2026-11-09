import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { blogService } from '../services/api';

export const JournalPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogService.getBlogs().then((res) => {
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    }).catch((e) => console.warn('Blog fetch error:', e)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-ivory-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block">
            The Apothecary Journal
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-charcoal-900 tracking-tight">
            Notes on Grooming, Biology &amp; Care
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 font-light leading-relaxed">
            Thoughtful essays, veterinary first-response protocols, and seasonal coat wellness guides.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-charcoal-500">Loading journal articles...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-ivory-100/70 border border-ivory-300 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-16/10 w-full overflow-hidden bg-ivory-200">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-sage-700 font-semibold uppercase tracking-wider">
                      <span>{post.category}</span>
                      <span className="flex items-center text-charcoal-400 font-normal">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="font-serif text-xl font-semibold text-charcoal-900 line-clamp-2 leading-snug">
                      <Link to={`/journal/${post.slug}`} className="hover:text-sage-700 transition-colors">
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-xs text-charcoal-600 font-light leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to={`/journal/${post.slug}`}
                    className="inline-flex items-center text-xs font-semibold text-charcoal-800 hover:text-sage-700 uppercase tracking-wider"
                  >
                    <span>Read Essay</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
