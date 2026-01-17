
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Building2, CheckCircle2, Clock, Eye, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const VerificationQueue = () => {
  const [loading, setLoading] = useState(true);
  const [pendingWorkers, setPendingWorkers] = useState<any[]>([]);
  const [pendingBusinesses, setPendingBusinesses] = useState<any[]>([]);

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      setLoading(true);

      // Fetch Pending Workers
      const { data: workers, error: workersError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'worker')
        .eq('is_verified', false);

      if (workersError) throw workersError;
      setPendingWorkers(workers || []);

      // Fetch Pending Businesses
      const { data: businesses, error: businessesError } = await supabase
        .from('businesses')
        .select('*')
        .eq('is_verified', false);

      if (businessesError) throw businessesError;
      setPendingBusinesses(businesses || []);

    } catch (error: any) {
      console.error("Error fetching verification queue:", error);
      toast.error("Failed to load verification queue");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyWorker = async (id: string, approve: boolean) => {
    try {
      if (!approve) {
        // Logic to reject (maybe delete or mark rejected)
        // For now, let's just toast
        toast.info("Rejection implemented as TODO");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', id);

      if (error) throw error;
      toast.success("Worker verified successfully");
      setPendingWorkers(prev => prev.filter(w => w.id !== id));

    } catch (error: any) {
      toast.error("Failed to verify worker");
    }
  };

  const handleVerifyBusiness = async (id: string, approve: boolean) => {
    try {
      if (!approve) {
        toast.info("Rejection implemented as TODO");
        return;
      }

      const { error } = await supabase
        .from('businesses')
        .update({ is_verified: true })
        .eq('id', id);

      if (error) throw error;
      toast.success("Business verified successfully");
      setPendingBusinesses(prev => prev.filter(b => b.id !== id));

    } catch (error: any) {
      toast.error("Failed to verify business");
    }
  };

  const viewDocument = async (path: string, bucket: string) => {
    if (!path) {
      toast.error("No document uploaded");
      return;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    if (data) {
      window.open(data.publicUrl, '_blank');
    } else {
      toast.error("Could not get document URL");
    }
  };

  if (loading) return <div className="p-8">Loading queue...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Verification Queue</h1>
        <p className="text-muted-foreground">
          {pendingWorkers.length + pendingBusinesses.length} pending requests
        </p>
      </div>

      <Tabs defaultValue="women" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="women">Pending Women ({pendingWorkers.length})</TabsTrigger>
          <TabsTrigger value="business">Pending Businesses ({pendingBusinesses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="women" className="space-y-4 mt-6">
          {pendingWorkers.length === 0 ? (
            <EmptyState message="No pending worker verifications" />
          ) : (
            pendingWorkers.map((worker, i) => (
              <motion.div
                key={worker.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 rounded-2xl"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={worker.avatar_url} />
                    <AvatarFallback>{worker.full_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{worker.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{worker.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Joined: {new Date(worker.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 md:flex-none"
                      onClick={() => viewDocument(worker.aadhar_url, 'aadhar-documents')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Aadhar
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 md:flex-none gradient-coral text-primary-foreground"
                      onClick={() => handleVerifyWorker(worker.id, true)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </TabsContent>

        <TabsContent value="business" className="space-y-4 mt-6">
          {pendingBusinesses.length === 0 ? (
            <EmptyState message="No pending business verifications" />
          ) : (
            pendingBusinesses.map((biz, i) => (
              <motion.div
                key={biz.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 rounded-2xl"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-secondary/30 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{biz.company_name}</h3>
                    <p className="text-sm text-muted-foreground">{biz.business_email}</p>
                    <p className="text-xs text-muted-foreground">Manager: {biz.manager_name} • {biz.location}</p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 md:flex-none"
                      onClick={() => viewDocument(biz.reg_cert_url, 'business-documents')}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Certificate
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 md:flex-none gradient-coral text-primary-foreground"
                      onClick={() => handleVerifyBusiness(biz.id, true)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>

    </motion.div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="glass-card p-12 rounded-2xl text-center">
    <CheckCircle2 className="h-16 w-16 text-trust-excellent mx-auto mb-4" />
    <h3 className="text-lg font-semibold">All caught up!</h3>
    <p className="text-muted-foreground">{message}</p>
  </div>
);

export default VerificationQueue;
