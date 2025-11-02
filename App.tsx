import React from 'react';
// FIX: Using Routes instead of Switch for react-router-dom v6 compatibility.
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import AuthPage from './pages/AuthPage';
import LOIPage from './pages/LOIPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ToolsPage from './pages/ToolsPage';
import PaymentsPage from './pages/PaymentsPage';
import AboutPage from './pages/AboutPage';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import FeedbackWidget from './components/FeedbackWidget';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ToastProvider>
        <HashRouter>
          <div className="bg-stone-50 text-slate-800 min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/loi" element={<LOIPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </main>
            <Footer />
            <Chatbot />
            <FeedbackWidget />
            <ToastContainer />
          </div>
        </HashRouter>
      </ToastProvider>
    </LanguageProvider>
  );
};

export default App;