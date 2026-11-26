"use client";

import { MotionConfig } from "motion/react";
import ScrollExperience from "@/components/ScrollExperience";
import EasterEggs from "@/components/fun/EasterEggs";
import TrainingHud from "@/components/fun/TrainingHud";
import Toast from "@/components/fun/Toast";

import NotebookMode from "@/components/notebook/NotebookMode";

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollExperience />
      {children}
      <TrainingHud />
      <NotebookMode />
      <EasterEggs />
      <Toast />
    </MotionConfig>
  );
}
