import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

const SEOHead = ({
    title = 'SocioSports - India\'s Sports Ecosystem',
    description = 'Join India\'s premier sports ecosystem connecting athletes, coaches, and vendors. Book stalls, find tournaments, and elevate your game.',
    image = '/images/logo.png',
    url = 'https://sociosports.in',
    type = 'website'
}: SEOHeadProps) => {
    const siteTitle = title.includes('SocioSports') ? title : `${title} | SocioSports`;
    const fullUrl = url.startsWith('http') ? url : `https://sociosports.in${url}`;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={siteTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEOHead;
