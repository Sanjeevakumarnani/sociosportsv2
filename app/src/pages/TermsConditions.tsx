import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, ArrowLeft } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TermsConditions = () => {
  const [cmsData, setCmsData] = useState<{ title?: string; content?: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch CMS data
    const fetchContent = async () => {
      try {
        const data = await api.cms.get('terms-conditions');
        if (data && data.content) {
          try {
            setCmsData(JSON.parse(data.content));
          } catch {
            setCmsData({ content: data.content });
          }
        }
      } catch (error) {
        console.error('Failed to load terms conditions', error);
      }
    };
    fetchContent();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tc-content > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.tc-content',
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
            Terms & Conditions
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Last updated: November 17, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-12 max-w-4xl mx-auto">
        <div className="tc-content space-y-8">
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
                  These Terms and Conditions (&quot;Terms&quot;) govern your use of the SocioSports platform,
                  including the website, mobile applications, and any related services (collectively
                  referred to as the &quot;Service&quot;). SocioSports is a brand owned and operated by ViranAI
                  Solutions Private Limited, an Indian company registered under the Companies Act, 2013.
                </p>
                <p className="mt-4" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  By accessing or using the Service, you agree to be bound by these Terms. If you do not
                  agree with any part of these Terms, you should not access or use the Service.
                </p>
              </section>

              {/* Scope and Applicability */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Scope and Applicability
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  These Terms apply to all users, including but not limited to:
                </p>
                <ul className="list-disc list-inside mt-3 space-y-2" style={{ color: 'var(--text-secondary)' }}>
                  <li>Common users and participants</li>
                  <li>Sports trainers and coaches</li>
                  <li>Community and residential owners or managers</li>
                  <li>Educational institutions and corporates</li>
                  <li>Event planners and organizers</li>
                  <li>Businesses, brands, or sponsors booking stalls or event spaces</li>
                </ul>
                <p className="mt-4" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  All users agree to comply with these Terms and any other policy or agreement communicated
                  by SocioSports.
                </p>
              </section>

              {/* Nature of Services */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Nature of Services
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  SocioSports is a <strong>social engagement and activity platform</strong> that promotes
                  <strong> sports, games, and wellness-driven events</strong>.
                </p>
                <p className="mt-4" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  Our services include:
                </p>
                <ul className="list-disc list-inside mt-3 space-y-2" style={{ color: 'var(--text-secondary)' }}>
                  <li>Conducting events and activities at residential communities, corporates, and institutions.</li>
                  <li>Providing and transporting games and sports equipment (e.g., tug-of-war ropes, tyres, balls, archery sets, darts, cones, nets, etc.) in vehicles such as vans or buses to event locations.</li>
                  <li>Engaging qualified trainers and event coordinators to conduct activities.</li>
                </ul>
                <p className="mt-4" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  While SocioSports arranges most of the required equipment, the <strong>client (event host)</strong> may
                  be requested to arrange certain local items like chairs, tables, tents, sound systems, or
                  additional sports sets as necessary.
                </p>
              </section>

              {/* Account Registration */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Account Registration
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  You must create an account to use certain features of the Service. The information you
                  provide during registration must be accurate and complete. You are responsible for
                  maintaining the confidentiality of your account credentials and for all activities that
                  occur under your account.
                </p>
                <p className="mt-4" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  You agree to notify us immediately of any unauthorized use of your account or any other
                  breach of security. SocioSports will not be liable for any loss or damage arising from
                  your failure to comply with these security obligations.
                </p>
              </section>

              {/* User Responsibilities */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  User Responsibilities
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  By using our Service, you agree to:
                </p>
                <ul className="list-disc list-inside mt-3 space-y-2" style={{ color: 'var(--text-secondary)' }}>
                  <li>Use the Service only for lawful purposes</li>
                  <li>Not engage in any activity that disrupts or interferes with the Service</li>
                  <li>Not attempt to gain unauthorized access to any part of the Service</li>
                  <li>Not use the Service to transmit any harmful code or malware</li>
                  <li>Respect the rights and privacy of other users</li>
                  <li>Follow all safety guidelines during events and activities</li>
                  <li>Provide accurate information when booking events or registering for activities</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Intellectual Property
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  The Service and its original content, features, and functionality are and will remain
                  the exclusive property of SocioSports and its licensors. The Service is protected by
                  copyright, trademark, and other laws of India and foreign countries.
                </p>
                <p className="mt-4" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  Our trademarks and trade dress may not be used in connection with any product or service
                  without the prior written consent of SocioSports.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Limitation of Liability
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  To the maximum extent permitted by applicable law, SocioSports shall not be liable for
                  any indirect, incidental, special, consequential, or punitive damages, including without
                  limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting
                  from:
                </p>
                <ul className="list-disc list-inside mt-3 space-y-2" style={{ color: 'var(--text-secondary)' }}>
                  <li>Your access to or use of or inability to access or use the Service</li>
                  <li>Any conduct or content of any third party on the Service</li>
                  <li>Any content obtained from the Service</li>
                  <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                </ul>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Termination
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  We may terminate or suspend your account immediately, without prior notice or liability,
                  for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p className="mt-4" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  Upon termination, your right to use the Service will immediately cease. If you wish to
                  terminate your account, you may simply discontinue using the Service or contact us to
                  request account deletion.
                </p>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Governing Law
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  These Terms shall be governed and construed in accordance with the laws of India,
                  without regard to its conflict of law provisions. Any dispute arising under these Terms
                  shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.
                </p>
              </section>

              {/* Verification Disclaimer */}
              <section className="p-6 border-l-4 border-yellow-500 bg-yellow-500/10 rounded-r-2xl">
                <h2 className="text-xl font-bold mb-3 text-yellow-500 uppercase tracking-tight">Verification & Identity Disclaimer</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  SocioSports provides a platform for verified digital identity. "Verified" status is granted based on documentation provided at the time of registration. SocioSports is not responsible for any subsequent changes in status or conduct of individuals or institutions. All bookings and interactions are subject to mutual agreement between the parties involved.
                </p>
              </section>

              {/* Changes to Terms */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Changes to Terms
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any
                  time. If a revision is material, we will try to provide at least 30 days&apos; notice prior
                  to any new terms taking effect.
                </p>
                <p className="mt-4" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  By continuing to access or use our Service after those revisions become effective, you
                  agree to be bound by the revised terms.
                </p>
              </section>

              {/* Contact Information */}
              <section className="bg-[var(--bg-secondary)] rounded-2xl p-6 md:p-8 border border-[var(--border)]">
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Contact Information
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  If you have any questions about these Terms, please contact us:
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

export default TermsConditions;
