import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
                 title = 'Строительная компания Алматы | Строительство домов и продажа квартир',
                 description = 'Профессиональное строительство домов под ключ, продажа квартир в новостройках Алматы. Более 10 лет опыта. Гарантия качества.',
                 keywords = 'строительство домов Алматы, продажа квартир Алматы, строительная компания, новостройки Алматы',
                 image = '/og-image.jpg',
                 url = 'https://almaty-build.kz',
                 author = 'Строительная компания Алматы'
             }) => {
    const siteUrl = 'https://almaty-build.kz';
    const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
    const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author} />
            <meta name="robots" content="index, follow" />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content="ru_RU" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />

            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />

            {/* Schema.org markup for local business */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    "name": "Almaty Build",
                    "description": description,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Алматы",
                        "addressCountry": "KZ"
                    },
                    "telephone": "+77771234567",
                    "priceRange": "$$",
                    "openingHours": "Mo-Fr 09:00-18:00"
                })}
            </script>
        </Helmet>
    );
};

export default SEO;