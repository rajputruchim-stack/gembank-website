
import React from 'react';
import { Link } from 'react-router-dom';
import { Gem, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    if (email) {
      alert(`Thank you for subscribing with ${email}!`);
      e.currentTarget.reset();
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center text-slate-900 font-bold text-xl">
              <Gem className="text-sky-600 h-6 w-6 mr-2" />
              <span>GEMBank</span>
            </Link>
            <p className="text-slate-500 text-sm">{t('footer.tagline')}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 tracking-wider uppercase">{t('footer.product')}</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/features" className="text-base text-slate-500 hover:text-sky-600">{t('header.howItWorks')}</Link></li>
              <li><Link to="/payments" className="text-base text-slate-500 hover:text-sky-600">{t('footer.payments')}</Link></li>
              <li><Link to="/auth" className="text-base text-slate-500 hover:text-sky-600">{t('footer.signUp')}</Link></li>
              <li><Link to="/loi" className="text-base text-slate-500 hover:text-sky-600">{t('header.pilotProgram')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 tracking-wider uppercase">{t('footer.company')}</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/about" className="text-base text-slate-500 hover:text-sky-600">{t('footer.about')}</Link></li>
              <li><Link to="/contact" className="text-base text-slate-500 hover:text-sky-600">{t('header.contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 tracking-wider uppercase">{t('footer.resources')}</h3>
            <ul className="mt-4 space-y-2">
               <li><Link to="/blog" className="text-base text-slate-500 hover:text-sky-600">{t('header.blog')}</Link></li>
               <li><Link to="/admin" className="flex items-center text-base text-slate-500 hover:text-sky-600">
                  <Shield size={16} className="mr-2"/> {t('footer.adminPanel')}
               </Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-900">{t('footer.newsletterTitle')}</h3>
            <p className="mt-2 max-w-md mx-auto text-sm text-slate-500">
              {t('footer.newsletterDescription')}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mt-4 flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="flex-auto w-full px-4 py-2 rounded-md bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-sky-600 focus:border-sky-600 sm:text-sm"
                placeholder={t('footer.emailPlaceholder')}
              />
              <button
                type="submit"
                className="flex-shrink-0 px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 transition-colors"
              >
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-8 text-center">
          <p className="text-base text-slate-500">{t('footer.copyright').replace('{year}', new Date().getFullYear().toString())}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;