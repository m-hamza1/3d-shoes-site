"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const TOTAL_FRAMES = 240; // 00001.png -> 00240.png (Total 240 frames in images/)
const FOG_COLOR = "#ECECEC"; // Editorial light background

// Helper to format frame path to 5-digit 00001.png
function getFramePath(index: number) {
  const paddedIndex = String(index).padStart(5, "0");
  return `/images/${paddedIndex}.png`;
}

export default function ShoeScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastRenderedIndexRef = useRef<number>(-1);

  // Framer motion scroll tracking across 400vh
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map 0 -> 1 scroll progress to frame index 1 -> 240
  const frameIndexMotion = useTransform(scrollYProgress, [0, 1], [1, TOTAL_FRAMES]);

  // Story Text Opacity & Translation Transforms for the 4 Key Beats
  // Beat 1: 0% - Centered
  const opacityBeat1 = useTransform(scrollYProgress, [0, 0.08, 0.18], [1, 1, 0]);
  const yBeat1 = useTransform(scrollYProgress, [0, 0.08, 0.18], [0, 0, -15]);

  // Beat 2: 25% - Left Aligned
  const opacityBeat2 = useTransform(scrollYProgress, [0.18, 0.25, 0.35, 0.45], [0, 1, 1, 0]);
  const yBeat2 = useTransform(scrollYProgress, [0.18, 0.25, 0.35, 0.45], [15, 0, 0, -15]);

  // Beat 3: 60% - Right Aligned
  const opacityBeat3 = useTransform(scrollYProgress, [0.48, 0.58, 0.68, 0.78], [0, 1, 1, 0]);
  const yBeat3 = useTransform(scrollYProgress, [0.48, 0.58, 0.68, 0.78], [15, 0, 0, -15]);

  // Beat 4: 90% - Centered CTA
  const opacityBeat4 = useTransform(scrollYProgress, [0.82, 0.92, 1], [0, 1, 1]);
  const yBeat4 = useTransform(scrollYProgress, [0.82, 0.92, 1], [15, 0, 0]);

  // Preload Image Sequence from images/00001.png to images/00240.png
  useEffect(() => {
    let count = 0;
    const loadedImgs: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);

      img.onload = () => {
        count++;
        setLoadedCount(count);
        if (count === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        count++;
        setLoadedCount(count);
        if (count === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      loadedImgs[i] = img;
    }

    setImages(loadedImgs);
  }, []);

  // Draw current frame to canvas using "contain" fit & devicePixelRatio scaling
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = images[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear / Fill background seamlessly
      ctx.fillStyle = FOG_COLOR;
      ctx.fillRect(0, 0, width, height);

      // Calculate "contain" aspect ratio fitting
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = width / height;
      let renderW: number, renderH: number, offsetX: number, offsetY: number;

      if (imgRatio > canvasRatio) {
        renderW = width;
        renderH = width / imgRatio;
        offsetX = 0;
        offsetY = (height - renderH) / 2;
      } else {
        renderH = height;
        renderW = height * imgRatio;
        offsetX = (width - renderW) / 2;
        offsetY = 0;
      }

      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
      lastRenderedIndexRef.current = index;
    },
    [images]
  );

  // Resize canvas for sharp rendering on retina displays
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    if (lastRenderedIndexRef.current >= 1) {
      drawFrame(lastRenderedIndexRef.current);
    }
  }, [drawFrame]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Render first frame as soon as loaded
  useEffect(() => {
    if (isLoaded && images.length > 0) {
      handleResize();
      drawFrame(1);
    }
  }, [isLoaded, images, handleResize, drawFrame]);

  // Scroll listener mapped to requestAnimationFrame
  useEffect(() => {
    if (!isLoaded) return;

    let animFrameId: number;

    const unsubscribe = frameIndexMotion.on("change", (latestVal) => {
      const targetIndex = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.round(latestVal))
      );

      if (targetIndex !== lastRenderedIndexRef.current) {
        cancelAnimationFrame(animFrameId);
        animFrameId = requestAnimationFrame(() => {
          drawFrame(targetIndex);
        });
      }
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(animFrameId);
    };
  }, [isLoaded, frameIndexMotion, drawFrame]);

  const loadProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full bg-[#ECECEC]">
      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain block select-none"
        />

        {/* Loading Indicator */}
        <AnimatePresence>
          {!isLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#ECECEC] pointer-events-auto"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 rounded-full border border-black/20 border-t-black animate-spin" />
                <div className="flex flex-col items-center space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] font-medium text-black/60">
                    Loading sneaker sequence…
                  </p>
                  <p className="text-xs font-mono text-black/40">{loadProgress}%</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STORY OVERLAYS (Timed Fade In/Out Beats) */}

        {/* Beat 1: 0% Scroll (Centered) */}
        <motion.div
          style={{ opacity: opacityBeat1, y: yBeat1 }}
          className="absolute top-24 md:top-28 inset-x-0 mx-auto text-center px-6 max-w-xl pointer-events-none"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-black/40 block mb-2">
            Edition 01 // Kinetic
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-black/90 leading-none mb-3">
            Sleek. Engineered.
          </h2>
          <p className="text-base sm:text-lg text-black/60 font-normal">
            Designed for effortless movement.
          </p>
        </motion.div>

        {/* Beat 2: 25% Scroll (Left Aligned) */}
        <motion.div
          style={{ opacity: opacityBeat2, y: yBeat2 }}
          className="absolute left-8 sm:left-16 md:left-24 top-1/2 -translate-y-1/2 max-w-md px-4 pointer-events-none"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-black/40 block mb-2">
            01 / Upper Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-black/90 leading-tight mb-2">
            Built for Comfort.
          </h2>
          <p className="text-base sm:text-lg text-black/60 font-normal leading-relaxed">
            Every layer, thoughtfully engineered.
          </p>
        </motion.div>

        {/* Beat 3: 60% Scroll (Right Aligned) */}
        <motion.div
          style={{ opacity: opacityBeat3, y: yBeat3 }}
          className="absolute right-8 sm:right-16 md:right-24 top-1/2 -translate-y-1/2 max-w-md text-right px-4 pointer-events-none"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-black/40 block mb-2">
            02 / Exploded Anatomy
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-black/90 leading-tight mb-2">
            Layered Engineering.
          </h2>
          <p className="text-base sm:text-lg text-black/60 font-normal leading-relaxed">
            See what’s inside.
          </p>
        </motion.div>

        {/* Beat 4: 90% Scroll (Centered CTA) */}
        <motion.div
          style={{ opacity: opacityBeat4, y: yBeat4 }}
          className="absolute bottom-20 md:bottom-24 inset-x-0 mx-auto text-center px-6 max-w-lg pointer-events-auto"
        >
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-black/90 leading-none mb-3">
            Assembled. Ready.
          </h2>
          <p className="text-base text-black/60 mb-6">
            Scroll back to replay.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="bg-black hover:bg-black/80 transition-colors text-white text-xs uppercase font-medium tracking-[0.15em] px-8 py-3.5 rounded-full shadow-sm active:scale-95 duration-150">
              Acquire Edition
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="border border-black/20 hover:border-black/50 transition-colors text-black/80 text-xs uppercase font-medium tracking-[0.15em] px-6 py-3.5 rounded-full duration-150"
            >
              Replay Sequence ↑
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
