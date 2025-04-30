
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { UserRound, FileText, Users, BarChart3, LogOut } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, colorClass }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`${colorClass} p-2 rounded-md`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-brand-900">Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-muted-foreground">
            Here's what's happening with your account today.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value="12,345"
            description="2.5% increase from last week"
            icon={<Users className="h-4 w-4 text-brand-600" />}
            colorClass="bg-brand-100"
          />
          
          <StatCard
            title="Active Projects"
            value="42"
            description="10 projects added this month"
            icon={<FileText className="h-4 w-4 text-blue-600" />}
            colorClass="bg-blue-100"
          />
          
          <StatCard
            title="New Visitors"
            value="1,234"
            description="18% increase from yesterday"
            icon={<UserRound className="h-4 w-4 text-green-600" />}
            colorClass="bg-green-100"
          />
          
          <StatCard
            title="Revenue"
            value="$24,500"
            description="15% increase from last month"
            icon={<BarChart3 className="h-4 w-4 text-amber-600" />}
            colorClass="bg-amber-100"
          />
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-md">
                  <div className="bg-brand-100 p-2 rounded-full">
                    <UserRound className="h-4 w-4 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Profile Updated</p>
                    <p className="text-xs text-muted-foreground">You updated your profile information</p>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground">
                    5 minutes ago
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-md">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New Document Created</p>
                    <p className="text-xs text-muted-foreground">Created "Q1 Marketing Plan"</p>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground">
                    2 hours ago
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-md">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Team Joined</p>
                    <p className="text-xs text-muted-foreground">You joined the "Product Design" team</p>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground">
                    1 day ago
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
