// AMMA Healthcare Platform - Register Page

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Heart, ArrowRight, Loader2, Check, User, Stethoscope, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuthStore } from '@/store';
import { toast } from 'sonner';
import type { UserRole } from '@/types';

const roles: { value: UserRole; label: string; icon: typeof User; description: string }[] = [
  { 
    value: 'patient', 
    label: 'Patient', 
    icon: User,
    description: 'Manage your family health records and connect with doctors'
  },
  { 
    value: 'doctor', 
    label: 'Doctor', 
    icon: Stethoscope,
    description: 'Manage patients, appointments, and access AI predictions'
  },
  { 
    value: 'researcher', 
    label: 'Researcher', 
    icon: Database,
    description: 'Access anonymized data and generate insights'
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast.error('Please fill in all required fields');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!formData.password || !formData.confirmPassword) {
        toast.error('Please enter your password');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (!formData.agreeTerms) {
        toast.error('Please agree to the terms and conditions');
        return;
      }

      try {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: selectedRole,
          phone: formData.phone,
        });
        toast.success('Registration successful!');
        
        // Redirect based on role
        switch (selectedRole) {
          case 'patient':
            navigate('/dashboard');
            break;
          case 'doctor':
            navigate('/doctor/dashboard');
            break;
          case 'researcher':
            navigate('/researcher/dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      } catch (error) {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf0f9] via-[#f0f7fc] to-[#cce5f3] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 bg-[#0070a0] rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-2xl font-semibold text-[#1f1f1f] font-['Fraunces']">
              AMMA
            </span>
          </Link>
          <p className="mt-2 text-[#626a72]">Create your account to get started</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Step {step} of 2: {step === 1 ? 'Personal Information' : 'Security'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-[#0070a0]' : 'bg-[#dee5eb]'}`} />
              <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-[#0070a0]' : 'bg-[#dee5eb]'}`} />
            </div>

            {step === 1 && (
              <>
                {/* Role Selection */}
                <div className="mb-6">
                  <Label className="mb-2 block">I am a:</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {roles.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setSelectedRole(role.value)}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          selectedRole === role.value
                            ? 'border-[#0070a0] bg-[#e6f7ff]'
                            : 'border-[#dee5eb] hover:border-[#0070a0]/50'
                        }`}
                      >
                        <role.icon className={`w-6 h-6 mx-auto mb-1 ${
                          selectedRole === role.value ? 'text-[#0070a0]' : 'text-[#626a72]'
                        }`} />
                        <span className={`text-xs font-medium ${
                          selectedRole === role.value ? 'text-[#0070a0]' : 'text-[#626a72]'
                        }`}>
                          {role.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-[#99a4af]">
                    {roles.find(r => r.value === selectedRole)?.description}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="bg-[#f7f9fa] border-[#dee5eb] focus:border-[#0070a0] focus:ring-[#0070a0]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="bg-[#f7f9fa] border-[#dee5eb] focus:border-[#0070a0] focus:ring-[#0070a0]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-[#f7f9fa] border-[#dee5eb] focus:border-[#0070a0] focus:ring-[#0070a0]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-[#f7f9fa] border-[#dee5eb] focus:border-[#0070a0] focus:ring-[#0070a0]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#0070a0] hover:bg-[#00577c] text-white py-6"
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="bg-[#f7f9fa] border-[#dee5eb] focus:border-[#0070a0] focus:ring-[#0070a0] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#99a4af] hover:text-[#626a72]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="space-y-1 text-xs text-[#99a4af]">
                    <p className="flex items-center gap-1">
                      <Check className="w-3 h-3" /> At least 8 characters
                    </p>
                    <p className="flex items-center gap-1">
                      <Check className="w-3 h-3" /> One uppercase letter
                    </p>
                    <p className="flex items-center gap-1">
                      <Check className="w-3 h-3" /> One number
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="bg-[#f7f9fa] border-[#dee5eb] focus:border-[#0070a0] focus:ring-[#0070a0]"
                  />
                </div>

                <label className="flex items-start gap-2 text-sm text-[#626a72]">
                  <input 
                    type="checkbox" 
                    className="rounded border-[#dee5eb] mt-0.5"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  />
                  <span>
                    I agree to the{' '}
                    <Link to="#" className="text-[#0070a0] hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="#" className="text-[#0070a0] hover:underline">Privacy Policy</Link>
                  </span>
                </label>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#0070a0] hover:bg-[#00577c] text-white py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-[#626a72]">
                Already have an account?{' '}
                <Link to="/login" className="text-[#0070a0] hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
