
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Clipboard, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const JewelryDescriptionGenerator: React.FC = () => {
    const { t } = useLanguage();
    const [productType, setProductType] = useState('');
    const [features, setFeatures] = useState('');
    const [audience, setAudience] = useState('');
    const [tone, setTone] = useState(t('tools.toneElegant'));
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!productType || !features) {
            setError(t('tools.error'));
            return;
        }
        setError('');
        setIsLoading(true);
        setDescription('');

        const prompt = `Generate a compelling e-commerce product description for a jewelry piece. The description should be around 100-150 words, well-structured with a captivating title, a descriptive paragraph, and a list of key specifications.

        **Jewelry Details:**
        - **Product Type:** ${productType}
        - **Key Features:** ${features}
        - **Target Audience:** ${audience || 'General'}
        - **Tone of Voice:** ${tone}`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setDescription(response.text);
        } catch (err) {
            console.error('Error generating description:', err);
            setError(t('tools.generateError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if(navigator.clipboard) {
            navigator.clipboard.writeText(description).then(() => {
                alert(t('tools.copySuccess'));
            });
        }
    };

    const inputClasses = "mt-1 block w-full bg-slate-50 border-slate-300 rounded-md shadow-sm text-slate-900 focus:ring-sky-600 focus:border-sky-600";
    const labelClasses = "block text-sm font-medium text-slate-600";

    return (
        <div className="bg-white p-8 rounded-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                <Sparkles className="h-6 w-6 mr-3 text-sky-600" />
                {t('tools.generatorTitle')}
            </h2>
            <p className="mt-2 text-slate-500">
                {t('tools.generatorDescription')}
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="productType" className={labelClasses}>{t('tools.productType')}</label>
                    <input type="text" id="productType" value={productType} onChange={e => setProductType(e.target.value)} placeholder={t('tools.productTypePlaceholder')} className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="audience" className={labelClasses}>{t('tools.targetAudience')}</label>
                    <input type="text" id="audience" value={audience} onChange={e => setAudience(e.target.value)} placeholder={t('tools.targetAudiencePlaceholder')} className={inputClasses} />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="features" className={labelClasses}>{t('tools.features')}</label>
                    <textarea id="features" rows={3} value={features} onChange={e => setFeatures(e.target.value)} placeholder={t('tools.featuresPlaceholder')} className={inputClasses}></textarea>
                </div>
                <div>
                    <label htmlFor="tone" className={labelClasses}>{t('tools.tone')}</label>
                    <select id="tone" value={tone} onChange={e => setTone(e.target.value)} className={inputClasses}>
                        <option>{t('tools.toneElegant')}</option>
                        <option>{t('tools.toneLuxurious')}</option>
                        <option>{t('tools.toneModern')}</option>
                        <option>{t('tools.tonePlayful')}</option>
                        <option>{t('tools.toneTraditional')}</option>
                    </select>
                </div>
            </div>
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            <div className="mt-6">
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full md:w-auto inline-flex justify-center items-center py-2 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                    {isLoading ? t('tools.generating') : t('tools.generate')}
                </button>
            </div>
            {description && (
                <div className="mt-8 p-6 bg-slate-50 rounded-lg relative fade-in">
                    <button onClick={handleCopy} className="absolute top-4 right-4 p-2 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-600" aria-label="Copy description">
                        <Clipboard size={18} />
                    </button>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('tools.generatedDescription')}</h3>
                    <div className="text-slate-700 whitespace-pre-wrap">{description}</div>
                </div>
            )}
        </div>
    );
};


const ToolsPage: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="bg-stone-50 py-12 sm:py-16 fade-in">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{t('tools.title')}</h1>
                    <p className="mt-4 text-lg text-slate-500">
                        {t('tools.description')}
                    </p>
                </div>
                <JewelryDescriptionGenerator />
                {/* Future tools can be added here as separate components */}
            </div>
        </div>
    );
};

export default ToolsPage;