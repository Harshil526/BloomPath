
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Loader2, Lock, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const RegisterWorker = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
    });
    const [aadharFile, setAadharFile] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAadharFile(e.target.files[0]);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log("Starting registration for:", formData.email);

        try {
            if (!aadharFile) {
                throw new Error("Please upload your Aadhar card for verification.");
            }

            // 1. Sign up with Supabase Auth
            console.log("Step 1: Signing up...", formData);
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.name,
                        role: 'worker',
                    },
                },
            });

            console.log("Step 1 Result:", authData, authError);

            if (authError) throw authError;
            if (!authData.user) throw new Error("Registration failed - no user returned");

            // 2. Upload Aadhar Card
            console.log("Step 2: Uploading Aadhar...");
            const fileExt = aadharFile.name.split('.').pop();
            const fileName = `${authData.user.id}/aadhar.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('aadhar-documents')
                .upload(fileName, aadharFile);

            console.log("Step 2 Result:", uploadError ? uploadError : "Success");

            if (uploadError) {
                console.error("Upload error details:", uploadError);
                // Alert the user so they see it
                alert(`Upload Failed: ${uploadError.message}`);
            }

            const aadharUrl = fileName;

            // 3. Update Profile
            console.log("Step 3: Updating Profile...");
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: authData.user.id,
                    email: formData.email,
                    full_name: formData.name,
                    role: 'worker',
                    mobile: formData.mobile,
                    aadhar_url: aadharUrl,
                    is_verified: false,
                });

            console.log("Step 3 Result:", profileError ? profileError : "Success");

            if (profileError) {
                alert(`Profile Update Failed: ${profileError.message}`);
                throw profileError;
            }

            toast.success("Registration successful! Please wait for admin verification.");
            navigate("/login");

        } catch (error: any) {
            console.error("Registration Error Caught:", error);
            alert(`Registration Error: ${error.message}`);
            toast.error(error.message || "Failed to register");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                <Link to="/login" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                </Link>

                <div className="glass-card p-8 rounded-3xl shadow-xl border-white/50 relative z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Join as a Worker</h1>
                        <p className="text-muted-foreground">Start your journey to dignified work</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    className="pl-9 bg-white/50"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-9 bg-white/50"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="mobile"
                                    name="mobile"
                                    placeholder="+91 98765 43210"
                                    className="pl-9 bg-white/50"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    className="pl-9 bg-white/50"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="aadhar">Aadhar Card (Proof of Identity)</Label>
                            <div className="border-2 border-dashed border-input rounded-xl p-4 text-center cursor-pointer hover:bg-primary/5 transition-colors">
                                <Input
                                    id="aadhar"
                                    type="file"
                                    accept="image/*,.pdf"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    required
                                />
                                <Label htmlFor="aadhar" className="cursor-pointer flex flex-col items-center gap-2">
                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        {aadharFile ? aadharFile.name : "Click to upload Aadhar Card"}
                                    </span>
                                </Label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 mt-4 text-lg gradient-coral shadow-lg hover:shadow-xl transition-all rounded-xl"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                            Register & Verify
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterWorker;
