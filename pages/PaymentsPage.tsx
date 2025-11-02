
import React, { useState, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, Mail, User, Loader2, CheckCircle2, XCircle, Printer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Invoice } from '../types';

// @ts-ignore
const { jsPDF } = window.jspdf;
// @ts-ignore
const html2canvas = window.html2canvas;

// Use a public test key from Stripe's documentation.
const stripePromise = loadStripe('pk_test_51BTUDGJAJfZb9HEBwDgAbc5TVC7IFgVpB9RxP2aJdI1YdNrhCZVw9q3tv4e3Mv6w1gqW2j2ECmbusfRH7hR6XyYp00OXy32qR0');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#1e293b', // slate-800
      fontFamily: 'Inter, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#94a3b8', // slate-400
      },
    },
    invalid: {
      iconColor: '#EF4444',
      color: '#EF4444',
    },
  },
};

type PaymentStatus = 'idle' | 'processing' | 'succeeded' | 'failed';

const InvoiceView = ({ invoice, onClose }: { invoice: Invoice; onClose: () => void; }) => {
    const { t } = useLanguage();
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = () => {
        const input = invoiceRef.current;
        if (input) {
            html2canvas(input, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const imgProps= pdf.getImageProperties(imgData);
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`GEMBank_Invoice_${invoice.id}.pdf`);
                alert(t('payments.invoiceGeneratedSuccess'));
            }).catch(err => {
                console.error("Error generating PDF:", err);
                alert(t('payments.invoiceGeneratedError'));
            });
        }
    };

    return (
        <div className="fade-in">
            <div ref={invoiceRef} className="bg-white p-8 rounded-lg border border-slate-200 text-slate-800">
                <div className="flex justify-between items-center border-b pb-4 border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-900">{t('payments.invoiceTitle')}</h3>
                    <span className="text-sm text-slate-500">#{invoice.id}</span>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-6">
                    <div>
                        <p className="text-sm text-slate-500">{t('payments.invoiceFor')}</p>
                        <p className="font-semibold">{invoice.customerName}</p>
                        <p>{invoice.customerEmail}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500">{t('payments.invoiceDate')}</p>
                        <p className="font-semibold">{new Date(invoice.date).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="mt-8">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="p-2 rounded-l-md font-normal">Description</th>
                                <th className="p-2 text-right rounded-r-md font-normal">{t('payments.amount')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-200">
                                <td className="py-4">GEMBank Pilot Program - Setup Fee</td>
                                <td className="py-4 text-right">₹{invoice.amount.toFixed(2)}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="font-bold">
                                <td className="py-4 text-right">Total</td>
                                <td className="py-4 text-right">₹{invoice.amount.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="mt-6 border-t pt-4 border-slate-200">
                    <p className="text-sm text-slate-500">{t('payments.paymentMethod')}:</p>
                    <p className="text-sm">Card (ID: {invoice.paymentMethodId})</p>
                </div>
            </div>
            <div className="mt-6 flex justify-between">
                <button
                    onClick={onClose}
                    className="inline-flex justify-center items-center py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                >
                    {t('payments.close')}
                </button>
                <button
                    onClick={handleDownloadPdf}
                    className="inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700"
                >
                    <Printer className="mr-2 h-4 w-4" />
                    {t('payments.downloadInvoice')}
                </button>
            </div>
        </div>
    );
};

const PaymentSuccessView = ({ paymentMethodId, onShowInvoice }: { paymentMethodId: string; onShowInvoice: () => void; }) => {
    const { t } = useLanguage();
    return (
        <div className="text-center p-8 bg-green-50 rounded-lg">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4 animate-pop-in" />
            <h3 className="text-2xl font-bold text-green-600 opacity-0 fade-in" style={{ animationDelay: '0.2s' }}>
                {t('payments.paymentSuccessTitle')}
            </h3>
            <p className="mt-2 text-slate-700 opacity-0 fade-in" style={{ animationDelay: '0.4s' }}>
                {t('payments.paymentSuccessMessage').replace('{paymentMethodId}', paymentMethodId || 'N/A')}
            </p>
            <button
                onClick={onShowInvoice}
                className="mt-6 inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 opacity-0 fade-in"
                style={{ animationDelay: '0.6s' }}
            >
                {t('payments.viewInvoice')}
            </button>
        </div>
    );
};

const PaymentFailedView = ({ error, onTryAgain }: { error: string | null; onTryAgain: () => void; }) => {
    const { t } = useLanguage();
    return (
        <div className="text-center p-8 bg-red-50 rounded-lg fade-in">
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-red-600">{t('payments.paymentErrorTitle')}</h3>
            <p className="mt-2 text-slate-700">
                {error}
            </p>
            <button
                onClick={onTryAgain}
                className="mt-6 inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600"
            >
                {t('payments.tryAgain')}
            </button>
        </div>
    );
};


const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [lastInvoice, setLastInvoice] = useState<Invoice | null>(null);
  const [showInvoiceView, setShowInvoiceView] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
  const PAYMENT_AMOUNT = 1000; // Sample amount in INR

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPaymentStatus('processing');
    setError(null);

    if (!stripe || !elements) {
      setError(t('payments.paymentError'));
      setPaymentStatus('failed');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
        setError(t('payments.paymentError'));
        setPaymentStatus('failed');
        return;
    }

    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name,
        email,
      },
    });

    if (paymentMethodError) {
      setError(paymentMethodError.message ?? t('payments.paymentError'));
      setPaymentStatus('failed');
    } else {
      // Simulate backend processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newInvoice: Invoice = {
        id: `INV-${Date.now()}`,
        paymentMethodId: paymentMethod.id,
        amount: PAYMENT_AMOUNT,
        currency: 'INR',
        date: new Date().toISOString(),
        customerName: name,
        customerEmail: email,
      };

      try {
        const existingInvoices: Invoice[] = JSON.parse(localStorage.getItem('gembank_invoices') || '[]');
        existingInvoices.push(newInvoice);
        localStorage.setItem('gembank_invoices', JSON.stringify(existingInvoices));
      } catch (e) {
        console.error("Failed to save invoice to localStorage", e);
      }

      setPaymentMethodId(paymentMethod.id);
      setLastInvoice(newInvoice);
      setPaymentStatus('succeeded');
    }
  };
  
  const handleTryAgain = () => {
    setPaymentStatus('idle');
    setError(null);
    setLastInvoice(null);
    setShowInvoiceView(false);
  };
  
  if (showInvoiceView && lastInvoice) {
      return <InvoiceView invoice={lastInvoice} onClose={() => setShowInvoiceView(false)} />
  }

  if (paymentStatus === 'succeeded' && paymentMethodId) {
      return <PaymentSuccessView paymentMethodId={paymentMethodId} onShowInvoice={() => setShowInvoiceView(true)} />
  }
  
  if (paymentStatus === 'failed') {
      return <PaymentFailedView error={error} onTryAgain={handleTryAgain} />
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-600">{t('payments.cardholderName')}</label>
            <div className="mt-1 relative">
              <User className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-500 h-5 w-5" />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10 block w-full bg-slate-50 rounded-md shadow-sm text-slate-900 border-slate-300 focus:ring-sky-600 focus:border-sky-600"
              />
            </div>
        </div>
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-600">{t('payments.email')}</label>
            <div className="mt-1 relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-500 h-5 w-5" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 block w-full bg-slate-50 rounded-md shadow-sm text-slate-900 border-slate-300 focus:ring-sky-600 focus:border-sky-600"
              />
            </div>
        </div>
      <div>
        <label className="block text-sm font-medium text-slate-600">{t('payments.cardDetails')}</label>
        <div className="mt-1 p-3 bg-slate-50 rounded-md border border-slate-300 shadow-sm focus-within:ring-sky-600 focus-within:border-sky-600 focus-within:ring-1">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>
      <button
        type="submit"
        disabled={paymentStatus === 'processing' || !stripe}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 disabled:bg-slate-400 disabled:cursor-not-allowed"
      >
        {paymentStatus === 'processing' ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t('payments.processing')}
          </>
        ) : (
          <>
            <Lock className="mr-2 h-5 w-5" />
            {t('payments.payNow')}
          </>
        )}
      </button>
    </form>
  );
};


const PaymentsPage: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="bg-stone-50 py-12 sm:py-16 fade-in">
            <div className="container mx-auto px-4 max-w-lg">
                <div className="text-center">
                    <CreditCard className="mx-auto h-12 w-12 text-sky-600"/>
                    <h1 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">{t('payments.title')}</h1>
                    <p className="mt-4 text-lg text-slate-500">
                        {t('payments.description')}
                    </p>
                </div>
                <div className="mt-10 bg-white p-8 rounded-lg border border-slate-200 shadow-xl">
                    <Elements stripe={stripePromise}>
                        <CheckoutForm />
                    </Elements>
                </div>
                <div className="mt-4 text-center text-xs text-slate-500">
                    <p>Powered by Stripe. Your payment information is securely processed and never stored on our servers.</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentsPage;