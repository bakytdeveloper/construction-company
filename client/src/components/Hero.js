import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeroSection = styled.section`
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(44,62,80,0.9), rgba(52,152,219,0.8)),
              url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3')
              center/cover no-repeat;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  text-align: center;
  color: white;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  z-index: 2;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 20px;
  font-weight: bold;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  margin-bottom: 30px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: 15px 40px;
  background: var(--secondary-color);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: bold;
  transition: all 0.3s ease;
  margin: 10px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    background: #d35400;
  }
`;

const Hero = () => {
    return (
        <HeroSection>
            <HeroContent>
                <HeroTitle
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Строим дом вашей мечты в Алматы
                </HeroTitle>
                <HeroSubtitle
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    Профессиональное строительство домов, продажа квартир в новостройках,
                    отделочные работы под ключ. Гарантия качества и индивидуальный подход.
                </HeroSubtitle>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <CTAButton to="/contact">Получить консультацию</CTAButton>
                    <CTAButton to="/projects" style={{ background: 'transparent', border: '2px solid white' }}>
                        Наши проекты
                    </CTAButton>
                </motion.div>
            </HeroContent>
        </HeroSection>
    );
};

export default Hero;