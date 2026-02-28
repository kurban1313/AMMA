// AMMA Healthcare Platform - Home Page

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Heart,
  Users,
  Brain,
  Stethoscope,
  BarChart3,
  Calendar,
  Shield,
  ArrowRight,
  Check,
  Quote,
  Star,
  MessageSquare,
  Database,
  FileText,
  Activity,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Users,
    title: 'Family Health Vault',
    description: 'Manage complete medical histories for your entire family under one secure account. Upload records, track conditions, and access anytime.',
  },
  {
    icon: Brain,
    title: 'AI Health Predictions',
    description: 'Our AI analyzes your health data to predict potential risks and recommend preventive care before issues arise.',
  },
  {
    icon: Stethoscope,
    title: 'Doctor Network',
    description: 'Connect with verified healthcare providers. Book appointments, share records, and receive coordinated care.',
  },
  {
    icon: BarChart3,
    title: 'Research Insights',
    description: 'Contribute to medical research with anonymized data. Help scientists discover new treatments and patterns.',
  },
  {
    icon: Calendar,
    title: 'Smart Appointments',
    description: 'AI-prioritized scheduling ensures urgent cases get attention first. Automatic reminders keep you on track.',
  },
  {
    icon: Shield,
    title: 'Secure & Compliant',
    description: 'Bank-level encryption and HIPAA-compliant handling. Your data is protected with the highest security standards.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Register & Add Family',
    description: 'Create your account and add family members. Each person gets their own secure health profile.',
  },
  {
    number: '02',
    title: 'Link with Doctors',
    description: 'Connect with your healthcare providers. They can upload records and you can book appointments.',
  },
  {
    number: '03',
    title: 'Get AI Insights',
    description: 'Receive personalized health predictions and recommendations based on your complete medical history.',
  },
];

