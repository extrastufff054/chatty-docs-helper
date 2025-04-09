
import { useState, useEffect } from "react";
import { db, User } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import UserTable from "./UserTable";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const { toast } = useToast();
  
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await db.getUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error loading users",
        description: "Failed to load user data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  const handleApproveUser = async (userId: string) => {
    try {
      const updatedUser = await db.approveUser(userId);
      if (updatedUser) {
        toast({
          title: "User approved",
          description: `${updatedUser.username} has been approved`,
        });
        loadUsers();
      }
    } catch (error) {
      console.error("Error approving user:", error);
      toast({
        title: "Error approving user",
        description: "Failed to approve user",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateRole = async (userId: string, role: User['role']) => {
    try {
      const updatedUser = await db.updateUserRole(userId, role);
      if (updatedUser) {
        toast({
          title: "Role updated",
          description: `${updatedUser.username}'s role has been updated to ${role}`,
        });
        loadUsers();
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error updating role",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    try {
      const deleted = await db.deleteUser(userId);
      if (deleted) {
        toast({
          title: "User deleted",
          description: "User has been deleted successfully",
        });
        loadUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error deleting user",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };
  
  // Filter users based on selected filter
  const filteredUsers = users.filter(user => {
    if (filter === "pending") return !user.approved;
    if (filter === "approved") return user.approved;
    return true; // "all" filter
  });
  
  // Count of pending approvals
  const pendingCount = users.filter(user => !user.approved).length;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={loadUsers}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={filter} 
          onValueChange={(value) => setFilter(value as any)}
          className="mb-4"
        >
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Pending Approval
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <UserTable
            users={filteredUsers}
            onApprove={handleApproveUser}
            onUpdateRole={handleUpdateRole}
            onDelete={handleDeleteUser}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
