import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  UserCheck, 
  Search, 
  Shield, 
  Clock, 
  AlertTriangle,
  LogOut,
  Eye,
  Building2,
  User,
  Calendar
} from 'lucide-react';

interface ImpersonationSession {
  id: string;
  admin_user: string;
  target_user: string;
  target_tenant: string;
  start_time: string;
  duration: number; // minutes
  status: 'active' | 'ended';
  reason: string;
  ip_address: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  tenant_name: string;
  role: string;
  last_active: string;
  status: 'active' | 'inactive';
}

const UserImpersonation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState('all');
  const [isImpersonateDialogOpen, setIsImpersonateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [impersonationReason, setImpersonationReason] = useState('');

  const activeSessions: ImpersonationSession[] = [
    {
      id: '1',
      admin_user: 'john.doe@intelliflow.ai',
      target_user: 'alice.smith@acme.com',
      target_tenant: 'Acme Corporation',
      start_time: '2024-01-28T10:30:00Z',
      duration: 25,
      status: 'active',
      reason: 'Customer support - integration setup assistance',
      ip_address: '192.168.1.100'
    }
  ];

  const users: User[] = [
    {
      id: '1',
      name: 'Alice Smith',
      email: 'alice.smith@acme.com',
      tenant_name: 'Acme Corporation',
      role: 'Admin',
      last_active: '2 minutes ago',
      status: 'active'
    },
    {
      id: '2',
      name: 'Bob Johnson',
      email: 'bob.johnson@techflow.com',
      tenant_name: 'TechFlow Solutions',
      role: 'User',
      last_active: '1 hour ago',
      status: 'active'
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol.davis@startupx.com',
      tenant_name: 'StartupX',
      role: 'Admin',
      last_active: '1 day ago',
      status: 'inactive'
    }
  ];

  const recentSessions: ImpersonationSession[] = [
    {
      id: '2',
      admin_user: 'jane.admin@intelliflow.ai',
      target_user: 'bob.johnson@techflow.com',
      target_tenant: 'TechFlow Solutions',
      start_time: '2024-01-27T14:15:00Z',
      duration: 45,
      status: 'ended',
      reason: 'Billing inquiry resolution',
      ip_address: '192.168.1.102'
    },
    {
      id: '3',
      admin_user: 'john.doe@intelliflow.ai',
      target_user: 'carol.davis@startupx.com',
      target_tenant: 'StartupX',
      start_time: '2024-01-26T09:20:00Z',
      duration: 30,
      status: 'ended',
      reason: 'Technical support - workflow configuration',
      ip_address: '192.168.1.100'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</Badge>;
      case 'ended':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">Ended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUserStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Online</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">Offline</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTenant = selectedTenant === 'all' || user.tenant_name === selectedTenant;
    return matchesSearch && matchesTenant;
  });

  const handleImpersonate = (user: User) => {
    setSelectedUser(user);
    setIsImpersonateDialogOpen(true);
  };

  const startImpersonation = () => {
    if (!selectedUser || !impersonationReason.trim()) return;
    
    // Here you would implement the actual impersonation logic
    console.log('Starting impersonation for:', selectedUser.email, 'Reason:', impersonationReason);
    
    setIsImpersonateDialogOpen(false);
    setImpersonationReason('');
    setSelectedUser(null);
  };

  const endImpersonation = (sessionId: string) => {
    // Here you would implement ending the impersonation session
    console.log('Ending impersonation session:', sessionId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">User Impersonation System</h2>
          <p className="text-muted-foreground">Securely access user accounts for support and troubleshooting</p>
        </div>
        <Badge variant="outline" className="text-red-600 border-red-600">
          <Shield className="w-3 h-3 mr-1" />
          High Security Zone
        </Badge>
      </div>

      {/* Security Warning */}
      <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          <strong>Security Notice:</strong> All impersonation sessions are logged and monitored. 
          Only use this feature for legitimate support purposes. Unauthorized access may result in account suspension.
        </AlertDescription>
      </Alert>

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Active Impersonation Sessions ({activeSessions.length})
            </CardTitle>
            <CardDescription>Currently active user impersonation sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <UserCheck className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium">
                        {session.admin_user} → {session.target_user}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.target_tenant} • Started {new Date(session.start_time).toLocaleTimeString()} • {session.duration} min
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Reason: {session.reason}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => endImpersonation(session.id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    End Session
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Search and Impersonation */}
      <Card>
        <CardHeader>
          <CardTitle>User Search & Impersonation</CardTitle>
          <CardDescription>Search for users across all tenants to initiate support sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search users by name or email..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedTenant} onValueChange={setSelectedTenant}>
              <SelectTrigger className="w-60">
                <SelectValue placeholder="All Tenants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tenants</SelectItem>
                <SelectItem value="Acme Corporation">Acme Corporation</SelectItem>
                <SelectItem value="TechFlow Solutions">TechFlow Solutions</SelectItem>
                <SelectItem value="StartupX">StartupX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      {user.tenant_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {user.last_active}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleImpersonate(user)}
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Impersonate
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Impersonation History</CardTitle>
          <CardDescription>Previous impersonation sessions for audit purposes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin User</TableHead>
                <TableHead>Target User</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.admin_user}</TableCell>
                  <TableCell>{session.target_user}</TableCell>
                  <TableCell>{session.target_tenant}</TableCell>
                  <TableCell>{session.duration} min</TableCell>
                  <TableCell className="max-w-48 truncate">{session.reason}</TableCell>
                  <TableCell>{new Date(session.start_time).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(session.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Impersonation Dialog */}
      <Dialog open={isImpersonateDialogOpen} onOpenChange={setIsImpersonateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              Impersonate User
            </DialogTitle>
            <DialogDescription>
              Start a secure impersonation session for support purposes
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{selectedUser.name}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.tenant_name}</p>
              </div>
              
              <div>
                <Label htmlFor="reason">Reason for Impersonation *</Label>
                <Input
                  id="reason"
                  placeholder="e.g., Customer support - technical issue resolution"
                  value={impersonationReason}
                  onChange={(e) => setImpersonationReason(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                  This session will be logged and monitored. Ensure you have proper authorization.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button 
                  onClick={startImpersonation}
                  disabled={!impersonationReason.trim()}
                  className="flex-1"
                >
                  Start Impersonation
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsImpersonateDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserImpersonation;