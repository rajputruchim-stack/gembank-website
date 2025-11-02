
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);
  const { language, t } = useLanguage();

  if (!post) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">{t('blogPost.postNotFound')}</h1>
        <Link to="/blog" className="text-sky-600 hover:underline mt-4 inline-block">{t('blogPost.backToBlog')}</Link>
      </div>
    );
  }
  
  const title = post.title[language] || post.title['en'];
  const content = post.content[language] || post.content['en'];

  return (
    <div className="bg-white py-12 sm:py-16 fade-in">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <Link to="/blog" className="inline-flex items-center text-sky-600 hover:text-sky-700">
            <ArrowLeft size={16} className="mr-2" />
            {t('blogPost.backToBlog')}
          </Link>
        </div>
        
        <article>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{title}</h1>
          <div className="flex items-center text-sm text-slate-500 mb-8 space-x-4">
            <div className="flex items-center">
              <User size={14} className="mr-2" />
              <span>{t('blogPost.by')} {post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={14} className="mr-2" />
              <span>{t('blogPost.postedOn')} {post.date}</span>
            </div>
          </div>
          
          <div 
            className="prose prose-lg max-w-none text-slate-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage;