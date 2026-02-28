// AMMA Healthcare Platform - Trusted Doctors Page

import React, { useState } from 'react';
import {
  Building2,
  Phone,
  Mail,
  Plus,
  Search,
  Check,
  Link as LinkIcon,
  Calendar,
  Stethoscope,
  Clock,
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
import { useAuthStore, usePatientStore, useAIStore, useLinkStore } from '@/store';
import { toast } from 'sonner';
import type { TrustedDoctor } from '@/types';

export default function TrustedDoctors() {
  const { trustedDoctors, addTrustedDoctor, updateTrustedDoctor, removeTrustedDoctor } = usePatientStore();
  const { matchDoctorByName, matchingResults } = useAIStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMatchingDialogOpen, setIsMatchingDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);
  const [doctorCode, setDoctorCode] = useState('');
  const { matchDoctorByCode } = useAIStore();
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    clinic: '',
    phone: '',
    email: '',
  });

  const { user } = useAuthStore();
  const { profile } = usePatientStore();
  const patientId = profile?.id || user?.id || 'user_patient_1';
  const { links, createLinkRequest, unlink } = useLinkStore();

  // Find if a linked doctor exists
  const getDoctorLink = (doc: TrustedDoctor) => {
    // Direct match if we have the ID
    if (doc.doctorId) {
      return links.find(l => l.patientId === patientId && l.doctorId === doc.doctorId);
    }

    // Fallback: look for any link matching this doctor's name
    return links.find(l => l.patientId === patientId && l.doctorName?.toLowerCase() === doc.name.toLowerCase());
  };

  const filteredDoctors = trustedDoctors.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDoctor = () => {
    if (!formData.name) {
      toast.error('Please enter doctor name');
      return;
    }

    // Check for duplicates
    const exists = trustedDoctors.find(
      d => d.name.toLowerCase() === formData.name.toLowerCase()
    );
    if (exists) {
      toast.error('This doctor has already been added to your trusted list');
      return;
    }

    const createdId = `td_${Date.now()}`;
    const newDoctor = {
      id: createdId,
      name: formData.name,
      specialty: formData.specialty,
      clinic: formData.clinic,
      phone: formData.phone,
      email: formData.email,
    };

    addTrustedDoctor(newDoctor);
    toast.success('Doctor added to your trusted list');
    setIsDialogOpen(false);
    setFormData({ name: '', specialty: '', clinic: '', phone: '', email: '' });

    // Trigger AI matching for this specific entry
    handleMatchDoctor(newDoctor.id, newDoctor.name);
  };

  const handleMatchDoctor = async (trustedId: string, name: string) => {
    const results = await matchDoctorByName(name);
    if (results.length > 0) {
      setSelectedDoctor({ trustedId, name, matches: results });
      setIsMatchingDialogOpen(true);
    } else {
      toast.error('No registered doctors found with that name.');
    }
  };

  const handleCreateLinkRequest = (doctorId: string) => {
    const patientName = profile
      ? `${profile.firstName} ${profile.lastName}`
      : (user ? `${user.firstName} ${user.lastName}` : 'Unknown Patient');
    const match = matchingResults.doctors.find(d => d.id === doctorId);
    const doctorName = match?.name || selectedDoctor?.name || 'Unknown Doctor';

    // 1. Associate the platform ID with our trusted doctor entry permanently
    if (selectedDoctor?.trustedId) {
      updateTrustedDoctor(selectedDoctor.trustedId, { doctorId });
    }

    // 2. Create the platform link request
    createLinkRequest(patientId, doctorId, patientName, doctorName);

    toast.success('Link request sent securely to doctor');
    setIsMatchingDialogOpen(false);
  };

  const handleLinkByCode = async () => {
    if (doctorCode.length !== 4) {
      toast.error('Please enter a valid 4-digit code');
      return;
    }

    const results = await matchDoctorByCode(doctorCode);
    if (results.length > 0) {
      const match = results[0];
      const patientName = profile
        ? `${profile.firstName} ${profile.lastName}`
        : (user ? `${user.firstName} ${user.lastName}` : 'Unknown Patient');

      // Auto-add to trusted list if not there
      const existing = trustedDoctors.find(d => d.doctorId === match.id);
      if (!existing) {
        addTrustedDoctor({
          id: `td_${Date.now()}`,
          name: match.name,
          specialty: 'Verified Platform Doctor',
          doctorId: match.id
        });
      }

      createLinkRequest(patientId, match.id, patientName, match.name);
      toast.success(`Success! Request sent to ${match.name}`);
      setIsCodeDialogOpen(false);
      setDoctorCode('');
    } else {
      toast.error('No doctor found with this code. Please verify and try again.');
    }
  };

  const handleRemoveDoctor = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from your trusted doctors?`)) {
      removeTrustedDoctor(id);
      toast.success(`${name} removed from trusted doctors`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">Trusted Doctors</h1>
          <p className="text-[#626a72]">Manage your healthcare providers and connections</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCodeDialogOpen} onOpenChange={setIsCodeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-[#0070a0] text-[#0070a0] hover:bg-[#e6f7ff]">
                <LinkIcon className="w-4 h-4 mr-2" />
                Link via Code
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Link to Specialized Doctor</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pt-4 text-center">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-[#0070a0]/10 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-8 h-8 text-[#0070a0]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#1f1f1f]">Enter 4-Digit Code</h3>
                  <p className="text-sm text-[#626a72]">Enter the unique code provided by your doctor to establish a secure link.</p>
                </div>
                <div className="flex justify-center">
                  <Input
                    value={doctorCode}
                    onChange={(e) => setDoctorCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="e.g. 1234"
                    className="w-40 text-center text-2xl tracking-[1em] font-bold h-14 border-2 border-[#dee5eb] focus:border-[#0070a0]"
                  />
                </div>
                <Button onClick={handleLinkByCode} className="w-full bg-[#0070a0] h-12 text-lg">
                  Verify & Link
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0070a0] hover:bg-[#00577c]">
                <Plus className="w-4 h-4 mr-2" />
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Trusted Doctor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Doctor Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Dr. Priya Sharma"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Specialty</Label>
                  <Input
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="e.g., Cardiologist"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Clinic/Hospital</Label>
                  <Input
                    value={formData.clinic}
                    onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                    placeholder="e.g., Apollo Hospital"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="doctor@example.com"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-[#0070a0] hover:bg-[#00577c]" onClick={handleAddDoctor}>
                    Add Doctor
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#99a4af]" />
        <Input
          placeholder="Search doctors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Stethoscope className="w-16 h-16 mx-auto mb-4 text-[#dee5eb]" />
            <h3 className="text-lg font-medium text-[#1f1f1f] mb-2">No doctors added yet</h3>
            <p className="text-[#626a72] mb-4">
              Add your trusted healthcare providers to manage appointments and share records.
            </p>
            <Button
              className="bg-[#0070a0] hover:bg-[#00577c]"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Doctor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-[#0070a0] rounded-full flex items-center justify-center text-white text-xl font-semibold">
                    {doctor.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>

                  {(() => {
                    const link = getDoctorLink(doctor);
                    if (link?.status === 'pending') {
                      return (
                        <span className="px-2 py-1 bg-[#f59e0b] text-white text-xs rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      );
                    }
                    if (link?.status === 'accepted') {
                      return (
                        <span className="px-2 py-1 bg-[#00b67a] text-white text-xs rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Linked
                        </span>
                      );
                    }
                    if (link?.status === 'declined') {
                      return (
                        <span className="px-2 py-1 bg-[#e92222] text-white text-xs rounded-full flex items-center gap-1">
                          Declined
                        </span>
                      );
                    }
                    return (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMatchDoctor(doctor.id, doctor.name)}
                      >
                        <LinkIcon className="w-3 h-3 mr-1" />
                        Link
                      </Button>
                    );
                  })()}
                </div>

                <h3 className="font-semibold text-[#1f1f1f] text-lg">{doctor.name}</h3>
                {doctor.specialty && (
                  <p className="text-[#0070a0] text-sm">{doctor.specialty}</p>
                )}

                <div className="mt-4 space-y-2 text-sm">
                  {doctor.clinic && (
                    <div className="flex items-center gap-2 text-[#626a72]">
                      <Building2 className="w-4 h-4" />
                      <span>{doctor.clinic}</span>
                    </div>
                  )}
                  {doctor.phone && (
                    <div className="flex items-center gap-2 text-[#626a72]">
                      <Phone className="w-4 h-4" />
                      <span>{doctor.phone}</span>
                    </div>
                  )}
                  {doctor.email && (
                    <div className="flex items-center gap-2 text-[#626a72]">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{doctor.email}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-[#dee5eb] flex gap-2">
                  {(() => {
                    const link = getDoctorLink(doctor);
                    if (link?.status === 'accepted') {
                      return (
                        <>
                          <Button variant="outline" className="flex-1" size="sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Appointment
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#e92222]"
                            onClick={() => unlink(link.id)}
                          >
                            Unlink
                          </Button>
                        </>
                      );
                    }
                    return (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1"
                          size="sm"
                          onClick={() => handleMatchDoctor(doctor.id, doctor.name)}
                          disabled={link?.status === 'pending'}
                        >
                          <LinkIcon className="w-4 h-4 mr-2" />
                          {link?.status === 'declined' ? 'Re-send Request' : 'Find Registered Doctor'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#e92222]"
                          onClick={() => handleRemoveDoctor(doctor.id, doctor.name)}
                        >
                          Remove
                        </Button>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* AI Matching Results Dialog */}
      <Dialog open={isMatchingDialogOpen} onOpenChange={setIsMatchingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registered Platform Doctors</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-[#626a72]">
              We found potential matches for <strong>{selectedDoctor?.name}</strong> in our system.
              Select the correct doctor to link accounts.
            </p>

            <div className="space-y-2">
              {matchingResults.doctors.map((match) => (
                <div
                  key={match.id}
                  className="p-4 border border-[#dee5eb] rounded-lg hover:border-[#0070a0] hover:bg-[#e6f7ff] cursor-pointer transition-all"
                  onClick={() => handleCreateLinkRequest(match.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#1f1f1f]">{match.name}</p>
                      <p className="text-sm text-[#0070a0]">Verified Provider</p>
                    </div>
                    <Button size="sm" className="bg-[#0070a0]">Link Now</Button>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full" onClick={() => setIsMatchingDialogOpen(false)}>
              Skip for Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper components
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-sm font-medium text-[#1f1f1f] block mb-1">
      {children}
    </label>
  );
}
