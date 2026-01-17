import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Briefcase, 
  Award, 
  User, 
  Settings,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import WorkerHome from "@/components/worker/WorkerHome";
import JobFeed from "@/components/worker/JobFeed";
import SkillVerification from "@/components/worker/SkillVerification";
import WorkerProfile from "@/components/worker/WorkerProfile";

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/worker", label: "Dashboard", icon: LayoutDashboard },
    { path: "/worker/jobs", label: "Job Feed", icon: Briefcase },
    { path: "/worker/skills", label: "Skills", icon: Award },
    { path: "/worker/profile", label: "Profile", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/worker") return location.pathname === "/worker";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-card border-r border-border p-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="h-10 w-10 rounded-xl gradient-coral flex items-center justify-center shadow-lg">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">BloomPath</span>
        </motion.div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant={isActive(item.path) ? "secondary" : "ghost"}
                className={`w-full justify-start h-12 rounded-xl transition-all duration-300 ${
                  isActive(item.path) 
                    ? "bg-primary/10 text-primary shadow-soft" 
                    : "hover:bg-muted"
                }`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive(item.path) ? "text-primary" : ""}`} />
                {item.label}
              </Button>
            </motion.div>
          ))}
        </nav>

        <div className="pt-6 border-t border-border space-y-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            className="w-full justify-start h-12 rounded-xl"
            onClick={() => navigate("/")}
          >
            <Settings className="mr-3 h-5 w-5" />
            Back to Home
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-coral flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold">BloomPath</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-b border-border overflow-hidden"
          >
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className="w-full justify-start h-12 rounded-xl"
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <AnimatePresence mode="wait">
          <Routes>
            <Route index element={<WorkerHome />} />
            <Route path="jobs" element={<JobFeed />} />
            <Route path="skills" element={<SkillVerification />} />
            <Route path="profile" element={<WorkerProfile />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default WorkerDashboard;
