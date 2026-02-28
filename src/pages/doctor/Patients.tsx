// AMMA Healthcare Platform - Doctor Patients Page

import { useState } from 'react';
import {
  Search,
  FileText,
  Calendar,
  Check,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuthStore, useLinkStore } from '@/store';
import { toast } from 'sonner';

export default function DoctorPatients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false);

  const { user } = useAuthStore();
  const { links, acceptLink, declineLink, unlink } = useLinkStore();

  const doctorId = user?.id || 'user_doctor_1';

  // Selectors
  const activePatients = links.filter(l => l.doctorId === doctorId && l.status === 'accepted');
  const pendingRequests = links.filter(l => l.doctorId === doctorId && l.status === 'pending');

  const filteredPatients = activePatients.filter(patient => {
    const nameMatch = patient.patientName?.toLowerCase().includes(searchQuery.toLowerCase());
    const idMatch = patient.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || idMatch;
  });

  const handleAcceptRequest = (linkId: string) => {
    acceptLink(linkId);
    toast.success('Patient request accepted');
  };

  const handleDeclineRequest = (linkId: string) => {
    declineLink(linkId);
    toast.error('Patient request declined');
  };

  const handleUnlinkPatient = (linkId: string) => {
    if (confirm('Are you sure you want to unlink this patient?')) {
      unlink(linkId);
      toast.success('Patient unlinked');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">My Patients</h1>
          <p className="text-[#626a72]">Manage your patient roster and access medical records</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#626a72]">{activePatients.length} active patients</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#99a4af]" />
        <Input
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#1f1f1f] mb-4">Pending Requests ({pendingRequests.length})</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="border-[#f59e0b] shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#fef3c7] text-[#f59e0b] rounded-full flex items-center justify-center font-semibold">
                      {(request.patientName || request.patientId).substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1f1f1f]">{request.patientName || 'Patient'}</h3>
                      <p className="text-xs text-[#626a72]">ID: {request.patientId}</p>
                      <p className="text-xs text-[#626a72]">Requested: {new Date(request.requestedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-[#00b67a] hover:bg-[#009b68] text-white"
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      <Check className="w-4 h-4 mr-1" /> Accept
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-[#e92222] border-[#e92222] hover:bg-[#fef2f2]"
                      onClick={() => handleDeclineRequest(request.id)}
                    >
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-[#dee5eb]" />
            <h3 className="text-lg font-medium text-[#1f1f1f] mb-2">No patients linked yet</h3>
            <p className="text-[#626a72] mb-4">
              Patients will appear here once you accept their link requests.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-[#0070a0] rounded-full flex items-center justify-center text-white text-lg font-semibold">
                    {(patient.patientName || patient.patientId).substring(0, 2).toUpperCase()}
                  </div>
                  <span className="px-2 py-1 bg-[#00b67a] text-white text-xs rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Linked
                  </span>
                </div>

                <h3 className="font-semibold text-[#1f1f1f] text-lg">{patient.patientName || 'Patient'}</h3>
                <p className="text-[#626a72] text-sm">ID: {patient.patientId}</p>
                <p className="text-[#626a72] text-sm capitalize">
                  Access: {patient.accessLevel.replace('_', ' ')}
                </p>

                <div className="mt-4 pt-4 border-t border-[#dee5eb]">
                  <div className="flex items-center justify-between text-sm text-[#626a72]">
                    <span>Linked:</span>
                    <span>{new Date(patient.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedPatient(patient);
                      setIsPatientDialogOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="w-4 h-4 mr-1" />
                    Records
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#e92222]"
                    onClick={() => handleUnlinkPatient(patient.id)}
                  >
                    Unlink
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Patient Detail Dialog */}
      <Dialog open={isPatientDialogOpen} onOpenChange={setIsPatientDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-[#0070a0] rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                  {selectedPatient.patientId.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1f1f1f]">Patient {selectedPatient.patientId}</h3>
                  <p className="text-[#626a72]">
                    Access Level: {selectedPatient.accessLevel.replace('_', ' ')}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-[#00b67a] text-white text-xs rounded-full">
                    <Check className="w-3 h-3" />
                    Account Linked
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#f7f9fa] rounded-lg">
                  <p className="text-sm text-[#626a72]">Linked Date</p>
                  <p className="text-lg font-medium text-[#1f1f1f] mt-1">{new Date(selectedPatient.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-[#0070a0] hover:bg-[#00577c]">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  View Records
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
