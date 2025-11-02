
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Plus, Minus, Banknote, Sparkles, ClipboardCheck, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FeaturesPage: React.FC = () => {
  const { t } = useLanguage();

  const howItWorksItems = [
    { icon: Banknote, title: t('features.bankingRailsTitle'), description: t('features.bankingRailsDesc') },
    { icon: Sparkles, title: t('features.creditSolutionsTitle'), description: t('features.creditSolutionsDesc') },
    { icon: ClipboardCheck, title: t('features.complianceAutomationTitle'), description: t('features.complianceAutomationDesc') },
    { icon: LayoutDashboard, title: t('features.businessDashboardTitle'), description: t('features.businessDashboardDesc') },
  ];

  const faqItems = [
      { q: t('features.faq1Q'), a: t('features.faq1A') },
      { q: t('features.faq2Q'), a: t('features.faq2A') },
      { q: t('features.faq3Q'), a: t('features.faq3A') },
      { q: t('features.faq4Q'), a: t('features.faq4A') },
      { q: t('features.faq5Q'), a: t('features.faq5A') },
  ];

  interface AccordionItemProps {
    q: string;
    a: string;
  }

  const AccordionItem: React.FC<AccordionItemProps> = ({ q, a }) => {
      const [isOpen, setIsOpen] = useState(false);
      return (
          <div className="border-b border-slate-200">
              <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-4">
                  <span className="text-lg font-medium text-slate-900">{q}</span>
                  {isOpen ? <Minus className="text-sky-600" /> : <Plus className="text-slate-400" />}
              </button>
              {isOpen && <div className="pb-4 text-slate-600">{a}</div>}
          </div>
      );
  };

  return (
    <div className="text-slate-600 fade-in">
      
      {/* Problem Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-sky-600">{t('features.problemTitle')}</h2>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4">{t('features.problemHeading')}</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500">{t('features.problemDesc')}</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-center">{t('features.howItWorksTitle')}</h1>
           <p className="mt-4 max-w-2xl mx-auto text-center text-lg text-slate-500">{t('features.howItWorksDesc')}</p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksItems.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-slate-200 hover:border-sky-500 transition-colors">
                <item.icon className="h-8 w-8 text-sky-600" />
                <h3 className="text-lg font-bold text-slate-900 mt-4">{item.title}</h3>
                <p className="text-slate-500 mt-1 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Join Pilot Section */}
      <section id="pilot" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{t('features.joinPilotTitle')}</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500">{t('features.joinPilotDesc')}</p>
          <div className="mt-8 max-w-md mx-auto bg-white p-8 rounded-lg border border-slate-200 text-left">
             <h3 className="text-xl font-bold text-sky-600 text-center mb-6">{t('features.pilotBenefitsTitle')}</h3>
             <ul className="space-y-4 text-slate-700">
                <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3" />{t('features.benefit1')}</li>
                <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3" />{t('features.benefit2')}</li>
                <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3" />{t('features.benefit3')}</li>
                <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3" />{t('features.benefit4')}</li>
                <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3" />{t('features.benefit5')}</li>
              </ul>
              <Link to="/loi" className="mt-8 block w-full text-center bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700">
                {t('features.applyForPilot')}
              </Link>
              <p className="text-xs text-slate-500 text-center mt-3">{t('features.spotsInfo')}</p>
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-center">{t('features.faqTitle')}</h1>
          <div className="mt-8">
            {faqItems.map((item, index) => <AccordionItem key={index} q={item.q} a={item.a} />)}
          </div>
        </div>
      </section>

    </div>
  );
};

export default FeaturesPage;