const testimonials = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Family Physician, Delhi',
    quote: 'AMMA has transformed how I manage patient care. The AI predictions help me prioritize appointments, and having complete medical histories at my fingertips saves precious time.',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Patient, Mumbai',
    quote: 'Managing my parents\' health records used to be a nightmare. With AMMA, everything is organized and accessible. The AI even predicted my father\'s diabetes risk before symptoms appeared.',
    rating: 5,
  },
  {
    name: 'Dr. Anand Kumar',
    role: 'Research Scientist, AIIMS',
    quote: 'The research platform is a game-changer. I can query complex datasets in seconds and get insights that would have taken weeks to compile manually. And the anonymization is rock-solid.',
    rating: 5,
  },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(
        '.hero-headline span',
        { opacity: 0, y: 30, clipPath: 'inset(0 100% 0 0)' },
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.3,
        }
      );

      gsap.fromTo(
        '.hero-description',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.7, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.hero-cta',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.9, ease: 'back.out(1.7)' }
      );

      gsap.fromTo(
        '.hero-image',
        { opacity: 0, x: 80 },
        { opacity: 1, x: 0, duration: 1, delay: 0.5, ease: 'power3.out' }
      );

      // Features animation
      gsap.fromTo(
        '.feature-card',
        { opacity: 0, y: 60, rotateX: 15 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
          },
        }
      );

      // Steps animation
      gsap.fromTo(
        '.step-card',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.3,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top 80%',
          },
        }
      );

      // Testimonials animation
      gsap.fromTo(
        '.testimonial-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: 'top 80%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen pt-[75px] bg-gradient-to-br from-[#ebf0f9] via-[#f0f7fc] to-[#cce5f3] overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 opacity-30">
          <div className="w-full h-full bg-[#0070a0] rounded-full blur-3xl" />
        </div>
        <div className="absolute bottom-40 right-20 w-32 h-32 opacity-20">
          <div className="w-full h-full bg-[#faea73] rounded-full blur-3xl" />
        </div>

        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="relative z-10">
              <h1 className="hero-headline text-4xl sm:text-5xl lg:text-[58px] font-medium text-[#1f1f1f] leading-tight font-['Fraunces']">
                <span className="inline-block">Get the</span>{' '}
                <span className="inline-block text-[#0070a0]">care</span>{' '}
                <span className="inline-block">you</span>{' '}
                <span className="inline-block text-[#1b9cca]">need,</span>{' '}
                <span className="inline-block">when you</span>{' '}
                <span className="inline-block text-[#0070a0]">need</span>{' '}
                <span className="inline-block">it</span>
              </h1>

              <p className="hero-description mt-6 text-lg text-[#626a72] leading-relaxed max-w-lg">
                AMMA connects patients, doctors, and researchers on a unified platform.
                Manage family health records, book appointments with AI-powered predictions,
                and access anonymized medical insights—all in one secure place.
              </p>

              <div className="hero-cta mt-8 flex flex-wrap gap-4">
                <Link to="/register">
                  <Button className="bg-[#0070a0] hover:bg-[#00577c] text-white px-8 py-6 text-lg rounded-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,112,160,0.3)]">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button
                    variant="outline"
                    className="border-[#cce5f3] text-[#0070a0] hover:bg-[#e6f7ff] px-8 py-6 text-lg rounded-md"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-[#cce5f3]">
                <p className="text-sm text-[#99a4af] mb-4">
                  Trusted by leading healthcare providers
                </p>
                <div className="flex items-center gap-8 opacity-60">
                  {['AIIMS', 'Apollo', 'Max', 'Fortis'].map((hospital) => (
                    <span
                      key={hospital}
                      className="text-lg font-semibold text-[#626a72]"
                    >
                      {hospital}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hero-image relative hidden lg:block">
              <div className="relative">
                {/* Main Illustration */}
                <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 animate-pulse-glow">
                  <div className="aspect-square bg-gradient-to-br from-[#0070a0] to-[#2c90c9] rounded-xl flex items-center justify-center">
                    <Heart className="w-32 h-32 text-white" />
                  </div>

                  {/* Floating Cards */}
                  <div className="absolute -left-8 top-1/4 bg-white rounded-lg shadow-lg p-4 animate-float">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#00b67a] rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1f1f1f]">Health Check</p>
                        <p className="text-xs text-[#626a72]">All systems normal</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-4 bottom-1/4 bg-white rounded-lg shadow-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#faea73] rounded-full flex items-center justify-center">
                        <Brain className="w-5 h-5 text-[#1f1f1f]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1f1f1f]">AI Prediction</p>
                        <p className="text-xs text-[#626a72]">92% accuracy</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Cross */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#1b9cca] rounded-2xl flex items-center justify-center animate-float">
                  <Heart className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-[#f7f9fa]">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#0070a0] text-sm font-semibold uppercase tracking-wider">
              Features
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[50px] font-medium text-[#1f1f1f] font-['Fraunces']">
              Our platform provides everything you need
            </h2>
            <p className="mt-4 text-lg text-[#626a72]">
              From family health management to AI-powered predictions, AMMA brings all your healthcare needs together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="feature-card group bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden"
                style={{ marginTop: index % 3 === 1 ? '30px' : '0' }}
              >
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-[#e6f7ff] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0070a0] transition-colors duration-300">
                    <feature.icon className="w-7 h-7 text-[#0070a0] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1f1f1f] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#626a72] leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={stepsRef} className="py-20 bg-white">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#0070a0] text-sm font-semibold uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[50px] font-medium text-[#1f1f1f] font-['Fraunces']">
              Three simple steps to complete healthcare
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#dee5eb] -translate-y-1/2" />

            {steps.map((step) => (
              <div key={step.number} className="step-card relative">
                <div className="bg-white rounded-2xl border border-[#dee5eb] p-8 text-center relative z-10 hover:border-[#0070a0] hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-[#0070a0] rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#1f1f1f] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#626a72]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Tabs Section */}
      <section className="py-20 bg-[#f7f9fa]">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#0070a0] text-sm font-semibold uppercase tracking-wider">
              Platform Overview
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[50px] font-medium text-[#1f1f1f] font-['Fraunces']">
              Three platforms, one unified ecosystem
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                {
                  icon: Users,
                  title: 'Family Health Vault',
                  description: 'Store and manage medical records for your entire family. Upload prescriptions, lab reports, doctor notes, and vaccination records.',
                },
                {
                  icon: Stethoscope,
                  title: 'Doctor Portal',
                  description: 'Upload patient records, manage appointments, and access AI-generated health predictions. Prioritize cases by urgency.',
                },
                {
                  icon: Database,
                  title: 'Research Platform',
                  description: 'Query aggregated health data using natural language. Discover patterns and generate reports while maintaining privacy.',
                },
                {
                  icon: Brain,
                  title: 'AI Predictions',
                  description: 'Our AI analyzes patient history to predict health risks before they become serious. Get proactive alerts.',
                },
              ].map((platform) => (
                <div
                  key={platform.title}
                  className="flex items-start gap-4 p-6 bg-white rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-[#e6f7ff] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#0070a0] transition-colors">
                    <platform.icon className="w-6 h-6 text-[#0070a0] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1f1f1f] mb-2">
                      {platform.title}
                    </h3>
                    <p className="text-[#626a72] text-sm">{platform.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="aspect-video bg-gradient-to-br from-[#0070a0] to-[#2c90c9] rounded-xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <Activity className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-semibold">Unified Health Dashboard</p>
                    <p className="text-sm opacity-80">Real-time insights across all platforms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Prediction Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#0070a0] text-sm font-semibold uppercase tracking-wider">
                AI Health Predictions
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[50px] font-medium text-[#1f1f1f] font-['Fraunces'] leading-tight">
                Stay ahead of health issues before they arise
              </h2>
              <p className="mt-6 text-lg text-[#626a72]">
                Our AI engine continuously analyzes patient data to identify patterns and predict potential health risks. Get proactive alerts and preventive recommendations.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  'Risk scoring based on age, history, and lifestyle',
                  'Pattern recognition across family health data',
                  'Automated appointment suggestions for high-risk cases',
                  'Priority queue management for doctors',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#00b67a] rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[#33383f]">{item}</span>
                  </li>
                ))}
              </ul>

              <Link to="/features" className="inline-block mt-8">
                <Button
                  variant="outline"
                  className="border-[#0070a0] text-[#0070a0] hover:bg-[#e6f7ff]"
                >
                  Learn About AI Features
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="bg-[#f7f9fa] rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-[#626a72]">Diabetes Risk</span>
                      <span className="text-sm font-bold text-[#e92222]">High</span>
                    </div>
                    <div className="w-full bg-[#dee5eb] rounded-full h-2">
                      <div className="bg-[#e92222] h-2 rounded-full" style={{ width: '78%' }} />
                    </div>
                    <p className="text-xs text-[#99a4af] mt-2">Confidence: 78%</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-[#626a72]">Hypertension Control</span>
                      <span className="text-sm font-bold text-[#00b67a]">Good</span>
                    </div>
                    <div className="w-full bg-[#dee5eb] rounded-full h-2">
                      <div className="bg-[#00b67a] h-2 rounded-full" style={{ width: '89%' }} />
                    </div>
                    <p className="text-xs text-[#99a4af] mt-2">Confidence: 89%</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-[#626a72]">Heart Health</span>
                      <span className="text-sm font-bold text-[#faea73]">Moderate</span>
                    </div>
                    <div className="w-full bg-[#dee5eb] rounded-full h-2">
                      <div className="bg-[#faea73] h-2 rounded-full" style={{ width: '65%' }} />
                    </div>
                    <p className="text-xs text-[#99a4af] mt-2">Confidence: 72%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Platform Section */}
      <section className="py-20 bg-[#f7f9fa]">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#dee5eb]">
                  <div className="w-10 h-10 bg-[#0070a0] rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1f1f1f]">AMMA Research Assistant</p>
                    <p className="text-xs text-[#99a4af]">AI-powered query engine</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#f7f9fa] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium">You</span>
                    </div>
                    <div className="bg-[#f7f9fa] rounded-lg p-3 text-sm text-[#33383f]">
                      Show me data for diabetic patients aged 45-60 in Punjab
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#0070a0] rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-[#e6f7ff] rounded-lg p-3 text-sm text-[#33383f]">
                      <p>I found 3,247 anonymized patient records. Diabetes prevalence is 18.3% in this demographic.</p>
                      <div className="mt-3 p-3 bg-white rounded-lg">
                        <p className="text-xs text-[#626a72] mb-2">Key Statistics:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-[#f7f9fa] p-2 rounded">
                            <p className="font-semibold text-[#0070a0]">3,247</p>
                            <p className="text-[#99a4af]">Records</p>
                          </div>
                          <div className="bg-[#f7f9fa] p-2 rounded">
                            <p className="font-semibold text-[#0070a0]">18.3%</p>
                            <p className="text-[#99a4af]">Prevalence</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-[#0070a0] text-sm font-semibold uppercase tracking-wider">
                Research Platform
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[50px] font-medium text-[#1f1f1f] font-['Fraunces'] leading-tight">
                Unlock medical insights with natural language
              </h2>
              <p className="mt-6 text-lg text-[#626a72]">
                Researchers can query anonymized health data using simple conversational language. Our AI understands complex requests and returns statistical insights in seconds.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  'Natural language queries—no SQL required',
                  'Strict anonymization—no PII ever exposed',
                  'Export results as CSV or PDF reports',
                  'Full audit log for compliance',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#00b67a] rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[#33383f]">{item}</span>
                  </li>
                ))}
              </ul>

              <Link to="/features" className="inline-block mt-8">
                <Button
                  variant="outline"
                  className="border-[#0070a0] text-[#0070a0] hover:bg-[#e6f7ff]"
                >
                  Explore Research Features
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-20 bg-white">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#0070a0] text-sm font-semibold uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[50px] font-medium text-[#1f1f1f] font-['Fraunces']">
              What healthcare providers and patients say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.name}
                className="testimonial-card bg-white border border-[#dee5eb] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[#faea73] fill-[#faea73]" />
                    ))}
                  </div>

                  <Quote className="w-8 h-8 text-[#cce5f3] mb-4" />

                  <p className="text-[#33383f] leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-[#dee5eb]">
                    <div className="w-12 h-12 bg-[#0070a0] rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1f1f1f]">{testimonial.name}</p>
                      <p className="text-sm text-[#626a72]">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#cce5f3] to-[#f7f9fa]">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-[50px] font-medium text-[#1f1f1f] font-['Fraunces'] leading-tight">
              Ready to transform your healthcare experience?
            </h2>
            <p className="mt-6 text-lg text-[#626a72]">
              Join thousands of families and healthcare providers already using AMMA to manage health better, predict risks earlier, and contribute to medical research.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button className="bg-[#0070a0] hover:bg-[#00577c] text-white px-8 py-6 text-lg rounded-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,112,160,0.3)]">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="border-[#0070a0] text-[#0070a0] hover:bg-white px-8 py-6 text-lg rounded-md"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center gap-2 text-[#626a72]">
                <Lock className="w-5 h-5 text-[#0070a0]" />
                <span className="text-sm">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-[#626a72]">
                <Shield className="w-5 h-5 text-[#0070a0]" />
                <span className="text-sm">256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2 text-[#626a72]">
                <FileText className="w-5 h-5 text-[#0070a0]" />
                <span className="text-sm">ISO 27001 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
