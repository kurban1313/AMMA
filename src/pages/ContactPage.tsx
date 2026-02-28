// AMMA Healthcare Platform - Contact Page

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    details: ['support@amma.health', 'sales@amma.health'],
  },
  {
    icon: Phone,
    title: 'Phone',
    details: ['+91 1800-AMMA-HELP', '+91 98765-43210'],
  },
  {
    icon: MapPin,
    title: 'Office',
    details: ['123 Healthcare Tower', 'New Delhi, India 110001'],
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="pt-[75px]">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#ebf0f9] via-[#f0f7fc] to-[#cce5f3]">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#0070a0] text-sm font-semibold uppercase tracking-wider">
            Contact Us
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[58px] font-medium text-[#1f1f1f] font-['Fraunces'] leading-tight">
            Get in touch with us
          </h1>
          <p className="mt-6 text-lg text-[#626a72] max-w-2xl mx-auto">
            Have questions about AMMA? We are here to help. Reach out to our team 
            for support, sales inquiries, or partnership opportunities.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              {contactInfo.map((info) => (
                <div key={info.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#e6f7ff] rounded-lg flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-[#0070a0]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1f1f1f]">{info.title}</h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-[#626a72]">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Map Placeholder */}
              <div className="bg-[#f7f9fa] rounded-xl h-48 flex items-center justify-center">
                <div className="text-center text-[#99a4af]">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p>Interactive Map</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-[#f7f9fa] rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-[#1f1f1f] mb-6">
                  Send us a message
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white border-[#dee5eb]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white border-[#dee5eb]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-white border-[#dee5eb]"
                    required
                  />
                </div>

                <div className="space-y-2 mb-6">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-white border-[#dee5eb] min-h-[150px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-[#0070a0] hover:bg-[#00577c] text-white px-8 py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
