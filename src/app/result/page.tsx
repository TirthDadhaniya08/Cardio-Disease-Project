"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertTriangle, HeartPulse, Activity, Stethoscope, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ConfettiFireworks } from "@/components/ui/confetti-fireworks";
import { RainEffect } from "@/components/ui/rain-effect";

function ResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Parse query parameters
    const riskPercentage = parseFloat(searchParams.get("risk") || "0");
    const hasDisease = searchParams.get("disease") === "true";

    // We can also pass input data for personalized insights if needed
    // const age = searchParams.get("age");

    // Determine risk level and configuration
    const isHighRisk = hasDisease || riskPercentage > 50;

    const config = isHighRisk ? {
        theme: "red",
        gradient: "from-red-50 to-orange-50",
        accent: "text-red-600",
        border: "border-red-200",
        icon: AlertTriangle,
        title: "High Risk Detected",
        subtitle: "Immediate attention recommended",
        description: "Our AI analysis indicates a significant probability of cardiovascular issues based on the provided parameters."
    } : {
        theme: "emerald",
        gradient: "from-emerald-50 to-teal-50",
        accent: "text-emerald-600",
        border: "border-emerald-200",
        icon: CheckCircle,
        title: "Low Risk Detected",
        subtitle: "Health metrics appear stable",
        description: "Our AI analysis indicates your cardiovascular profile is currently within a healthy range."
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden bg-slate-50/50">
            {isHighRisk ? <RainEffect /> : <ConfettiFireworks />}

            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className={cn("absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-30 animate-pulse", isHighRisk ? "bg-red-500/20" : "bg-emerald-500/20")} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <Link href="/predict">
                    <Button variant="ghost" className="mb-8 text-slate-500 hover:text-slate-900 hover:bg-white/50 pl-0 gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Analysis
                    </Button>
                </Link>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-12 gap-8"
                >
                    {/* Main Result Card */}
                    <motion.div variants={itemVariants} className="md:col-span-12 lg:col-span-8">
                        <Card className={cn(
                            "p-8 overflow-hidden relative backdrop-blur-2xl border bg-white/80 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-8",
                            config.border
                        )}>
                            <div className={cn("absolute top-0 left-0 w-full h-2",
                                isHighRisk ? "bg-gradient-to-r from-orange-500 to-red-600" : "bg-gradient-to-r from-emerald-400 to-teal-500"
                            )} />

                            {/* Icon Circle */}
                            <div className="flex-shrink-0">
                                <div className={cn(
                                    "w-32 h-32 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white relative z-10",
                                    isHighRisk ? "bg-red-100 text-red-500" : "bg-emerald-100 text-emerald-600"
                                )}>
                                    <config.icon className="w-16 h-16" />
                                </div>
                            </div>

                            <div className="flex-grow text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-slate-100 text-slate-500 mb-3">
                                    <Activity className="w-3 h-3" /> AI Analysis Complete
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{config.title}</h1>
                                <p className={cn("text-xl font-medium mb-4", config.accent)}>{config.subtitle}</p>
                                <p className="text-slate-600 leading-relaxed text-lg max-w-2xl">
                                    {config.description}
                                </p>
                            </div>
                        </Card>

                        {/* Detailed Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <motion.div variants={itemVariants}>
                                <Card className="p-6 h-full border-slate-200 bg-white/60 hover:bg-white/90 transition-colors shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600">
                                            <HeartPulse className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-semibold text-slate-900">Risk Assessment</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-slate-500 text-sm font-medium">calculated probability</span>
                                            <span className={cn("text-3xl font-bold", config.accent)}>{riskPercentage.toFixed(1)}%</span>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${riskPercentage}%` }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                className={cn("h-full rounded-full", isHighRisk ? "bg-red-500" : "bg-emerald-500")}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400">
                                            Score based on age, BMI, blood pressure, and lifestyle factors.
                                        </p>
                                    </div>
                                </Card>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Card className="p-6 h-full border-slate-200 bg-white/60 hover:bg-white/90 transition-colors shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-purple-50 rounded-lg text-purple-600">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-semibold text-slate-900">Key Contributors</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {[
                                            "Blood Pressure Analysis",
                                            "Body Mass Index (BMI)",
                                            "Cholesterol Levels",
                                            "Age & Lifestyle Indicators"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Sidebar / Recommendations */}
                    <motion.div variants={itemVariants} className="md:col-span-12 lg:col-span-4">
                        <Card className="p-6 bg-slate-900 text-slate-100 h-full shadow-xl relative overflow-hidden">
                            {/* Decorative blob */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />

                            <div className="relative z-10">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <Stethoscope className="w-5 h-5 text-blue-400" /> Recommendations
                                </h3>

                                <div className="space-y-6">
                                    {isHighRisk ? (
                                        <>
                                            <RecommendationItem title="Consult a Specialist" text="Schedule an appointment with a cardiologist for a comprehensive check-up." />
                                            <RecommendationItem title="Monitor Blood Pressure" text="Track your BP daily. Consistency is key to understanding your heart health." />
                                            <RecommendationItem title="Lifestyle Adjustment" text="Consider reducing sodium intake and increasing moderate physical activity." />
                                        </>
                                    ) : (
                                        <>
                                            <RecommendationItem title="Maintain Activity" text="Continue your current exercise routine to support cardiovascular health." />
                                            <RecommendationItem title="Regular Check-ups" text="Routine annual physicals help catch potential issues early." />
                                            <RecommendationItem title="Balanced Diet" text="Focus on a heart-healthy diet rich in fruits, vegetables, and whole grains." />
                                        </>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-800">
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        *Disclaimer: This AI analysis is for informational purposes only and does not constitute medical advice or diagnosis. Always consult a healthcare professional.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}

function RecommendationItem({ title, text }: { title: string, text: string }) {
    return (
        <div className="group">
            <h4 className="font-semibold text-blue-200 mb-1 flex items-center gap-2 group-hover:text-blue-100 transition-colors">
                <ChevronRight className="w-3 h-3 text-blue-500" /> {title}
            </h4>
            <p className="text-sm text-slate-400 ml-5 group-hover:text-slate-300 transition-colors">
                {text}
            </p>
        </div>
    )
}

export default function ResultPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
        }>
            <ResultContent />
        </Suspense>
    );
}
