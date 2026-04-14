import React, { useEffect, useState } from 'react';
import SEO from '../../components/SEO/SEO';
import Hero from '../../components/Hero/Hero';
import Services from '../../components/Services/Services';
import ProjectsShowcase from '../../components/ProjectsShowcase/ProjectsShowcase';
import Advantages from '../../components/Advantages/Advantages';
import ContactForm from '../../components/ContactForm/ContactForm';
import Stats from '../../components/Stats/Stats';
import Testimonials from '../../components/Testimonials/Testimonials';
import './HomePage.css';
import FAQ from "../../components/FAQ/FAQ";

const HomePage = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className={`homepage ${isVisible ? 'visible' : ''}`}>
            <SEO
                title="Строительная компания Алматы | Строительство домов и продажа квартир"
                description="Профессиональное строительство домов под ключ, продажа квартир в новостройках Алматы. Более 10 лет опыта. Гарантия качества, современные технологии."
                keywords="строительство домов Алматы, продажа квартир Алматы, строительная компания, новостройки Алматы, строительство коттеджей"
            />

            <Hero />
            <Services />
            <ProjectsShowcase />
            <Advantages />
            <FAQ />
            <Stats />
            <Testimonials />
            <ContactForm />
        </div>
    );
};

export default HomePage;