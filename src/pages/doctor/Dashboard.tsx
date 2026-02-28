// AMMA Healthcare Platform - Doctor Dashboard

import { useEffect } from 'react';
import {
  Users,
  Calendar,
  Brain,
  TrendingUp,
  AlertCircle,
  Check,
  ArrowRight,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore, useDoctorStore, useLinkStore } from '@/store';
import { mockAppointments, mockHealthPredictions } from '@/services/mockData';
import { format } from 'date-fns';

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const { appointments, addAppointment, profile } = useDoctorStore();
  const { links } = useLinkStore();
  const doctorId = user?.id || 'user_doctor_1';
  const activePatients = links.filter(l => l.doctorId === doctorId && l.status === 'accepted');
  const patientsLength = activePatients.length;

  // Load mock data
  useEffect(() => {
    mockAppointments.forEach(apt => {
      if (!appointments.find(a => a.id === apt.id)) {
        addAppointment(apt);
      }
    });
  }, []);

  const todayAppointments = appointments
    .filter(a => {
      const aptDate = new Date(a.scheduledAt);
      const today = new Date();
      return aptDate.toDateString() === today.toDateString() && a.status !== 'cancelled';
    })
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const urgentAppointments = appointments.filter(a => a.status === 'urgent');

  const getPriorityColor = (score?: number) => {
    if (!score) return 'bg-[#dee5eb]';
    if (score >= 8) return 'bg-[#e92222]';
    if (score >= 5) return 'bg-[#faea73]';
    return 'bg-[#00b67a]';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">
            Welcome, Dr. {user?.firstName || user?.email?.split('@')[0]} {user?.lastName || ''}
          </h1>
          <p className="text-[#626a72]">Here's your schedule and patient updates for today</p>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-[#faea73] fill-[#faea73]" />
          <span className="font-medium">{profile?.rating || 4.8}</span>
          <span className="text-[#626a72]">({profile?.reviewCount || 127} reviews)</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#626a72]">Today's Appointments</p>
                <p className="text-2xl font-semibold text-[#1f1f1f]">{todayAppointments.length}</p>
              </div>
              <div className="w-10 h-10 bg-[#e6f7ff] rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#0070a0]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#626a72]">Total Patients</p>
                <p className="text-2xl font-semibold text-[#1f1f1f]">{patientsLength}</p>
              </div>
              <div className="w-10 h-10 bg-[#f0fdf4] rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#00b67a]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0070a0] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Invitation Code</p>
                <p className="text-2xl font-bold tracking-widest">{user?.doctorCode || '----'}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#626a72]">Urgent Cases</p>
                <p className="text-2xl font-semibold text-[#e92222]">{urgentAppointments.length}</p>
              </div>
              <div className="w-10 h-10 bg-[#fef2f2] rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[#e92222]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
            <Link to="/doctor/appointments">
              <Button variant="ghost" size="sm" className="text-[#0070a0]">
                View All
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-[#99a4af]">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No appointments scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-4 p-3 bg-[#f7f9fa] rounded-lg"
                  >
                    <div className="text-center w-14 flex-shrink-0">
                      <p className="text-lg font-semibold text-[#0070a0]">
                        {format(new Date(apt.scheduledAt), 'h:mm')}
                      </p>
                      <p className="text-xs text-[#626a72]">
                        {format(new Date(apt.scheduledAt), 'a')}
                      </p>
                    </div>
                    <div className="w-px h-10 bg-[#dee5eb]" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1f1f1f]">
                        {apt.reason || 'General Checkup'}
                      </p>
                      <p className="text-sm text-[#626a72]">
                        Patient ID: {apt.patientId}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getPriorityColor(apt.aiPriorityScore)}`}
                        title={`Priority Score: ${apt.aiPriorityScore || 'N/A'}`}
                      />
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${apt.status === 'urgent'
                        ? 'bg-[#e92222] text-white'
                        : 'bg-[#e6f7ff] text-[#0070a0]'
                        }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Predictions Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">AI Health Alerts</CardTitle>
            <Brain className="w-5 h-5 text-[#0070a0]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockHealthPredictions.slice(0, 3).map((prediction) => (
                <div
                  key={prediction.id}
                  className="flex items-start gap-3 p-3 bg-[#f7f9fa] rounded-lg"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${prediction.severity === 'high'
                    ? 'bg-[#fef2f2] text-[#e92222]'
                    : 'bg-[#fefce8] text-[#faea73]'
                    }`}>
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1f1f1f]">{prediction.predictionType}</p>
                    <p className="text-sm text-[#626a72] line-clamp-2">
                      {prediction.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${prediction.severity === 'high'
                        ? 'bg-[#fef2f2] text-[#e92222]'
                        : 'bg-[#fefce8] text-[#faea73]'
                        }`}>
                        {prediction.severity}
                      </span>
                      <span className="text-xs text-[#99a4af]">
                        {Math.round(prediction.confidenceScore * 100)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Link to="/doctor/patients">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                View Patients
              </Button>
            </Link>
            <Link to="/doctor/appointments">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Manage Schedule
              </Button>
            </Link>
            <Link to="/doctor/records">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Upload Records
              </Button>
            </Link>
            <Link to="/doctor/profile">
              <Button variant="outline" className="w-full justify-start">
                <Check className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
