
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/store/appStore";
import { motion } from "framer-motion";
import { Briefcase, Loader2, Lock, Mail, Users } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
    const navigate = useNavigate();
    const { setCurrentRole } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Hardcoded Admin Access
            if (email === "admin@empowerher.com" && password === "SecretAdmin2026") {
                setCurrentRole("admin");
                toast.success("Welcome back, Admin!");
                navigate("/admin-dashboard");
                return;
            }

            // Supabase Login
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                // Fetch user profile to determine role
                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", data.user.id)
                    .single();

                if (profileError) {
                    // Fallback if profile not found (shouldn't happen in normal flow)
                    console.error("Error fetching profile:", profileError);
                    toast.error("Could not fetch user profile.");
                } else {
                    const role = profile.role;
                    // Update store
                    setCurrentRole(role);

                    if (role === 'worker') {
                        navigate("/worker");
                    } else if (role === 'employer') {
                        navigate("/employer");
                    } else if (role === 'admin') {
                        navigate("/admin-dashboard");
                    } else {
                        toast.error("Unknown user role.");
                    }
                    toast.success("Login successful!");
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/20 blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-8 rounded-3xl shadow-xl border-white/50 relative z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-muted-foreground">Sign in to continue your journey</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-9 h-12 bg-white/50 border-input/50 focus:bg-white transition-colors"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password">Password</Label>
                                <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-9 h-12 bg-white/50 border-input/50 focus:bg-white transition-colors"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-lg gradient-coral shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-8 relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted-foreground/20" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or join us today</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <Link to="/register/worker">
                            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all">
                                <Users className="h-6 w-6 text-primary" />
                                <span className="text-xs font-semibold">I'm a Worker</span>
                            </Button>
                        </Link>
                        <Link to="/register/business">
                            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 hover:bg-secondary/20 hover:border-secondary transition-all">
                                <Briefcase className="h-6 w-6 text-secondary-foreground" />
                                <span className="text-xs font-semibold">I'm a Business</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                <p className="text-center mt-6 text-sm text-muted-foreground">
                    Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
