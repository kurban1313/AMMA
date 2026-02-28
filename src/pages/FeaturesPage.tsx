// AMMA Healthcare Platform - Features Page

import { 
  Users, 
  Brain, 
  Stethoscope, 
  BarChart3, 
  Calendar, 
  Shield, 
  FileText,
  Activity,
  Lock,
  Bell,
  Search,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const patientFeatures = [
  {
    icon: Users,
    title: 'Family Health Management',
    description: 'Manage complete medical histories for your entire family under one secure account.',
    benefits: [
      'Unlimited family members',
      'Individual health profiles',
      'Relationship tracking',
      'Emergency contact management',
    ],
  },
  {
    icon: FileText,
    title: 'Medical Records Vault',
    description: 'Store and organize all your medical documents in one secure location.',
    benefits: [
      'PDF, image, and document upload',
      'Smart categorization',
      'Quick search and filter',
      'Share with doctors securely',
    ],
  },
  {
    icon: Calendar,
    title: 'Appointment Booking',
    description: 'Book appointments with your trusted doctors with just a few clicks.',
    benefits: [
      'Real-time availability',
      'Video, phone, or in-person',
      'Automatic reminders',
      'Reschedule easily',
    ],
  },
  {
    icon: Brain,
    title: 'AI Health Insights',
    description: 'Receive personalized health predictions based on your medical history.',
    benefits: [
      'Risk assessment',
      'Preventive recommendations',
      'Trend analysis',
      'Early warning alerts',
    ],
  },
];

const doctorFeatures = [
  {
    icon: Stethoscope,
    title: 'Patient Management',
    description: 'Efficiently manage your patient roster and their complete medical histories.',
    benefits: [
      'Patient directory',
      'Medical history access',
      'Treatment tracking',
      'Collaborative care',
    ],
  },
  {
    icon: Activity,
    title: 'AI-Powered Predictions',
    description: 'Leverage AI to predict patient health risks and prioritize care.',
    benefits: [
      'Risk scoring algorithms',
      'Pattern recognition',
      'Priority queue management',
      'Treatment suggestions',
    ],
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Manage your appointments with intelligent prioritization.',
    benefits: [
      'AI-prioritized queue',
      'Availability management',
      'Automated reminders',
      'Calendar integration',
    ],
  },
  {
    icon: FileText,
    title: 'Digital Prescriptions',
    description: 'Create and manage prescriptions digitally with ease.',
    benefits: [
      'Digital prescription pad',
      'Medication database',
      'Dosage calculations',
      'Patient history access',
    ],
  },
];

const researcherFeatures = [
  {
    icon: Brain,
    title: 'Natural Language Queries',
    description: 'Query medical data using simple conversational language.',
    benefits: [
      'No SQL required',
      'Conversational interface',
      'Context-aware responses',
      'Query suggestions',
    ],
  },
  {
    icon: BarChart3,
    title: 'Statistical Analysis',
    description: 'Generate comprehensive statistical reports from anonymized data.',
    benefits: [
      'Trend analysis',
      'Pattern detection',
      'Correlation studies',
      'Export to CSV/PDF',
    ],
  },
  {
    icon: Lock,
    title: 'Privacy-First Design',
    description: 'Access insights while maintaining strict patient privacy.',
    benefits: [
      '100% anonymized data',
      'No PII exposure',
      'HIPAA compliant',
      'Audit trail',
    ],
  },
  {
    icon: Search,
    title: 'Advanced Filtering',
    description: 'Filter data by demographics, conditions, time periods, and more.',
    benefits: [
      'Age group filtering',
      'Region selection',
      'Condition filters',
      'Time range queries',
    ],
  },
];

const securityFeatures = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'All data is encrypted in transit and at rest using AES-256.',
  },
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description: 'Our platform meets all HIPAA requirements for healthcare data.',
  },
  {
    icon: Bell,
    title: 'Audit Logging',
    description: 'Complete audit trail of all data access and modifications.',
  },
  {
    icon: Check,
    title: 'Regular Security Audits',
    description: 'Third-party security assessments conducted annually.',
  },
];

export default function FeaturesPage() {
  return (
    <div className="pt-[75px]">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#ebf0f9] via-[#f0f7fc] to-[#cce5f3]">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#0070a0] text-sm font-semibold uppercase tracking-wider">
            Features
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[58px] font-medium text-[#1f1f1f] font-['Fraunces'] leading-tight">
            Everything you need for<br />better healthcare
          </h1>
          <p className="mt-6 text-lg text-[#626a72] max-w-2xl mx-auto">
            AMMA combines powerful features for patients, doctors, and researchers 
            in one unified platform designed for the modern healthcare ecosystem.
          </p>
        </div>
      </section>

      {/* Patient Features */}
      <section className="py-20 bg-white">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#0070a0] text-sm font-semibold uppercase tracking-wider">
              For Patients
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-medium text-[#1f1f1f] font-['Fraunces']">
              Family Health Vault
            </h2>
            <p className="mt-4 text-lg text-[#626a72] max-w-2xl mx-auto">
              Take control of your family's health with comprehensive record management and AI-powered insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {patientFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-[#f7f9fa] rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-[#e6f7ff] rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-[#0070a0]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1f1f1f] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#626a72] mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-[#33383f]">
                      <Check className="w-4 h-4 text-[#00b67a]" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor Features */}
      <section className="py-20 bg-[#f7f9fa]">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#0070a0] text-sm font-semibold uppercase tracking-wider">
              For Doctors
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-medium text-[#1f1f1f] font-['Fraunces']">
              Doctor Portal
            </h2>
            <p className="mt-4 text-lg text-[#626a72] max-w-2xl mx-auto">
              Streamline your practice with intelligent patient management and AI-assisted diagnostics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {doctorFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-[#e6f7ff] rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-[#0070a0]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1f1f1f] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#626a72] mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-[#33383f]">
                      <Check className="w-4 h-4 text-[#00b67a]" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Researcher Features */}
      <section className="py-20 bg-white">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#0070a0] text-sm font-semibold uppercase tracking-wider">
              For Researchers
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-medium text-[#1f1f1f] font-['Fraunces']">
              Research Platform
            </h2>
            <p className="mt-4 text-lg text-[#626a72] max-w-2xl mx-auto">
              Unlock medical insights from anonymized data with our AI-powered research tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {researcherFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-[#f7f9fa] rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-[#e6f7ff] rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-[#0070a0]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1f1f1f] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#626a72] mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-[#33383f]">
                      <Check className="w-4 h-4 text-[#00b67a]" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-[#f7f9fa]">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#0070a0] text-sm font-semibold uppercase tracking-wider">
              Security
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-medium text-[#1f1f1f] font-['Fraunces']">
              Your data is safe with us
            </h2>
            <p className="mt-4 text-lg text-[#626a72] max-w-2xl mx-auto">
              We employ industry-leading security measures to protect your sensitive health information.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-[#e6f7ff] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-[#0070a0]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1f1f1f] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#626a72]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#cce5f3] to-[#f7f9fa]">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-medium text-[#1f1f1f] font-['Fraunces']">
            Ready to experience AMMA?
          </h2>
          <p className="mt-4 text-lg text-[#626a72] max-w-2xl mx-auto">
            Join thousands of users who are already benefiting from our unified healthcare platform.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button className="bg-[#0070a0] hover:bg-[#00577c] text-white px-8 py-6 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-[#0070a0] text-[#0070a0] hover:bg-white px-8 py-6 text-lg">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
