import AnimatedCounter from "@/components/AnimatedCounter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/appStore";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Heart,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const { setCurrentRole, platformStats } = useAppStore();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const handleRoleSelect = (role: 'worker' | 'employer') => {
    setCurrentRole(role);
    navigate(`/${role}`);
  };

  const stats = [
    { label: "Women Empowered", value: platformStats.totalWorkers, icon: Users, suffix: "+" },
    { label: "Tasks Completed", value: platformStats.tasksCompleted, icon: CheckCircle2, suffix: "+" },
    { label: "Fair Wage Index", value: platformStats.fairnessIndex, icon: TrendingUp, suffix: "%" },
    { label: "Active Jobs", value: platformStats.activeJobs, icon: Briefcase, suffix: "" },
  ];

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description: "Smart algorithms connect you with perfect opportunities based on skills and availability.",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Verified profiles, skill assessments, and transparent rating systems protect everyone.",
    },
    {
      icon: Heart,
      title: "Fair Wages",
      description: "AI recommends fair compensation ensuring dignified work for all.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="h-10 w-10 rounded-xl gradient-coral flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">BloomPath</span>
          </motion.div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              variant="outline"
              className="hidden md:flex border-primary/20 hover:bg-primary/5"
              onClick={() => navigate('/admin')}
            >
              Admin
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24">
        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-32 left-[10%] w-20 h-20 rounded-full bg-primary/10 blur-xl"
          animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-48 right-[15%] w-32 h-32 rounded-full bg-secondary/30 blur-2xl"
          animate={{ y: [0, 20, 0], scale: [1, 0.9, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-32 left-[20%] w-24 h-24 rounded-full bg-accent/40 blur-xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="h-4 w-4" />
              Empowering Women Through Technology
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Your Path to{" "}
            <span className="gradient-text">Dignified Work</span>
            <br />
            Starts Here
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            AI-powered platform connecting skilled women with fair, flexible daily work opportunities.
            Build your career, one task at a time.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="h-14 px-8 text-lg gradient-coral text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"
                onClick={() => navigate('/register/worker')}
              >
                <Users className="mr-2 h-5 w-5" />
                I'm a Worker
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg border-2 rounded-2xl bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
                onClick={() => navigate('/register/business')}
              >
                <Briefcase className="mr-2 h-5 w-5" />
                I'm an Employer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass-card p-6 rounded-2xl"
              >
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why <span className="gradient-text">BloomPath</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're building the future of dignified work with cutting-edge AI and a heart for social impact.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="glass-card p-8 rounded-3xl group cursor-pointer"
              >
                <div className="h-14 w-14 rounded-2xl gradient-coral flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Profile", desc: "Sign up and verify your skills with proof" },
              { step: "02", title: "Get Matched", desc: "AI finds perfect opportunities for you" },
              { step: "03", title: "Earn Fairly", desc: "Complete tasks and get paid fairly" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                <div className="text-8xl font-bold text-primary/10 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative z-10 pt-8 pl-4">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center glass-card p-12 rounded-3xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of women who've found dignified work and financial independence through BloomPath.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              className="h-14 px-10 text-lg gradient-coral text-primary-foreground shadow-lg rounded-2xl"
              onClick={() => navigate('/register/worker')}
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-coral flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">BloomPath</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 BloomPath. Empowering women, one opportunity at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
