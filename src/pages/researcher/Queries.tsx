// AMMA Healthcare Platform - Research Queries Page

import { useState } from 'react';
import { 
  Search, 
  Clock,
  Database,
  Check,
  X,
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
import { useResearcherStore } from '@/store';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function ResearchQueries() {
  const { queryHistory } = useResearcherStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredQueries = queryHistory.filter(query => {
    const matchesSearch = query.naturalLanguageQuery.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || query.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = (queryId: string, format: 'csv' | 'pdf') => {
    toast.success(`Exporting query ${queryId} as ${format.toUpperCase()}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-[#00b67a]" />;
      case 'failed':
        return <X className="w-4 h-4 text-[#e92222]" />;
      case 'running':
        return <Clock className="w-4 h-4 text-[#faea73] animate-pulse" />;
      default:
        return <Clock className="w-4 h-4 text-[#99a4af]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">Query History</h1>
          <p className="text-[#626a72]">View and manage your research queries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#99a4af]" />
          <Input
            placeholder="Search queries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Queries List */}
      {filteredQueries.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Database className="w-16 h-16 mx-auto mb-4 text-[#dee5eb]" />
            <h3 className="text-lg font-medium text-[#1f1f1f] mb-2">No queries found</h3>
            <p className="text-[#626a72]">Start querying data from the chatbot</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredQueries.map((query) => (
            <Card key={query.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#e6f7ff] rounded-lg flex items-center justify-center flex-shrink-0">
                      {getStatusIcon(query.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1f1f1f]">
                        {query.naturalLanguageQuery}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-[#99a4af]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(query.executedAt), 'MMM d, yyyy h:mm a')}
                        </span>
                        <span>{query.executionTime}s</span>
                        <span>{query.recordCount.toLocaleString()} records</span>
                      </div>
                      {query.errorMessage && (
                        <p className="text-sm text-[#e92222] mt-2">{query.errorMessage}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {query.status === 'completed' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedQuery(query)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleExport(query.id, 'csv')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                      query.status === 'completed' 
                        ? 'bg-[#00b67a] text-white' 
                        : query.status === 'failed'
                        ? 'bg-[#e92222] text-white'
                        : 'bg-[#faea73] text-[#1f1f1f]'
                    }`}>
                      {query.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Query Detail Dialog */}
      <Dialog open={!!selectedQuery} onOpenChange={() => setSelectedQuery(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Query Results</DialogTitle>
          </DialogHeader>
          {selectedQuery && (
            <div className="space-y-4 pt-4">
              <div className="p-4 bg-[#f7f9fa] rounded-lg">
                <p className="text-sm text-[#626a72]">Query:</p>
                <p className="font-medium text-[#1f1f1f]">{selectedQuery.naturalLanguageQuery}</p>
              </div>

              {selectedQuery.generatedSql && (
                <div className="p-4 bg-[#1f1f1f] rounded-lg">
                  <p className="text-sm text-[#99a4af]">Generated SQL:</p>
                  <code className="text-sm text-[#00b67a] font-mono mt-1 block">
                    {selectedQuery.generatedSql}
                  </code>
                </div>
              )}

              {selectedQuery.results && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-[#1f1f1f]">Results Summary</h4>
                  <p className="text-[#626a72]">{selectedQuery.results.summary}</p>

                  {selectedQuery.results.statistics && (
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedQuery.results.statistics).map(([key, value]) => (
                        <div key={key} className="p-3 bg-[#f7f9fa] rounded-lg">
                          <p className="text-xs text-[#626a72] capitalize">{key.replace(/_/g, ' ')}</p>
                          <p className="text-xl font-semibold text-[#0070a0]">{value as string | number}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-[#0070a0] hover:bg-[#00577c]"
                  onClick={() => handleExport(selectedQuery.id, 'csv')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleExport(selectedQuery.id, 'pdf')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
