import { useState, useEffect } from 'react';
import { Search, Filter, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const FindCoach = () => {
    const [coaches, setCoaches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpec, setFilterSpec] = useState('All');

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            setCoaches([
                { id: 1, name: 'Srinivas M.', specialization: 'Athletics', exp: '15 Yrs', location: 'Hyderabad', rating: 4.9, students: '400+' },
                { id: 2, name: 'Rahul D.', specialization: 'Cricket', exp: '10 Yrs', location: 'Bangalore', rating: 4.8, students: '250+' },
                { id: 3, name: 'Lakshmi P.', specialization: 'Badminton', exp: '8 Yrs', location: 'Chennai', rating: 4.9, students: '300+' },
                { id: 4, name: 'John K.', specialization: 'Strength', exp: '12 Yrs', location: 'Mumbai', rating: 5.0, students: '500+' },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredCoaches = coaches.filter(coach =>
        (filterSpec === 'All' || coach.specialization === filterSpec) &&
        (coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coach.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <section className="py-20 container mx-auto px-6" id="find-coach">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <span className="eyebrow text-blue-500 mb-2 inline-block">EXPERT GUIDANCE</span>
                    <h2 className="text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight">Find a <span className="text-gradient">Coach</span></h2>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                        <input
                            type="text"
                            placeholder="Search by name or location..."
                            className="w-full md:w-64 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full py-3 pl-10 pr-6 text-sm outline-none focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                        <select
                            className="w-full md:w-48 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full py-3 pl-10 pr-6 text-sm outline-none focus:border-blue-500 appearance-none cursor-pointer"
                            value={filterSpec}
                            onChange={(e) => setFilterSpec(e.target.value)}
                        >
                            <option value="All">All Specializations</option>
                            <option value="Athletics">Athletics</option>
                            <option value="Cricket">Cricket</option>
                            <option value="Badminton">Badminton</option>
                            <option value="Strength">Strength & Conditioning</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="h-80 rounded-[32px] bg-[var(--bg-secondary)] animate-pulse border border-[var(--border)]"></div>
                    ))}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredCoaches.map(coach => (
                        <div key={coach.id} className="group p-6 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-blue-500/50 transition-all hover:-translate-y-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-black text-xl">
                                    {coach.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold mb-1">
                                        <Star className="w-3 h-3 fill-current" /> {coach.rating}
                                    </div>
                                    <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight">{coach.name}</h3>
                                    <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider">{coach.specialization}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--text-secondary)]">Experience</span>
                                    <span className="font-bold text-[var(--text-primary)]">{coach.exp}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--text-secondary)]">Students</span>
                                    <span className="font-bold text-[var(--text-primary)]">{coach.students}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--text-secondary)]">Location</span>
                                    <span className="font-bold text-[var(--text-primary)] text-right">{coach.location}</span>
                                </div>
                            </div>

                            <Link to="/mobile-app" className="block w-full">
                                <button className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold uppercase tracking-wider hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                                    Book Session
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default FindCoach;
