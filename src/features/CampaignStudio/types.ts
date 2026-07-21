export type CampaignStatus = "active" | "scheduled" | "completed" | "draft";

export type CampaignPlatformName = "LinkedIn" | "Instagram" | "Facebook" | "X";

export interface CampaignMetrics {
  clicks: number;
  applicationStarts: number;
  applications: number;
}

export interface CampaignPlatformOutput {
  platform: CampaignPlatformName;
  format: string;
  postDate: string;
  copy: string;
  utmLink: string;
  assetName: string;
  assetSize: string;
  accent: string;
  image: string;
  /** Vertical Video Hub testimonial stills render as 9:16 in post previews */
  mediaKind?: "image" | "video";
  ctaDestination: string;
  altText: string;
  metrics: CampaignMetrics;
}

export interface Campaign {
  id: string;
  name: string;
  role: string;
  roles?: string[];
  events?: string[];
  location: string;
  tone: string;
  audience: string;
  status: CampaignStatus;
  createdAt: string;
  postDate: string;
  platforms: CampaignPlatformOutput[];
  metrics: CampaignMetrics;
  draftPrompt?: string;
}

export interface CampaignStudioAdapter {
  listCampaigns: (refNum: string) => Promise<Campaign[]>;
  saveCampaign: (refNum: string, campaign: Campaign) => Promise<Campaign>;
  deleteCampaign: (refNum: string, campaignId: string) => Promise<void>;
}

export interface BriefDetails {
  role: string;
  location: string;
  audience: string;
  tone: string;
}
