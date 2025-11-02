import React, { useState } from 'react';
import { X, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const { t } = useLanguage();

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onSubmit(email);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 fade-in"
      aria-labelledby="password-reset-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4 relative animate-pop-in">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full text-slate-500 hover:bg-slate-200"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <h2 id="password-reset-title" className="text-xl font-bold text-slate-900">
          {t('auth.resetPasswordTitle')}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {t('auth.resetPasswordInstruction')}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-sm font-medium text-slate-500">
              {t('auth.email')}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="reset-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-md border-slate-300 bg-slate-50 pl-10 py-2 text-slate-900 focus:border-sky-600 focus:ring-sky-600 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
            >
              {t('auth.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700"
            >
              {t('auth.sendResetLink')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetModal;
