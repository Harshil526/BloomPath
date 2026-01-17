import { motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Calendar, 
  Star, 
  CheckCircle2, 
  TrendingUp,
  Award,
  Edit2,
  Share2
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";

const trustHistory = [
  { month: 'Jul', score: 65 },
  { month: 'Aug', score: 72 },
  { month: 'Sep', score: 78 },
  { month: 'Oct', score: 82 },
  { month: 'Nov', score: 88 },
  { month: 'Dec', score: 92 },
];

const completedTasks = [
  { title: 'Kitchen Deep Clean', date: '2 days ago', rating: 5, feedback: 'Excellent work! Very thorough.' },
  { title: 'Weekly Housekeeping', date: '5 days ago', rating: 4, feedback: 'Good job, arrived on time.' },
  { title: 'Office Sanitization', date: '1 week ago', rating: 5, feedback: 'Professional and efficient.' },
  { title: 'Post-Event Cleanup', date: '2 weeks ago', rating: 5, feedback: 'Amazing attention to detail!' },
];

const WorkerProfile = () => {
  const { currentWorker } = useAppStore();

  if (!currentWorker) return null;

  const handleShare = () => {
    toast.success("Profile link copied!", {
      description: "Share your BloomPath profile with potential employers",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-2xl"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={currentWorker.avatar} alt={currentWorker.name} />
              <AvatarFallback className="text-2xl">{currentWorker.name[0]}</AvatarFallback>
            </Avatar>
            {currentWorker.isAvailable && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-trust-excellent border-4 border-card"
              />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{currentWorker.name}</h1>
              <Badge className="bg-primary/10 text-primary rounded-full">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{currentWorker.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Member since {new Date(currentWorker.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-chart-3 fill-chart-3" />
                <span className="font-medium text-foreground">{currentWorker.rating}</span>
                <span>({currentWorker.completedTasks} reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-xl" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="rounded-xl">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trust Score History */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Trust Score History</h2>
            <div className="flex items-center gap-1 text-trust-excellent">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+27% growth</span>
            </div>
          </div>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trustHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[50, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--trust-excellent))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--trust-excellent))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Skills & Badges */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h2 className="text-lg font-semibold mb-4">Skills & Badges</h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {currentWorker.skills.map(skill => (
              <Badge 
                key={skill.id}
                variant="secondary"
                className={`rounded-full py-2 px-4 ${
                  skill.status === 'verified' 
                    ? 'bg-trust-excellent/10 text-trust-excellent border border-trust-excellent/20' 
                    : 'bg-muted'
                }`}
              >
                {skill.status === 'verified' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                {skill.name}
              </Badge>
            ))}
          </div>

          <h3 className="text-sm font-medium text-muted-foreground mb-3">Achievements</h3>
          <div className="flex gap-3">
            {[
              { icon: Award, label: 'Top Performer', color: 'text-chart-3' },
              { icon: Star, label: '5-Star Rated', color: 'text-primary' },
              { icon: CheckCircle2, label: '100+ Tasks', color: 'text-trust-excellent' },
            ].map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                className="flex flex-col items-center gap-1"
              >
                <div className={`h-12 w-12 rounded-xl bg-muted flex items-center justify-center ${badge.color}`}>
                  <badge.icon className="h-6 w-6" />
                </div>
                <span className="text-xs text-muted-foreground">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Task Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 rounded-2xl"
      >
        <h2 className="text-lg font-semibold mb-4">Recent Work</h2>
        
        <div className="space-y-4">
          {completedTasks.map((task, index) => (
            <motion.div
              key={task.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium">{task.title}</h3>
                  <span className="text-sm text-muted-foreground">{task.date}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">"{task.feedback}"</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-4 w-4 ${i < task.rating ? 'text-chart-3 fill-chart-3' : 'text-muted'}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WorkerProfile;
