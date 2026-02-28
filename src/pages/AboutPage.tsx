// AMMA Healthcare Platform - About Page

import { Shield, Users, Brain, Globe } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'We believe your health data belongs to you. Our platform is built with privacy at its core, ensuring complete control over who can access your information.',
  },
  {
    icon: Brain,
    title: 'AI for Good',
    description: 'We harness the power of artificial intelligence to improve healthcare outcomes while maintaining the highest ethical standards.',
  },
  {
    icon: Users,
    title: 'Patient-Centered',
    description: 'Every feature we build starts with understanding patient needs. We design for real people, not just medical records.',
  },
  {
    icon: Globe,
    title: 'Universal Access',
    description: 'We believe quality healthcare should be accessible to everyone, regardless of location or socioeconomic status.',
  },
];

const team = [
  {
    name: 'Dr. Rajesh Kumar',
    role: 'Founder & CEO',
    bio: 'Former Chief of Medicine at AIIMS with 20+ years of healthcare experience.',
  },
  {
    name: 'Priya Sharma',
    role: 'Chief Technology Officer',
    bio: 'Ex-Google AI researcher with expertise in healthcare machine learning.',
  },
  {
    name: 'Dr. Anand Verma',
    role: 'Chief Medical Officer',
    bio: 'Board-certified physician specializing in digital health transformation.',
  },
  {
    name: 'Sunita Patel',
    role: 'Head of Research',
    bio: 'Leading epidemiologist with publications in top-tier medical journals.',
  },
];

export default function AboutPage() {
  return (
    <div className="pt-[75px]">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#ebf0f9] via-[#f0f7fc] to-[#cce5f3]">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#0070a0] text-sm font-semibold uppercase tracking-wider">
            About Us
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[58px] font-medium text-[#1f1f1f] font-['Fraunces'] leading-tight">
            Building the future of<br />healthcare together
          </h1>
          <p className="mt-6 text-lg text-[#626a72] max-w-2xl mx-auto">
            AMMA is a unified healthcare platform that connects patients, doctors, and researchers 
            to create a more efficient, predictive, and personalized healthcare ecosystem.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#0070a0] text-sm font-semibold uppercase tracking-wider">
                Our Mission
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-medium text-[#1f1f1f] font-['Fraunces']">
                Democratizing healthcare through technology
              </h2>
              <p className="mt-6 text-lg text-[#626a72] leading-relaxed">
                Our mission is to make quality healthcare accessible to every individual by leveraging 
                cutting-edge technology. We believe that by connecting patients, doctors, and researchers 
                on a single platform, we can create a more efficient healthcare system that prevents 
                diseases before they occur and treats them more effectively when they do.
              </p>
              <p className="mt-4 text-lg text-[#626a72] leading-relaxed">
                Founded in 2024, AMMA has grown from a simple idea to a comprehensive platform serving 
                thousands of patients, hundreds of doctors, and dozens of research institutions across India.
              </p>
            </div>
            <div className="bg-[#f7f9fa] rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#0070a0]">50K+</p>
                  <p className="text-sm text-[#626a72] mt-1">Registered Patients</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#0070a0]">500+</p>
                  <p className="text-sm text-[#626a72] mt-1">Verified Doctors</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#0070a0]">100+</p>
                  <p className="text-sm text-[#626a72] mt-1">Research Partners</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#0070a0]">1M+</p>
                  <p className="text-sm text-[#626a72] mt-1">Health Records</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-[#f7f9fa]">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#0070a0] text-sm font-semibold uppercase tracking-wider">
              Our Values
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-medium text-[#1f1f1f] font-['Fraunces']">
              Principles that guide us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-[#e6f7ff] rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-[#0070a0]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1f1f1f] mb-3">
                  {value.title}
                </h3>
                <p className="text-[#626a72] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#0070a0] text-sm font-semibold uppercase tracking-wider">
              Our Team
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-medium text-[#1f1f1f] font-['Fraunces']">
              Meet the people behind AMMA
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="text-center group"
              >
                <div className="w-32 h-32 bg-[#0070a0] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-semibold group-hover:scale-110 transition-transform duration-300">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-lg font-semibold text-[#1f1f1f]">{member.name}</h3>
                <p className="text-[#0070a0] text-sm font-medium">{member.role}</p>
                <p className="text-[#626a72] text-sm mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
