import { motion } from "framer-motion";
import { useAppStore, Skill, SkillStatus } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Camera,
  FileVideo,
  Award,
  X,
  FileUp
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const allSkills = [
  { name: 'Housekeeping', category: 'Domestic' },
  { name: 'Cooking', category: 'Domestic' },
  { name: 'Childcare', category: 'Care' },
  { name: 'Elderly Care', category: 'Care' },
  { name: 'Tailoring', category: 'Skilled' },
  { name: 'Embroidery', category: 'Skilled' },
  { name: 'Office Cleaning', category: 'Commercial' },
  { name: 'Deep Cleaning', category: 'Commercial' },
  { name: 'First Aid', category: 'Medical' },
  { name: 'Laundry', category: 'Domestic' },
];

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillName: string;
  onUpload: (file: File, type: 'photo' | 'video') => void;
}

const UploadModal = ({ isOpen, onClose, skillName, onUpload }: UploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'photo' | 'video'>('photo');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      onUpload(selectedFile, uploadType);
      onClose();
      setSelectedFile(null);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Proof for {skillName}</DialogTitle>
          <DialogDescription>
            Upload photo or video evidence of your skill
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Upload Type Toggle */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={uploadType === 'photo' ? 'default' : 'outline'}
              className={`flex-1 ${uploadType === 'photo' ? 'gradient-coral' : ''}`}
              onClick={() => setUploadType('photo')}
            >
              <Camera className="h-4 w-4 mr-2" />
              Photo
            </Button>
            <Button
              type="button"
              variant={uploadType === 'video' ? 'default' : 'outline'}
              className={`flex-1 ${uploadType === 'video' ? 'gradient-coral' : ''}`}
              onClick={() => setUploadType('video')}
            >
              <FileVideo className="h-4 w-4 mr-2" />
              Video
            </Button>
          </div>

          {/* File Upload Area */}
          <div 
            className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer hover:bg-primary/5 transition-colors"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <FileUp className="h-12 w-12 mx-auto text-primary/50 mb-4" />
            <p className="font-medium mb-1">Click to select file</p>
            <p className="text-sm text-muted-foreground">
              {uploadType === 'photo' 
                ? 'JPG, PNG up to 5MB' 
                : 'MP4, MOV up to 50MB'}
            </p>
            <input
              id="file-upload"
              type="file"
              accept={uploadType === 'photo' ? 'image/*' : 'video/*'}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileUp className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>Tip:</strong> For best results, upload clear {uploadType}s showing you performing the skill.
              Certificates, work samples, or demonstration videos work well.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            className="flex-1 gradient-coral"
          >
            {isUploading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Proof
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SkillVerification = () => {
  const { currentWorker } = useAppStore();
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadModal, setUploadModal] = useState<{
    isOpen: boolean;
    skillName: string;
  }>({ isOpen: false, skillName: '' });

  if (!currentWorker) return null;

  const verifiedCount = currentWorker.skills.filter(s => s.status === 'verified').length;
  const pendingCount = currentWorker.skills.filter(s => s.status === 'pending').length;
  const progress = (verifiedCount / currentWorker.skills.length) * 100;

  const getStatusIcon = (status: SkillStatus) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-5 w-5 text-trust-excellent" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-chart-3" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const getStatusBadge = (status: SkillStatus) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-trust-excellent/20 text-trust-excellent border-trust-excellent/30 rounded-full">
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30 rounded-full">
            Pending Review
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30 rounded-full">
            Rejected
          </Badge>
        );
    }
  };

  const handleOpenUpload = (skillName: string) => {
    setUploadModal({ isOpen: true, skillName });
  };

  const handleUpload = (file: File, type: 'photo' | 'video') => {
    setUploading(uploadModal.skillName);
    // Simulate upload
    setTimeout(() => {
      setUploading(null);
      toast.success("Proof uploaded successfully!", {
        description: `Your ${uploadModal.skillName} verification is now pending review`,
      });
    }, 2000);
  };

  const availableSkills = allSkills.filter(
    skill => !currentWorker.skills.find(s => s.name === skill.name)
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold mb-2"
          >
            Skill Verification
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Verify your skills to unlock better job matches
          </motion.p>
        </div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl gradient-coral flex items-center justify-center">
              <Award className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold">Verification Progress</h2>
              <p className="text-sm text-muted-foreground">
                {verifiedCount} of {currentWorker.skills.length} skills verified
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
            </div>
          </div>
          <Progress value={progress} className="h-3 rounded-full" />
          
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-trust-excellent" />
              <span className="text-sm text-muted-foreground">Verified ({verifiedCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-chart-3" />
              <span className="text-sm text-muted-foreground">Pending ({pendingCount})</span>
            </div>
          </div>
        </motion.div>

        {/* Current Skills */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Skills</h2>
          <div className="grid gap-4">
            {currentWorker.skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-5 rounded-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(skill.status)}
                    <div>
                      <h3 className="font-medium">{skill.name}</h3>
                      <p className="text-sm text-muted-foreground">{skill.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(skill.status)}
                    
                    {skill.status === 'rejected' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => handleOpenUpload(skill.name)}
                        disabled={uploading === skill.name}
                      >
                        {uploading === skill.name ? (
                          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-1" />
                            Re-upload
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                
                {skill.status === 'pending' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-3 rounded-xl bg-chart-3/10 border border-chart-3/20"
                  >
                    <p className="text-sm text-muted-foreground">
                      Your proof is being reviewed. This usually takes 24-48 hours.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Add New Skills */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Add More Skills</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {availableSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="glass-card p-5 rounded-2xl cursor-pointer group hover:border-primary/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{skill.name}</h3>
                    <p className="text-sm text-muted-foreground">{skill.category}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleOpenUpload(skill.name)}
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      Photo
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleOpenUpload(skill.name)}
                    >
                      <FileVideo className="h-4 w-4 mr-1" />
                      Video
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModal.isOpen}
        onClose={() => setUploadModal({ isOpen: false, skillName: '' })}
        skillName={uploadModal.skillName}
        onUpload={handleUpload}
      />
    </>
  );
};

export default SkillVerification;