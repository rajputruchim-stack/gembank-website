
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AdminPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    // Use a flex container to center the card vertically and horizontally
    <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 fade-in bg-slate-50" style={{ minHeight: 'calc(100vh - 8rem)' }}>
      <div className="bg-white text-center p-8 sm:p-12 rounded-lg border border-slate-200 shadow-sm max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center justify-center">
            <span role="img" aria-label="compass" className="mr-3 text-3xl">🧭</span>
            {t('admin.title')}
        </h1>
        <p className="mt-6 text-slate-600">
            {t('admin.comingSoonDesc1')}
        </p>
        <div className="mt-4 text-sm text-slate-500">
            <span className="inline-flex items-center justify-center">
              {t('admin.comingSoonDesc2')}
              <span className="ml-2 w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse"></span>
            </span>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
