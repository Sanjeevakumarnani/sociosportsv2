import { useRef, useState, useEffect } from 'react';
import { Download, ShieldCheck, MapPin, Phone, Mail, ChevronLeft, X, Link2, Briefcase, GraduationCap, Star, ScrollText, UserSearch, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';

interface Language {
    name: string;
    level: number; // 0-100
}

interface Reference {
    name: string;
    title: string;
    contact: string;
}

interface SportsProfile {
    id: string;
    sportsId: string;
    name: string;
    role: string;
    sport?: string;
    profession?: string;
    location?: string;
    image?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    height?: string;
    weight?: string;
    bio?: string;
    achievements?: string;
    trainingHistory?: string;
    certifications?: string;
    experience?: string;
    specializations?: string;
    socialLinks?: string;
    skills?: string;
    languages?: string;
    hobbies?: string;
    references?: string;
}

interface AthleteResumeProps {
    profile: SportsProfile;
    onBack: () => void;
    onShowCard: () => void;
    onClose: () => void;
}

const AthleteResume: React.FC<AthleteResumeProps> = ({ profile: initialProfile, onBack, onShowCard, onClose }) => {
    const resumeRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [profile, setProfile] = useState<SportsProfile>(initialProfile);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFullProfile = async () => {
            try {
                const fullProfile = await api.sportsProfiles.getById(initialProfile.sportsId);
                setProfile(fullProfile);
            } catch {
                console.warn('Could not fetch full profile, using search result data');
            } finally {
                setLoading(false);
            }
        };
        fetchFullProfile();
    }, [initialProfile.sportsId]);

    // Parse JSON fields with fallbacks
    const achievements = profile.achievements ? JSON.parse(profile.achievements) : [];
    const trainingHistory = profile.trainingHistory ? JSON.parse(profile.trainingHistory) : [];
    const certifications = profile.certifications ? JSON.parse(profile.certifications) : [];
    const socialLinks = profile.socialLinks ? JSON.parse(profile.socialLinks) : {};
    const skills = profile.skills ? JSON.parse(profile.skills) : [];
    const languages: Language[] = profile.languages ? JSON.parse(profile.languages) : [];
    const hobbies = profile.hobbies ? JSON.parse(profile.hobbies) : [];
    const references: Reference[] = profile.references ? JSON.parse(profile.references) : [];

    const handleExportPDF = async () => {
        setIsExporting(true);
        const toastId = toast.loading('Generating Professional Sports Resume...');

        try {
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = 210;
            const pageHeight = 297;
            const sidebarWidth = 75;

            // --- SIDEBAR BACKGROUND ---
            doc.setFillColor(60, 60, 60); // Dark Gray sidebar
            doc.rect(0, 0, sidebarWidth, pageHeight, 'F');

            // --- PROFILE IMAGE (Circular Placeholder/Position) ---
            doc.setFillColor(80, 80, 80);
            doc.circle(sidebarWidth / 2, 35, 25, 'F');
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(1);
            doc.circle(sidebarWidth / 2, 35, 25, 'D');

            let sidebarY = 80;

            // --- SIDEBAR CONTENT HELPER ---
            const drawSidebarHeader = (text: string) => {
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(255, 255, 255);
                doc.text(text.toUpperCase(), 12, sidebarY);
                doc.setDrawColor(255, 255, 255);
                doc.setLineWidth(0.3);
                doc.line(12, sidebarY + 2, sidebarWidth - 12, sidebarY + 2);
                sidebarY += 10;
            };

            // --- ABOUT ME (SIDEBAR) ---
            if (profile.bio) {
                drawSidebarHeader('ABOUT ME');
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(220, 220, 220);
                const bioLines = doc.splitTextToSize(profile.bio, sidebarWidth - 24);
                doc.text(bioLines, 12, sidebarY);
                sidebarY += (bioLines.length * 4.5) + 12;
            }

            // --- LINKS (SIDEBAR) ---
            const linksArr = [];
            if (socialLinks.linkedin) linksArr.push({ label: 'LinkedIn', val: socialLinks.linkedin });
            if (socialLinks.twitter) linksArr.push({ label: 'Twitter', val: socialLinks.twitter });
            if (socialLinks.instagram) linksArr.push({ label: 'Instagram', val: socialLinks.instagram });

            if (linksArr.length > 0) {
                drawSidebarHeader('LINKS');
                for (const link of linksArr) {
                    doc.setFontSize(8);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(255, 255, 255);
                    doc.text(`${link.label}:`, 12, sidebarY);
                    sidebarY += 4;
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(200, 200, 200);
                    const linkLines = doc.splitTextToSize(link.val, sidebarWidth - 24);
                    doc.text(linkLines, 12, sidebarY);
                    sidebarY += (linkLines.length * 4) + 4;
                }
                sidebarY += 4;
            }

            // --- REFERENCE (SIDEBAR) ---
            if (references.length > 0) {
                drawSidebarHeader('REFERENCE');
                for (const ref of references) {
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(255, 255, 255);
                    doc.text(ref.name, 12, sidebarY);
                    sidebarY += 4;
                    doc.setFontSize(8);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(220, 220, 220);
                    doc.text(ref.title, 12, sidebarY);
                    sidebarY += 4;
                    doc.setTextColor(200, 200, 200);
                    doc.text(ref.contact, 12, sidebarY);
                    sidebarY += 10;
                }
            }

            // --- HOBBIES (SIDEBAR) ---
            if (hobbies.length > 0) {
                drawSidebarHeader('HOBBIES');
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(220, 220, 220);
                for (const hobby of hobbies) {
                    doc.text(`• ${hobby.toUpperCase()}`, 12, sidebarY);
                    sidebarY += 6;
                }
            }

            // --- MAIN SECTION CONTENT ---
            let mainY = 30;
            const mainX = sidebarWidth + 15;
            const mainContentWidth = pageWidth - sidebarWidth - 30;

            // --- NAME & TITLE ---
            doc.setFontSize(32);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(40, 40, 40);
            const nameParts = profile.name.split(' ');
            doc.text(nameParts[0].toUpperCase(), mainX, mainY);
            mainY += 10;
            if (nameParts[1]) {
                doc.text(nameParts.slice(1).join(' ').toUpperCase(), mainX, mainY);
                mainY += 8;
            }

            doc.setFontSize(14);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            const roleTitle = profile.role === 'TRAINER' ? (profile.profession || 'SPORTS TEACHER') : (profile.sport || 'ATHLETE');
            doc.text(roleTitle.toUpperCase(), mainX, mainY);
            mainY += 15;

            // --- CONTACT INFO (TOP RIGHT) ---
            const contactX = pageWidth - 15;
            doc.setFontSize(8);
            doc.setTextColor(80, 80, 80);
            let contactY = 30;

            if (profile.location) {
                doc.text(profile.location, contactX, contactY, { align: 'right' });
                contactY += 6;
            }
            if (profile.phone) {
                doc.text(profile.phone, contactX, contactY, { align: 'right' });
                contactY += 6;
            }
            if (profile.email) {
                doc.text(profile.email, contactX, contactY, { align: 'right' });
            }

            // --- MAIN CONTENT HEADERS HELPER ---
            const drawMainHeader = (text: string) => {
                if (mainY > 260) { doc.addPage(); mainY = 20; }
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(40, 40, 40);
                doc.text(text.toUpperCase(), mainX, mainY);
                doc.setDrawColor(100, 100, 100);
                doc.setLineWidth(0.5);
                doc.line(mainX, mainY + 2, pageWidth - 15, mainY + 2);
                mainY += 12;
            };

            // --- WORK EXPERIENCE (Achievements/Training) ---
            const experienceData = profile.role === 'ATHLETE' ? achievements : trainingHistory;
            if (experienceData.length > 0) {
                drawMainHeader(profile.role === 'ATHLETE' ? 'ACHIEVEMENTS' : 'WORK EXPERIENCE');
                for (const exp of experienceData) {
                    if (mainY > 260) { doc.addPage(); mainY = 20; }

                    // Left Side of entry
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(60, 60, 60);
                    const org = exp.organization || exp.academy || '';
                    doc.text(org.toUpperCase(), mainX, mainY);

                    doc.setFontSize(8);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(120, 120, 120);
                    doc.text(exp.location || '', mainX, mainY + 4);
                    doc.text(exp.year || exp.period || '', mainX, mainY + 8);

                    // Right Side of entry (The Dot & Text)
                    const timelineX = mainX + 50;
                    doc.setFillColor(80, 80, 80);
                    doc.circle(timelineX, mainY - 1, 1, 'F');
                    doc.setDrawColor(150, 150, 150);
                    doc.setLineWidth(0.2);
                    doc.line(timelineX, mainY, timelineX, mainY + 15);

                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(40, 40, 40);
                    doc.text(exp.title || 'Professional Role', timelineX + 5, mainY);

                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(100, 100, 100);
                    const descText = exp.result ? `• ${exp.result}` : (exp.coach ? `• Trained by ${exp.coach}` : '• Professional development and performance in sports ecosystem.');
                    const wrappedDesc = doc.splitTextToSize(descText, pageWidth - timelineX - 25);
                    doc.text(wrappedDesc, timelineX + 5, mainY + 5);

                    mainY += Math.max(15, (wrappedDesc.length * 4.5) + 10);
                }
                mainY += 5;
            }

            // --- EDUCATION / CERTIFICATIONS ---
            const eduData = profile.role === 'ATHLETE' ? trainingHistory : certifications;
            if (eduData.length > 0) {
                drawMainHeader(profile.role === 'ATHLETE' ? 'TRAINING & EDUCATION' : 'EDUCATION');
                for (const edu of eduData) {
                    if (mainY > 260) { doc.addPage(); mainY = 20; }

                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(60, 60, 60);
                    const inst = edu.academy || edu.issuer || '';
                    doc.text(inst.toUpperCase(), mainX, mainY);

                    doc.setFontSize(8);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(120, 120, 120);
                    doc.text(edu.location || '', mainX, mainY + 4);
                    doc.text(edu.period || edu.year || '', mainX, mainY + 8);

                    const timelineX = mainX + 50;
                    doc.setFillColor(80, 80, 80);
                    doc.circle(timelineX, mainY - 1, 1, 'F');

                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(40, 40, 40);
                    doc.text(edu.academy ? 'Sports Fellowship/Training' : (edu.name || 'Professional Certification'), timelineX + 5, mainY);

                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(100, 100, 100);
                    const eduDesc = edu.coach ? `• Under guidance of Coach ${edu.coach}` : '• Completed professional certification and passed all required standards.';
                    const wrappedEdu = doc.splitTextToSize(eduDesc, pageWidth - timelineX - 25);
                    doc.text(wrappedEdu, timelineX + 5, mainY + 5);

                    mainY += (wrappedEdu.length * 4.5) + 12;
                }
                mainY += 5;
            }

            // --- SKILLS ---
            if (skills.length > 0) {
                drawMainHeader('SKILLS');
                const skillCols = 2;
                const skillColWidth = mainContentWidth / skillCols;
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(60, 60, 60);

                for (let i = 0; i < skills.length; i++) {
                    const col = i % skillCols;
                    const row = Math.floor(i / skillCols);
                    const x = mainX + (col * skillColWidth);
                    const y = mainY + (row * 12);

                    if (y > 275) { doc.addPage(); mainY = 20; }

                    doc.text(skills[i].toUpperCase(), x, y);
                    doc.setFillColor(240, 240, 240);
                    doc.rect(x, y + 2, skillColWidth - 10, 1.5, 'F');
                    doc.setFillColor(100, 100, 100);
                    doc.rect(x, y + 2, (skillColWidth - 10) * 0.85, 1.5, 'F'); // 85% skill level placeholder
                }
                mainY += (Math.ceil(skills.length / skillCols) * 12) + 10;
            }

            // --- LANGUAGES ---
            if (languages.length > 0) {
                drawMainHeader('LANGUAGES');
                const langCols = 2;
                const langColWidth = mainContentWidth / langCols;
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(60, 60, 60);

                for (let i = 0; i < languages.length; i++) {
                    const col = i % langCols;
                    const row = Math.floor(i / langCols);
                    const x = mainX + (col * langColWidth);
                    const y = mainY + (row * 12);

                    doc.text(languages[i].name.toUpperCase(), x, y);
                    doc.setFillColor(240, 240, 240);
                    doc.rect(x, y + 2, langColWidth - 10, 1.5, 'F');
                    doc.setFillColor(100, 100, 100);
                    doc.rect(x, y + 2, (langColWidth - 10) * (languages[i].level / 100), 1.5, 'F');
                }
                mainY += (Math.ceil(languages.length / langCols) * 12) + 10;
            }

            // --- SOCIO SPORTS LOGO / FOOTER ---
            const margin = 20;
            doc.setFillColor(255, 77, 46);
            doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
            doc.setFontSize(8);
            doc.setTextColor(255, 255, 255);
            doc.text('OFFICIAL SPORTS ID: ' + profile.sportsId, margin + sidebarWidth, pageHeight - 5);
            doc.text('GENERATED BY SOCIOSPORTS', pageWidth - 15, pageHeight - 5, { align: 'right' });

            doc.save(`SocioSports-Resume-${profile.sportsId}.pdf`);
            toast.success('Professional Resume PDF Downloaded!', { id: toastId });
        } catch (error) {
            console.error('PDF Export failed:', error);
            toast.error('Failed to generate professional PDF', { id: toastId });
        } finally {
            setIsExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-[#0B0F17]">
                <Loader2 className="w-8 h-8 text-[var(--accent-orange)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden text-[#333]">
            {/* Action Bar */}
            <div className="bg-[#0B0F17] p-4 flex items-center justify-between border-b border-white/10 shrink-0">
                <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">Back</span>
                </button>
                <div className="flex items-center gap-3">
                    <button onClick={onShowCard} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-orange)]/10 text-[var(--accent-orange)] border border-[var(--accent-orange)]/20 text-xs font-black uppercase">
                        <ShieldCheck className="w-4 h-4" /> Digital ID
                    </button>
                    <button onClick={handleExportPDF} disabled={isExporting} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white border border-white/10 text-xs font-black uppercase hover:bg-white/10">
                        <Download className="w-4 h-4" /> {isExporting ? 'Generating...' : 'Export Pro PDF'}
                    </button>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><X className="w-5 h-5 text-white/70" /></button>
                </div>
            </div>

            {/* Resume Content View */}
            <div className="flex-1 overflow-y-auto bg-gray-100 p-8 flex justify-center custom-scrollbar">
                <div id="pro-resume-view" className="w-full max-w-[1000px] bg-white shadow-2xl flex min-h-[1400px]">

                    {/* Dark Sidebar */}
                    <div className="w-[32%] bg-[#3D3D3D] text-white p-8 flex flex-col gap-10">
                        {/* Profile Pic */}
                        <div className="flex justify-center">
                            <div className="w-40 h-40 rounded-full border-4 border-white/20 overflow-hidden bg-gray-800 shadow-xl">
                                <img
                                    src={profile.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=0D8ABC&color=fff&size=512`}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Sidebar Sections */}
                        <div className="space-y-10 mt-4">
                            {/* About Me */}
                            <section>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] border-b border-white/20 pb-2 mb-4">About Me</h3>
                                <p className="text-sm text-gray-300 leading-relaxed italic">{profile.bio || 'Professional sports enthusiast dedicated to excellence and community development.'}</p>
                            </section>

                            {/* Links */}
                            {socialLinks && Object.values(socialLinks).some(v => v) && (
                                <section>
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] border-b border-white/20 pb-2 mb-4">Links</h3>
                                    <div className="space-y-4">
                                        {socialLinks.linkedin && (
                                            <div>
                                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">LinkedIn</p>
                                                <p className="text-xs text-blue-400 break-all">{socialLinks.linkedin}</p>
                                            </div>
                                        )}
                                        {socialLinks.twitter && (
                                            <div>
                                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Twitter</p>
                                                <p className="text-xs text-blue-400 break-all">{socialLinks.twitter}</p>
                                            </div>
                                        )}
                                        {socialLinks.instagram && (
                                            <div>
                                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Instagram</p>
                                                <p className="text-xs text-blue-400 break-all">{socialLinks.instagram}</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* References */}
                            {references.length > 0 && (
                                <section>
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] border-b border-white/20 pb-2 mb-4">Reference</h3>
                                    <div className="space-y-6">
                                        {references.map((ref, idx) => (
                                            <div key={idx}>
                                                <p className="text-sm font-bold text-white mb-0.5">{ref.name}</p>
                                                <p className="text-xs text-gray-400 mb-1">{ref.title}</p>
                                                <p className="text-xs text-gray-500">{ref.contact}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Hobbies */}
                            {hobbies.length > 0 && (
                                <section>
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] border-b border-white/20 pb-2 mb-4">Hobbies</h3>
                                    <ul className="space-y-2">
                                        {hobbies.map((hobby: string, idx: number) => (
                                            <li key={idx} className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                                {hobby}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 p-12 flex flex-col gap-12">
                        {/* Header Info */}
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <h1 className="text-6xl font-black text-[#333] tracking-tighter leading-none flex flex-col">
                                    {profile.name.split(' ')[0]}
                                    <span className="text-gray-400 opacity-80">{profile.name.split(' ').slice(1).join(' ')}</span>
                                </h1>
                                <p className="text-xl font-bold tracking-[0.15em] text-[#555] uppercase">
                                    {profile.role === 'TRAINER' ? (profile.role + ' / ' + (profile.profession || 'COACH')) : (profile.role + ' / ' + (profile.sport || 'ATHLETE'))}
                                </p>
                            </div>
                            <div className="text-right space-y-2 text-gray-500 mt-2">
                                <div className="flex items-center justify-end gap-2 text-sm font-medium">
                                    {profile.location} <MapPin className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="flex items-center justify-end gap-2 text-sm font-medium">
                                    {profile.phone} <Phone className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="flex items-center justify-end gap-2 text-sm font-medium">
                                    {profile.email} <Mail className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Experience Timeline */}
                        <section>
                            <h2 className="text-lg font-black uppercase tracking-[0.4em] text-[#333] border-b-2 border-gray-100 pb-3 mb-8">Work Experience</h2>
                            <div className="space-y-12">
                                {(profile.role === 'ATHLETE' ? achievements : trainingHistory).map((exp: any, idx: number) => (
                                    <div key={idx} className="flex gap-8 group">
                                        <div className="w-48 pt-1">
                                            <p className="text-xs font-black uppercase text-[#333]">{exp.organization || exp.academy}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{exp.location}</p>
                                            <p className="text-[10px] font-bold text-gray-400 mt-0.5">{exp.year || exp.period}</p>
                                        </div>
                                        <div className="relative flex flex-col gap-2 flex-1 pl-8 border-l border-gray-200">
                                            <div className="absolute top-2 -left-[5px] w-2.5 h-2.5 rounded-full bg-[#3D3D3D] border-2 border-white" />
                                            <h4 className="text-base font-black text-[#333] uppercase leading-none">{exp.title || 'Professional Sports Role'}</h4>
                                            <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                                {exp.result ? exp.result : (exp.coach ? `Successfully completed intensive training under the guidance of Head Coach ${exp.coach}.` : 'Demonstrated exceptional performance and commitment to sports excellence.')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Education Timeline */}
                        <section>
                            <h2 className="text-lg font-black uppercase tracking-[0.4em] text-[#333] border-b-2 border-gray-100 pb-3 mb-8">Education / Training</h2>
                            <div className="space-y-12">
                                {(profile.role === 'ATHLETE' ? trainingHistory : certifications).map((edu: any, idx: number) => (
                                    <div key={idx} className="flex gap-8 group">
                                        <div className="w-48 pt-1">
                                            <p className="text-xs font-black uppercase text-[#333]">{edu.academy || edu.issuer}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{edu.location || 'Official Certification'}</p>
                                            <p className="text-[10px] font-bold text-gray-400 mt-0.5">{edu.period || edu.year}</p>
                                        </div>
                                        <div className="relative flex flex-col gap-2 flex-1 pl-8 border-l border-gray-200">
                                            <div className="absolute top-2 -left-[5px] w-2.5 h-2.5 rounded-full bg-[#3D3D3D] border-2 border-white" />
                                            <h4 className="text-base font-black text-[#333] uppercase leading-none">{edu.name || 'Sports Certification / Fellowship'}</h4>
                                            <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                                {edu.coach ? `Completed fellowship under ${edu.coach}.` : 'Successfully attained professional standard for the discipline.'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Skills Grid */}
                        {skills.length > 0 && (
                            <section>
                                <h2 className="text-lg font-black uppercase tracking-[0.4em] text-[#333] border-b-2 border-gray-100 pb-3 mb-8">Skills</h2>
                                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                    {skills.map((skill: string, idx: number) => (
                                        <div key={idx} className="space-y-2">
                                            <p className="text-xs font-black text-[#555] uppercase tracking-wider">{skill}</p>
                                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${85}%` }}
                                                    className="h-full bg-gray-400"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Languages Grid */}
                        {languages.length > 0 && (
                            <section>
                                <h2 className="text-lg font-black uppercase tracking-[0.4em] text-[#333] border-b-2 border-gray-100 pb-3 mb-8">Languages</h2>
                                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                    {languages.map((lang, idx) => (
                                        <div key={idx} className="space-y-2">
                                            <p className="text-xs font-black text-[#555] uppercase tracking-wider">{lang.name}</p>
                                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${lang.level}%` }}
                                                    className="h-full bg-gray-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

            {/* Official Footer Sticker */}
            <div className="bg-[#FF4D2E] p-3 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Official Sports ID: {profile.sportsId}</span>
                    <span className="text-[10px] font-medium opacity-80 italic">Verified by SocioSports Ecosystem</span>
                </div>
                <div className="flex items-center gap-2">
                    <Star className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Sports Authority of India Registered</span>
                </div>
            </div>
        </div>
    );
};

export default AthleteResume;
