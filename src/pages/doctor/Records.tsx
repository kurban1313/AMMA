// AMMA Healthcare Platform - Doctor Records Page

import { useState } from 'react';
import {
  FileText,
  Search,
  FileImage,
  FileSpreadsheet,
  File,
  Download,
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
import { usePatientStore } from '@/store';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { DocumentType, MedicalRecord } from '@/types';

const documentTypes = [
  { value: 'prescription', label: 'Prescription', icon: FileText },
  { value: 'lab_report', label: 'Lab Report', icon: FileSpreadsheet },
  { value: 'doctor_note', label: 'Doctor Note', icon: FileText },
  { value: 'imaging', label: 'Imaging', icon: FileImage },
];

export default function DoctorRecords() {
  // Pull real records from the patient store instead of using mock data
  const patientRecords = usePatientStore(state => state.medicalRecords);
  const familyMembers = usePatientStore(state => state.familyMembers);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentType | 'all'>('all');
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const getMemberName = (memberId: string) => {
    if (memberId === 'profile_patient_1') return 'Patient (Self)';
    const member = familyMembers.find(m => m.id === memberId);
    return member ? `${member.firstName} ${member.lastName}` : memberId;
  };

  const filteredRecords = patientRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || record.documentType === selectedType;
    return matchesSearch && matchesType;
  });

  const getFileIcon = (type: string) => {
    const docType = documentTypes.find(dt => dt.value === type);
    const Icon = docType?.icon || File;
    return <Icon className="w-6 h-6" />;
  };

  const handleDownload = async (record: MedicalRecord) => {
    try {
      setIsDownloading(record.id);

      if (!record.fileUrl) {
        toast.error('File data not found. The file may have been removed.');
        return;
      }

      // Simulate network request for UX
      await new Promise(resolve => setTimeout(resolve, 800));

      const a = document.createElement('a');
      a.href = record.fileUrl;
      a.download = record.fileName || record.title || 'medical_record';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('File downloaded successfully');
    } catch (e) {
      console.error('Download error:', e);
      toast.error('Failed to download file. Please try again or contact support.');
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">Patient Records</h1>
          <p className="text-[#626a72]">View medical documents uploaded by patients</p>
        </div>
        <span className="text-sm text-[#626a72]">{patientRecords.length} records</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#99a4af]" />
          <Input
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as DocumentType | 'all')}
          className="h-10 px-3 rounded-md border border-input bg-background"
        >
          <option value="all">All Types</option>
          {documentTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-[#dee5eb]" />
            <h3 className="text-lg font-medium text-[#1f1f1f] mb-2">No records found</h3>
            <p className="text-[#626a72] mb-4">
              {patientRecords.length === 0
                ? "No patient records have been uploaded yet. Records uploaded by patients will appear here."
                : "No records match your current filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-[#e6f7ff] rounded-lg flex items-center justify-center flex-shrink-0">
                    {getFileIcon(record.documentType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#1f1f1f] truncate">{record.title}</h4>
                    <p className="text-sm text-[#626a72]">{getMemberName(record.familyMemberId)}</p>
                    <p className="text-xs text-[#99a4af]">
                      {format(new Date(record.recordDate), 'MMM d, yyyy')}
                    </p>
                    <p className="text-xs text-[#99a4af]">
                      {(record.fileSize / 1024).toFixed(1)} KB • {record.documentType.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#dee5eb]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-[#0070a0]"
                    onClick={() => setViewingRecord(record)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-[#626a72]"
                    onClick={() => handleDownload(record)}
                    disabled={isDownloading === record.id}
                  >
                    {isDownloading === record.id ? (
                      <span className="w-4 h-4 mr-1 border-2 border-[#626a72] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-1" />
                    )}
                    {isDownloading === record.id ? 'Downloading...' : 'Download'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={!!viewingRecord} onOpenChange={() => setViewingRecord(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingRecord?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#626a72]">Patient:</span>
                <span className="ml-2">{viewingRecord && getMemberName(viewingRecord.familyMemberId)}</span>
              </div>
              <div>
                <span className="text-[#626a72]">Date:</span>
                <span className="ml-2">
                  {viewingRecord && format(new Date(viewingRecord.recordDate), 'MMM d, yyyy')}
                </span>
              </div>
              <div>
                <span className="text-[#626a72]">Type:</span>
                <span className="ml-2 capitalize">{viewingRecord?.documentType.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-[#626a72]">Size:</span>
                <span className="ml-2">
                  {viewingRecord && (viewingRecord.fileSize / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
            {viewingRecord?.description && (
              <div className="p-4 bg-[#f7f9fa] rounded-lg">
                <p className="text-sm text-[#626a72]">{viewingRecord.description}</p>
              </div>
            )}
            <div className="border-2 border-dashed border-[#dee5eb] rounded-lg p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-[#dee5eb]" />
              <p className="text-[#626a72]">Document Preview</p>
              <p className="text-sm text-[#99a4af]">{viewingRecord?.fileName}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
