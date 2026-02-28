// AMMA Healthcare Platform - Doctor Appointments Page

import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDoctorStore, usePatientStore } from '@/store';
import { toast } from 'sonner';
import { format } from 'date-fns';

const appointmentTypes = [
  { value: 'all', label: 'All' },
  { value: 'in_person', label: 'In-Person' },
  { value: 'video', label: 'Video' },
  { value: 'phone', label: 'Phone' },
];

export default function DoctorAppointments() {
  const { appointments, updateAppointment } = useDoctorStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.reason?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || apt.type === selectedType;
    return matchesSearch && matchesType;
  });

  const upcomingAppointments = filteredAppointments
    .filter(a => new Date(a.scheduledAt) > new Date() && a.status !== 'cancelled')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const pendingAppointments = filteredAppointments.filter(a => a.status === 'pending');
  const completedAppointments = filteredAppointments.filter(a => a.status === 'completed');
  const cancelledAppointments = filteredAppointments.filter(a => a.status === 'cancelled');

  const handleConfirm = (id: string) => {
    updateAppointment(id, { status: 'confirmed' });
    usePatientStore.getState().updateAppointment(id, { status: 'confirmed' });
    toast.success('Appointment confirmed');
  };

  const handleCancel = (id: string) => {
    updateAppointment(id, { status: 'cancelled' });
    usePatientStore.getState().updateAppointment(id, { status: 'cancelled' });
    toast.success('Appointment cancelled');
  };

  const handleComplete = (id: string) => {
    updateAppointment(id, { status: 'completed' });
    usePatientStore.getState().updateAppointment(id, { status: 'completed' });
    toast.success('Appointment marked as completed');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (score?: number) => {
    if (!score) return 'bg-[#dee5eb]';
    if (score >= 8) return 'bg-[#e92222]';
    if (score >= 5) return 'bg-[#faea73]';
    return 'bg-[#00b67a]';
  };

  const AppointmentCard = ({ apt }: { apt: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center w-16 flex-shrink-0">
              <p className="text-lg font-semibold text-[#0070a0]">
                {format(new Date(apt.scheduledAt), 'MMM d')}
              </p>
              <p className="text-sm text-[#626a72]">
                {format(new Date(apt.scheduledAt), 'h:mm a')}
              </p>
            </div>
            <div className="w-px h-12 bg-[#dee5eb]" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-[#1f1f1f]">
                  {apt.reason || 'General Checkup'}
                </h4>
                <div
                  className={`w-2 h-2 rounded-full ${getPriorityColor(apt.aiPriorityScore)}`}
                  title={`AI Priority Score: ${apt.aiPriorityScore || 'N/A'}`}
                />
              </div>
              <p className="text-sm text-[#626a72]">
                Patient: {apt.patientId}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-[#99a4af]">
                <span className="flex items-center gap-1">
                  {getTypeIcon(apt.type)}
                  {apt.type.replace('_', ' ')}
                </span>
                <span>{apt.duration} min</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {apt.status === 'pending' && (
              <>
                <Button size="sm" className="bg-[#00b67a] hover:bg-[#00a067]" onClick={() => handleConfirm(apt.id)}>
                  <Check className="w-4 h-4 mr-1" />
                  Confirm
                </Button>
                <Button size="sm" variant="ghost" className="text-[#e92222]" onClick={() => handleCancel(apt.id)}>
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}
            {apt.status === 'confirmed' && (
              <>
                <Button size="sm" variant="outline" onClick={() => handleComplete(apt.id)}>
                  <Check className="w-4 h-4 mr-1" />
                  Complete
                </Button>
                <span className="px-2 py-1 bg-[#e6f7ff] text-[#0070a0] text-xs rounded-full">
                  Confirmed
                </span>
              </>
            )}
            {apt.status === 'urgent' && (
              <span className="px-2 py-1 bg-[#e92222] text-white text-xs rounded-full">
                Urgent
              </span>
            )}
            {apt.status === 'completed' && (
              <span className="px-2 py-1 bg-[#00b67a] text-white text-xs rounded-full">
                Completed
              </span>
            )}
            {apt.status === 'cancelled' && (
              <span className="px-2 py-1 bg-[#dee5eb] text-[#626a72] text-xs rounded-full">
                Cancelled
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">Appointments</h1>
          <p className="text-[#626a72]">Manage your schedule and patient appointments</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Input
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background"
        >
          {appointmentTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-12 text-[#99a4af]">
              <Calendar className="w-12 h-12 mx-auto mb-4" />
              <p>No upcoming appointments</p>
            </div>
          ) : (
            upcomingAppointments.map(apt => <AppointmentCard key={apt.id} apt={apt} />)
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-3">
          {pendingAppointments.length === 0 ? (
            <div className="text-center py-12 text-[#99a4af]">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <p>No pending appointments</p>
            </div>
          ) : (
            pendingAppointments.map(apt => <AppointmentCard key={apt.id} apt={apt} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {completedAppointments.length === 0 ? (
            <div className="text-center py-12 text-[#99a4af]">
              <Check className="w-12 h-12 mx-auto mb-4" />
              <p>No completed appointments</p>
            </div>
          ) : (
            completedAppointments.map(apt => <AppointmentCard key={apt.id} apt={apt} />)
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-3">
          {cancelledAppointments.length === 0 ? (
            <div className="text-center py-12 text-[#99a4af]">
              <X className="w-12 h-12 mx-auto mb-4" />
              <p>No cancelled appointments</p>
            </div>
          ) : (
            cancelledAppointments.map(apt => <AppointmentCard key={apt.id} apt={apt} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
