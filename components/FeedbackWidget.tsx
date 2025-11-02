
import React, { useState, useRef, useEffect } from 'react';
import { Star, X, Send, Loader2, ThumbsUp, Smile, Meh, Frown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type FeedbackRating = 'Positive' | 'Neutral' | 'Negative' | null;

const FeedbackWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState<FeedbackRating>(null);
    const [comment, setComment] = useState('');
    const [canContact, setCanContact] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const widgetRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [widgetRef]);
    
    // Reset state on close
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setRating(null);
                setComment('');
                setCanContact(false);
                setIsSubmitted(false);
                setIsSubmitting(false);
            }, 300); // after animation
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating || isSubmitting) return;
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log({ rating, comment, canContact });
        setIsSubmitting(false);
        setIsSubmitted(true);
    };
    
    const getPlaceholderText = () => {
        switch (rating) {
            case 'Positive':
                return t('feedback.positivePlaceholder');
            case 'Neutral':
                return t('feedback.neutralPlaceholder');
            case 'Negative':
                return t('feedback.negativePlaceholder');
            default:
                return 'Tell us more...';
        }
    };

    const ratingOptions = [
        { type: 'Positive' as FeedbackRating, icon: <Smile className="h-8 w-8 text-green-500" />, label: t('feedback.positive') },
        { type: 'Neutral' as FeedbackRating, icon: <Meh className="h-8 w-8 text-yellow-500" />, label: t('feedback.neutral') },
        { type: 'Negative' as FeedbackRating, icon: <Frown className="h-8 w-8 text-red-500" />, label: t('feedback.negative') },
    ];
    
    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 bg-sky-600 text-white p-4 rounded-full shadow-lg hover:bg-sky-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 z-20"
                aria-label={t('feedback.open')}
            >
                <Star size={24} />
            </button>

            {isOpen && (
                <div ref={widgetRef} className="fixed bottom-24 left-6 w-full max-w-sm flex flex-col bg-white rounded-lg shadow-2xl border border-slate-200 z-20 fade-in-late">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-200">
                        <h3 className="font-bold text-lg text-slate-900">{t('feedback.title')}</h3>
                        <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-900">
                            <X size={20} />
                        </button>
                    </div>

                    {isSubmitted ? (
                        <div className="p-8 text-center">
                            <ThumbsUp className="h-12 w-12 mx-auto text-green-500 mb-4" />
                            <h4 className="text-xl font-bold text-slate-900">{t('feedback.thankYou')}</h4>
                             <p className="text-slate-600 mt-2">
                                {rating === 'Positive'
                                    ? t('feedback.positiveResponse')
                                    : t('feedback.otherResponse')}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <p className="text-sm font-medium text-slate-700 text-center mb-3">{t('feedback.experience')}</p>
                                <div className="flex justify-center gap-4">
                                    {ratingOptions.map(option => (
                                        <button
                                            key={option.type}
                                            type="button"
                                            onClick={() => setRating(option.type)}
                                            className={`p-3 rounded-full transition-all duration-200 ${rating === option.type ? 'bg-sky-100 ring-2 ring-sky-500 scale-110' : 'bg-slate-100 hover:bg-slate-200'}`}
                                            aria-label={option.label}
                                        >
                                            {option.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {rating && (
                                <div className="fade-in space-y-4">
                                    <div>
                                        <label htmlFor="comment" className="sr-only">Your comment</label>
                                        <textarea
                                            id="comment"
                                            rows={4}
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder={getPlaceholderText()}
                                            className="w-full p-2 bg-slate-100 text-slate-900 rounded-md border border-slate-300 focus:ring-2 focus:ring-sky-600 focus:border-sky-600 outline-none"
                                        />
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="canContact"
                                                name="canContact"
                                                type="checkbox"
                                                checked={canContact}
                                                onChange={(e) => setCanContact(e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 bg-slate-100 text-sky-600 focus:ring-sky-700"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="canContact" className="text-slate-500">
                                                {t('feedback.canContact')}
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 disabled:bg-slate-400 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 mr-2" />}
                                            {isSubmitting ? t('feedback.sending') : t('feedback.send')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            )}
        </>
    );
};

export default FeedbackWidget;