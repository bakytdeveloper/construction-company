import React, {useEffect} from 'react';
import SEO from '../../components/SEO/SEO';
import ContactForm from '../../components/ContactForm/ContactForm';
import './ContactPage.css';
import {useLocation} from "react-router-dom";

const ContactPage = () => {
    const location = useLocation();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        scrollToTop();
    }, [location.search]);


    return (
        <>
            <SEO
                title="Контакты - Строительная компания Алматы"
                description="Свяжитесь со строительной компанией в Алматы. Телефоны, адрес, схема проезда. Бесплатная консультация."
                url="/contact"
            />

            <div className="contact-page">
                <section className="contact-hero">
                    <div className="contact-hero-bg"></div>
                    <div className="container">
                        <h1 data-aos="fade-up">Контакты</h1>
                        <p data-aos="fade-up" data-aos-delay="100">
                            Свяжитесь с нами любым удобным способом
                        </p>
                    </div>
                </section>

                <ContactForm />

                <section className="map-section">
                    <div className="container">
                        <div className="map-container" data-aos="fade-up">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2905.836589377112!2d76.928648!3d43.256818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38836e2b8b5e2e1b%3A0x8b5e2e1b2b5e2e1b!2z0JDQu9C80LDRgtGL!5e0!3m2!1sru!2skz!4v1700000000000!5m2!1sru!2skz"
                                width="100%"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Карта офиса"
                            ></iframe>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ContactPage;