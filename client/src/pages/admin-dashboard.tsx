import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Users, 
  Activity, 
  TrendingUp, 
  Wallet,
  Calendar,
  Download,
  LogOut,
  RefreshCw,
  Search,
  Eye,
  BarChart3
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  total: number;
  byWallet: Record<string, number>;
  byCategory: Record<string, number>;
  byMethod: Record<string, number>;
  recent: number;
}

interface Submission {
  id: string;
  wallet: string;
  method: string;
  category?: string;
  categoryTitle?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  status: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [walletFilter, setWalletFilter] = useState('all');

  useEffect(() => {
    verifyAuth();
    loadDashboardData();
  }, []);

  const verifyAuth = async () => {
    const sessionToken = localStorage.getItem('admin_session');
    if (!sessionToken) {
      setLocation('/admin/login');
      return;
    }

    try {
      const response = await fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('admin_session');
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_expires');
        setLocation('/admin/login');
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      setLocation('/admin/login');
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    const sessionToken = localStorage.getItem('admin_session');
    
    try {
      // Load stats
      const statsResponse = await fetch('/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load submissions
      await loadSubmissions();
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async () => {
    setSubmissionsLoading(true);
    const sessionToken = localStorage.getItem('admin_session');
    
    try {
      const response = await fetch('/api/admin/submissions?limit=100', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Failed to load submissions:', error);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleLogout = async () => {
    const sessionToken = localStorage.getItem('admin_session');
    
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin_session');
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_expires');
      setLocation('/admin/login');
    }
  };

  const exportSubmissions = () => {
    const csv = [
      ['ID', 'Wallet', 'Method', 'Category', 'Timestamp', 'IP Address', 'Status'],
      ...submissions.map(sub => [
        sub.id,
        sub.wallet,
        sub.method,
        sub.categoryTitle || '',
        new Date(sub.timestamp).toLocaleString(),
        sub.ipAddress || '',
        sub.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = searchQuery === '' || 
      sub.wallet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.categoryTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesWallet = walletFilter === 'all' || sub.wallet === walletFilter;
    
    return matchesSearch && matchesStatus && matchesWallet;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const walletChartData = stats ? Object.entries(stats.byWallet).map(([wallet, count]) => ({
    name: wallet,
    count
  })) : [];

  const methodChartData = stats ? Object.entries(stats.byMethod).map(([method, count]) => ({
    name: method,
    count
  })) : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Web3 Support Management Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Last 24 Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.recent || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Wallet className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unique Wallets</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats ? Object.keys(stats.byWallet).length : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats ? Object.keys(stats.byCategory).length : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Wallet Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Distribution</CardTitle>
                  <CardDescription>Submissions by wallet type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={walletChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Method Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Connection Methods</CardTitle>
                  <CardDescription>How users connect their wallets</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={methodChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {methodChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Wallet Submissions</CardTitle>
                    <CardDescription>View and manage all wallet connection submissions</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={exportSubmissions} variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button onClick={loadSubmissions} variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search submissions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={walletFilter} onValueChange={setWalletFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Wallet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Wallets</SelectItem>
                      {stats && Object.keys(stats.byWallet).map(wallet => (
                        <SelectItem key={wallet} value={wallet}>{wallet}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Submissions Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Wallet</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissionsLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" />
                            Loading submissions...
                          </TableCell>
                        </TableRow>
                      ) : filteredSubmissions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            No submissions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSubmissions.map((submission) => (
                          <TableRow key={submission.id}>
                            <TableCell className="font-medium">{submission.wallet}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{submission.method}</Badge>
                            </TableCell>
                            <TableCell>{submission.categoryTitle || '-'}</TableCell>
                            <TableCell>
                              {new Date(submission.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {submission.ipAddress || '-'}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  submission.status === 'processed' ? 'default' :
                                  submission.status === 'failed' ? 'destructive' : 'secondary'
                                }
                              >
                                {submission.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Detailed analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <BarChart3 className="h-4 w-4" />
                  <AlertDescription>
                    Advanced analytics features coming soon. This will include conversion rates, 
                    geographic distribution, device analytics, and more detailed reporting.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 