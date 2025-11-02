
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, MessageSquare, Calendar, Banknote, FileCheck2, CreditCard, ArrowRight, ChevronUp, Rocket, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const journeyCards = [
    {
      icon: Users,
      title: t('home.journey.card1.title'),
      description: t('home.journey.card1.desc'),
    },
    {
      icon: MessageSquare,
      title: t('home.journey.card2.title'),
      description: t('home.journey.card2.desc'),
    },
    {
      icon: Rocket,
      title: t('home.journey.card3.title'),
      description: t('home.journey.card3.desc'),
    },
    {
      icon: ShieldCheck,
      title: t('home.journey.card4.title'),
      description: t('home.journey.card4.desc'),
    },
  ];


  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,white_5%,transparent_100%)]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                {t('home.heroTitle1')}<span className="text-sky-600">{t('home.heroTitle2')}</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-xl mx-auto md:mx-0">
                {t('home.heroSubtitle')}
              </p>
              <div className="mt-10 flex justify-center md:justify-start">
                <Link 
                  to="/loi" 
                  className="inline-flex items-center justify-center bg-sky-600 text-white font-bold py-4 px-8 rounded-lg text-lg text-center hover:bg-sky-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-sky-600/20 hover:shadow-xl hover:shadow-sky-600/40"
                >
                  {t('header.joinPilot')}
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </div>
              <p className="mt-4 text-sm text-slate-500 text-center md:text-left">{t('home.pilotInfo')}</p>
            </div>
            <div className="mt-10 md:mt-0">
               <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop" alt="GEMBank Dashboard" className="rounded-xl shadow-2xl ring-1 ring-slate-900/5" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Journey So Far Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">{t('home.journey.title')}</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {journeyCards.map((card, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-slate-200 text-center transition-all duration-300 hover:shadow-lg hover:shadow-sky-600/10 hover:-translate-y-1">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-sky-100 mx-auto">
                    <card.icon className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-800">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Pain Points Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900">{t('home.painPointsTitle')}</h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-lg text-slate-500">{t('home.painPointsSubtitle')}</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <div className="flex items-center text-sky-600 mb-4">
                        <Banknote className="h-8 w-8 mr-3"/>
                        <h3 className="text-xl font-bold">{t('home.cashFlowTitle')}</h3>
                    </div>
                    <p className="text-slate-600">{t('home.cashFlowDesc')}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                     <div className="flex items-center text-sky-600 mb-4">
                        <FileCheck2 className="h-8 w-8 mr-3"/>
                        <h3 className="text-xl font-bold">{t('home.complianceTitle')}</h3>
                    </div>
                    <p className="text-slate-600">{t('home.complianceDesc')}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <div className="flex items-center text-sky-600 mb-4">
                        <CreditCard className="h-8 w-8 mr-3"/>
                        <h3 className="text-xl font-bold">{t('home.creditTitle')}</h3>
                    </div>
                    <p className="text-slate-600">{t('home.creditDesc')}</p>
                </div>
            </div>
        </div>
      </section>
      
      {/* Get in Touch Section */}
      <section className="py-10 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-800">{t('home.contact.title')}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500">
            {t('home.contact.subtitle')}
          </p>
          <div className="mt-8">
            <a
              href="mailto:gembankteam@gmail.com?subject=Pilot Interest - GEMBank"
              className="inline-flex items-center justify-center bg-sky-600 text-white font-bold py-3 px-6 rounded-lg text-lg text-center hover:bg-sky-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500/20"
            >
              {t('home.contact.button')}
            </a>
          </div>
          <div className="mt-6 text-slate-600">
              <p className="flex items-center justify-center">
                  <span role="img" aria-label="email emoji" className="mr-2">📧</span>
                  <a href="mailto:gembankteam@gmail.com" className="hover:underline text-sky-600 font-medium">gembankteam@gmail.com</a>
              </p>
          </div>
        </div>
      </section>


      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 bg-sky-600 text-white p-3 rounded-full shadow-lg hover:bg-sky-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 z-20 fade-in"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
};

export default HomePage;
