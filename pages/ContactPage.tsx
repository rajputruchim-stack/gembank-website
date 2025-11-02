
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { User, Mail, MessageSquare, Type, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>();
  const { t } = useLanguage();

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(data);
    alert(t('contact.success'));
    reset();
  };

  const getInputClasses = (hasError: boolean) => {
    const baseClasses = "pl-10 block w-full bg-slate-50 rounded-md shadow-sm text-slate-900";
    const errorClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
    const normalClasses = "border-slate-300 focus:ring-sky-600 focus:border-sky-600";
    return `${baseClasses} ${hasError ? errorClasses : normalClasses}`;
  };

  return (
    <div className="bg-stone-50 py-12 sm:py-16 fade-in">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{t('contact.title')}</h1>
          <p className="mt-4 text-lg text-slate-500">
            {t('contact.description')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 bg-white p-8 rounded-lg border border-slate-200 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-600">{t('contact.fullName')}</label>
            <div className="mt-1 relative">
              <User className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-500 h-5 w-5" />
              <input
                type="text"
                id="name"
                {...register("name", { required: t('contact.nameRequired') })}
                className={getInputClasses(!!errors.name)}
                aria-invalid={errors.name ? "true" : "false"}
              />
            </div>
            {errors.name && <span className="text-red-500 text-xs mt-1" role="alert">{errors.name.message}</span>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-600">{t('contact.email')}</label>
            <div className="mt-1 relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-500 h-5 w-5" />
              <input
                type="email"
                id="email"
                {...register("email", { 
                  required: t('contact.emailRequired'),
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: t('contact.emailInvalid')
                  }
                })}
                className={getInputClasses(!!errors.email)}
                aria-invalid={errors.email ? "true" : "false"}
              />
            </div>
            {errors.email && <span className="text-red-500 text-xs mt-1" role="alert">{errors.email.message}</span>}
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-600">{t('contact.subject')}</label>
             <div className="mt-1 relative">
              <Type className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-500 h-5 w-5" />
              <input
                type="text"
                id="subject"
                {...register("subject", { required: t('contact.subjectRequired') })}
                className={getInputClasses(!!errors.subject)}
                aria-invalid={errors.subject ? "true" : "false"}
              />
            </div>
            {errors.subject && <span className="text-red-500 text-xs mt-1" role="alert">{errors.subject.message}</span>}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-600">{t('contact.message')}</label>
             <div className="mt-1 relative">
               <MessageSquare className="pointer-events-none absolute top-4 left-3 text-slate-500 h-5 w-5" />
              <textarea
                id="message"
                rows={5}
                {...register("message", { required: t('contact.messageRequired') })}
                className={`${getInputClasses(!!errors.message)} pl-10`}
                aria-invalid={errors.message ? "true" : "false"}
              />
            </div>
            {errors.message && <span className="text-red-500 text-xs mt-1" role="alert">{errors.message.message}</span>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
              {isSubmitting ? t('contact.sending') : t('contact.send')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;