// AMMA Healthcare Platform - Admin Dashboard

import { 
  Users, 
  Stethoscope,
  Database,
  Shield,
  TrendingUp,
  AlertCircle,
  Check,
  X,
  Settings,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Mock admin data
const mockStats = {
  totalUsers: 5247,
  totalPatients: 4892,
  totalDoctors: 312,
  totalResearchers: 43,
  pendingVerifications: 18,
  totalRecords: 1247832,
  queriesToday: 156,
  systemHealth: 'operational',
};

const mockPendingVerifications = [
  { id: 1, name: 'Dr. Rajesh Kumar', type: 'doctor', submittedAt: '2024-06-10' },
  { id: 2, name: 'Dr. Anita Sharma', type: 'doctor', submittedAt: '2024-06-09' },
  { id: 3, name: 'Dr. Sanjay Gupta', type: 'researcher', submittedAt: '2024-06-08' },
];

const mockRecentActivity = [
  { id: 1, action: 'New patient registration', user: 'rahul.verma@email.com', time: '2 min ago' },
  { id: 2, action: 'Doctor verification approved', user: 'dr.sharma@clinic.com', time: '15 min ago' },
  { id: 3, action: 'Research query executed', user: 'researcher@aiims.edu', time: '32 min ago' },
  { id: 4, action: 'Medical record uploaded', user: 'dr.kumar@hospital.com', time: '1 hour ago' },
];

export default function AdminDashboard() {
  const handleApprove = (_id: number, name: string) => {
    toast.success(`Approved ${name}`);
  };

  const handleReject = (_id: number, name: string) => {
    toast.error(`Rejected ${name}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">Admin Dashboard</h1>
          <p className="text-[#626a72]">Platform overview and management</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#00b67a] text-white rounded-full text-sm">
          <Activity className="w-4 h-4" />
          <span>All Systems Operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#626a72]">Total Users</p>
                <p className="text-2xl font-semibold text-[#1f1f1f]">{mockStats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-[#e6f7ff] rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#0070a0]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#626a72]">Verified Doctors</p>
                <p className="text-2xl font-semibold text-[#1f1f1f]">{mockStats.totalDoctors}</p>
              </div>
              <div className="w-10 h-10 bg-[#f0fdf4] rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-[#00b67a]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#626a72]">Health Records</p>
                <p className="text-2xl font-semibold text-[#1f1f1f]">{(mockStats.totalRecords / 1000000).toFixed(1)}M</p>
              </div>
              <div className="w-10 h-10 bg-[#fefce8] rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-[#faea73]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#626a72]">Pending Verifications</p>
                <p className="text-2xl font-semibold text-[#e92222]">{mockStats.pendingVerifications}</p>
              </div>
              <div className="w-10 h-10 bg-[#fef2f2] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#e92222]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Verifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#faea73]" />
              Pending Verifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockPendingVerifications.length === 0 ? (
              <div className="text-center py-8 text-[#99a4af]">
                <Check className="w-12 h-12 mx-auto mb-2" />
                <p>No pending verifications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mockPendingVerifications.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-[#f7f9fa] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#e6f7ff] rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-[#0070a0]">
                          {item.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-[#1f1f1f]">{item.name}</p>
                        <p className="text-sm text-[#626a72] capitalize">{item.type} • {item.submittedAt}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-[#00b67a] hover:bg-[#00a067]"
                        onClick={() => handleApprove(item.id, item.name)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-[#e92222]"
                        onClick={() => handleReject(item.id, item.name)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0070a0]" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-[#f7f9fa] rounded-lg"
                >
                  <div>
                    <p className="font-medium text-[#1f1f1f]">{activity.action}</p>
                    <p className="text-sm text-[#626a72]">{activity.user}</p>
                  </div>
                  <span className="text-xs text-[#99a4af]">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#f0fdf4] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#00b67a] rounded-full animate-pulse" />
                <span className="font-medium text-[#1f1f1f]">API</span>
              </div>
              <p className="text-sm text-[#626a72]">Operational</p>
              <p className="text-xs text-[#99a4af]">99.9% uptime</p>
            </div>
            <div className="p-4 bg-[#f0fdf4] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#00b67a] rounded-full animate-pulse" />
                <span className="font-medium text-[#1f1f1f]">Database</span>
              </div>
              <p className="text-sm text-[#626a72]">Operational</p>
              <p className="text-xs text-[#99a4af]">12ms latency</p>
            </div>
            <div className="p-4 bg-[#f0fdf4] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#00b67a] rounded-full animate-pulse" />
                <span className="font-medium text-[#1f1f1f]">AI Engine</span>
              </div>
              <p className="text-sm text-[#626a72]">Operational</p>
              <p className="text-xs text-[#99a4af]">2.4s avg response</p>
            </div>
            <div className="p-4 bg-[#f0fdf4] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#00b67a] rounded-full animate-pulse" />
                <span className="font-medium text-[#1f1f1f]">Storage</span>
              </div>
              <p className="text-sm text-[#626a72]">Operational</p>
              <p className="text-xs text-[#99a4af]">45% capacity</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="justify-start">
              <Stethoscope className="w-4 h-4 mr-2" />
              Verify Doctors
            </Button>
            <Button variant="outline" className="justify-start">
              <Database className="w-4 h-4 mr-2" />
              View Logs
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
