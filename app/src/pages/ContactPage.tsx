import ContactSection from '../sections/ContactSection';
import SimpleFooter from '../sections/SimpleFooter';
import SEOHead from '../components/SEOHead';

const ContactPage = () => {
    return (
        <main>
            <SEOHead
                title="Contact Us - Book Events, Partner, or Get in Touch | SocioSports"
                description="Have a question? Want to book an event or explore partnerships? Reach out to the SocioSports team. We're here to help bring your sports vision to life."
            />
            <div className="pt-20">
                <ContactSection />
                <SimpleFooter />
            </div>
        </main>
    );
};

export default ContactPage;
