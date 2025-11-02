import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Linkedin, Twitter, Layers, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

const AboutPage: React.FC = () => {
    const { t } = useLanguage();

    const founders = [
        {
            name: t('about.founders.ruchi.name'),
            title: t('about.founders.ruchi.title'),
            description: t('about.founders.ruchi.description'),
            imageUrl: 'https://images.unsplash.com/photo-1580894908361-967195033215?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
            linkedin: '#',
            twitter: '#'
        },
        {
            name: t('about.founders.amrit.name'),
            title: t('about.founders.amrit.title'),
            description: t('about.founders.amrit.description'),
            imageUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
            linkedin: '#',
            twitter: '#'
        },
        {
            name: t('about.founders.ivan.name'),
            title: t('about.founders.ivan.title'),
            description: t('about.founders.ivan.description'),
            imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
            linkedin: '#',
            twitter: '#'
        }
    ];

    const whyItems = [
        {
            icon: Layers,
            title: t('about.why.item1.title'),
            description: t('about.why.item1.description')
        },
        {
            icon: TrendingUp,
            title: t('about.why.item2.title'),
            description: t('about.why.item2.description')
        },
        {
            icon: ShieldCheck,
            title: t('about.why.item3.title'),
            description: t('about.why.item3.description')
        }
    ];

    const checklistItems = [
        t('about.checklist.item1'),
        t('about.checklist.item2'),
        t('about.checklist.item3'),
        t('about.checklist.item4'),
        t('about.checklist.item5'),
        t('about.checklist.item6'),
        t('about.checklist.item7'),
    ];

    return (
        <div className="fade-in">
            {/* Hero Section */}
            <section className="py-20 text-center bg-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                        {t('about.title')}
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600">
                        {t('about.description')}
                    </p>
                </div>
            </section>

            {/* Why GEMBank Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-slate-900">{t('about.why.title')}</h2>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {whyItems.map((item, index) => (
                            <div key={index} className="text-center p-6">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-sky-100 mx-auto">
                                    <item.icon className="h-8 w-8 text-sky-600" />
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-slate-900">{item.title}</h3>
                                <p className="mt-2 text-slate-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Founders Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-slate-900">{t('about.foundersTitle')}</h2>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
                        {founders.map((founder, index) => (
                            <div key={index} className="bg-white text-center p-8 rounded-lg border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-sky-300">
                                <img
                                    className="w-32 h-32 rounded-full mx-auto object-cover ring-4 ring-slate-100"
                                    src={founder.imageUrl}
                                    alt={`Portrait of ${founder.name}`}
                                />
                                <h3 className="mt-6 text-xl font-bold text-slate-900">{founder.name}</h3>
                                <p className="mt-1 text-base font-semibold text-sky-600">{founder.title}</p>
                                <p className="mt-4 text-slate-600 text-sm">
                                    {founder.description}
                                </p>
                                <div className="mt-6 flex justify-center space-x-4">
                                    <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-600 transition-colors">
                                        <Linkedin size={20} />
                                        <span className="sr-only">LinkedIn</span>
                                    </a>
                                    <a href={founder.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-600 transition-colors">
                                        <Twitter size={20} />
                                        <span className="sr-only">Twitter</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Authenticity Checklist Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900">{t('about.checklist.title')}</h2>
                        <p className="mt-4 text-lg text-slate-500">{t('about.checklist.subtitle')}</p>
                    </div>
                    <div className="mt-12 max-w-2xl mx-auto bg-slate-50/50 border border-slate-200 rounded-lg p-8">
                        <ul className="space-y-4">
                            {checklistItems.map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-slate-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-8 text-center font-semibold text-slate-600 border-t border-slate-200 pt-6">
                            ➡️ {t('about.checklist.conclusion')}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;