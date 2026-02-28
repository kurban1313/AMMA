// AMMA Healthcare Platform - Appointments Page

import { useState } from 'react';
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  Video,
  Phone,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePatientStore, useDoctorStore } from '@/store';
import { toast } from 'sonner';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';

const appointmentTypes = [
  { value: 'in_person', label: 'In-Person', icon: MapPin },
  { value: 'video', label: 'Video Call', icon: Video },
  { value: 'phone', label: 'Phone', icon: Phone },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

export default function Appointments() {
  const { familyMembers, appointments, addAppointment, updateAppointment } = usePatientStore();
  const { addAppointment: addDoctorAppointment } = useDoctorStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState('doc_1');
  const [selectedType, setSelectedType] = useState('in_person');
  const [reason, setReason] = useState('');

  const upcomingAppointments = appointments
    .filter(a => new Date(a.scheduledAt) > new Date() && a.status !== 'completed' && a.status !== 'cancelled')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const pastAppointments = appointments
    .filter(a => new Date(a.scheduledAt) <= new Date() || a.status === 'completed' || a.status === 'cancelled')
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`);
    const newAppointment = {
      id: `apt_${Date.now()}`,
      patientId: 'profile_patient_1',
      doctorId: selectedDoctor,
      scheduledAt,
      duration: 30,
      type: selectedType as 'in_person' | 'video' | 'phone',
      status: 'pending' as const,
      reason: reason || 'General Checkup',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to both patient and doctor stores so it's visible on both sides
    addAppointment(newAppointment);
    addDoctorAppointment(newAppointment);

    toast.success('Appointment booked successfully!');
    setIsDialogOpen(false);
    setSelectedDate('');
    setSelectedTime('');
    setReason('');
  };

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      updateAppointment(id, { status: 'cancelled' });
      toast.success('Appointment cancelled');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-[#00b67a] text-white';
      case 'pending':
        return 'bg-[#faea73] text-[#1f1f1f]';
      case 'urgent':
        return 'bg-[#e92222] text-white';
      case 'cancelled':
        return 'bg-[#dee5eb] text-[#626a72]';
      default:
        return 'bg-[#e6f7ff] text-[#0070a0]';
    }
  };

  const getTypeIcon = (type: string) => {
    const aptType = appointmentTypes.find(at => at.value === type);
    const Icon = aptType?.icon || MapPin;
    return <Icon className="w-4 h-4" />;
  };

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">Appointments</h1>
          <p className="text-[#626a72]">Book and manage your healthcare appointments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0070a0] hover:bg-[#00577c]">
              <Plus className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              {/* Doctor Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Doctor</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'doc_1', name: 'Dr. Priya Sharma', specialty: 'General Physician' },
                    { id: 'doc_2', name: 'Dr. Anand Kumar', specialty: 'Cardiologist' },
                  ].map(doc => (
                    <div
                      key={doc.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedDoctor === doc.id
                        ? 'border-[#0070a0] bg-[#e6f7ff]'
                        : 'border-[#dee5eb] hover:border-[#0070a0]'
                        }`}
                      onClick={() => setSelectedDoctor(doc.id)}
                    >
                      <p className="font-medium text-[#1f1f1f]">{doc.name}</p>
                      <p className="text-sm text-[#626a72]">{doc.specialty}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Family Member */}
              <div className="space-y-2">
                <label className="text-sm font-medium">For Family Member</label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                  <option value="">You</option>
                  {familyMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName} ({member.relationship})
                    </option>
                  ))}
                </select>
              </div>

              {/* Appointment Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Appointment Type</label>
                <div className="flex gap-3">
                  {appointmentTypes.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${selectedType === type.value
                        ? 'border-[#0070a0] bg-[#e6f7ff] text-[#0070a0]'
                        : 'border-[#dee5eb] hover:border-[#0070a0] hover:bg-[#e6f7ff]'
                        }`}
                      onClick={() => setSelectedType(type.value)}
                    >
                      <type.icon className="w-4 h-4" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Date</label>
                <div className="flex items-center gap-2 mb-3">
                  <Button variant="ghost" size="icon" onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    {format(weekStart, 'MMMM yyyy')}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(format(day, 'yyyy-MM-dd'))}
                      className={`p-2 text-center rounded-lg border transition-all ${selectedDate === format(day, 'yyyy-MM-dd')
                        ? 'bg-[#0070a0] text-white border-[#0070a0]'
                        : 'border-[#dee5eb] hover:border-[#0070a0]'
                        }`}
                    >
                      <p className="text-xs">{format(day, 'EEE')}</p>
                      <p className="text-lg font-semibold">{format(day, 'd')}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Time</label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 text-center rounded-lg border transition-all ${selectedTime === time
                          ? 'bg-[#0070a0] text-white border-[#0070a0]'
                          : 'border-[#dee5eb] hover:border-[#0070a0]'
                          }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reason */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for Visit</label>
                <Input placeholder="e.g., Annual checkup, Follow-up..." value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-[#0070a0] hover:bg-[#00577c]" onClick={handleBookAppointment}>
                  Book Appointment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-lg font-semibold text-[#1f1f1f] mb-4">Upcoming Appointments</h2>
        {upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-[#dee5eb]" />
              <p className="text-[#626a72]">No upcoming appointments</p>
              <Button
                variant="link"
                className="text-[#0070a0]"
                onClick={() => setIsDialogOpen(true)}
              >
                Book your first appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((apt) => (
              <Card key={apt.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#e6f7ff] rounded-lg flex items-center justify-center">
                        <Calendar className="w-7 h-7 text-[#0070a0]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-[#1f1f1f]">
                            {apt.reason || 'General Checkup'}
                          </h4>
                          <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${getStatusColor(apt.status)}`}>
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-sm text-[#626a72]">
                          with Dr. Priya Sharma
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-[#99a4af]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(apt.scheduledAt), 'MMM d, yyyy h:mm a')}
                          </span>
                          <span className="flex items-center gap-1">
                            {getTypeIcon(apt.type)}
                            {apt.type.replace('_', ' ')}
                          </span>
                          <span>{apt.duration} min</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {apt.status !== 'cancelled' && (
                        <>
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#e92222]"
                            onClick={() => handleCancel(apt.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#1f1f1f] mb-4">Past Appointments</h2>
          <div className="space-y-3">
            {pastAppointments.slice(0, 3).map((apt) => (
              <Card key={apt.id} className="opacity-70">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#dee5eb] rounded-lg flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#626a72]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#1f1f1f]">
                        {apt.reason || 'General Checkup'}
                      </h4>
                      <p className="text-sm text-[#626a72]">
                        {format(new Date(apt.scheduledAt), 'MMM d, yyyy')} • <span className="capitalize">{apt.status}</span>
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
