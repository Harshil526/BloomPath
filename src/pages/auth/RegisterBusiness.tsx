
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, FileText, Loader2, Mail, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const RegisterBusiness = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: "",
        businessEmail: "",
        password: "",
        location: "",
        contactNo: "",
        managerName: "",
        description: "",
    });
    const [certFile, setCertFile] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCertFile(e.target.files[0]);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!certFile) {
                throw new Error("Please upload your Business Registration Certificate.");
            }

            // 1. Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.businessEmail,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.companyName,
                        role: 'employer',
                    },
                },
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Registration failed");

            // 2. Upload Certificate
            const fileExt = certFile.name.split('.').pop();
            const fileName = `${authData.user.id}/cert.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('business-documents')
                .upload(fileName, certFile);

            if (uploadError) {
                console.error("Upload error:", uploadError);
            }

            const certUrl = fileName;

            // 3. Create Profile & Business Entry
            // First update profiles
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: authData.user.id,
                    email: formData.businessEmail,
                    full_name: formData.companyName,
                    role: 'employer',
                    mobile: formData.contactNo,
                    is_verified: false,
                });

            if (profileError) throw profileError;

            // Then insert into businesses
            const { error: businessError } = await supabase
                .from('businesses')
                .insert({
                    id: authData.user.id,
                    company_name: formData.companyName,
                    business_email: formData.businessEmail,
                    location: formData.location,
                    contact_no: formData.contactNo,
                    manager_name: formData.managerName,
                    description: formData.description,
                    reg_cert_url: certUrl,
                    is_verified: false,
                });

            if (businessError) throw businessError;

            toast.success("Registration submitted! Pending admin verification.");
            navigate("/login");

        } catch (error: any) {
            toast.error(error.message || "Failed to register");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/10 blur-3xl" />

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                <Link to="/login" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                </Link>

                <div className="glass-card p-8 rounded-3xl shadow-xl border-white/50 relative z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Partner with Us</h1>
                        <p className="text-muted-foreground">Find verified talent for your business</p>
                    </div>

                    <form onSubmit={handleRegister} className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="companyName"
                                        name="companyName"
                                        placeholder="EmpowerHer Solutions"
                                        className="pl-9 bg-white/50"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="managerName">Manager Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="managerName"
                                        name="managerName"
                                        placeholder="John Doe"
                                        className="pl-9 bg-white/50"
                                        value={formData.managerName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="businessEmail">Business Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="businessEmail"
                                        name="businessEmail"
                                        type="email"
                                        placeholder="contact@company.com"
                                        className="pl-9 bg-white/50"
                                        value={formData.businessEmail}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Create password"
                                        className="pl-3 bg-white/50"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="contactNo">Contact Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="contactNo"
                                        name="contactNo"
                                        placeholder="+91 99999 88888"
                                        className="pl-9 bg-white/50"
                                        value={formData.contactNo}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="location"
                                        name="location"
                                        placeholder="Mumbai, India"
                                        className="pl-9 bg-white/50"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cert">Registration Certificate</Label>
                                <div className="border-2 border-dashed border-input rounded-xl p-3 text-center cursor-pointer hover:bg-primary/5 transition-colors h-[50px] flex items-center justify-center">
                                    <Input
                                        id="cert"
                                        type="file"
                                        accept=".pdf,.jpg,.png"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        required
                                    />
                                    <Label htmlFor="cert" className="cursor-pointer flex items-center gap-2 w-full justify-center">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                                            {certFile ? certFile.name : "Upload Cert"}
                                        </span>
                                    </Label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Business Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="What do you do?"
                                    className="bg-white/50 resize-none h-[80px]"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 mt-2">
                            <Button
                                type="submit"
                                className="w-full h-12 text-lg gradient-coral shadow-lg hover:shadow-xl transition-all rounded-xl"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                                Register Business
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterBusiness;
