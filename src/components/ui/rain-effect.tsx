"use client";

import { useEffect, useRef } from "react";

export function RainEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        const rainDrops: { x: number; y: number; l: number; v: number }[] = [];

        const init = () => {
            for (let i = 0; i < 150; i++) {
                rainDrops.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    l: Math.random() * 1,
                    v: Math.random() * 4 + 2,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.strokeStyle = "rgba(174,194,224,0.5)";
            ctx.lineWidth = 1;
            ctx.lineCap = "round";

            for (let i = 0; i < rainDrops.length; i++) {
                const p = rainDrops[i];
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x, p.y + p.l);
                ctx.stroke();
            }
            move();
            requestAnimationFrame(draw);
        };

        const move = () => {
            for (let i = 0; i < rainDrops.length; i++) {
                const p = rainDrops[i];
                p.y += p.v;
                if (p.y > h) {
                    p.x = Math.random() * w;
                    p.y = -20;
                }
            }
        };

        init();
        draw();

        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
        />
    );
}
