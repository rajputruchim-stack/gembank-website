import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-slate-50 py-12 sm:py-16 fade-in">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{t('blog.title')}</h1>
          <p className="mt-4 text-lg text-slate-500">
            {t('blog.description')}
          </p>
        </div>
        
        <div className="space-y-12">
          {blogPosts.map((post) => (
            <article key={post.slug} className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <h2 className="text-2xl font-bold text-slate-900 hover:text-sky-600 transition-colors">
                <Link to={`/blog/${post.slug}`}>
                  {post.title[language] || post.title['en']}
                </Link>
              </h2>
              <div className="flex flex-wrap items-center text-sm text-slate-500 mt-4 gap-x-4 gap-y-2">
                <div className="flex items-center">
                  <User size={14} className="mr-2" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2" />
                  <span>{post.date}</span>
                </div>
              </div>
              <p className="mt-4 text-slate-600">
                {post.excerpt[language] || post.excerpt['en']}
              </p>
              <div className="mt-6">
                <Link to={`/blog/${post.slug}`} className="inline-flex items-center font-semibold text-sky-600 hover:text-sky-700 group">
                  {t('blog.readMore')}
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BlogPage;
