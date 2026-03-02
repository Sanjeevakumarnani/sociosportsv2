import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, AlertTriangle, Mail, ArrowLeft, Check, UserX, FileWarning, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ChildSafety = () => {
  const [cmsData, setCmsData] = useState<{ title?: string; content?: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch CMS data
    const fetchContent = async () => {
      try {
        const data = await api.cms.get('child-safety');
        if (data && data.content) {
          try {
            setCmsData(JSON.parse(data.content));
          } catch {
            setCmsData({ content: data.content });
          }
        }
      } catch (error) {
        console.error('Failed to load child safety', error);
      }
    };
    fetchContent();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cs-content > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.cs-content',
            start: 'top 80%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const prohibitedItems = [
    'Child sexual abuse or exploitation (CSAE)',
    'Sexual content involving minors',
    'Grooming, solicitation, or inappropriate interactions with children',
    'Sharing of explicit content targeting minors',
    'Any form of child endangerment or harm',
  ];

  const safetyMeasures = [
    {
      icon: UserX,
      title: 'Prohibited Content',
      description: 'Creation, sharing, or promotion of CSAE content is strictly forbidden on our platform.',
    },
    {
      icon: FileWarning,
      title: 'Reporting System',
      description: 'Users can report inappropriate profiles, messages, or content for immediate review.',
    },
    {
      icon: Shield,
      title: 'Immediate Action',
      description: 'We take immediate action including account suspension or permanent removal.',
    },
    {
      icon: Users,
      title: 'Authority Cooperation',
      description: 'We cooperate fully with law enforcement agencies and comply with all applicable laws.',
    },
  ];

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
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black" style={{ color: 'var(--text-primary)' }}>
                Child Safety & CSAE Policy
              </h1>
              <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
                Our commitment to protecting children and minors on our platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-12 max-w-4xl mx-auto">
        <div className="cs-content space-y-12">
          {cmsData && cmsData.content && cmsData.content.length > 50 ? (
            <div className="prose prose-invert max-w-none">
              {cmsData.title && <h1 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">{cmsData.title}</h1>}
              <div className="whitespace-pre-wrap text-[var(--text-secondary)] leading-relaxed" dangerouslySetInnerHTML={{ __html: cmsData.content || '' }} />
            </div>
          ) : (
            <>
              {/* Zero Tolerance Notice */}
              <section className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-red-400">
                      Zero Tolerance Policy
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>SocioSports</strong> has{' '}
                      <strong className="text-red-400">zero tolerance</strong> for any form of child
                      sexual abuse or exploitation. We are committed to providing a safe and respectful
                      platform for all users, especially children and minors.
                    </p>
                  </div>
                </div>
              </section>

              {/* Prohibited Content */}
              <section>
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                  Strictly Prohibited Content
                </h2>
                <p className="mb-4" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  The following content is <strong className="text-red-400">strictly prohibited</strong> on our platform:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {prohibitedItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl"
                    >
                      <UserX className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Safety Measures */}
              <section>
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                  User Safety Measures
                </h2>
                <p className="mb-6" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  To protect users, <strong style={{ color: 'var(--text-primary)' }}>SocioSports</strong> implements the following measures:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {safetyMeasures.map((measure, index) => {
                    const Icon = measure.icon;
                    return (
                      <div
                        key={index}
                        className="p-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl hover:border-[var(--accent-orange)]/30 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[var(--accent-orange)]/20 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6" style={{ color: 'var(--accent-orange)' }} />
                        </div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                          {measure.title}
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                          {measure.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Reporting & Enforcement */}
              <section className="bg-[var(--bg-secondary)] rounded-2xl p-6 md:p-8 border border-[var(--border)]">
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                  Reporting & Enforcement
                </h2>
                <p className="mb-6" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  Any detected or reported CSAE-related activity will result in:
                </p>
                <div className="space-y-4">
                  {[
                    'Immediate content removal',
                    'Account suspension or termination',
                    'Reporting to relevant authorities when required by law',
                    'Permanent ban from the platform',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-red-500" />
                      </div>
                      <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Cooperation with Authorities */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Cooperation with Authorities
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>SocioSports</strong> cooperates fully with{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>law enforcement agencies</strong> and complies
                  with all applicable child safety and online protection laws. We are committed to assisting
                  authorities in any investigations related to child safety violations.
                </p>
              </section>

              {/* Age Requirements */}
              <section className="bg-[var(--bg-secondary)] rounded-2xl p-6 md:p-8 border border-[var(--border)]">
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Age Requirements
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  Our Service is not intended for children under the age of 13. We do not knowingly collect
                  personal information from children under 13. If you are a parent or guardian and believe
                  that your child under 13 has provided personal information to us, please contact us
                  immediately.
                </p>
                <p className="mt-4" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  For users between 13 and 18 years of age, we recommend parental guidance and supervision
                  while using our platform.
                </p>
              </section>

              {/* Parental Guidance */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Parental Guidance
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  We encourage parents and guardians to:
                </p>
                <ul className="list-disc list-inside mt-3 space-y-2" style={{ color: 'var(--text-secondary)' }}>
                  <li>Monitor their children&apos;s online activities</li>
                  <li>Educate children about online safety</li>
                  <li>Report any suspicious behavior immediately</li>
                  <li>Use parental control tools where appropriate</li>
                  <li>Encourage open communication about online experiences</li>
                </ul>
              </section>

              {/* Contact for Reporting */}
              <section className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4 text-red-400">
                  Report Violations
                </h2>
                <p className="mb-6" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  If you find any content that violates this policy, please report it immediately.
                  Your report will be handled with the utmost seriousness and confidentiality.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:it-support@sociobeatsapp.com"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    Report via Email
                  </a>
                  <a
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-red-500/50 text-red-400 rounded-full font-semibold hover:bg-red-500/10 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Return to Home
                  </a>
                </div>
                <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Email: <a href="mailto:it-support@sociobeatsapp.com" className="text-red-400 hover:underline">it-support@sociobeatsapp.com</a>
                </p>
              </section>

              {/* Commitment */}
              <section className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-[var(--accent-orange)]/20 flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10" style={{ color: 'var(--accent-orange)' }} />
                </div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Our Commitment
                </h2>
                <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  SocioSports is dedicated to maintaining a safe environment for all users. We continuously
                  review and improve our safety measures to protect children and minors on our platform.
                  Together, we can create a safer digital space for everyone.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildSafety;
