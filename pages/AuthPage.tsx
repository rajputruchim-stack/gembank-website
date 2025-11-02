import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gem, Mail, Lock, Phone, Briefcase, MapPin, KeyRound, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import PasswordResetModal from '../components/PasswordResetModal';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C41.38,36.405,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const AppleIcon = () => (
    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.01,16.23C14.06,16.23,15.35,15.02,16.36,12.9C16.56,12.48,16.78,12.02,17.01,11.58C15.78,11.08,14.96,11,14.96,11C13.14,11,11.58,12.23,10.72,12.23C9.86,12.23,8.59,11.1,7.05,11.1C5.2,11.1,3.64,12.26,2.78,14.21C1.68,16.77,2.86,20.03,4.29,22.05C5.35,23.59,6.66,24,6.66,24C7.81,24,8.69,23.26,9.71,23.26C10.73,23.26,11.46,23.97,12.77,23.97C14.13,23.97,14.31,22.75,12.72,16.23H12.01M15.1,6.57C15.8,5.73,16.22,4.64,16.14,3.43C14.86,3.34,13.45,3.97,12.65,4.81C11.9,5.55,11.41,6.67,11.49,7.85C12.87,7.99,14.37,7.43,15.1,6.57"></path>
    </svg>
);

const MicrosoftIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 21 21" aria-hidden="true">
        <path fill="#f25022" d="M1 1h9v9H1z"/>
        <path fill="#00a4ef" d="M1 11h9v9H1z"/>
        <path fill="#7fba00" d="M11 1h9v9h-9z"/>
        <path fill="#ffb900" d="M11 11h9v9h-9z"/>
    </svg>
);


