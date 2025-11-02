
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gem, Menu, X, Globe } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
    const { language, changeLanguage } = useLanguage();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const languages: { [key in Language]: string } = {
        en: 'English',
        hi: 'हिन्दी',
        gu: 'ગુજરાતી'
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors flex items-center"
                aria-label="Change language"
            >
                <Globe size={20} />
            </button>
            {isLangOpen && (
                <div 
                  className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 border border-slate-200 z-50"
                  onMouseLeave={() => setIsLangOpen(false)}
                >
                    {Object.entries(languages).map(([code, name]) => (
                        <button
                            key={code}
                            onClick={() => {
                                changeLanguage(code as Language);
                                setIsLangOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm ${language === code ? 'bg-sky-50 text-sky-700' : 'text-slate-700'} hover:bg-slate-100`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};


const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: t('header.howItWorks'), path: '/features' },
    { name: t('header.about'), path: '/about' },
    { name: t('header.tools'), path: '/tools' },
    { name: t('header.pilotProgram'), path: '/loi' },
    { name: t('header.blog'), path: '/blog' },
    { name: t('header.contact'), path: '/contact' },
  ];

  // Effect for keyboard navigation (Esc, Tab) and focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      if (e.key === 'Tab') {
        const focusableElements = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Effect to manage focus and body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
      setTimeout(() => {
        mobileMenuRef.current?.querySelector<HTMLElement>('button, a')?.focus();
      }, 100);
    } else {
      document.body.classList.remove('overflow-hidden');
      menuButtonRef.current?.focus();
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  // Effect to close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);


  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center text-slate-900 font-bold text-xl">
                <Gem className="text-sky-600 h-6 w-6 mr-2" />
                <span>GEMBank</span>
              </Link>
            </div>
            <nav className="hidden md:block" aria-label="Main navigation">
              <div className="ml-10 flex items-baseline space-x-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors group ${
                      location.pathname.startsWith(link.path)
                        ? 'text-slate-900'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-sky-600 transition-all duration-300 group-hover:w-[80%] ${location.pathname.startsWith(link.path) ? 'w-[80%]' : 'w-0'}`}></span>
                  </Link>
                ))}
              </div>
            </nav>
            <div className="hidden md:flex items-center space-x-2">
               <LanguageSwitcher />
              <Link
                to="/loi"
                className="ml-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 transition-colors"
              >
                {t('header.joinPilot')}
              </Link>
            </div>
            <div className="-mr-2 flex md:hidden items-center">
               <LanguageSwitcher />
              <button
                ref={menuButtonRef}
                onClick={() => setIsOpen(true)}
                type="button"
                className="ml-2 bg-slate-100 inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-600"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
                aria-label="Open main menu"
              >
                <Menu className="block h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Mobile Menu Panel */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className={`md:hidden fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out transform z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-labelledby="mobile-menu-title"
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h2 id="mobile-menu-title" className="sr-only">Main menu</h2>
            <Link to="/" className="flex items-center text-slate-900 font-bold text-lg">
                <Gem className="text-sky-600 h-6 w-6 mr-2" />
                <span>GEMBank</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md text-slate-500 hover:bg-slate-200"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex-grow px-4 pt-5 pb-3 space-y-2 sm:px-5" aria-label="Mobile navigation">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 transform ${
                  location.pathname.startsWith(link.path)
                     ? 'text-sky-700 bg-sky-50'
                     : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                } ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5 pointer-events-none'}`}
                style={{ transitionDelay: `${150 + index * 50}ms` }}
                tabIndex={isOpen ? 0 : -1}
              >
                {link.name}
              </Link>
            ))}
            <div
                className={`mt-4 pt-4 border-t border-slate-200 transition-all duration-300 transform ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5 pointer-events-none'}`}
                style={{ transitionDelay: `${150 + navLinks.length * 50}ms` }}
            >
                <Link
                  to="/loi"
                  className="block w-full text-center px-4 py-3 rounded-md text-base font-medium text-white bg-sky-600 hover:bg-sky-700 transition-colors"
                  tabIndex={isOpen ? 0 : -1}
                >
                  {t('header.joinPilot')}
                </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;