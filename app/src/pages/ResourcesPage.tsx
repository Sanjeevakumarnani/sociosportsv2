import KnowledgeHub from '../sections/KnowledgeHub';
import EventCertificatesSection from '../sections/EventCertificatesSection';
import CertificatesSection from '../sections/CertificatesSection';
import SimpleFooter from '../sections/SimpleFooter';
import SEOHead from '../components/SEOHead';

const BlogPage = () => {
    return (
        <main>
            <SEOHead
                title="Sports Knowledge Hub - Training, Stories & Expert Insights | SocioSports"
                description="Explore expert sports articles, athlete success stories, training guides, nutrition tips, and mental health resources. Your complete knowledge hub for sports excellence in India."
            />
            <div className="pt-20">
                <KnowledgeHub />
                <EventCertificatesSection />
                <CertificatesSection />
                <SimpleFooter />
            </div>
        </main>
    );
};

export default BlogPage;
