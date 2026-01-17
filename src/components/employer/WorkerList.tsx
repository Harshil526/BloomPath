import { motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, CheckCircle2, Zap, Calendar, Clock, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const WorkerList = () => {
  const { workers, calculateMatchScore, jobs } = useAppStore();
  const [assigningWorker, setAssigningWorker] = useState<typeof workers[0] | null>(null);
  const openJob = jobs.find(j => j.status === 'open');

  const handleAssignClick = (worker: typeof workers[0]) => {
    setAssigningWorker(worker);
  };

  const handleConfirmAssign = () => {
    if (!assigningWorker) return;
    
    toast.success(`Assigned ${assigningWorker.name} to the job!`, {
      description: "They have been notified and will confirm shortly.",
    });
    setAssigningWorker(null);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Available Workers</h1>
          <p className="text-muted-foreground">AI-ranked by match score</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {workers.filter(w => w.isAvailable).map((worker, i) => {
            const matchScore = openJob ? calculateMatchScore(worker.id, openJob.id) : Math.round(70 + Math.random() * 25);
            return (
              <motion.div 
                key={worker.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }} 
                whileHover={{ y: -4 }} 
                className="glass-card p-5 rounded-2xl"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={worker.avatar} />
                    <AvatarFallback>{worker.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{worker.name}</h3>
                      <Badge className="bg-primary text-primary-foreground rounded-full">
                        <Zap className="h-3 w-3 mr-1" />
                        {matchScore}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      {worker.location}
                      <Star className="h-3 w-3 text-chart-3 fill-chart-3 ml-2" />
                      {worker.rating}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {worker.skills.filter(s => s.status === 'verified').slice(0, 3).map(s => (
                        <Badge key={s.id} variant="secondary" className="text-xs rounded-full">
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl"
                    onClick={() => toast.info("Profile view coming soon")}
                  >
                    View Profile
                  </Button>
                  <Button 
                    className="flex-1 gradient-coral text-primary-foreground rounded-xl"
                    onClick={() => handleAssignClick(worker)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Assign
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Assignment Confirmation Modal */}
      <Dialog open={!!assigningWorker} onOpenChange={() => setAssigningWorker(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Worker to Job</DialogTitle>
            <DialogDescription>
              Confirm assignment details for {assigningWorker?.name}
            </DialogDescription>
          </DialogHeader>
          
          {assigningWorker && openJob && (
            <div className="space-y-4 py-4">
              {/* Worker Info */}
              <div className="flex items-center gap-4 p-3 rounded-lg bg-primary/5">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={assigningWorker.avatar} />
                  <AvatarFallback>{assigningWorker.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{assigningWorker.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 text-chart-3 fill-chart-3" />
                    {assigningWorker.rating} • {assigningWorker.location}
                  </div>
                </div>
                <Badge className="ml-auto bg-primary text-primary-foreground">
                  <Zap className="h-3 w-3 mr-1" />
                  {calculateMatchScore(assigningWorker.id, openJob.id)}% Match
                </Badge>
              </div>

              {/* Job Details */}
              <div className="space-y-3">
                <h4 className="font-semibold">Job Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Job:</span>
                    <span>{openJob.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Duration:</span>
                    <span>{openJob.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Location:</span>
                    <span>{openJob.address || "123 Business Street"}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="font-semibold">Worker Contact</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Phone:</span>
                    <span>{assigningWorker.phone || "+91 98765 43210"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <span className="text-blue-600">{assigningWorker.email || "worker@email.com"}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> The worker will receive a notification and has 1 hour to accept the assignment.
                  You can cancel anytime before they accept.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setAssigningWorker(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAssign}
              className="flex-1 gradient-coral text-primary-foreground"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkerList;