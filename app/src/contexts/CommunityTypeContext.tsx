import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type CommunityType = 'apartments' | 'corporate' | 'ngo' | 'school' | 'club';

interface CommunityTypeConfig {
  id: CommunityType;
  label: string;
  shortLabel: string;
  headline: string;
  subtext: string;
  icon: string;
  color: string;
}

export const COMMUNITY_CONFIGS: Record<CommunityType, CommunityTypeConfig> = {
  apartments: {
    id: 'apartments',
    label: 'Apartments & Gated Communities',
    shortLabel: 'Apartments',
    headline: 'Transform Your Apartment Into a Sports Hub',
    subtext: 'Organize weekend leagues, manage facility bookings, and build a healthier residential community.',
    icon: '🏠',
    color: 'from-blue-500 to-cyan-500',
  },
  corporate: {
    id: 'corporate',
    label: 'Corporate & Companies',
    shortLabel: 'Corporate',
    headline: 'Elevate Employee Wellness Through Sports',
    subtext: 'Boost productivity, reduce healthcare costs, and build team spirit with corporate sports programs.',
    icon: '🏢',
    color: 'from-purple-500 to-pink-500',
  },
  ngo: {
    id: 'ngo',
    label: 'NGOs & Youth Programs',
    shortLabel: 'NGOs',
    headline: 'Create Lasting Impact Through Sports',
    subtext: 'Track youth development, measure outcomes, and showcase your program\'s success to donors.',
    icon: '❤️',
    color: 'from-green-500 to-emerald-500',
  },
  school: {
    id: 'school',
    label: 'Schools & Colleges',
    shortLabel: 'Schools',
    headline: 'Digitize Your Institution\'s Sports Programs',
    subtext: 'From PT classes to inter-school tournaments, manage everything in one integrated platform.',
    icon: '🎓',
    color: 'from-orange-500 to-yellow-500',
  },
  club: {
    id: 'club',
    label: 'Clubs & Associations',
    shortLabel: 'Clubs',
    headline: 'Grow Your Sports Club Membership',
    subtext: 'Attract members, organize events, and manage your club efficiently with powerful tools.',
    icon: '🏆',
    color: 'from-red-500 to-orange-500',
  },
};

interface CommunityTypeContextType {
  selectedType: CommunityType;
  setSelectedType: (type: CommunityType) => void;
  config: CommunityTypeConfig;
}

export const CommunityTypeContext = createContext<CommunityTypeContextType | undefined>(undefined);

export const CommunityTypeProvider = ({ children }: { children: ReactNode }) => {
  const [selectedType, setSelectedType] = useState<CommunityType>(() => {
    // Try to restore from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('communityType');
      if (saved && Object.keys(COMMUNITY_CONFIGS).includes(saved)) {
        return saved as CommunityType;
      }
    }
    return 'apartments'; // Default priority
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('communityType', selectedType);
  }, [selectedType]);

  const config = COMMUNITY_CONFIGS[selectedType];

  return (
    <CommunityTypeContext.Provider value={{ selectedType, setSelectedType, config }}>
      {children}
    </CommunityTypeContext.Provider>
  );
};

export const useCommunityType = () => {
  const context = useContext(CommunityTypeContext);
  if (!context) {
    throw new Error('useCommunityType must be used within a CommunityTypeProvider');
  }
  return context;
};

export default CommunityTypeContext;
