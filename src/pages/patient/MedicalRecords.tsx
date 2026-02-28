// AMMA Healthcare Platform - Medical Records Page

import { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Search,
  Download,
  Trash2,
  FileImage,
  FileSpreadsheet,
  File,
  Eye,
  Check,
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
import { usePatientStore } from '@/store';
import { toast } from 'sonner';
import type { DocumentType, MedicalRecord } from '@/types';
import { format } from 'date-fns';

const documentTypes: { value: DocumentType; label: string; icon: typeof File }[] = [
  { value: 'prescription', label: 'Prescription', icon: FileText },
  { value: 'lab_report', label: 'Lab Report', icon: FileSpreadsheet },
  { value: 'doctor_note', label: 'Doctor Note', icon: FileText },
  { value: 'vaccination', label: 'Vaccination', icon: FileImage },
  { value: 'imaging', label: 'Imaging', icon: FileImage },
  { value: 'other', label: 'Other', icon: File },
];

export default function MedicalRecords() {
  const { familyMembers, medicalRecords, addMedicalRecord, removeMedicalRecord } = usePatientStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentType | 'all'>('all');
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadDocType, setUploadDocType] = useState<DocumentType>('prescription');
  const [uploadMember, setUploadMember] = useState('profile_patient_1');

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || record.documentType === selectedType;
    const matchesMember = selectedMember === 'all' || record.familyMemberId === selectedMember;
    return matchesSearch && matchesType && matchesMember;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      if (!uploadTitle) setUploadTitle(file.name.replace(/\.[^.]+$/, ''));
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error('Please select a file to upload');
      return;
    }
    if (!uploadTitle) {
      toast.error('Please enter a title');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const newRecord: MedicalRecord = {
        id: `mr_${Date.now()}`,
        familyMemberId: uploadMember,
        title: uploadTitle,
        description: uploadDesc || undefined,
        documentType: uploadDocType,
        fileUrl: base64Data,
        fileName: uploadFile.name,
        fileSize: uploadFile.size,
        mimeType: uploadFile.type,
        uploadedBy: 'patient',
        recordDate: new Date(),
        isAnonymized: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addMedicalRecord(newRecord);
      toast.success('Record uploaded successfully!');
      setIsUploadDialogOpen(false);
      setUploadFile(null);
      setUploadTitle('');
      setUploadDesc('');
      setUploadDocType('prescription');
      setUploadMember('profile_patient_1');
    };
    reader.onerror = () => {
      toast.error('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(uploadFile);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      removeMedicalRecord(id);
      toast.success('Record deleted');
    }
  };

  const getFileIcon = (type: DocumentType) => {
    const docType = documentTypes.find(dt => dt.value === type);
    const Icon = docType?.icon || File;
    return <Icon className="w-6 h-6" />;
  };

  const getMemberName = (memberId: string) => {
    if (memberId === 'profile_patient_1') return 'You';
    const member = familyMembers.find(m => m.id === memberId);
    return member ? `${member.firstName} ${member.lastName}` : 'Unknown';
  };

  const handleDownload = (record: MedicalRecord) => {
    try {
      if (!record.fileUrl) {
        toast.error('File not found');
        return;
      }

      const a = document.createElement('a');
      a.href = record.fileUrl;
      a.download = record.title || 'medical_record';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Download started');
    } catch (e) {
      toast.error('Failed to download file');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">Medical Records</h1>
          <p className="text-[#626a72]">Manage and access all your family's medical documents</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0070a0] hover:bg-[#00577c]">
              <Upload className="w-4 h-4 mr-2" />
              Upload Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload Medical Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4 pt-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${uploadFile ? 'border-[#00b67a] bg-[#f0fdf4]' : 'border-[#dee5eb] hover:border-[#0070a0] hover:bg-[#e6f7ff]'
                  }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.docx,.dcm"
                  onChange={handleFileSelect}
                />
                {uploadFile ? (
                  <>
                    <Check className="w-12 h-12 mx-auto mb-4 text-[#00b67a]" />
                    <p className="font-medium text-[#1f1f1f]">{uploadFile.name}</p>
                    <p className="text-sm text-[#626a72] mt-1">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                    <p className="text-xs text-[#0070a0] mt-2">Click to change file</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto mb-4 text-[#99a4af]" />
                    <p className="text-[#626a72]">Click to browse files</p>
                    <p className="text-sm text-[#99a4af] mt-1">PDF, JPG, PNG, DOCX, DICOM — up to 10MB</p>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Document Type</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value as DocumentType)}
                >
                  {documentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">For Family Member</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={uploadMember}
                  onChange={(e) => setUploadMember(e.target.value)}
                >
                  <option value="profile_patient_1">You</option>
                  {familyMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName} ({member.relationship})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input placeholder="e.g., Blood Test Report - March 2024" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <Input placeholder="Add any additional details..." value={uploadDesc} onChange={(e) => setUploadDesc(e.target.value)} />
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-[#0070a0] hover:bg-[#00577c]">
                  Upload
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
        <select
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background"
        >
          <option value="all">All Members</option>
          <option value="profile_patient_1">You</option>
          {familyMembers.map(member => (
            <option key={member.id} value={member.id}>
              {member.firstName} {member.lastName}
            </option>
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
              {medicalRecords.length === 0
                ? "Start building your family's medical history by uploading records."
                : "No records match your search criteria."}
            </p>
            <Button
              className="bg-[#0070a0] hover:bg-[#00577c]"
              onClick={() => setIsUploadDialogOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload First Record
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-lg transition-shadow group">
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
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#e92222]"
                    onClick={() => handleDelete(record.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Record Dialog */}
      <Dialog open={!!viewingRecord} onOpenChange={() => setViewingRecord(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingRecord?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#626a72]">Type:</span>
                <span className="ml-2 capitalize">{viewingRecord?.documentType.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-[#626a72]">Date:</span>
                <span className="ml-2">
                  {viewingRecord && format(new Date(viewingRecord.recordDate), 'MMM d, yyyy')}
                </span>
              </div>
              <div>
                <span className="text-[#626a72]">For:</span>
                <span className="ml-2">
                  {viewingRecord && getMemberName(viewingRecord.familyMemberId)}
                </span>
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
              <p className="text-sm text-[#99a4af]">PDF viewer would appear here</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
