import { motion } from "framer-motion";
import { Job, useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Zap, Check, X, Building, Phone, Mail, User } from "lucide-react";
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

interface JobMatchCardProps {
  job: Job & { matchScore?: number };
  index: number;
}

const JobMatchCard = ({ job, index }: JobMatchCardProps) => {
  const { acceptJob, declineJob, calculateCompletionProbability, currentWorker } = useAppStore();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const completionProb = currentWorker 
    ? calculateCompletionProbability(currentWorker.id, job.id) 
    : 0;

  const handleAccept = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmAccept = () => {
    acceptJob(job.id);
    setShowConfirmDialog(false);
    toast.success("Job accepted! 🎉", {
      description: `You've been assigned to "${job.title}"`,
    });
  };

  const handleDecline = () => {
    declineJob(job.id);
    toast.info("Job declined", {
      description: "We'll find you better matches",
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="glass-card p-5 rounded-2xl relative overflow-hidden group"
      >
        {/* Match Score Badge */}
        {job.matchScore && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
            className="absolute top-4 right-4"
          >
            <Badge className="bg-primary text-primary-foreground rounded-full px-3 py-1 font-bold">
              <Zap className="h-3 w-3 mr-1" />
              {job.matchScore}% Match
            </Badge>
          </motion.div>
        )}

        {/* Content */}
        <div className="pr-24">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{job.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{job.employer}</p>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.requiredSkills.map(skill => (
            <Badge key={skill} variant="secondary" className="rounded-full text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        {/* Info chips */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium text-foreground">₹{job.wage}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{job.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{job.distance.toFixed(1)} km</span>
          </div>
        </div>

        {/* AI Prediction */}
        <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-primary/5 border border-primary/10">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{completionProb}%</span> completion probability
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            onClick={handleDecline}
          >
            <X className="h-4 w-4 mr-1" />
            Decline
          </Button>
          <Button
            size="sm"
            className="flex-1 rounded-xl gradient-coral text-primary-foreground"
            onClick={handleAccept}
          >
            <Check className="h-4 w-4 mr-1" />
            Accept
          </Button>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-primary/5 to-transparent" />
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Job Acceptance</DialogTitle>
            <DialogDescription>
              Please review the job details before accepting
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">{job.employer}</h4>
                <p className="text-sm text-muted-foreground">{job.title}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Address:</span>
                <span>{job.address || "123 Business Street, City, State 12345"}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Contact Person:</span>
                <span>{job.contactPerson || "Mr. Sharma (HR Manager)"}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Phone:</span>
                <span>{job.contactPhone || "+91 98765 43210"}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span className="text-blue-600">{job.contactEmail || "hr@company.com"}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Once accepted, you'll be expected to report at the scheduled time. 
                Late arrivals or no-shows may affect your rating.
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAccept}
              className="flex-1 gradient-coral text-primary-foreground"
            >
              <Check className="h-4 w-4 mr-2" />
              Confirm Acceptance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobMatchCard;