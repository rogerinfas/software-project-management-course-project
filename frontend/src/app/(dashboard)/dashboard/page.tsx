"use client";

import * as React from "react";
import { DashboardBanner } from "./_components/dashboard-banner";
import { DashboardRoadmap } from "./_components/dashboard-roadmap";
import { DashboardServerStatus } from "./_components/dashboard-server-status";

export default function UnderConstructionPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      <DashboardBanner />
      <DashboardRoadmap />
      <DashboardServerStatus />
    </div>
  );
}
