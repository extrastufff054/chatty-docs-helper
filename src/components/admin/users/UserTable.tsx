
import { User } from "@/lib/db";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, Shield, Trash, X } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserTableProps {
  users: User[];
  onApprove: (userId: string) => void;
  onUpdateRole: (userId: string, role: User['role']) => void;
  onDelete: (userId: string) => void;
}

export const UserTable = ({ 
  users, 
  onApprove, 
  onUpdateRole, 
  onDelete 
}: UserTableProps) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No users found.
      </div>
    );
  }
  
  // Format date from ISO string
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  // Get badge for role
  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500 hover:bg-red-600">Admin</Badge>;
      case "moderator":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Moderator</Badge>;
      default:
        return <Badge variant="outline">User</Badge>;
    }
  };
  
  // Get badge for approval status
  const getStatusBadge = (approved: boolean) => {
    return approved ? (
      <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
    ) : (
      <Badge variant="destructive">Pending</Badge>
    );
  };

  return (
    <ScrollArea className="max-h-96">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>{getStatusBadge(user.approved)}</TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Actions <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!user.approved && (
                      <DropdownMenuItem onClick={() => onApprove(user.id)}>
                        <Check className="mr-2 h-4 w-4" /> Approve
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem onClick={() => onUpdateRole(user.id, "admin")}>
                      <Shield className="mr-2 h-4 w-4" /> Make Admin
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => onUpdateRole(user.id, "moderator")}>
                      <Shield className="mr-2 h-4 w-4" /> Make Moderator
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => onUpdateRole(user.id, "user")}>
                      <Check className="mr-2 h-4 w-4" /> Set as User
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={() => onDelete(user.id)}
                      className="text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default UserTable;
