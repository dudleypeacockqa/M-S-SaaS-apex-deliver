import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Input } from '@/components/marketing/financeflo/ui/input';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/marketing/financeflo/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/marketing/financeflo/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/marketing/financeflo/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard, 
  AlertCircle,
  Search,
  Download,
  RefreshCw,
  Calendar,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface BillingRecord {
  id: string;
  tenant_name: string;
  plan: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  billing_date: string;
  next_billing_date: string;
  payment_method: string;
  invoice_number: string;
}

const BillingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30d');

  const billingRecords: BillingRecord[] = [
    {
      id: '1',
      tenant_name: 'Acme Corporation',
      plan: 'Enterprise',
      amount: 4999,
      status: 'paid',
      billing_date: '2024-01-01',
      next_billing_date: '2024-02-01',
      payment_method: 'Visa ****4242',
      invoice_number: 'INV-2024-001'
    },
    {
      id: '2',
      tenant_name: 'TechFlow Solutions',
      plan: 'Professional',
      amount: 1999,
      status: 'paid',
      billing_date: '2024-01-15',
      next_billing_date: '2024-02-15',
      payment_method: 'MasterCard ****8888',
      invoice_number: 'INV-2024-002'
    },
    {
      id: '3',
      tenant_name: 'StartupX',
      plan: 'Starter',
      amount: 299,
      status: 'failed',
      billing_date: '2024-01-20',
      next_billing_date: '2024-02-20',
      payment_method: 'Visa ****1234',
      invoice_number: 'INV-2024-003'
    }
  ];

  const revenueMetrics = {
    totalRevenue: 2450000,
    monthlyRecurring: 425000,
    growth: 15.2,
    churnRate: 2.1,
    avgRevenuePerUser: 1250,
    lifetimeValue: 8750
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Failed</Badge>;
      case 'refunded':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <RefreshCw className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'refunded':
        return <RefreshCw className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredRecords = billingRecords.filter(record => {
    const matchesSearch = record.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Billing & Revenue Management</h2>
          <p className="text-muted-foreground">Monitor subscription revenue and manage billing operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync Billing
          </Button>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueMetrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All-time revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueMetrics.monthlyRecurring.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{revenueMetrics.growth}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueMetrics.churnRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-0.3%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Revenue Per User</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueMetrics.avgRevenuePerUser}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Lifetime Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueMetrics.lifetimeValue}</div>
            <p className="text-xs text-muted-foreground">
              Average across all tiers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {billingRecords.filter(r => r.status === 'failed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search transactions..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Transactions ({filteredRecords.length})</CardTitle>
              <CardDescription>Complete billing history and payment records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Billing Date</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.tenant_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.plan}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${(record.amount / 100).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          {getStatusBadge(record.status)}
                        </div>
                      </TableCell>
                      <TableCell>{record.payment_method}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {new Date(record.billing_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <FileText className="w-3 h-3" />
                          {record.invoice_number}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">View</Button>
                          {record.status === 'failed' && (
                            <Button variant="ghost" size="sm" className="text-blue-600">
                              Retry
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Revenue trends and financial insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                  <p>Revenue charts would be displayed here</p>
                  <p className="text-sm">Monthly recurring revenue, growth trends, and forecasts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>Manage tenant subscriptions and plan changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-semibold">Starter Plan</h3>
                    <p className="text-2xl font-bold text-muted-foreground">
                      {billingRecords.filter(r => r.plan === 'Starter').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Active subscriptions</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-semibold">Professional Plan</h3>
                    <p className="text-2xl font-bold text-muted-foreground">
                      {billingRecords.filter(r => r.plan === 'Professional').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Active subscriptions</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-semibold">Enterprise Plan</h3>
                    <p className="text-2xl font-bold text-muted-foreground">
                      {billingRecords.filter(r => r.plan === 'Enterprise').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Active subscriptions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingManagement;