
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { StatusBadge, StatusType } from "@/components/StatusBadge";
import { toast } from "sonner";
import { Spinner } from "@/components/Spinner";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Server {
  id: string;
  name: string;
  ipAddress: string;
  uptime: string;
  status: StatusType;
}

const serverFormSchema = z.object({
  name: z.string().min(2, { message: "Server name must be at least 2 characters." }),
  ipAddress: z.string().regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, { 
    message: "Please enter a valid IP address (e.g., 192.168.1.1)." 
  }),
  type: z.string().min(1, { message: "Please enter a server type." }),
  description: z.string().optional(),
});

const Servers = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddServerOpen, setIsAddServerOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  const form = useForm<z.infer<typeof serverFormSchema>>({
    resolver: zodResolver(serverFormSchema),
    defaultValues: {
      name: "",
      ipAddress: "",
      type: "",
      description: "",
    },
  });

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/servers`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch servers");
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        // Use mock data if no servers are returned
        setServers([
          { 
            id: "1", 
            name: "Database Server", 
            ipAddress: "192.168.1.10", 
            uptime: "24hrs", 
            status: "online" as StatusType
          },
          { 
            id: "2", 
            name: "Application Server", 
            ipAddress: "192.168.1.20", 
            uptime: "12hrs", 
            status: "maintenance" as StatusType
          },
          { 
            id: "3", 
            name: "Storage Server", 
            ipAddress: "192.168.1.30", 
            uptime: "7d 12hrs", 
            status: "online" as StatusType
          },
        ]);
      } else {
        // Transform the API response to match our interface
        const formattedServers = data.map((server: any) => ({
          id: server.serverID || server.id,
          name: server.name,
          ipAddress: server.ip || server.ipAddress,
          uptime: server.uptime || "Unknown",
          status: (server.status || "online") as StatusType
        }));
        setServers(formattedServers);
      }
    } catch (error) {
      console.error("Error fetching servers:", error);
      toast.error("Failed to load servers");
      
      // Use mock data as fallback
      setServers([
        { 
          id: "1", 
          name: "Database Server", 
          ipAddress: "192.168.1.10", 
          uptime: "24hrs", 
          status: "online" as StatusType
        },
        { 
          id: "2", 
          name: "Application Server", 
          ipAddress: "192.168.1.20", 
          uptime: "12hrs", 
          status: "maintenance" as StatusType
        },
        { 
          id: "3", 
          name: "Storage Server", 
          ipAddress: "192.168.1.30", 
          uptime: "7d 12hrs", 
          status: "online" as StatusType
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSetMaintenance = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/servers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'maintenance' }),
      });

      if (!response.ok) {
        throw new Error("Failed to update server status");
      }

      // Update local state
      setServers(prevServers => 
        prevServers.map(server => 
          server.id === id ? { ...server, status: 'maintenance' as StatusType } : server
        )
      );
      
      toast.success(`Server #${id} has been set to maintenance mode`);
    } catch (error) {
      console.error("Error updating server status:", error);
      toast.error("Failed to set server to maintenance mode");
      
      // Update local state anyway for demo purposes
      setServers(prevServers => 
        prevServers.map(server => 
          server.id === id ? { ...server, status: 'maintenance' as StatusType } : server
        )
      );
    }
  };

  const onAddServer = async (values: z.infer<typeof serverFormSchema>) => {
    try {
      const serverData = {
        name: values.name,
        ip: values.ipAddress,
        type: values.type,
        description: values.description || '',
        status: 'online'
      };

      console.log("Submitting server data:", serverData);

      const response = await fetch(`${apiUrl}/servers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serverData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add server");
      }

      const newServer = await response.json();
      
      console.log("Server added successfully:", newServer);
      
      // Add to local state (with appropriate property mapping)
      setServers(prevServers => [
        ...prevServers, 
        {
          id: newServer.serverID,
          name: values.name,
          ipAddress: values.ipAddress,
          uptime: "Just added", 
          status: "online" as StatusType
        }
      ]);
      
      toast.success("Server added successfully");
      setIsAddServerOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error adding server:", error);
      toast.error(`Failed to add server: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar role="admin" />
      
      <PageTransition>
        <main className="pt-24 pl-72 pr-8 pb-16 animate-fade-in">
          <div className="max-w-6xl">
            <h1 className="text-3xl font-semibold mb-6">Manage Servers</h1>
            
            <p className="text-muted-foreground mb-6">
              View and Update server details
            </p>
            
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Active Servers</h2>
                <Button onClick={() => setIsAddServerOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Server
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                {loading ? (
                  <div className="flex justify-center items-center p-8">
                    <Spinner />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Server Name</TableHead>
                        <TableHead>Server IP Address</TableHead>
                        <TableHead>Server Uptime</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {servers.length > 0 ? (
                        servers.map((server) => (
                          <TableRow key={server.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell>{server.name}</TableCell>
                            <TableCell>{server.ipAddress}</TableCell>
                            <TableCell>{server.uptime}</TableCell>
                            <TableCell>
                              <StatusBadge status={server.status} />
                            </TableCell>
                            <TableCell>
                              <Button 
                                onClick={() => handleSetMaintenance(server.id)}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white"
                                size="sm"
                                disabled={server.status === "maintenance"}
                              >
                                Set Maintenance
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No active servers
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </section>
          </div>
        </main>
      </PageTransition>

      {/* Add Server Dialog */}
      <Dialog open={isAddServerOpen} onOpenChange={setIsAddServerOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Server</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddServer)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Database Server" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ipAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Address</FormLabel>
                    <FormControl>
                      <Input placeholder="192.168.1.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Production" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Main database server for application" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddServerOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Server</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Servers;
