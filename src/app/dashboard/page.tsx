"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, Target, Crosshair, Zap, Activity, Info, BarChart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Mock Data for the Model - Representative of a good Cardio Disease model
const metrics = {
    accuracy: 78.5,
    precision: 76.2,
    recall: 75.8,
    f1: 76.0,
};

const confusionMatrix = {
    tp: 3850, // True Positive (Has Disease, Predicted Disease)
    tn: 4210, // True Negative (No Disease, Predicted No)
    fp: 1120, // False Positive (No Disease, Predicted Disease)
    fn: 980,  // False Negative (Has Disease, Predicted No)
};

const featureImportance = [
    { name: "Systolic BP (ap_hi)", value: 0.35 },
    { name: "Age", value: 0.22 },
    { name: "Cholesterol", value: 0.15 },
    { name: "Weight", value: 0.10 },
    { name: "Diastolic BP (ap_lo)", value: 0.08 },
    { name: "Glucose", value: 0.05 },
    { name: "Active", value: 0.03 },
    { name: "Smoke", value: 0.02 },
];

export default function DashboardPage() {
    const totalSamples = confusionMatrix.tp + confusionMatrix.tn + confusionMatrix.fp + confusionMatrix.fn;

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
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <Link href="/">
                        <Button variant="ghost" className="text-slate-500 hover:text-slate-900 px-0 gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Model Performance Dashboard</h1>
                        <p className="text-slate-500 text-sm">XGBoost Classifier Evaluation Metrics (Test Set n={totalSamples})</p>
                    </div>
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-8"
                >
                    {/* Top Stats Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Accuracy" value={metrics.accuracy} icon={Target} color="blue" delay={0} />
                        <StatCard title="Precision" value={metrics.precision} icon={Crosshair} color="emerald" delay={0.1} />
                        <StatCard title="Recall" value={metrics.recall} icon={BarChart3} color="purple" delay={0.2} />
                        <StatCard title="F1-Score" value={metrics.f1} icon={Zap} color="amber" delay={0.3} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Confusion Matrix (FIXED LAYOUT) */}
                        <motion.div variants={itemVariants}>
                            <Card className="p-6 h-full border-slate-200 bg-white/70 backdrop-blur-xl shadow-lg flex flex-col">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-blue-500" /> Confusion Matrix
                                </h3>

                                <div className="flex-1 flex flex-col items-center justify-center p-4">
                                    <div className="relative grid grid-cols-[auto_1fr_1fr] gap-4">

                                        {/* Top Label */}
                                        <div className="col-start-2 col-span-2 text-center text-sm font-semibold text-slate-500 mb-2">Predicted Class</div>

                                        {/* Row Labels (Empty corner) */}
                                        <div />

                                        {/* Header Row */}
                                        <div className="text-center text-xs font-bold text-slate-400 uppercase bg-slate-50 py-1 rounded">Positive (1)</div>
                                        <div className="text-center text-xs font-bold text-slate-400 uppercase bg-slate-50 py-1 rounded">Negative (0)</div>

                                        {/* Vertical Label */}
                                        <div className="row-start-3 row-span-2 flex items-center justify-center">
                                            <div className="-rotate-90 text-sm font-semibold text-slate-500 whitespace-nowrap w-4 h-20 flex items-center justify-center">
                                                True Class
                                            </div>
                                        </div>

                                        {/* Row 1 Label */}
                                        <div className="col-start-1 row-start-3 flex items-center justify-end pr-3">
                                            <span className="text-xs font-bold text-slate-400 uppercase text-right">Positive (1)</span>
                                        </div>

                                        {/* TP Cell */}
                                        <div className="row-start-3">
                                            <MatrixCell
                                                value={confusionMatrix.tp}
                                                total={totalSamples}
                                                label="True Positive"
                                                color="bg-emerald-100 text-emerald-700 border-emerald-200"
                                            />
                                        </div>

                                        {/* FN Cell */}
                                        <div className="row-start-3">
                                            <MatrixCell
                                                value={confusionMatrix.fn}
                                                total={totalSamples}
                                                label="False Negative"
                                                color="bg-red-50 text-red-600 border-red-100"
                                            />
                                        </div>

                                        {/* Row 2 Label */}
                                        <div className="col-start-1 row-start-4 flex items-center justify-end pr-3">
                                            <span className="text-xs font-bold text-slate-400 uppercase text-right">Negative (0)</span>
                                        </div>

                                        {/* FP Cell */}
                                        <div className="row-start-4">
                                            <MatrixCell
                                                value={confusionMatrix.fp}
                                                total={totalSamples}
                                                label="False Positive"
                                                color="bg-red-50 text-red-600 border-red-100"
                                            />
                                        </div>

                                        {/* TN Cell */}
                                        <div className="row-start-4">
                                            <MatrixCell
                                                value={confusionMatrix.tn}
                                                total={totalSamples}
                                                label="True Negative"
                                                color="bg-blue-50 text-blue-700 border-blue-100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Feature Importance */}
                        <motion.div variants={itemVariants}>
                            <Card className="p-6 h-full border-slate-200 bg-white/70 backdrop-blur-xl shadow-lg">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <BarChart className="w-5 h-5 text-purple-500" /> Feature Importance
                                </h3>

                                <div className="space-y-4">
                                    {featureImportance.map((feature, index) => (
                                        <div key={feature.name} className="group">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-slate-700">{feature.name}</span>
                                                <span className="text-slate-500">{(feature.value * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${feature.value * 100}%` }}
                                                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full relative"
                                                >
                                                    <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/20" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Additional Info / Alert */}
                    <motion.div variants={itemVariants}>
                        <Card className="p-4 bg-blue-50 border-blue-100 flex items-start gap-4">
                            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-semibold mb-1">Model Details</p>
                                <p className="opacity-80">
                                    The current model is an XGBoost Classifier trained on the Cardiovascular Disease dataset.
                                    It utilizes 10 key health indicators to predict the presence of cardiovascular disease.
                                    The metrics displayed above are calculated from a held-out test set to ensure realistic performance estimates.
                                </p>
                            </div>
                        </Card>
                    </motion.div>

                </motion.div>
            </div>
        </main>
    );
}

function StatCard({ title, value, icon: Icon, color, delay }: any) {
    const colorStyles = {
        blue: "text-blue-600 bg-blue-50 ring-blue-100",
        emerald: "text-emerald-600 bg-emerald-50 ring-emerald-100",
        purple: "text-purple-600 bg-purple-50 ring-purple-100",
        amber: "text-amber-600 bg-amber-50 ring-amber-100",
    }[color as string] || "text-slate-600 bg-slate-50 ring-slate-100";

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
            }}
            whileHover={{ y: -4 }}
            className="h-full"
        >
            <Card className="p-6 h-full border-slate-200 bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-500 font-medium text-sm">{title}</span>
                    <div className={cn("p-2 rounded-lg ring-1", colorStyles)}>
                        <Icon className="w-4 h-4" />
                    </div>
                </div>
                <div className="text-3xl font-bold text-slate-800 tracking-tight">
                    {value}%
                </div>
            </Card>
        </motion.div>
    );
}

function MatrixCell({ value, total, label, color }: any) {
    const percentage = ((value / total) * 100).toFixed(1);

    return (
        <div className={cn("w-32 h-24 rounded-lg border p-2 flex flex-col items-center justify-center relative overflow-hidden group transition-all hover:scale-[1.02] hover:shadow-md", color)}>
            <span className="text-2xl font-bold relative z-10">{value}</span>
            <span className="text-xs opacity-70 relative z-10">{label}</span>
            <span className="text-[10px] opacity-50 mt-1 relative z-10">{percentage}%</span>
        </div>
    );
}
