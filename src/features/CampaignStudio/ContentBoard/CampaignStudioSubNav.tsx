import React from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";

export const getCampaignStudioPaths = (customerCode?: string, refnum?: string) => {
  const base = customerCode && refnum ? `/${customerCode}/${refnum}/campaign-studio` : "/campaign-studio";
  return {
    campaigns: `${base}/campaigns`,
    contentBoard: `${base}/content-board`,
  };
};

export const CampaignStudioSubNav: React.FC = () => {
  const { customerCode, refnum } = useParams();
  const location = useLocation();
  const paths = getCampaignStudioPaths(customerCode, refnum);
  const onCampaigns = location.pathname.includes("/campaign-studio/campaigns");
  const onContentBoard = location.pathname.includes("/campaign-studio/content-board");

  return (
    <nav className="cs-subnav" aria-label="Social Media Advisor sections">
      <NavLink to={paths.campaigns} className={`cs-subnav__link${onCampaigns ? " is-active" : ""}`}>
        Campaigns
      </NavLink>
      <NavLink to={paths.contentBoard} className={`cs-subnav__link${onContentBoard ? " is-active" : ""}`}>
        Content Board
      </NavLink>
    </nav>
  );
};
