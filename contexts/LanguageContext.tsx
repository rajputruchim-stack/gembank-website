import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Language = 'en' | 'hi' | 'gu';

interface LanguageContextType {
    language: Language;
    changeLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to get nested properties from JSON, e.g., "header.howItWorks"
const getNestedTranslation = (obj: any, key: string): string => {
    if (!obj) return key;
    return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj) || key;
};

const translationsCache: { [key: string]: any } = {};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        const storedLang = localStorage.getItem('gembank_language');
        return (storedLang === 'hi' || storedLang === 'gu' || storedLang === 'en') ? storedLang : 'en';
    });
    const [translations, setTranslations] = useState<any | null>(null);

    useEffect(() => {
        const loadTranslations = async (lang: Language) => {
            if (translationsCache[lang]) {
                setTranslations(translationsCache[lang]);
                return;
            }
            try {
                // The path is relative to index.html
                const response = await fetch(`./locales/${lang}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to load ${lang}.json`);
                }
                const data = await response.json();
                translationsCache[lang] = data;
                setTranslations(data);
            } catch (error) {
                console.error(error);
                // Fallback to English if the desired language fails to load
                if (lang !== 'en') {
                    await loadTranslations('en');
                }
            }
        };

        loadTranslations(language);
        localStorage.setItem('gembank_language', language);
        document.documentElement.lang = language;
    }, [language]);

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
    };
    
    const t = useCallback((key: string): string => {
        return getNestedTranslation(translations, key);
    }, [translations]);

    // Prevent rendering children until translations are loaded to avoid FOUC
    if (!translations) {
        return null; 
    }

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
