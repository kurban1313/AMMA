// AMMA Healthcare Platform - Login Page

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Heart, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';
import type { UserRole } from '@/types';

const roles: { value: UserRole; label: string }[] = [
  { value: 'patient', label: 'Patient' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'researcher', label: 'Researcher' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await login(formData.email, formData.password, selectedRole);
      toast.success('Login successful!');
      
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
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf0f9] via-[#f0f7fc] to-[#cce5f3] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
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
          <p className="mt-2 text-[#626a72]">Welcome back! Please sign in to continue.</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your account type and enter your credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                {roles.map((role) => (
                  <TabsTrigger key={role.value} value={role.value}>
                    {role.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {roles.map((role) => (
                <TabsContent key={role.value} value={role.value}>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
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
                      <Label htmlFor="password">Password</Label>
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
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-[#626a72]">
                        <input type="checkbox" className="rounded border-[#dee5eb]" />
                        Remember me
                      </label>
                      <Link to="#" className="text-sm text-[#0070a0] hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#0070a0] hover:bg-[#00577c] text-white py-6"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#626a72]">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#0070a0] hover:underline font-medium">
                  Create one
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-[#f7f9fa] rounded-lg">
              <p className="text-xs font-semibold text-[#626a72] mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-[#99a4af]">
                <p>Patient: patient@amma.com / any password</p>
                <p>Doctor: doctor@amma.com / any password</p>
                <p>Researcher: researcher@amma.com / any password</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
