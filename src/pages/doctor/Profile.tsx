// AMMA Healthcare Platform - Doctor Profile Page

import { useState } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Award,
  Clock,
  Save,
  Edit2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDoctorStore, useAuthStore } from '@/store';
import { toast } from 'sonner';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DoctorProfile() {
  const { user } = useAuthStore();
  const { profile: storeProfile, setProfile: saveToStore } = useDoctorStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: storeProfile?.firstName || user?.firstName || 'Doctor',
    lastName: storeProfile?.lastName || user?.lastName || '',
    licenseNumber: storeProfile?.licenseNumber || 'PENDING-LICENSE',
    specialty: storeProfile?.specialty || 'General Physician',
    subSpecialty: storeProfile?.subSpecialty || 'Family Medicine',
    qualifications: Array.isArray(storeProfile?.qualifications) ? storeProfile.qualifications.join(', ') : 'MBBS',
    yearsOfExperience: String(storeProfile?.yearsOfExperience || '1'),
    clinicName: storeProfile?.clinicName || 'My Community Clinic',
    clinicAddress: typeof storeProfile?.clinicAddress === 'string' ? storeProfile.clinicAddress : '123 Health Ave',
    phone: storeProfile?.phone || user?.phone || '',
    email: storeProfile?.email || user?.email || '',
  });

  const handleSave = () => {
    // Persist to the doctor store
    saveToStore({
      ...storeProfile,
      id: storeProfile?.id || 'doc_profile_1',
      userId: storeProfile?.userId || 'doc_user_1',
      firstName: profile.firstName,
      lastName: profile.lastName,
      licenseNumber: profile.licenseNumber,
      specialty: profile.specialty,
      subSpecialty: profile.subSpecialty,
      qualifications: profile.qualifications.split(',').map(q => q.trim()),
      yearsOfExperience: parseInt(profile.yearsOfExperience) || 0,
      clinicName: profile.clinicName,
      clinicAddress: { street: profile.clinicAddress, city: 'New Delhi', state: 'Delhi', postalCode: '110024', country: 'India' },
      phone: profile.phone,
      email: profile.email,
      isVerified: storeProfile?.isVerified ?? true,
      verificationStatus: storeProfile?.verificationStatus || 'approved',
      appointments: storeProfile?.appointments || [],
      availability: storeProfile?.availability || [],
      rating: storeProfile?.rating || 4.8,
      reviewCount: storeProfile?.reviewCount || 120,
    } as any);
    setIsEditing(false);
    toast.success('Profile updated and saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">My Profile</h1>
          <p className="text-[#626a72]">Manage your professional information and availability</p>
        </div>
        <Button
          variant={isEditing ? 'default' : 'outline'}
          className={isEditing ? 'bg-[#0070a0] hover:bg-[#00577c]' : ''}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="w-24 h-24 bg-[#0070a0] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-semibold">
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
            <h2 className="text-xl font-semibold text-[#1f1f1f]">
              Dr. {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-[#0070a0]">{profile.specialty}</p>
            <p className="text-sm text-[#626a72] mt-1">{profile.subSpecialty}</p>

            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Award className="w-4 h-4 text-[#626a72]" />
                <span>{profile.qualifications}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-[#626a72]" />
                <span>{profile.yearsOfExperience} years experience</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="w-4 h-4 text-[#626a72]" />
                <span>{profile.clinicName}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-[#626a72]" />
                <span className="truncate">{profile.clinicAddress}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-[#626a72]" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[#626a72]" />
                <span className="truncate">{profile.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Professional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">License Number</label>
                <Input
                  value={profile.licenseNumber}
                  onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Experience</label>
                <Input
                  value={profile.yearsOfExperience}
                  onChange={(e) => setProfile({ ...profile, yearsOfExperience: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Specialty</label>
                <Input
                  value={profile.specialty}
                  onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sub-Specialty</label>
                <Input
                  value={profile.subSpecialty}
                  onChange={(e) => setProfile({ ...profile, subSpecialty: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Qualifications</label>
                <Input
                  value={profile.qualifications}
                  onChange={(e) => setProfile({ ...profile, qualifications: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Clinic/Hospital Name</label>
                <Input
                  value={profile.clinicName}
                  onChange={(e) => setProfile({ ...profile, clinicName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Clinic Address</label>
                <Input
                  value={profile.clinicAddress}
                  onChange={(e) => setProfile({ ...profile, clinicAddress: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Availability Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Availability Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="p-4 border border-[#dee5eb] rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-[#1f1f1f]">{day}</span>
                  <input
                    type="checkbox"
                    className="rounded border-[#dee5eb]"
                    defaultChecked={day !== 'Sunday'}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#626a72]" />
                    <select
                      className="text-sm border border-[#dee5eb] rounded px-2 py-1"
                      disabled={!isEditing}
                    >
                      <option>09:00 AM</option>
                      <option>10:00 AM</option>
                      <option>11:00 AM</option>
                    </select>
                    <span className="text-[#626a72]">-</span>
                    <select
                      className="text-sm border border-[#dee5eb] rounded px-2 py-1"
                      disabled={!isEditing}
                    >
                      <option>01:00 PM</option>
                      <option>02:00 PM</option>
                      <option>03:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
