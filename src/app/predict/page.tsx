"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity, Scale, Ruler, Activity as Pulse, FileHeart, Dumbbell, Wine, Cigarette, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Input Interface matches backend expectations
interface FormData {
    age: number;
    gender: number; // 1: Female, 2: Male
    height: number;
    weight: number;
    ap_hi: number;
    ap_lo: number;
    cholesterol: number; // 1, 2, 3
    gluc: number; // 1, 2, 3
    smoke: number; // 0, 1
    alco: number; // 0, 1
    active: number; // 0, 1
}

const initialFormData: FormData = {
    age: 30, // Default age in years
    gender: 1,
    height: 165,
    weight: 65,
    ap_hi: 120,
    ap_lo: 80,
    cholesterol: 1,
    gluc: 1,
    smoke: 0,
    alco: 0,
    active: 1,
};

export default function PredictPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateForm = (): string | null => {
        const { age, height, weight, ap_hi, ap_lo } = formData;
        const errors: string[] = [];

        if (age < 0 || age > 120) errors.push("Age must be between 0 and 120 years.");
        if (height < 50 || height > 250) errors.push("Height must be between 50 and 250 cm.");
        if (weight < 10 || weight > 500) errors.push("Weight must be between 10 and 500 kg.");
        if (ap_hi < 60 || ap_hi > 240) errors.push("Systolic BP must be between 60 and 240.");
        if (ap_lo < 30 || ap_lo > 180) errors.push("Diastolic BP must be between 30 and 180.");
        if (ap_lo >= ap_hi) errors.push("Diastolic BP must be lower than Systolic BP.");

        if (errors.length > 0) return errors.join(" ");
        return null;
    };

    const handlePredict = async () => {
        setLoading(true);
        setError(null);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const text = await response.text();
            console.log("Raw response:", text);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText} - ${text.substring(0, 100)}`);
            }

            const data = JSON.parse(text);

            // Redirect to result page with data
            const queryParams = new URLSearchParams({
                risk: data.risk_percentage.toString(),
                disease: data.has_disease.toString()
            });

            router.push(`/result?${queryParams.toString()}`);

        } catch (err: any) {
            setError(err.message || "Something went wrong");
            setLoading(false);
        }
    };

    const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm hover:border-blue-300";
    const labelClasses = "flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2";
    const selectClasses = "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm cursor-pointer hover:border-blue-300";

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden bg-slate-50/50">
            {/* Background Gradients - Enhanced */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-cyan-400/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[10%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <Link href="/">
                    <Button variant="ghost" className="mb-8 text-slate-500 hover:text-slate-900 hover:bg-white/50 pl-0 gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Button>
                </Link>

                <div className="w-full">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <Card className="p-6 md:p-8 backdrop-blur-2xl border-white/40 bg-white/70 shadow-2xl shadow-slate-200/50 rounded-2xl ring-1 ring-slate-100">
                            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                                <div className="p-3 bg-blue-500/10 rounded-xl">
                                    <Activity className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                        Health Parameters
                                    </h1>
                                    <p className="text-slate-500 text-sm">Enter detailed metrics for accurate analysis</p>
                                </div>
                            </motion.div>

                            <div className="space-y-8">
                                {/* Section 1: Personal Info */}
                                <motion.div variants={itemVariants} className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <User className="w-3 h-3" /> Personal Info
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className={labelClasses}>Age (Years)</label>
                                            <input
                                                type="number"
                                                className={inputClasses}
                                                value={formData.age || ""}
                                                onChange={(e) => handleInputChange("age", parseInt(e.target.value) || 0)}
                                                placeholder="e.g. 45"
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Gender</label>
                                            <div className="relative">
                                                <select
                                                    className={selectClasses}
                                                    value={formData.gender}
                                                    onChange={(e) => handleInputChange("gender", parseInt(e.target.value))}
                                                >
                                                    <option value={1}>Female</option>
                                                    <option value={2}>Male</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Section 2: Body Metrics */}
                                <motion.div variants={itemVariants} className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Scale className="w-3 h-3" /> Body Metrics
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className={labelClasses}>Height (cm)</label>
                                            <div className="relative">
                                                <Ruler className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="number"
                                                    className={cn(inputClasses, "pl-10")}
                                                    value={formData.height || ""}
                                                    onChange={(e) => handleInputChange("height", parseInt(e.target.value) || 0)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Weight (kg)</label>
                                            <div className="relative">
                                                <Scale className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="number"
                                                    className={cn(inputClasses, "pl-10")}
                                                    value={formData.weight || ""}
                                                    onChange={(e) => handleInputChange("weight", parseInt(e.target.value) || 0)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Section 3: Vitals */}
                                <motion.div variants={itemVariants} className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Pulse className="w-3 h-3" /> Vitals
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className={labelClasses}>Systolic BP</label>
                                            <input
                                                type="number"
                                                className={inputClasses}
                                                value={formData.ap_hi || ""}
                                                onChange={(e) => handleInputChange("ap_hi", parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Diastolic BP</label>
                                            <input
                                                type="number"
                                                className={inputClasses}
                                                value={formData.ap_lo || ""}
                                                onChange={(e) => handleInputChange("ap_lo", parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Section 4: Lab Results */}
                                <motion.div variants={itemVariants} className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <FileHeart className="w-3 h-3" /> Lab Results
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className={labelClasses}>Cholesterol</label>
                                            <select
                                                className={selectClasses}
                                                value={formData.cholesterol}
                                                onChange={(e) => handleInputChange("cholesterol", parseInt(e.target.value))}
                                            >
                                                <option value={1}>Normal</option>
                                                <option value={2}>Above Normal</option>
                                                <option value={3}>Well Above Normal</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Glucose</label>
                                            <select
                                                className={selectClasses}
                                                value={formData.gluc}
                                                onChange={(e) => handleInputChange("gluc", parseInt(e.target.value))}
                                            >
                                                <option value={1}>Normal</option>
                                                <option value={2}>Above Normal</option>
                                                <option value={3}>Well Above Normal</option>
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Section 5: Lifestyle */}
                                <motion.div variants={itemVariants} className="pt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex flex-col gap-3 group">
                                            <label className={cn(labelClasses, "mb-0")}>
                                                <Cigarette className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" /> Smoke
                                            </label>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleInputChange("smoke", 0)}
                                                    className={cn("flex-1 py-2.5 rounded-lg text-sm transition-all border", formData.smoke === 0 ? "bg-slate-100 text-slate-900 border-slate-300 font-bold shadow-inner" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300")}
                                                >No</button>
                                                <button
                                                    onClick={() => handleInputChange("smoke", 1)}
                                                    className={cn("flex-1 py-2.5 rounded-lg text-sm transition-all border", formData.smoke === 1 ? "bg-red-50 text-red-600 border-red-200 font-bold shadow-sm" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300")}
                                                >Yes</button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 group">
                                            <label className={cn(labelClasses, "mb-0")}>
                                                <Wine className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" /> Alcohol
                                            </label>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleInputChange("alco", 0)}
                                                    className={cn("flex-1 py-2.5 rounded-lg text-sm transition-all border", formData.alco === 0 ? "bg-slate-100 text-slate-900 border-slate-300 font-bold shadow-inner" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300")}
                                                >No</button>
                                                <button
                                                    onClick={() => handleInputChange("alco", 1)}
                                                    className={cn("flex-1 py-2.5 rounded-lg text-sm transition-all border", formData.alco === 1 ? "bg-amber-50 text-amber-600 border-amber-200 font-bold shadow-sm" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300")}
                                                >Yes</button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 group">
                                            <label className={cn(labelClasses, "mb-0")}>
                                                <Dumbbell className="w-4 h-4 text-slate-400 group-hover:text-green-500 transition-colors" /> Active
                                            </label>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleInputChange("active", 0)}
                                                    className={cn("flex-1 py-2.5 rounded-lg text-sm transition-all border", formData.active === 0 ? "bg-white text-slate-400 border-slate-200 hover:border-slate-300" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300")}
                                                >No</button>
                                                <button
                                                    onClick={() => handleInputChange("active", 1)}
                                                    className={cn("flex-1 py-2.5 rounded-lg text-sm transition-all border", formData.active === 1 ? "bg-green-50 text-green-600 border-green-200 font-bold shadow-sm" : "bg-white text-slate-100 border-slate-200 hover:border-slate-300")}
                                                >Yes</button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {error && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                                        Error: {error}
                                    </div>
                                )}

                                <motion.div variants={itemVariants} className="pt-4">
                                    <Button
                                        variant="glow"
                                        size="lg"
                                        className="w-full text-lg h-14 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
                                        onClick={handlePredict}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                                Processing Analysis...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Analyze Health Risk <Activity className="w-4 h-4" />
                                            </span>
                                        )}
                                    </Button>
                                </motion.div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
