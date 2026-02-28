"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BrainCircuit, Activity, Database, ShieldCheck, HeartPulse, Stethoscope, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function LearnMorePage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden bg-slate-50/50">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[60%] bg-cyan-400/5 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <Link href="/">
                    <Button variant="ghost" className="mb-8 text-slate-500 hover:text-slate-900 hover:bg-white/50 pl-0 gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Button>
                </Link>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-16"
                >
                    {/* Hero Section */}
                    <motion.div variants={itemVariants} className="text-center space-y-6">
                        <span className="py-1.5 px-4 rounded-full bg-blue-100/50 border border-blue-200 text-blue-600 text-sm font-semibold tracking-wider uppercase">
                            Under the Hood
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
                            How AI Predicts <br />
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Heart Health</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Our application leverages advanced machine learning algorithms trained on thousands of clinical records to identify potential cardiovascular risks early.
                        </p>
                    </motion.div>

                    {/* How It Works */}
                    <motion.div variants={itemVariants}>
                        <Card className="p-8 backdrop-blur-2xl border-white/40 bg-white/70 shadow-xl rounded-2xl ring-1 ring-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                        <Database className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">1. Data Collection</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        The model processes 11 key health indicators including age, vitals, and lifestyle choices to form a comprehensive health profile.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600">
                                        <BrainCircuit className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">2. Pattern Recognition</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Using a customized Random Forest algorithm, the AI compares your data against patterns found in over 70,000 positive and negative cases.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">3. Risk Assessment</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        It calculates a precise probability score, flagging high-risk scenarios that warrant professional medical attention.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Key Metrics Explained */}
                    <motion.div variants={itemVariants} className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-slate-900">Understanding Your Metrics</h2>
                            <p className="text-slate-500 mt-2">Why we ask for this information</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: "Systolic & Diastolic BP", icon: Stethoscope, desc: "High blood pressure puts extra strain on your heart and arteries. Over time, this strain can cause your arteries to become thicker and less flexible." },
                                { title: "Cholesterol Levels", icon: HeartPulse, desc: "High cholesterol can build up in artery walls (plaque), restricting blood flow to the heart and increasing heart attack risk." },
                                { title: "BMI (Body Mass Index)", icon: ShieldCheck, desc: "Being overweight forces the heart to work harder to pump blood, which can lead to high blood pressure and other complications." },
                                { title: "Lifestyle Factors", icon: Activity, desc: "Smoking, alcohol consumption, and physical inactivity are major modifiable risk factors that significantly impact long-term heart health." }
                            ].map((item, idx) => (
                                <Card key={idx} className="p-6 bg-white/60 hover:bg-white/80 transition-colors border-slate-200">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>

                    {/* Disclaimer */}
                    <motion.div variants={itemVariants} className="pb-12">
                        <Card className="p-6 bg-amber-50/50 border-amber-100">
                            <div className="flex gap-4">
                                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                                <div className="space-y-2">
                                    <h4 className="font-bold text-amber-900">Medical Disclaimer</h4>
                                    <p className="text-sm text-amber-800/80 leading-relaxed">
                                        This tool is intended for educational and informational purposes only. It does not constitute medical advice, diagnosis, or treatment.
                                        The AI model provides a statistical probability based on historical data, which may not apply to every individual case.
                                        Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    <div className="flex justify-center pb-12">
                        <Link href="/predict">
                            <Button variant="glow" size="lg" className="rounded-full px-12 h-14 text-lg">
                                Check Your Heart Health Now
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
