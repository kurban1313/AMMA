// AMMA Healthcare Platform - Researcher Dashboard

import { useEffect } from 'react';
import { 
  Database, 
  MessageSquare, 
  TrendingUp,
  FileText,
  Clock,
  Shield,
  Brain,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore, useResearcherStore } from '@/store';
import { mockResearchQueries } from '@/services/mockData';
import { format } from 'date-fns';

export default function ResearcherDashboard() {
  const { user } = useAuthStore();
  const { queryHistory, addQuery } = useResearcherStore();

  // Load mock queries
  useEffect(() => {
    mockResearchQueries.forEach(query => {
      if (!queryHistory.find(q => q.id === query.id)) {
        addQuery(query);
      }
    });
  }, []);

  const recentQueries = queryHistory.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">
            Welcome, {user?.email?.split('@')[0]}
          </h1>
          <p className="text-[#626a72]">Access anonymized health data for your research</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#00b67a] text-white rounded-full text-sm">
          <Shield className="w-4 h-4" />
          <span>Full Access</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#626a72]">Total Queries</p>
                <p className="text-2xl font-semibold text-[#1f1f1f]">{queryHistory.length}</p>
              </div>
              <div className="w-10 h-10 bg-[#e6f7ff] rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-[#0070a0]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#626a72]">Records Accessed</p>
                <p className="text-2xl font-semibold text-[#1f1f1f]">15,420</p>
              </div>
              <div className="w-10 h-10 bg-[#f0fdf4] rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#00b67a]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#626a72]">Reports Generated</p>
                <p className="text-2xl font-semibold text-[#1f1f1f]">8</p>
              </div>
              <div className="w-10 h-10 bg-[#fefce8] rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#faea73]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#626a72]">Compliance Score</p>
                <p className="text-2xl font-semibold text-[#00b67a]">100%</p>
              </div>
              <div className="w-10 h-10 bg-[#f0fdf4] rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-[#00b67a]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Chatbot Card */}
        <Card className="bg-gradient-to-br from-[#0070a0] to-[#00577c] text-white">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Research Assistant</h3>
                <p className="text-white/80 mb-6">
                  Query our database using natural language. No SQL required. 
                  Get instant insights from anonymized health data.
                </p>
                <Link to="/researcher/chatbot">
                  <Button className="bg-white text-[#0070a0] hover:bg-white/90">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Open Chatbot
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#f7f9fa] rounded-lg">
                <span className="text-[#626a72]">Total Anonymized Records</span>
                <span className="font-semibold text-[#1f1f1f]">1,247,832</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#f7f9fa] rounded-lg">
                <span className="text-[#626a72]">Conditions Tracked</span>
                <span className="font-semibold text-[#1f1f1f]">156</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#f7f9fa] rounded-lg">
                <span className="text-[#626a72]">Geographic Coverage</span>
                <span className="font-semibold text-[#1f1f1f]">28 States</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#f7f9fa] rounded-lg">
                <span className="text-[#626a72]">Data Freshness</span>
                <span className="font-semibold text-[#00b67a]">Real-time</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Queries */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Recent Queries</CardTitle>
          <Link to="/researcher/queries">
            <Button variant="ghost" size="sm" className="text-[#0070a0]">
              View All
              <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentQueries.length === 0 ? (
            <div className="text-center py-8 text-[#99a4af]">
              <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No queries yet</p>
              <Link to="/researcher/chatbot">
                <Button variant="link" className="text-[#0070a0]">Start your first query</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentQueries.map((query) => (
                <div
                  key={query.id}
                  className="flex items-center gap-4 p-4 bg-[#f7f9fa] rounded-lg"
                >
                  <div className="w-10 h-10 bg-[#e6f7ff] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-[#0070a0]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1f1f1f] truncate">
                      {query.naturalLanguageQuery}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-[#99a4af]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(query.executedAt), 'MMM d, yyyy')}
                      </span>
                      <span>{query.executionTime}s execution</span>
                      <span>{query.recordCount.toLocaleString()} records</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    query.status === 'completed' 
                      ? 'bg-[#00b67a] text-white' 
                      : 'bg-[#faea73] text-[#1f1f1f]'
                  }`}>
                    {query.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <div className="bg-[#e6f7ff] rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-[#0070a0] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-[#0070a0]">Privacy & Compliance</p>
          <p className="text-sm text-[#0070a0]/80">
            All data accessed through this platform is 100% anonymized. No personally identifiable 
            information (PII) is ever exposed. All queries are logged for compliance auditing.
          </p>
        </div>
      </div>
    </div>
  );
}
