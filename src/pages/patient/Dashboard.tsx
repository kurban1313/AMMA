// AMMA Healthcare Platform - Patient Dashboard

import { useEffect } from 'react';
import {
  Users,
  FileText,
  Calendar,
  Brain,
  Stethoscope,
  ArrowRight,
  Bell,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore, usePatientStore } from '@/store';
import { mockAppointments } from '@/services/mockData';
import { format } from 'date-fns';

const quickActions = [
  { icon: Plus, label: 'Add Family Member', href: '/patient/family', color: 'bg-[#0070a0]' },
  { icon: FileText, label: 'Upload Records', href: '/patient/records', color: 'bg-[#00b67a]' },
  { icon: Calendar, label: 'Book Appointment', href: '/patient/appointments', color: 'bg-[#faea73]' },
  { icon: Stethoscope, label: 'Find Doctor', href: '/patient/doctors', color: 'bg-[#f7cedc]' },
];

export default function PatientDashboard() {
  const { user } = useAuthStore();
  const {
    familyMembers,
    appointments,
    predictions,
    notifications,
    addAppointment,
  } = usePatientStore();

  // Load mock data on mount
  useEffect(() => {
    // Add mock appointments
    mockAppointments.forEach(apt => {
      if (!appointments.find(a => a.id === apt.id)) {
        addAppointment(apt);
      }
    });
  }, []);

  const upcomingAppointments = appointments
    .filter(a => new Date(a.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 3);

  const unreadPredictions = predictions.filter(p => !p.isRead).slice(0, 3);
  const unreadNotifications = notifications.filter(n => !n.isRead).slice(0, 5);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-[#e92222] bg-[#fef2f2]';
      case 'high':
        return 'text-[#e92222] bg-[#fef2f2]';
      case 'medium':
        return 'text-[#faea73] bg-[#fefce8]';
      default:
        return 'text-[#00b67a] bg-[#f0fdf4]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">
            Welcome back, {user?.email?.split('@')[0]}
          </h1>
          <p className="text-[#626a72]">Here's what's happening with your family's health</p>
        </div>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#626a72]" />
          {unreadNotifications.length > 0 && (
            <span className="px-2 py-1 bg-[#e92222] text-white text-xs rounded-full">
              {unreadNotifications.length}
            </span>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link key={action.label} to={action.href}>
            <div className="bg-white rounded-xl p-4 hover:shadow-md transition-all duration-200 group">
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-5 h-5 ${action.color === 'bg-[#faea73]' ? 'text-[#1f1f1f]' : 'text-white'}`} />
              </div>
              <p className="text-sm font-medium text-[#1f1f1f]">{action.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#626a72]">Family Members</p>
                <p className="text-2xl font-semibold text-[#1f1f1f]">{familyMembers.length + 1}</p>
              </div>
              <div className="w-10 h-10 bg-[#e6f7ff] rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#0070a0]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#626a72]">Medical Records</p>
                <p className="text-2xl font-semibold text-[#1f1f1f]">12</p>
              </div>
              <div className="w-10 h-10 bg-[#f0fdf4] rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#00b67a]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#626a72]">Upcoming Appointments</p>
                <p className="text-2xl font-semibold text-[#1f1f1f]">{upcomingAppointments.length}</p>
              </div>
              <div className="w-10 h-10 bg-[#fefce8] rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#faea73]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#626a72]">Health Alerts</p>
                <p className="text-2xl font-semibold text-[#e92222]">{unreadPredictions.length}</p>
              </div>
              <div className="w-10 h-10 bg-[#fef2f2] rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#e92222]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
            <Link to="/patient/appointments">
              <Button variant="ghost" size="sm" className="text-[#0070a0]">
                View All
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 text-[#99a4af]">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No upcoming appointments</p>
                <Link to="/patient/appointments">
                  <Button variant="link" className="text-[#0070a0]">Book one now</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-4 p-3 bg-[#f7f9fa] rounded-lg"
                  >
                    <div className="w-12 h-12 bg-[#0070a0] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1f1f1f] truncate">
                        {appointment.reason || 'General Checkup'}
                      </p>
                      <p className="text-sm text-[#626a72]">
                        {format(new Date(appointment.scheduledAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${appointment.status === 'urgent'
                      ? 'bg-[#e92222] text-white'
                      : 'bg-[#e6f7ff] text-[#0070a0]'
                      }`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Predictions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Health Predictions</CardTitle>
            <Link to="/patient/predictions">
              <Button variant="ghost" size="sm" className="text-[#0070a0]">
                View All
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {unreadPredictions.length === 0 ? (
              <div className="text-center py-8 text-[#99a4af]">
                <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No new health predictions</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {unreadPredictions.map((prediction) => (
                  <div
                    key={prediction.id}
                    className="flex items-start gap-4 p-3 bg-[#f7f9fa] rounded-lg"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityColor(prediction.severity)}`}>
                      <Brain className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1f1f1f]">{prediction.predictionType}</p>
                      <p className="text-sm text-[#626a72] line-clamp-2">
                        {prediction.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${getSeverityColor(prediction.severity)}`}>
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Family Members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Family Members</CardTitle>
          <Link to="/patient/family">
            <Button variant="ghost" size="sm" className="text-[#0070a0]">
              Manage
              <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {/* Primary User */}
            <div className="flex items-center gap-3 p-4 bg-[#e6f7ff] rounded-xl">
              <div className="w-12 h-12 bg-[#0070a0] rounded-full flex items-center justify-center text-white font-semibold">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-[#1f1f1f]">You</p>
                <p className="text-sm text-[#626a72]">Primary Account</p>
              </div>
            </div>

            {/* Family Members */}
            {familyMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-4 bg-[#f7f9fa] rounded-xl">
                <div className="w-12 h-12 bg-[#cce5f3] rounded-full flex items-center justify-center text-[#0070a0] font-semibold">
                  {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-[#1f1f1f]">{member.firstName} {member.lastName}</p>
                  <p className="text-sm text-[#626a72] capitalize">{member.relationship}</p>
                </div>
              </div>
            ))}

            {/* Add Member Button */}
            <Link to="/patient/family">
              <div className="flex items-center gap-3 p-4 border-2 border-dashed border-[#dee5eb] rounded-xl hover:border-[#0070a0] hover:bg-[#e6f7ff] transition-all cursor-pointer">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6 text-[#0070a0]" />
                </div>
                <div>
                  <p className="font-medium text-[#0070a0]">Add Member</p>
                  <p className="text-sm text-[#626a72]">Add family member</p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
