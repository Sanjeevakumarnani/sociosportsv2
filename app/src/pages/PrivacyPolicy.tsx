import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, ArrowLeft } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PrivacyPolicy = () => {
  const [cmsData, setCmsData] = useState<{ title?: string; content?: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch CMS data
    const fetchContent = async () => {
      try {
        const data = await api.cms.get('privacy-policy');
        if (data && data.content) {
          try {
            setCmsData(JSON.parse(data.content));
          } catch {
            setCmsData({ content: data.content });
          }
        }
      } catch (error) {
        console.error('Failed to load privacy policy', error);
      }
    };
    fetchContent();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pp-content > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.pp-content',
            start: 'top 80%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border)]">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-orange)] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </a>
          <h1 className="text-4xl md:text-5xl font-black" style={{ color: 'var(--text-primary)' }}>
            Privacy Policy
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Last updated: November 11, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-12 max-w-4xl mx-auto">
        <div className="pp-content space-y-8">
          {cmsData && cmsData.content && cmsData.content.length > 50 ? (
            <div className="prose prose-invert max-w-none">
              {cmsData.title && <h1 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">{cmsData.title}</h1>}
              <div className="whitespace-pre-wrap text-[var(--text-secondary)] leading-relaxed" dangerouslySetInnerHTML={{ __html: cmsData.content || '' }} />
            </div>
          ) : (
            <>
              {/* Introduction */}
              <section>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  This Privacy Policy outlines the practices and principles regarding the collection, use, and
                  disclosure of your information when you use our service. It aims to inform you about your
                  privacy rights and the legal protections afforded to you. We are committed to safeguarding
                  your privacy and ensuring the security of your information in accordance with applicable
                  laws and regulations.
                </p>
                <p className="mt-4" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  By using our service, you acknowledge and consent to the collection, use, and disclosure
                  of your information as described in this Privacy Policy. We encourage you to read this
                  policy carefully and contact us if you have any questions or concerns.
                </p>
              </section>

              {/* Interpretation and Definitions */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Interpretation and Definitions
                </h2>

                <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Interpretation
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  The words of which the initial letter is capitalized have meanings defined under the
                  following conditions. The following definitions shall have the same meaning regardless
                  of whether they appear in singular or plural.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--text-primary)' }}>
                  Definitions
                </h3>
                <ul className="space-y-4">
                  {[
                    { term: 'Account', def: 'A unique account created for You to access our Service or parts of our Service.' },
                    { term: 'Application', def: 'Refers to SocioSports, the software program provided by the Company.' },
                    { term: 'Company', def: 'Refers to SocioSports, a product of ViranAI Solutions Private Limited, HYDERABAD.' },
                    { term: 'Country', def: 'Refers to Telangana, India.' },
                    { term: 'Device', def: 'Any device that can access the Service such as a computer, a cellphone, or a digital tablet.' },
                    { term: 'Personal Data', def: 'Any information that relates to an identified or identifiable individual.' },
                    { term: 'Service', def: 'Refers to the Application.' },
                    { term: 'Service Provider', def: 'Any natural or legal person who processes the data on behalf of the Company.' },
                    { term: 'Usage Data', def: 'Data collected automatically, either generated by the use of the Service or from the Service infrastructure itself.' },
                    { term: 'You', def: 'Individuals, corporate clients, institutions, communities, trainers, or stall owners accessing or using the Service.' },
                  ].map((item, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="font-semibold min-w-[120px]" style={{ color: 'var(--accent-orange)' }}>
                        {item.term}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>{item.def}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Collecting and Using Your Personal Data */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Collecting and Using Your Personal Data
                </h2>

                <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Types of Data Collected
                </h3>

                <h4 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Personal Data
                </h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  While using Our Service, We may ask You to provide Us with certain personally identifiable
                  information that can be used to contact or identify You. Personally identifiable information
                  may include, but is not limited to:
                </p>
                <ul className="list-disc list-inside mt-3 space-y-2" style={{ color: 'var(--text-secondary)' }}>
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                  <li>Address, State, Province, ZIP/Postal code, City</li>
                  <li>Usage Data</li>
                </ul>

                <h4 className="text-lg font-medium mb-2 mt-6" style={{ color: 'var(--text-primary)' }}>
                  Usage Data
                </h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  Usage Data is collected automatically when using the Service. It may include information
                  such as Your Device&apos;s Internet Protocol address (e.g. IP address), browser type, browser
                  version, the pages of our Service that You visit, the time and date of Your visit, the
                  time spent on those pages, unique device identifiers and other diagnostic data.
                </p>
              </section>

              {/* Use of Your Personal Data */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Use of Your Personal Data
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  The Company may use Personal Data for the following purposes:
                </p>
                <ul className="list-disc list-inside mt-3 space-y-2" style={{ color: 'var(--text-secondary)' }}>
                  <li>To provide and maintain our Service</li>
                  <li>To manage Your Account</li>
                  <li>For the performance of a contract</li>
                  <li>To contact You</li>
                  <li>To provide You with news, special offers and general information</li>
                  <li>To manage Your requests</li>
                  <li>For business transfers</li>
                  <li>For other purposes such as data analysis, identifying usage trends, and improving our Service</li>
                </ul>
              </section>

              {/* Disclosure of Your Personal Data */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Disclosure of Your Personal Data
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  The Company may disclose Your Personal Data in the good faith belief that such action
                  is necessary to:
                </p>
                <ul className="list-disc list-inside mt-3 space-y-2" style={{ color: 'var(--text-secondary)' }}>
                  <li>Comply with a legal obligation</li>
                  <li>Protect and defend the rights or property of the Company</li>
                  <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
                  <li>Protect the personal safety of Users of the Service or the public</li>
                  <li>Protect against legal liability</li>
                </ul>
              </section>

              {/* Security of Your Personal Data */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Security of Your Personal Data
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  The security of Your Personal Data is important to Us, but remember that no method of
                  transmission over the Internet, or method of electronic storage is 100% secure. While
                  We strive to use commercially acceptable means to protect Your Personal Data, We cannot
                  guarantee its absolute security.
                </p>
              </section>

              {/* Children's Privacy */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Children&apos;s Privacy
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  Our Service does not address anyone under the age of 13. We do not knowingly collect
                  personally identifiable information from anyone under the age of 13. If You are a parent
                  or guardian and You are aware that Your child has provided Us with Personal Data, please
                  contact Us.
                </p>
              </section>

              {/* Verification Disclaimer */}
              <section className="p-6 border-l-4 border-yellow-500 bg-yellow-500/10 rounded-r-2xl">
                <h2 className="text-xl font-bold mb-3 text-yellow-500 uppercase tracking-tight">Verification Disclaimer</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  The "Verified" status on SocioSports profiles and events indicates that the identity or details provided have undergone a primary validation check by our team. However, SocioSports does not guarantee the absolute accuracy of user-generated content or the performance levels of athletes. Users are advised to perform their own due diligence before entering into formal contracts or agreements.
                </p>
              </section>

              {/* Changes to this Privacy Policy */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Changes to this Privacy Policy
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  We may update Our Privacy Policy from time to time. We will notify You of any changes by
                  posting the new Privacy Policy on this page. You are advised to review this Privacy Policy
                  periodically for any changes.
                </p>
              </section>

              {/* Contact Us */}
              <section className="bg-[var(--bg-secondary)] rounded-2xl p-6 md:p-8 border border-[var(--border)]">
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Contact Us
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  If you have any questions about this Privacy Policy, You can contact us:
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <Mail className="w-5 h-5" style={{ color: 'var(--accent-orange)' }} />
                  <a
                    href="mailto:info@sociosports.com"
                    className="hover:underline"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    info@sociosports.com
                  </a>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
