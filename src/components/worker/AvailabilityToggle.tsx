import { motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

const AvailabilityToggle = () => {
  const { currentWorker, updateWorkerAvailability } = useAppStore();

  if (!currentWorker) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
        currentWorker.isAvailable 
          ? 'bg-trust-excellent/10 border border-trust-excellent/30' 
          : 'bg-muted border border-border'
      }`}
    >
      <motion.div
        animate={{ scale: currentWorker.isAvailable ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        {currentWorker.isAvailable ? (
          <Wifi className="h-5 w-5 text-trust-excellent" />
        ) : (
          <WifiOff className="h-5 w-5 text-muted-foreground" />
        )}
      </motion.div>
      
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {currentWorker.isAvailable ? 'Available for Work' : 'Currently Offline'}
        </span>
        <span className="text-xs text-muted-foreground">
          {currentWorker.isAvailable ? 'You can receive job offers' : 'Toggle to start receiving jobs'}
        </span>
      </div>

      <Switch
        checked={currentWorker.isAvailable}
        onCheckedChange={updateWorkerAvailability}
        className="data-[state=checked]:bg-trust-excellent"
      />

      {currentWorker.isAvailable && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <Badge className="bg-trust-excellent text-primary-foreground rounded-full animate-pulse">
            Live
          </Badge>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AvailabilityToggle;
