// App.js
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Layout Components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import MobileBottomNav from './components/MobileBottomNav/MobileBottomNav';

// Pages
import HomePage from './pages/HomePage/HomePage';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import PropertyDetailPage from './pages/ProjectDetailPage/PropertyDetailPage';
import ContactPage from './pages/ContactPage/ContactPage';
import AboutPage from './pages/AboutPage/AboutPage';
import FAQPage from './pages/FAQPage/FAQPage';
import AdminPanel from './admin/AdminPanel';
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton";

function App() {
    const location = useLocation();

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }, []);

    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <>
            {!isAdminRoute && <Header />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/property/:id" element={<PropertyDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/admin/*" element={<AdminPanel />} />
            </Routes>

            <ConditionalWhatsAppButton />
            <ConditionalMobileNav />
            {!isAdminRoute && <Footer />}
        </>
    );
}

// Компонент для условного отображения WhatsAppButton
const ConditionalWhatsAppButton = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    if (isAdminRoute) return null;
    return <WhatsAppButton />;
};

// Компонент для условного отображения мобильной навигации
const ConditionalMobileNav = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    if (isAdminRoute) return null;
    return <MobileBottomNav />;
};

export default App;