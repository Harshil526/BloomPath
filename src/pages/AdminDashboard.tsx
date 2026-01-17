import { ThemeToggle } from "@/components/ThemeToggle";
import AdminHome from "@/components/admin/AdminHome";
import PlatformStats from "@/components/admin/PlatformStats";
import UserAnalytics from "@/components/admin/UserAnalytics";
import VerificationQueue from "@/components/admin/VerificationQueue";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  LayoutDashboard,
  Menu,
  Settings,
  Shield,
  Sparkles,
  Users,
  X
} from "lucide-react";
import { useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin-dashboard/verify", label: "Verification", icon: Shield },
    { path: "/admin-dashboard/users", label: "Users", icon: Users },
    { path: "/admin-dashboard/stats", label: "Platform Stats", icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path === "/admin-dashboard") return location.pathname === "/admin-dashboard";
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
          <div>
            <span className="text-xl font-bold block">BloomPath</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
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
                className={`w-full justify-start h-12 rounded-xl transition-all duration-300 ${isActive(item.path)
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
          <span className="font-bold">Admin</span>
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
            <Route index element={<AdminHome />} />
            <Route path="verify" element={<VerificationQueue />} />
            <Route path="users" element={<UserAnalytics />} />
            <Route path="stats" element={<PlatformStats />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
