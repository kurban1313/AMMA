// AMMA Healthcare Platform - Research Exports Page

import { useState } from 'react';
import { 
  Download, 
  FileText,
  FileSpreadsheet,
  Calendar,
  Check,
  Clock,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Mock exports data
const mockExports = [
  {
    id: 'exp_1',
    name: 'Diabetes Study - Punjab Region',
    type: 'csv',
    size: '2.4 MB',
    records: 3247,
    createdAt: '2024-06-01T10:30:00',
    status: 'ready',
  },
  {
    id: 'exp_2',
    name: 'Hypertension Trends 2020-2024',
    type: 'pdf',
    size: '5.1 MB',
    records: 15420,
    createdAt: '2024-05-28T14:15:00',
    status: 'ready',
  },
  {
    id: 'exp_3',
    name: 'Vaccination Coverage Analysis',
    type: 'csv',
    size: '1.8 MB',
    records: 8921,
    createdAt: '2024-05-20T09:00:00',
    status: 'ready',
  },
  {
    id: 'exp_4',
    name: 'Chronic Conditions by Age Group',
    type: 'pdf',
    size: '3.2 MB',
    records: 0,
    createdAt: '2024-06-10T11:00:00',
    status: 'generating',
  },
];

export default function ResearchExports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredExports = mockExports.filter(exp => {
    const matchesSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || exp.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDownload = (_exportId: string, name: string) => {
    toast.success(`Downloading ${name}...`);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'csv':
        return <FileSpreadsheet className="w-6 h-6 text-[#00b67a]" />;
      case 'pdf':
        return <FileText className="w-6 h-6 text-[#e92222]" />;
      default:
        return <FileText className="w-6 h-6 text-[#626a72]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">Exports</h1>
          <p className="text-[#626a72]">Download your research data exports</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#99a4af]" />
          <Input
            placeholder="Search exports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background"
        >
          <option value="all">All Types</option>
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
        </select>
      </div>

      {/* Exports List */}
      {filteredExports.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Download className="w-16 h-16 mx-auto mb-4 text-[#dee5eb]" />
            <h3 className="text-lg font-medium text-[#1f1f1f] mb-2">No exports yet</h3>
            <p className="text-[#626a72]">Generate reports from the chatbot to see them here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredExports.map((exp) => (
            <Card key={exp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f7f9fa] rounded-lg flex items-center justify-center flex-shrink-0">
                    {getFileIcon(exp.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#1f1f1f] truncate">{exp.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-[#99a4af]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(exp.createdAt), 'MMM d, yyyy')}
                      </span>
                      <span>{exp.size}</span>
                      {exp.records > 0 && (
                        <span>{exp.records.toLocaleString()} records</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#dee5eb]">
                  {exp.status === 'ready' ? (
                    <>
                      <span className="flex items-center gap-1 text-sm text-[#00b67a]">
                        <Check className="w-4 h-4" />
                        Ready
                      </span>
                      <Button 
                        size="sm" 
                        className="bg-[#0070a0] hover:bg-[#00577c]"
                        onClick={() => handleDownload(exp.id, exp.name)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1 text-sm text-[#faea73]">
                        <Clock className="w-4 h-4 animate-pulse" />
                        Generating...
                      </span>
                      <Button size="sm" disabled>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Export Info */}
      <div className="bg-[#f7f9fa] rounded-xl p-6">
        <h3 className="font-semibold text-[#1f1f1f] mb-4">About Data Exports</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-[#1f1f1f] mb-2">CSV Format</h4>
            <p className="text-sm text-[#626a72]">
              Raw data in comma-separated format. Best for further analysis in Excel, R, or Python.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-[#1f1f1f] mb-2">PDF Format</h4>
            <p className="text-sm text-[#626a72]">
              Formatted reports with charts and visualizations. Best for presentations and publications.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-[#1f1f1f] mb-2">Data Retention</h4>
            <p className="text-sm text-[#626a72]">
              Exports are retained for 90 days. Download important files to your local storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
