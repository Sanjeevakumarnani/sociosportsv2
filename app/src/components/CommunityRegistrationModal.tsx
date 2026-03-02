import { useState, useEffect } from 'react';
// Adding comment to force refresh
import { useNavigate } from 'react-router-dom';
import { X, Check, ChevronRight, Building2, Users, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { useCommunityType, COMMUNITY_CONFIGS, type CommunityType } from '../contexts/CommunityTypeContext';
import { api } from '../services/api';
import { useAnalytics } from './AnalyticsProvider';

interface CommunityRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: CommunityType;
}

const STEPS = [
  { id: 1, title: 'Community Type', description: 'What best describes your community?' },
  { id: 2, title: 'Basic Details', description: 'Tell us about your community' },
  { id: 3, title: 'Contact Info', description: 'How can we reach you?' },
  { id: 4, title: 'Confirmation', description: 'Review and submit' },
];

const CommunityRegistrationModal = ({ isOpen, onClose, initialType }: CommunityRegistrationModalProps) => {
  const navigate = useNavigate();
  const { selectedType, setSelectedType } = useCommunityType();
  const { trackEvent } = useAnalytics();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    type: initialType || selectedType,
    name: '',
    location: '',
    sport: '',
    members: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    if (initialType) {
      setFormData(prev => ({ ...prev, type: initialType }));
    }
  }, [initialType]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTypeSelect = (type: CommunityType) => {
    setSelectedType(type);
    setFormData(prev => ({ ...prev, type }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!formData.type;
      case 2:
        return formData.name.trim().length > 0 && formData.location.trim().length > 0;
      case 3:
        return formData.email.trim().length > 0 && formData.phone.trim().length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    trackEvent('community_registration_submit', { type: formData.type });

    try {
      await api.createCommunity({
        type: formData.type,
        name: formData.name,
        location: formData.location,
        sport: formData.sport,
        expectedMembers: parseInt(formData.members) || 0,
        contactEmail: formData.email,
        contactPhone: formData.phone,
        message: formData.message,
      });

      setIsSuccess(true);
      trackEvent('community_registration_success', { type: formData.type });
    } catch (error) {
      console.error('Registration failed:', error);
      trackEvent('community_registration_error', { type: formData.type, error: String(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      type: selectedType,
      name: '',
      location: '',
      sport: '',
      members: '',
      email: '',
      phone: '',
      message: '',
    });
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[var(--bg-primary)] rounded-3xl border border-[var(--border)] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative px-6 py-6 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--bg-primary)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${currentStep >= step.id
                    ? 'bg-[var(--accent-orange)] text-white'
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border)]'
                    }`}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`w-12 md:w-20 h-0.5 mx-2 transition-colors ${currentStep > step.id ? 'bg-[var(--accent-orange)]' : 'bg-[var(--border)]'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-[var(--text-primary)]">
            {STEPS[currentStep - 1].title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {STEPS[currentStep - 1].description}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[300px]">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2">
                Community Created!
              </h3>
              <p className="text-[var(--text-secondary)] mb-6 max-w-sm">
                Explore it in the app to start managing your sports community.
              </p>
              <button
                onClick={() => {
                  handleClose();
                  navigate('/mobile-app');
                }}
                className="btn-primary px-8 py-3"
              >
                Get the App
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Community Type */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.values(COMMUNITY_CONFIGS).map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleTypeSelect(type.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${formData.type === type.id
                        ? 'border-[var(--accent-orange)] bg-[var(--accent-orange)]/10'
                        : 'border-[var(--border)] hover:border-[var(--accent-orange)]/50'
                        }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{type.icon}</span>
                        <span className="font-bold text-[var(--text-primary)]">{type.shortLabel}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">{type.label}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Basic Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                      Community Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g., Hiranandani Sports Club"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-orange)] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                      Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g., Gachibowli, Hyderabad"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-orange)] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                        Primary Sport
                      </label>
                      <select
                        value={formData.sport}
                        onChange={(e) => handleInputChange('sport', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none transition-colors"
                      >
                        <option value="">Select sport</option>
                        <option value="cricket">Cricket</option>
                        <option value="football">Football</option>
                        <option value="badminton">Badminton</option>
                        <option value="basketball">Basketball</option>
                        <option value="tennis">Tennis</option>
                        <option value="swimming">Swimming</option>
                        <option value="running">Running</option>
                        <option value="multiple">Multiple Sports</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                        Expected Members
                      </label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                        <input
                          type="number"
                          value={formData.members}
                          onChange={(e) => handleInputChange('members', e.target.value)}
                          placeholder="e.g., 100"
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-orange)] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Info */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-orange)] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 78429 83839"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-orange)] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                      Anything else you'd like to tell us?
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us about your community goals, specific needs, or questions..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-orange)] focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider mb-4">
                      Review Your Details
                    </h4>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Community Type:</span>
                        <span className="font-bold text-[var(--text-primary)]">
                          {COMMUNITY_CONFIGS[formData.type as CommunityType]?.shortLabel}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Name:</span>
                        <span className="font-bold text-[var(--text-primary)]">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Location:</span>
                        <span className="font-bold text-[var(--text-primary)]">{formData.location}</span>
                      </div>
                      {formData.sport && (
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">Primary Sport:</span>
                          <span className="font-bold text-[var(--text-primary)] capitalize">{formData.sport}</span>
                        </div>
                      )}
                      {formData.members && (
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">Expected Members:</span>
                          <span className="font-bold text-[var(--text-primary)]">{formData.members}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Email:</span>
                        <span className="font-bold text-[var(--text-primary)]">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Phone:</span>
                        <span className="font-bold text-[var(--text-primary)]">{formData.phone}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] text-center">
                    By submitting, your community will be created and you've taken the first step to digitize your sports network.
                    Explore it instantly in our mobile app!
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-secondary)] flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-2.5 rounded-full font-bold transition-colors ${currentStep === 1
                ? 'text-[var(--text-secondary)] cursor-not-allowed'
                : 'text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                }`}
            >
              Back
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all ${canProceed()
                  ? 'bg-[var(--accent-orange)] text-white hover:shadow-lg hover:shadow-[var(--accent-orange)]/25'
                  : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] cursor-not-allowed'
                  }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold bg-green-500 text-white hover:shadow-lg hover:shadow-green-500/25 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Create Community & Download App
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityRegistrationModal;
