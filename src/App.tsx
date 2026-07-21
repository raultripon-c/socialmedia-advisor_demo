import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  CampaignStudioCreate,
  CampaignStudioDashboard,
  CampaignStudioList,
  ContentBoardPage,
} from "./features/CampaignStudio";
import { DemoShell } from "./shell/DemoShell";

const seedDemoTenant = () => {
  const tenant = {
    customerCode: "onehealth",
    refNum: "demo",
    tenantName: "One Health",
    customerName: "One Health",
  };
  localStorage.setItem("selectedTenant", JSON.stringify(tenant));
  sessionStorage.setItem(
    "selectedApp",
    JSON.stringify({
      id: "campaign-studio-new",
      name: "Social Media Advisor",
      hoverText: "Social Media Advisor",
      appConfig: { route: "/campaign-studio/campaigns" },
    }),
  );
};

export default function App() {
  useEffect(() => {
    seedDemoTenant();
  }, []);

  return (
    <Routes>
      <Route element={<DemoShell />}>
        <Route path="/" element={<Navigate to="/campaign-studio/campaigns" replace />} />
        <Route path="/campaign-studio/campaigns" element={<CampaignStudioList />} />
        <Route path="/campaign-studio/campaigns/new" element={<CampaignStudioCreate />} />
        <Route path="/campaign-studio/campaigns/:campaignId/dashboard" element={<CampaignStudioDashboard />} />
        <Route path="/campaign-studio/content-board" element={<ContentBoardPage />} />
        <Route path="*" element={<Navigate to="/campaign-studio/campaigns" replace />} />
      </Route>
    </Routes>
  );
}
