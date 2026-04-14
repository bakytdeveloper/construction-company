import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Layout Components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// Pages
import HomePage from './pages/HomePage/HomePage';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage/ProjectDetailPage';
import ContactPage from './pages/ContactPage/ContactPage';
import AboutPage from './pages/AboutPage/AboutPage';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import FAQPage from "./pages/FAQPage/FAQPage";

function App() {
    const location = useLocation();

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }, []);

    // Проверка, является ли текущий маршрут админ-панелью
    const isAdminRoute = location.pathname === '/admin';

    return (
        <>
            <ScrollToTop />
            {!isAdminRoute && <Header />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/admin" element={<AdminPanel />} />
            </Routes>
            {!isAdminRoute && <Footer />}
        </>
    );
}

export default App;