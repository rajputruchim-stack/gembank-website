import React, { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import type { LOIFormData } from '../types';
import { Loader2, Sparkles, Bot, User, Send } from 'lucide-react';
import { GoogleGenAI, Chat, FunctionDeclaration, Type, GenerateContentResponse } from '@google/genai';
import { useLanguage } from '../contexts/LanguageContext';

// @ts-ignore
const { jsPDF } = window.jspdf;
// @ts-ignore
const html2canvas = window.html2canvas;

const LOIPdfTemplate = React.forwardRef<HTMLDivElement, { data: LOIFormData, loiId: string }>(({ data, loiId }, ref) => {
    return (
        <div ref={ref} className="p-10 bg-white text-black font-serif" style={{ width: '210mm', minHeight: '297mm' }}>
            <h1 className="text-3xl font-bold border-b-2 border-black pb-2">Letter of Intent (Expression of Interest)</h1>
            <div className="text-sm mt-4 text-gray-600">
                <p>Date: {new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</p>
                <p>LOI ID: {loiId}</p>
            </div>

            <div className="mt-8 text-base leading-relaxed">
                <p>I, <strong>{data.contactName}</strong>, in my capacity as <strong>{data.designation}</strong> at <strong>{data.companyName}</strong>, hereby express our interest in evaluating GEMBank’s financial platform and participating in early access or a pilot program.</p>
                <p className="mt-4">We understand that this is an expression of interest and is non-binding. We authorize GEMBank to include anonymised versions of our data in investor materials and to contact us regarding pilot offers.</p>
            </div>
            
            <div className="mt-12">
                <p><strong>Signed (typed):</strong> {data.contactName}</p>
                <p><strong>Email:</strong> {data.email}</p>
                <p><strong>Phone:</strong> {data.phone}</p>
            </div>
            
            <div className="mt-10 pt-4 border-t border-gray-300 text-xs text-gray-500">
                <p>This Letter of Intent is non-binding and for the exclusive purpose of demonstrating market interest to prospective investors. For any binding commitment, a separate agreement will be executed.</p>
            </div>
        </div>
    );
});

const updateFormField: FunctionDeclaration = {
    name: 'updateFormField',
    parameters: {
        type: Type.OBJECT,
        description: 'Updates a field in the Letter of Intent form.',
        properties: {
            fieldName: {
                type: Type.STRING,
                description: 'The name of the form field to update. Must be one of: "companyName", "businessType", "city", "gstin", "contactName", "designation", "email", "phone", "turnover", "interestLevel".',
            },
            value: {
                type: Type.STRING,
                description: 'The value to set for the form field.',
            },
        },
        required: ['fieldName', 'value'],
    },
};

const LOIPage: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<LOIFormData>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionData, setSubmissionData] = useState<LOIFormData | null>(null);
    const pdfRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    // AI Assistant State
    const [useAIAssistant, setUseAIAssistant] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
    const [isAILoading, setIsAILoading] = useState(false);
    const [aiInput, setAiInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);
    
    const initializeChat = async () => {
        setIsAILoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const chatSession = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: t('loi.aiSystemInstruction'),
                    tools: [{ functionDeclarations: [updateFormField] }],
                },
            });
            setChat(chatSession);
            setMessages([{ role: 'model', text: t('loi.aiGreeting') }]);
        } catch (error) {
            console.error("Failed to initialize AI chat:", error);
            setMessages([{ role: 'model', text: t('loi.aiUnavailable') }]);
        } finally {
            setIsAILoading(false);
        }
    };
    
    const handleToggleAIAssistant = () => {
        const nextState = !useAIAssistant;
        setUseAIAssistant(nextState);
        if (nextState && !chat) {
            initializeChat();
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiInput.trim() || !chat || isAILoading) return;

        const userMessage = { role: 'user' as const, text: aiInput };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = aiInput;
        setAiInput('');
        setIsAILoading(true);

        try {
            let response: GenerateContentResponse = await chat.sendMessage({ message: currentInput });
            
            while (response.functionCalls && response.functionCalls.length > 0) {
                const functionResponseParts = [];

                for (const fc of response.functionCalls) {
                    if (fc.name === 'updateFormField') {
                        const { fieldName, value } = fc.args;
                        // Fix: Cast `value` to string, as it's typed as `unknown` from the API response but `setValue` expects a specific type.
                        setValue(fieldName as keyof LOIFormData, value as string, { shouldValidate: true, shouldDirty: true });
                        functionResponseParts.push({
                            functionResponse: {
                                name: fc.name,
                                response: { result: `Successfully updated ${fieldName} to ${value}` },
                            }
                        });
                    }
                }

                // Fix: `sendToolResponse` does not exist on the Chat object.
                // The correct method is `sendMessage` with an array of `FunctionResponsePart`.
                // FIX: Corrected `parts` to `message` to match the SendMessageParameters type.
                response = await chat.sendMessage({
                    message: functionResponseParts
                });
            }
            
            const modelMessage = { role: 'model' as const, text: response.text };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error("Gemini Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: t('loi.aiError') }]);
        } finally {
            setIsAILoading(false);
        }
    };


    const generatePdf = (formData: LOIFormData) => {
        const loiId = `GEM-${Date.now()}`;
        setSubmissionData(formData);
        setIsSubmitting(true);
        
        setTimeout(() => {
            const input = pdfRef.current;
            if (input) {
                html2canvas(input).then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    const imgWidth = canvas.width;
                    const imgHeight = canvas.height;
                    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                    const imgX = (pdfWidth - imgWidth * ratio) / 2;
                    const imgY = 0;
                    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
                    pdf.save(`GEMBank_LOI_${formData.companyName.replace(/\s/g, '_')}.pdf`);
                    setIsSubmitting(false);
                    alert(t('loi.pdfSuccess'));
                });
            } else {
                setIsSubmitting(false);
                alert(t('loi.pdfError'));
            }
        }, 1000); // Allow time for the template to render with data
    };
    
    const onSubmit: SubmitHandler<LOIFormData> = (data) => {
        generatePdf(data);
    };

    const inputClasses = "mt-1 block w-full bg-slate-50 border-slate-300 rounded-md shadow-sm text-slate-900 focus:ring-sky-600 focus:border-sky-600";
    const labelClasses = "block text-sm font-medium text-slate-600";

    return (
        <div className="bg-stone-50 py-12 sm:py-16 fade-in">
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                {submissionData && <LOIPdfTemplate data={submissionData} loiId={`GEM-${Date.now()}`} ref={pdfRef} />}
            </div>
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{t('loi.title')}</h1>
                    <p className="mt-4 text-lg text-slate-500 max-w-3xl mx-auto">
                        {t('loi.description')}
                    </p>
                </div>
                 <div className="flex justify-center my-8">
                    <label htmlFor="ai-toggle" className="flex items-center cursor-pointer">
                        <span className="mr-3 text-sm font-medium text-slate-700">{t('loi.fillManually')}</span>
                        <div className="relative">
                            <input type="checkbox" id="ai-toggle" className="sr-only" checked={useAIAssistant} onChange={handleToggleAIAssistant} />
                            <div className="block bg-slate-300 w-14 h-8 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${useAIAssistant ? 'transform translate-x-6 bg-sky-600' : ''}`}></div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-sky-600 flex items-center">
                            <Sparkles className="w-4 h-4 mr-1"/> {t('loi.useAIAssistant')}
                        </span>
                    </label>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
                     <div className={`transition-opacity duration-500 ${!useAIAssistant ? 'lg:col-span-2' : ''}`}>
                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg border border-slate-200 space-y-6">
                            {/* Form sections */}
                            <div>
                                <h2 className="text-xl font-semibold text-sky-600 border-b border-slate-200 pb-2">{t('loi.companyInfo')}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div>
                                        <label htmlFor="companyName" className={labelClasses}>{t('loi.companyName')}</label>
                                        <input type="text" id="companyName" {...register("companyName", { required: true })} className={inputClasses} />
                                        {errors.companyName && <span className="text-red-500 text-xs">This field is required</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="businessType" className={labelClasses}>{t('loi.businessType')}</label>
                                        <select id="businessType" {...register("businessType", { required: true })} className={inputClasses}>
                                            <option>{t('auth.manufacturer')}</option>
                                            <option>{t('auth.retailer')}</option>
                                            <option>{t('auth.wholesaler')}</option>
                                            <option>{t('auth.distributor')}</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="city" className={labelClasses}>{t('loi.cityState')}</label>
                                        <input type="text" id="city" {...register("city", { required: true })} className={inputClasses} />
                                    </div>
                                    <div>
                                        <label htmlFor="gstin" className={labelClasses}>{t('loi.gstin')}</label>
                                        <input type="text" id="gstin" {...register("gstin")} className={inputClasses} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-sky-600 border-b border-slate-200 pb-2">{t('loi.contactPerson')}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <div>
                                        <label htmlFor="contactName" className={labelClasses}>{t('loi.fullName')}</label>
                                        <input type="text" id="contactName" {...register("contactName", { required: true })} className={inputClasses} />
                                        {errors.contactName && <span className="text-red-500 text-xs">This field is required</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="designation" className={labelClasses}>{t('loi.designation')}</label>
                                        <input type="text" id="designation" {...register("designation", { required: true })} className={inputClasses} />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className={labelClasses}>{t('loi.email')}</label>
                                        <input type="email" id="email" {...register("email", { required: true })} className={inputClasses} />
                                        {errors.email && <span className="text-red-500 text-xs">A valid email is required</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className={labelClasses}>{t('loi.phone')}</label>
                                        <input type="tel" id="phone" {...register("phone", { required: true })} className={inputClasses} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-sky-600 border-b border-slate-200 pb-2">{t('loi.businessDetails')}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div>
                                        <label htmlFor="turnover" className={labelClasses}>{t('loi.turnover')}</label>
                                        <select id="turnover" {...register("turnover", { required: true })} className={inputClasses}>
                                            <option>{t('auth.turnover1')}</option>
                                            <option>{t('auth.turnover2')}</option>
                                            <option>{t('auth.turnover3')}</option>
                                            <option>{t('auth.turnover4')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="interestLevel" className={labelClasses}>{t('loi.interestLevel')}</label>
                                        <select id="interestLevel" {...register("interestLevel", { required: true })} className={inputClasses}>
                                            <option value="1">{t('loi.interest1')}</option>
                                            <option value="2">{t('loi.interest2')}</option>
                                            <option value="3">{t('loi.interest3')}</option>
                                            <option value="4">{t('loi.interest4')}</option>
                                            <option value="5">{t('loi.interest5')}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-5">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <input id="authorization" type="checkbox" {...register("authorization", { required: true })} className="h-4 w-4 rounded border-slate-300 bg-slate-100 text-sky-600 focus:ring-sky-700" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="authorization" className="font-medium text-slate-700">{t('loi.authorization')}</label>
                                        {errors.authorization && <p className="text-red-500 text-xs mt-1">{t('loi.authorizationError')}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 disabled:bg-slate-500">
                                    {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t('loi.submitting')}</> : t('loi.submit')}
                                </button>
                            </div>
                        </form>
                    </div>

                    {useAIAssistant && (
                        <div className="lg:mt-0 fade-in">
                            <div className="bg-white rounded-lg border border-slate-200 h-full flex flex-col" style={{minHeight: '70vh'}}>
                                <div className="flex items-center p-4 border-b border-slate-200">
                                    <Bot className="h-6 w-6 text-sky-600 mr-2" />
                                    <h3 className="font-bold text-lg text-slate-900">{t('loi.aiAssistantTitle')}</h3>
                                </div>
                                <div className="flex-grow p-4 overflow-y-auto">
                                    <div className="space-y-4">
                                    {messages.map((msg, index) => (
                                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                            {msg.role === 'model' && (
                                                <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center flex-shrink-0">
                                                <Bot size={20} className="text-white" />
                                                </div>
                                            )}
                                            <div className={`px-4 py-2 rounded-lg max-w-[80%] ${
                                                msg.role === 'model'
                                                ? 'bg-slate-100 text-slate-800'
                                                : 'bg-sky-600 text-white'
                                            }`}>
                                                <p className="text-sm">{msg.text}</p>
                                            </div>
                                            {msg.role === 'user' && (
                                                <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0">
                                                <User size={20} className="text-slate-800" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {isAILoading && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center flex-shrink-0">
                                            <Bot size={20} className="text-white" />
                                            </div>
                                            <div className="px-4 py-2 rounded-lg bg-slate-100 text-slate-800">
                                                <Loader2 className="h-5 w-5 animate-spin"/>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                    </div>
                                </div>
                                 <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200">
                                    <div className="relative">
                                    <input
                                        type="text"
                                        value={aiInput}
                                        onChange={(e) => setAiInput(e.target.value)}
                                        placeholder={t('loi.aiChatPlaceholder')}
                                        className="w-full pl-4 pr-12 py-2 bg-slate-100 text-slate-900 rounded-full border border-slate-300 focus:ring-2 focus:ring-sky-600 focus:border-sky-600 outline-none"
                                        disabled={isAILoading}
                                    />
                                    <button type="submit" disabled={isAILoading || !aiInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-600 text-white rounded-full p-2 hover:bg-sky-700 disabled:bg-slate-500 disabled:cursor-not-allowed">
                                        <Send size={16} />
                                    </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LOIPage;