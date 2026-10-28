"use client";

import { useEffect, useRef } from "react";

type RibbonGlint = {
  x: number;
  speed: number;
  size: number;
  phase: number;
  opacity: number;
};

type RibbonShape = {
  seed: number;
  frequencies: [number, number, number];
  amplitudes: [number, number, number];
  speed: number;
};

export function LiveEnergyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const context = canvas.getContext("2d");
    if (context === null) return;
    const activeCanvas: HTMLCanvasElement = canvas;
    const drawingContext: CanvasRenderingContext2D = context;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let animationId = 0;
    let lastFrame = 0;

    const glints: RibbonGlint[] = Array.from({ length: 12 }, () => ({
      x: Math.random(),
      speed: 0.000035 + Math.random() * 0.00007,
      size: 0.6 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.08 + Math.random() * 0.18,
    }));
    const ribbonShapes: RibbonShape[] = Array.from({ length: 40 }, () => ({
      seed: Math.random() * Math.PI * 2,
      frequencies: [
        0.7 + Math.random() * 0.8,
        1.7 + Math.random() * 1.4,
        3.2 + Math.random() * 2,
      ],
      amplitudes: [
        0.018 + Math.random() * 0.025,
        0.008 + Math.random() * 0.018,
        0.003 + Math.random() * 0.009,
      ],
      speed: 0.65 + Math.random() * 0.7,
    }));

    function resize() {
      const rect = activeCanvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      width = rect.width;
      height = rect.height;
      activeCanvas.width = Math.round(width * dpr);
      activeCanvas.height = Math.round(height * dpr);
      drawingContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(time: number, animate: boolean) {
      if (width <= 0 || height <= 0) return;

      drawingContext.clearRect(0, 0, width, height);

      const glow = drawingContext.createRadialGradient(
        width * 0.62,
        height * 0.58,
        0,
        width * 0.62,
        height * 0.58,
        Math.max(width * 0.52, height * 0.8),
      );
      glow.addColorStop(0, "rgba(30, 180, 155, 0.10)");
      glow.addColorStop(0.48, "rgba(20, 125, 125, 0.045)");
      glow.addColorStop(1, "rgba(8, 47, 50, 0)");
      drawingContext.fillStyle = glow;
      drawingContext.fillRect(0, 0, width, height);

      const phase = animate ? time * 0.00012 : 0;
      const baseWaveY = (x: number) => {
        const dip = Math.exp(-(((x - 0.52) / 0.23) ** 2));
        const rise = Math.max(0, Math.min(1, (x - 0.62) / 0.38));
        const easedRise = rise * rise * (3 - 2 * rise);
        return 0.56 + dip * 0.16 - easedRise * 0.42;
      };
      const waveY = (x: number, shape: RibbonShape) => {
        const motionPhase = phase * shape.speed + shape.seed;
        const organicMotion =
          Math.sin(x * Math.PI * 2 * shape.frequencies[0] + motionPhase) *
            shape.amplitudes[0] +
          Math.sin(x * Math.PI * 2 * shape.frequencies[1] - motionPhase * 0.73) *
            shape.amplitudes[1] +
          Math.sin(x * Math.PI * 2 * shape.frequencies[2] + motionPhase * 1.31) *
            shape.amplitudes[2];

        return baseWaveY(x) + organicMotion;
      };
      const traceRibbon = (offset: number, shape: RibbonShape) => {
        drawingContext.beginPath();
        const sampleCount = 32;
        const firstX = -0.04;
        drawingContext.moveTo(
          firstX * width,
          height * waveY(firstX, shape) + offset,
        );

        for (let index = 1; index <= sampleCount; index++) {
          const x = firstX + (1.08 * index) / sampleCount;
          const y = height * waveY(x, shape) + offset;
          const nextX = x + 1.08 / sampleCount;
          const nextY = height * waveY(nextX, shape) + offset;

          drawingContext.quadraticCurveTo(
            x * width,
            y,
            ((x + nextX) / 2) * width,
            (y + nextY) / 2,
          );
        }
      };
      const centerShape = ribbonShapes[19];

      drawingContext.save();
      drawingContext.globalCompositeOperation = "lighter";
      traceRibbon(0, centerShape);
      drawingContext.strokeStyle = "rgba(30, 205, 182, 0.12)";
      drawingContext.lineWidth = Math.min(24, Math.max(12, height * 0.045));
      drawingContext.shadowBlur = 26;
      drawingContext.shadowColor = "rgba(28, 220, 190, 0.3)";
      drawingContext.stroke();
      drawingContext.restore();

      const ribbonCount = 32;
      for (let index = 0; index < ribbonCount; index++) {
        const progress = index / (ribbonCount - 1);
        const offset = (progress - 0.5) * height * 0.32;
        const centerStrength = 1 - Math.abs(progress - 0.5) * 2;
        const alpha = 0.025 + centerStrength * 0.15;
        const shape = ribbonShapes[index];

        traceRibbon(offset, shape);
        drawingContext.strokeStyle = `rgba(67, 220, 194, ${alpha})`;
        drawingContext.lineWidth = 0.55 + centerStrength * 0.65;
        drawingContext.stroke();
      }

      for (let index = 0; index < 5; index++) {
        const offset = (index - 2) * height * 0.012;
        const shape = ribbonShapes[32 + index];
        traceRibbon(offset, shape);
        drawingContext.strokeStyle =
          index === 2 ? "rgba(164, 255, 225, 0.62)" : "rgba(78, 239, 209, 0.34)";
        drawingContext.lineWidth = index === 2 ? 1.1 : 0.8;
        drawingContext.stroke();
      }

      for (const glint of glints) {
        const drift = animate ? time * glint.speed : 0;
        const x =
          ((glint.x * width + drift * width) % width + width) % width;
        const normalizedX = x / Math.max(width, 1);
        const y =
          height * waveY(normalizedX, centerShape) +
          Math.sin(time * 0.0003 + glint.phase) * 5 * (animate ? 1 : 0);
        const pulse = animate
          ? 0.65 + Math.sin(time * 0.001 + glint.phase) * 0.35
          : 0.8;

        drawingContext.beginPath();
        drawingContext.arc(x, y, glint.size, 0, Math.PI * 2);
        drawingContext.fillStyle = `rgba(161, 255, 226, ${glint.opacity * pulse})`;
        drawingContext.fill();
      }
    }

    function frame(time: number) {
      if (reducedMotion.matches || document.hidden) return;

      if (time - lastFrame >= 33) {
        draw(time, true);
        lastFrame = time;
      }

      animationId = window.requestAnimationFrame(frame);
    }

    function start() {
      window.cancelAnimationFrame(animationId);
      lastFrame = 0;

      if (reducedMotion.matches || document.hidden) {
        draw(0, false);
        return;
      }

      animationId = window.requestAnimationFrame(frame);
    }

    function handleVisibilityChange() {
      start();
    }

    function handleResize() {
      resize();
      start();
    }

    resize();
    start();

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.addEventListener("change", start);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] block h-full w-full overflow-hidden opacity-70 md:opacity-100"
    />
  );
}
