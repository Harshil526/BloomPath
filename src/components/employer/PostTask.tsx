import { motion } from "framer-motion";
import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Zap, DollarSign, CheckCircle2 } from "lucide-react";

const skills = ['Housekeeping', 'Cooking', 'Childcare', 'Elderly Care', 'Tailoring', 'Office Cleaning'];

const PostTask = () => {
  const { postTask, calculateFairWage } = useAppStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("3");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [wageMultiplier, setWageMultiplier] = useState([1]);

  const fairWage = calculateFairWage(selectedSkills.length ? selectedSkills : ['Housekeeping'], `${duration} hours`);
  const adjustedWage = Math.round(fairWage * wageMultiplier[0]);

  const handleSubmit = () => {
    if (!title || !description) {
      toast.error("Please fill all fields");
      return;
    }
    postTask({ title, description, wage: adjustedWage, duration: `${duration} hours`, requiredSkills: selectedSkills });
    toast.success("Task posted successfully! 🎉");
    setTitle(""); setDescription(""); setSelectedSkills([]);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Post a New Task</h1>
        <p className="text-muted-foreground">AI will help you find the perfect worker</p>
      </div>

      <div className="glass-card p-6 rounded-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Task Title</label>
          <Input placeholder="e.g., Daily House Cleaning" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea placeholder="Describe the task..." value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl min-h-24" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Required Skills</label>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <Badge key={skill} variant={selectedSkills.includes(skill) ? "default" : "outline"} className="cursor-pointer rounded-full py-2 px-4" onClick={() => setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])}>
                {selectedSkills.includes(skill) && <CheckCircle2 className="h-3 w-3 mr-1" />}{skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Duration (hours): {duration}</label>
          <Slider value={[parseInt(duration)]} onValueChange={(v) => setDuration(v[0].toString())} min={1} max={8} step={1} />
        </div>

        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-medium">AI Fair Wage Recommendation</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Suggested: ₹{fairWage}</span>
            <span className="text-2xl font-bold text-primary">₹{adjustedWage}</span>
          </div>
          <Slider value={wageMultiplier} onValueChange={setWageMultiplier} min={0.8} max={1.5} step={0.1} />
          <p className="text-xs text-muted-foreground mt-2">Adjust wage multiplier (0.8x - 1.5x)</p>
        </div>

        <Button className="w-full h-12 gradient-coral text-primary-foreground rounded-xl" onClick={handleSubmit}>
          <DollarSign className="h-4 w-4 mr-2" />Post Task for ₹{adjustedWage}
        </Button>
      </div>
    </motion.div>
  );
};

export default PostTask;