const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // For multi-step signup
  const [authMode, setAuthMode] = useState<'email' | 'otp_phone' | 'otp_verify'>('email');
  const [otpPhone, setOtpPhone] = useState('');
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const { addToast } = useToast();
  const { t } = useLanguage();

  const commonInputClasses = "block w-full rounded-md border-slate-300 bg-slate-50 pl-10 py-2 text-slate-900 focus:border-sky-600 focus:ring-sky-600 sm:text-sm";

  const handleSuccessfulSignup = () => {
    addToast(t('toasts.registrationSuccessTitle'), t('toasts.registrationSuccessMessage'), 'success');
    setStep(1);
    setIsLogin(true);
    setAuthMode('email');
  };

  const handlePasswordResetRequest = (email: string) => {
    addToast(t('toasts.passwordResetTitle'), t('toasts.passwordResetMessage').replace('{email}', email), 'success');
    setIsPasswordResetOpen(false);
  };

  const SignupForm = () => (
    <form className="space-y-6">
      <div>
        <label htmlFor="email-signup" className="block text-sm font-medium text-slate-500">{t('auth.email')}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-slate-500" />
            </div>
            <input id="email-signup" name="email" type="email" required className={commonInputClasses} placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <label htmlFor="password-signup" className="block text-sm font-medium text-slate-500">{t('auth.password')}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-slate-500" />
            </div>
            <input id="password-signup" name="password" type="password" required className={commonInputClasses} placeholder={t('auth.passwordPlaceholder')} />
        </div>
      </div>
      <div>
        <button type="button" onClick={() => setStep(2)} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600">
          {t('auth.createAccount')}
        </button>
      </div>
    </form>
  );

  const LoginForm = () => (
    <form className="space-y-6">
        <div>
            <label htmlFor="email-login" className="block text-sm font-medium text-slate-500">{t('auth.email')}</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input id="email-login" name="email" type="email" autoComplete="email" required className={commonInputClasses} placeholder="you@example.com" />
            </div>
        </div>

        <div>
            <label htmlFor="password-login" className="block text-sm font-medium text-slate-500">{t('auth.password')}</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input id="password-login" name="password" type="password" autoComplete="current-password" required className={commonInputClasses} placeholder={t('auth.password')} />
            </div>
        </div>

        <div className="flex items-center justify-between">
            <div className="text-sm">
                <button type="button" onClick={() => setIsPasswordResetOpen(true)} className="font-medium text-sky-600 hover:text-sky-500">{t('auth.forgotPassword')}</button>
            </div>
        </div>

        <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600">
                {t('auth.signIn')}
            </button>
        </div>
    </form>
  );

  const BusinessProfileForm = () => (
    <div className="animate-fade-in">
        <button onClick={() => setStep(1)} className="flex items-center text-sm text-slate-500 hover:text-sky-600 mb-4">
            <ArrowLeft size={16} className="mr-1"/> {t('auth.backToSignUp')}
        </button>
        <h2 className="text-2xl font-bold text-center text-slate-900">{t('auth.businessProfileTitle')}</h2>
        <p className="mt-2 text-sm text-center text-slate-500">{t('auth.businessProfileDesc')}</p>
        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleSuccessfulSignup(); }}>
            <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-slate-500">{t('auth.businessName')}</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Briefcase className="h-5 w-5 text-slate-500" />
                    </div>
                    <input id="businessName" name="businessName" type="text" required className={commonInputClasses} placeholder={t('auth.businessNamePlaceholder')} />
                </div>
            </div>
            <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-slate-500">{t('auth.businessType')}</label>
                <select id="businessType" name="businessType" className="mt-1 block w-full rounded-md border-slate-300 bg-slate-50 py-2 px-3 text-slate-900 focus:border-sky-600 focus:ring-sky-600 sm:text-sm">
                    <option>{t('auth.manufacturer')}</option>
                    <option>{t('auth.retailer')}</option>
                    <option>{t('auth.wholesaler')}</option>
                    <option>{t('auth.distributor')}</option>
                </select>
            </div>
            <div>
                <label htmlFor="city" className="block text-sm font-medium text-slate-500">{t('auth.city')}</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MapPin className="h-5 w-5 text-slate-500" />
                    </div>
                    <input id="city" name="city" type="text" required className={commonInputClasses} placeholder={t('auth.cityPlaceholder')} />
                </div>
            </div>
             <div>
                <label htmlFor="turnover" className="block text-sm font-medium text-slate-500">{t('auth.turnover')}</label>
                <select id="turnover" name="turnover" className="mt-1 block w-full rounded-md border-slate-300 bg-slate-50 py-2 px-3 text-slate-900 focus:border-sky-600 focus:ring-sky-600 sm:text-sm">
                    <option>{t('auth.turnover1')}</option>
                    <option>{t('auth.turnover2')}</option>
                    <option>{t('auth.turnover3')}</option>
                    <option>{t('auth.turnover4')}</option>
                </select>
            </div>

            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 rounded border-slate-300 bg-slate-100 text-sky-600 focus:ring-sky-700" />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-slate-500">
                        {t('auth.terms').split('<1>')[0]}
                        <a href="#" className="font-medium text-sky-600 hover:text-sky-500">{t('auth.terms').split('<1>')[1].split('</1>')[0]}</a>
                        {t('auth.terms').split('</1>')[1]}
                    </label>
                </div>
            </div>
            <div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600">
                    {t('auth.completeSignup')}
                </button>
            </div>
        </form>
    </div>
  );

  const OtpPhoneForm = () => (
    <div className="fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">{t('auth.signInWithOtp')}</h2>
        <p className="mt-2 text-sm text-slate-500">{t('auth.enterPhoneNumber')}</p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); setAuthMode('otp_verify'); }}>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-500">{t('auth.phoneNumber')}</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Phone className="h-5 w-5 text-slate-500" />
            </div>
            <input id="phone" name="phone" type="tel" value={otpPhone} onChange={(e) => setOtpPhone(e.target.value)} required className={commonInputClasses} placeholder={t('auth.phonePlaceholder')} />
          </div>
        </div>
        <div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700">
            {t('auth.sendOtp')}
          </button>
        </div>
      </form>
       <div className="mt-4 text-center">
         <button onClick={() => setAuthMode('email')} className="text-sm font-medium text-sky-600 hover:text-sky-500">{t('auth.backToEmailLogin')}</button>
      </div>
    </div>
  );

  const OtpVerifyForm = () => {
    const [countdown, setCountdown] = useState(30);
    
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);
    
    const handleResend = () => {
        // Simulate resending OTP
        setCountdown(30);
        addToast(t('toasts.otpResentTitle'), t('toasts.otpResentMessage'), 'success');
    };

    return (
        <div className="fade-in">
          <button onClick={() => setAuthMode('otp_phone')} className="flex items-center text-sm text-slate-500 hover:text-sky-600 mb-4">
              <ArrowLeft size={16} className="mr-1"/> {t('auth.back')}
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">{t('auth.enterOtp')}</h2>
            <p className="mt-2 text-sm text-slate-500">{t('auth.otpSentTo').replace('{phone}', otpPhone)}</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Logged in!'); setAuthMode('email'); }}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-slate-500">{t('auth.otp')}</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <KeyRound className="h-5 w-5 text-slate-500" />
                </div>
                <input id="otp" name="otp" type="text" maxLength={6} required className={commonInputClasses} placeholder={t('auth.otpPlaceholder')} />
              </div>
            </div>
            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700">
                {t('auth.verifySignIn')}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm text-slate-500">
            {t('auth.didNotReceive')}
            <button onClick={handleResend} disabled={countdown > 0} className="ml-1 font-medium text-sky-600 hover:text-sky-500 disabled:text-slate-400 disabled:cursor-not-allowed">
              {t('auth.resend')} {countdown > 0 && `(${countdown})`}
            </button>
          </div>
        </div>
    );
  };


  const AuthContainer = () => (
     <>
        <div>
            <div className="flex justify-center">
                <Link to="/" className="flex items-center text-slate-900 font-bold text-2xl">
                    <Gem className="text-sky-600 h-8 w-8 mr-2" />
                    <span>GEMBank</span>
                </Link>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                {isLogin ? t('auth.signInToAccount') : t('auth.createYourAccount')}
            </h2>
        </div>
        <div className="mt-8">
            <div className="flex justify-center border-b border-slate-200">
                <button onClick={() => { setIsLogin(true); setStep(1); }} className={`px-8 py-3 font-medium text-sm ${isLogin ? 'border-b-2 border-sky-600 text-sky-600' : 'text-slate-500'}`}>{t('auth.signIn')}</button>
                <button onClick={() => { setIsLogin(false); setStep(1); }} className={`px-8 py-3 font-medium text-sm ${!isLogin ? 'border-b-2 border-sky-600 text-sky-600' : 'text-slate-500'}`}>{t('auth.signUp')}</button>
            </div>
            <div className="mt-8">
                {isLogin ? <LoginForm /> : <SignupForm />}
                
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-slate-500">{t('auth.continueWith')}</span>
                        </div>
                    </div>
                    <div className="mt-6 space-y-3">
                        <div>
                            <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-600 hover:bg-slate-50">
                                <GoogleIcon />
                                Google
                            </a>
                        </div>
                        <div>
                            <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-600 hover:bg-slate-50">
                                <AppleIcon />
                                Apple
                            </a>
                        </div>
                        <div>
                            <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-600 hover:bg-slate-50">
                                <MicrosoftIcon />
                                Microsoft
                            </a>
                        </div>
                        <div>
                            <button onClick={() => { setAuthMode('otp_phone'); setIsLogin(true); }} className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-600 hover:bg-slate-50">
                                <Phone className="w-5 h-5 mr-2" />
                                {t('auth.phoneOtp')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     </>
  );

  return (
    <>
      <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 fade-in">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-slate-200">
            {step === 1 && authMode === 'email' && <AuthContainer />}
            {step === 2 && !isLogin && authMode === 'email' && <BusinessProfileForm />}
            {authMode === 'otp_phone' && <OtpPhoneForm />}
            {authMode === 'otp_verify' && <OtpVerifyForm />}
          </div>
        </div>
      </div>
      <PasswordResetModal
        isOpen={isPasswordResetOpen}
        onClose={() => setIsPasswordResetOpen(false)}
        onSubmit={handlePasswordResetRequest}
      />
    </>
  );
};

export default AuthPage;