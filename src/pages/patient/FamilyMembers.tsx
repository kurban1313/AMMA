// AMMA Healthcare Platform - Family Members Page

import { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Heart,
  Droplet,
  AlertCircle,
  Calendar,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePatientStore } from '@/store';
import { toast } from 'sonner';
import type { FamilyMember, Gender, BloodGroup } from '@/types';

const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const genders: Gender[] = ['male', 'female', 'other', 'prefer_not_to_say'];

export default function FamilyMembers() {
  const { familyMembers, addFamilyMember, updateFamilyMember, removeFamilyMember } = usePatientStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    relationship: '',
    dateOfBirth: '',
    gender: 'male' as Gender,
    bloodGroup: 'Unknown' as BloodGroup,
    allergies: '',
    chronicConditions: '',
  });

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.relationship) {
      toast.error('Please fill in all required fields');
      return;
    }

    const memberData: FamilyMember = {
      id: editingMember?.id || `fm_${Date.now()}`,
      patientProfileId: 'profile_patient_1',
      firstName: formData.firstName,
      lastName: formData.lastName,
      relationship: formData.relationship,
      dateOfBirth: new Date(formData.dateOfBirth),
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: formData.chronicConditions.split(',').map(s => s.trim()).filter(Boolean),
      medicalRecords: [],
      trustedDoctors: [],
      isPrimary: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (editingMember) {
      updateFamilyMember(editingMember.id, memberData);
      toast.success('Family member updated successfully');
    } else {
      addFamilyMember(memberData);
      toast.success('Family member added successfully');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      relationship: member.relationship,
      dateOfBirth: new Date(member.dateOfBirth).toISOString().split('T')[0],
      gender: member.gender,
      bloodGroup: member.bloodGroup,
      allergies: Array.isArray(member.allergies) ? member.allergies.join(', ') : '',
      chronicConditions: Array.isArray(member.chronicConditions) ? member.chronicConditions.join(', ') : '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this family member?')) {
      removeFamilyMember(id);
      toast.success('Family member removed');
    }
  };

  const resetForm = () => {
    setEditingMember(null);
    setFormData({
      firstName: '',
      lastName: '',
      relationship: '',
      dateOfBirth: '',
      gender: 'male',
      bloodGroup: 'Unknown',
      allergies: '',
      chronicConditions: '',
    });
  };

  const getAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">Family Members</h1>
          <p className="text-[#626a72]">Manage your family's health profiles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-[#0070a0] hover:bg-[#00577c]"
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMember ? 'Edit Family Member' : 'Add Family Member'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g., Sunita"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g., Verma"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Relationship *</Label>
                <Input
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  placeholder="e.g., Spouse, Son, Daughter"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    {genders.map(g => (
                      <option key={g} value={g}>{g.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Blood Group</Label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  {bloodGroups.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Allergies (comma-separated)</Label>
                <Input
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  placeholder="e.g., Penicillin, Peanuts, Dust"
                />
              </div>

              <div className="space-y-2">
                <Label>Chronic Conditions (comma-separated)</Label>
                <Input
                  value={formData.chronicConditions}
                  onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                  placeholder="e.g., Diabetes, Hypertension"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-[#0070a0] hover:bg-[#00577c]" onClick={handleSubmit}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingMember ? 'Update' : 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Members Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-[#0070a0] rounded-full flex items-center justify-center text-white text-lg font-semibold">
                    {member.firstName[0]}{member.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1f1f1f]">{member.firstName} {member.lastName}</h3>
                    <p className="text-sm text-[#626a72] capitalize">{member.relationship}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(member)}>
                    <Edit2 className="w-4 h-4 text-[#626a72]" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)}>
                    <Trash2 className="w-4 h-4 text-[#e92222]" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[#626a72]">
                  <Calendar className="w-4 h-4" />
                  <span>{getAge(member.dateOfBirth)} years old</span>
                </div>
                <div className="flex items-center gap-2 text-[#626a72]">
                  <Droplet className="w-4 h-4" />
                  <span>Blood Group: {member.bloodGroup}</span>
                </div>
                {member.allergies.length > 0 && (
                  <div className="flex items-start gap-2 text-[#e92222]">
                    <AlertCircle className="w-4 h-4 mt-0.5" />
                    <span>Allergies: {member.allergies.join(', ')}</span>
                  </div>
                )}
                {member.chronicConditions.length > 0 && (
                  <div className="flex items-start gap-2 text-[#faea73]">
                    <Heart className="w-4 h-4 mt-0.5" />
                    <span>Conditions: {member.chronicConditions.join(', ')}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Member Card */}
        <Card
          className="border-2 border-dashed border-[#dee5eb] hover:border-[#0070a0] hover:bg-[#e6f7ff] cursor-pointer transition-all"
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3">
              <Plus className="w-7 h-7 text-[#0070a0]" />
            </div>
            <p className="font-medium text-[#0070a0]">Add Family Member</p>
            <p className="text-sm text-[#626a72]">Create a new health profile</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
