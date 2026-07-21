import facebookImage from "../../assets/campaign-studio/reference/facebook-nursing-lifestyle.png";
import instagramImage from "../../assets/campaign-studio/reference/instagram-nursing-lifestyle.png";
import linkedinImage from "../../assets/campaign-studio/reference/linkedin-nursing-lifestyle.png";
import xImage from "../../assets/campaign-studio/reference/x-nursing-lifestyle.png";

import { BriefDetails, Campaign, CampaignMetrics, CampaignPlatformName, CampaignStudioAdapter } from "./types";

const STORAGE_PREFIX = "txe.campaignStudio.campaigns.v2";

export const channelOptions: CampaignPlatformName[] = ["LinkedIn", "Instagram", "Facebook", "X"];

export const toneOptions = [
  "Friendly and professional",
  "Warm and empathetic",
  "Direct and energetic",
  "Premium and polished",
  "Casual and upbeat",
];

export const templateCards = [
  {
    title: "Start Testimonial Campaign",
    prompt:
      "Create an employee testimonial campaign for One Health. Feature authentic teammate stories that highlight growth, belonging, and patient impact. Target qualified candidates in Durham, NC with a warm, professional tone and invite them to explore open roles.",
    icon: "user",
  },
  {
    title: "Showcase Your Culture",
    prompt:
      "Create an employer brand campaign for One Health that showcases culture, community, and inclusive values. Highlight learning opportunities, team camaraderie, and why candidates should consider One Health before they start actively applying. Use a warm, professional tone.",
    icon: "sparkle",
  },
  {
    title: "Promote Your Achievements",
    prompt:
      "Create an employer brand campaign for One Health that promotes recent awards, recognition, and achievements. Emphasize excellence, pride, and why top talent should join the team. Target qualified candidates with a confident, professional tone and a clear call to explore open roles.",
    icon: "award",
  },
  {
    title: "Promote Your Event",
    prompt:
      "Promote the One Health Nursing Hiring Event in Durham, NC. Drive RSVPs and attendance from experienced nurses with a direct, energetic tone that emphasizes meeting recruiters, learning about open roles, and next-step opportunities.",
    icon: "calendar",
  },
  {
    title: "Launch Hiring Blitz",
    prompt:
      "Create a high-volume hiring blitz campaign for Registered Nurses, Medical Assistants, and Radiology Technicians in Durham, NC. Use an urgent but professional tone for critical openings and encourage candidates to apply quickly.",
    icon: "bolt",
  },
];

export const quickPromptOptions = [
  {
    title: "Clarify target role",
    helper: "Use when AI inferred the role too broadly.",
    example:
      "Create a campaign for Pediatric ICU Registered Nurses in Austin, TX. Focus on experienced nurses with night-shift availability and a warm, professional tone.",
  },
  {
    title: "Define candidate audience",
    helper: "Use when the original prompt missed who should respond.",
    example:
      "Create a campaign for senior backend engineers in New York. Target candidates with fintech experience who care about scale, reliability, and technical ownership. Use a direct, confident tone.",
  },
  {
    title: "Refine message tone",
    helper: "Use when tone needs more nuance than a dropdown.",
    example:
      "Create a nursing recruitment campaign in Texas. Use a compassionate, mission-driven tone for experienced nurses who care about patient impact, stability, and team support.",
  },
  {
    title: "Include multiple roles",
    helper: "Use when one campaign should cover a hiring push.",
    example:
      "Promote healthcare openings in Dallas for Registered Nurses, Medical Assistants, and Radiology Technicians. Keep the message broad enough for all roles while emphasizing growth, care quality, and local opportunity.",
  },
  {
    title: "Add exclusions to avoid",
    helper: "Use when there are claims or details to avoid.",
    example:
      "Create a campaign for retail associates in Phoenix. Focus on career growth and flexible scheduling. Do not mention weekend shifts or sign-on bonuses.",
  },
  {
    title: "Use employer brand angle",
    helper: "Use when this is more brand-led than requisition-led.",
    example:
      "Build an employer-brand campaign for experienced nurses in Houston. Emphasize culture, stability, patient impact, and why candidates should consider us before actively applying.",
  },
];

export const generationSteps = [
  "Analyzing audience...",
  "Finding the right message...",
  "Crafting content...",
  "Generating assets...",
  "Preparing your campaign...",
];

export const getSelectedTenantName = () => {
  try {
    const selectedTenant = JSON.parse(localStorage.getItem("selectedTenant") || "{}");
    return selectedTenant?.tenantName || selectedTenant?.customerName || "Phenom";
  } catch {
    return "Phenom";
  }
};

export const getSelectedTenantInitial = () => getSelectedTenantName().trim().charAt(0).toUpperCase() || "P";

export const getRefNum = () => {
  try {
    const selectedTenant = JSON.parse(localStorage.getItem("selectedTenant") || "{}");
    return selectedTenant?.refNum || "demo";
  } catch {
    return "demo";
  }
};

export const parseBrief = (brief: string, toneFallback = toneOptions[0]): BriefDetails => {
  const structuredRoleMatch = brief.match(/Target role or roles:\s*([^.]*)\./i);
  const structuredLocationMatch = brief.match(/Location or work model:\s*([^.]*)\./i);
  const roleMatch = brief.match(/(?:for|hiring|openings? for)\s+([^,.]+?)(?:\s+in\s+|\.|,|$)/i);
  const locationMatch = brief.match(/\bin\s+([A-Z][A-Za-z\s]+,\s*[A-Z]{2}|[A-Z][A-Za-z\s]+)(?:\.|,|$)/);
  const tone = toneOptions.find((option) => brief.toLowerCase().includes(option.toLowerCase().split(" ")[0])) || toneFallback;

  return {
    role: structuredRoleMatch?.[1]?.trim() || roleMatch?.[1]?.trim() || "priority roles",
    location: structuredLocationMatch?.[1]?.trim() || locationMatch?.[1]?.trim() || "target markets",
    audience: brief.toLowerCase().includes("experienced") ? "experienced candidates" : "qualified candidates",
    tone,
  };
};

export const makeCampaignName = (brief: string) => {
  const details = parseBrief(brief);
  const briefText = brief.toLowerCase();
  const roleText = details.role.toLowerCase();

  if (briefText.includes("event") || briefText.includes("rsvp") || briefText.includes("attendance")) return "Event Registration Campaign";
  if (briefText.includes("passive")) return "Passive Talent Outreach";
  if (briefText.includes("brand") || briefText.includes("culture") || briefText.includes("values")) return "Employer Brand Campaign";
  if (briefText.includes("community") || briefText.includes("pipeline")) return "Talent Community Growth";
  if (briefText.includes("blitz") || briefText.includes("critical") || briefText.includes("high-volume")) return "High-Volume Hiring Campaign";
  if (roleText.includes("nurse") || roleText.includes("clinical") || roleText.includes("medical") || roleText.includes("health")) return "Healthcare Hiring Campaign";
  if (roleText.includes("engineer") || roleText.includes("software") || roleText.includes("developer")) return "Technical Talent Outreach";
  if (roleText.includes("retail") || roleText.includes("associate")) return "Retail Hiring Campaign";

  return "Talent Attraction Campaign";
};

const platformImageMap: Record<CampaignPlatformName, string> = {
  Facebook: facebookImage,
  Instagram: instagramImage,
  LinkedIn: linkedinImage,
  X: xImage,
};

const platformAccentMap: Record<CampaignPlatformName, string> = {
  Facebook: "#1877f2",
  Instagram: "#c13584",
  LinkedIn: "#0a66c2",
  X: "#111827",
};

const platformSourceMap: Record<CampaignPlatformName, string> = {
  Facebook: "facebook",
  Instagram: "instagram",
  LinkedIn: "linkedin",
  X: "x",
};

const toTrackingValue = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const buildChannelUtmLink = (destination: string, platform: CampaignPlatformName, campaignId: string) => {
  const fallbackDestination = `https://careers.dukehealth.org/jobs?campaign=${encodeURIComponent(campaignId)}`;

  try {
    const url = new URL(destination || fallbackDestination);
    url.searchParams.set("utm_source", platformSourceMap[platform]);
    url.searchParams.set("utm_medium", "social");
    url.searchParams.set("utm_campaign", campaignId);
    url.searchParams.set("utm_content", `${toTrackingValue(platform)}-campaign-post`);
    return url.toString();
  } catch {
    const baseDestination = destination || fallbackDestination;
    const separator = baseDestination.includes("?") ? "&" : "?";
    return `${baseDestination}${separator}utm_source=${platformSourceMap[platform]}&utm_medium=social&utm_campaign=${encodeURIComponent(campaignId)}&utm_content=${toTrackingValue(platform)}-campaign-post`;
  }
};

const totals = (platforms: Campaign["platforms"]): CampaignMetrics =>
  platforms.reduce(
    (acc, platform) => ({
      clicks: acc.clicks + platform.metrics.clicks,
      applicationStarts: acc.applicationStarts + platform.metrics.applicationStarts,
      applications: acc.applications + platform.metrics.applications,
    }),
    { clicks: 0, applicationStarts: 0, applications: 0 }
  );

export const createCampaignFromBrief = (
  brief: string,
  selectedChannels: CampaignPlatformName[],
  campaignName: string,
  tone: string,
  dueDate: string,
  selectedCtaDestination?: string,
  campaignId?: string,
  createdAt?: string,
  options?: { mediaImages?: string[] }
): Campaign => {
  const details = parseBrief(brief, tone);
  const id = campaignId || `campaign-${Date.now()}`;
  const tenantName = getSelectedTenantName();
  const employerName = tenantName === "Phenom" ? "One Health" : tenantName;
  const ctaDestination = selectedCtaDestination || `https://careers.dukehealth.org/jobs?campaign=${id}`;
  const mediaImages = options?.mediaImages?.filter(Boolean) || [];

  const platforms = selectedChannels.map((platform, index) => {
    const utmLink = buildChannelUtmLink(ctaDestination, platform, id);
    const copyByPlatform: Record<CampaignPlatformName, string> = {
      LinkedIn: `${employerName} is hiring ${details.role} in ${details.location}. Connect your experience with work that supports patients, families, and care teams every day. Learn more: ${utmLink}`,
      Instagram: `Ready to bring your care skills to ${employerName}? 💙 Explore ${details.role} opportunities in ${details.location} and join a team built around patient impact. #OneHealthCareers #NursingJobs #HealthcareCareers Learn more: ${utmLink}`,
      Facebook: `Join ${employerName} and make an impact as part of our ${details.role} team in ${details.location}. We are reaching ${details.audience} with a ${details.tone.toLowerCase()} message. Learn more: ${utmLink}`,
      X: `${employerName} is hiring ${details.role} in ${details.location}. Make a difference with a team focused on care, community, and growth. #OneHealth #HealthcareJobs Learn more: ${utmLink}`,
    };
    const copy = copyByPlatform[platform];
    const mediaImage = mediaImages[index % Math.max(mediaImages.length, 1)];
    const isVideoMedia = Boolean(mediaImage);

    return {
      platform,
      format: isVideoMedia
        ? "Vertical video (9:16)"
        : platform === "X"
          ? "Short social post"
          : "Social feed post",
      postDate: dueDate,
      copy,
      utmLink,
      assetName: `${platform.toLowerCase()}-${id}.${isVideoMedia ? "mp4" : "png"}`,
      assetSize: isVideoMedia ? "1080 x 1920" : platform === "LinkedIn" ? "1200 x 627" : "1080 x 1080",
      accent: platformAccentMap[platform],
      image: mediaImage || platformImageMap[platform],
      mediaKind: (isVideoMedia ? "video" : "image") as "image" | "video",
      ctaDestination,
      altText: mediaImage
        ? `${employerName} employee testimonial still for ${platform}`
        : `${employerName} nursing team lifestyle image for ${platform}`,
      metrics: {
        clicks: 140 + index * 37,
        applicationStarts: 34 + index * 9,
        applications: 11 + index * 4,
      },
    };
  });

  return {
    id,
    name: campaignName || makeCampaignName(brief),
    role: details.role,
    roles: details.role.split(/[,;]/).map((item) => item.trim()).filter(Boolean),
    location: details.location,
    tone: details.tone,
    audience: details.audience,
    status: "scheduled",
    createdAt: createdAt || new Date().toISOString(),
    postDate: dueDate,
    platforms,
    metrics: totals(platforms),
    draftPrompt: brief,
  };
};

const daysFromNow = (days: number) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

const withPlatformMetrics = (
  campaign: Campaign,
  metricsByPlatform: Partial<Record<CampaignPlatformName, CampaignMetrics>>
): Campaign => {
  const platforms = campaign.platforms.map((platform) => ({
    ...platform,
    metrics: metricsByPlatform[platform.platform] || { clicks: 0, applicationStarts: 0, applications: 0 },
  }));

  return {
    ...campaign,
    platforms,
    metrics: totals(platforms),
  };
};

const demoCampaigns = (): Campaign[] => {
  const campaigns: Campaign[] = [
    withPlatformMetrics(
      {
        ...createCampaignFromBrief(
          "Create a campaign for Registered Nurse, PICU in Durham, NC. Target experienced nurses with a warm and professional tone.",
          ["LinkedIn", "Facebook", "Instagram"],
          "Healthcare Hiring Campaign",
          toneOptions[0],
          daysFromNow(0),
          "https://careers.dukehealth.org/search-jobs/registered%20nurse",
          "demo-campaign-1",
          daysFromNow(-8)
        ),
        status: "active",
      },
      {
        LinkedIn: { clicks: 2528, applicationStarts: 1264, applications: 1011 },
        Facebook: { clicks: 902, applicationStarts: 631, applications: 126 },
        Instagram: { clicks: 181, applicationStarts: 45, applications: 2 },
      }
    ),
    withPlatformMetrics(
      {
        ...createCampaignFromBrief(
          "Create a campaign for Nurse Practitioners, Medical Assistants, and Radiology Technicians in Raleigh, NC. Use a premium and polished tone.",
          ["LinkedIn", "Facebook"],
          "Multi-Role Clinical Hiring Campaign",
          toneOptions[3],
          daysFromNow(5),
          "https://careers.dukehealth.org/search-jobs/clinical",
          "demo-campaign-2",
          daysFromNow(-2)
        ),
        roles: ["Nurse Practitioners", "Medical Assistants", "Radiology Technicians"],
        status: "scheduled",
      },
      {
        LinkedIn: { clicks: 721, applicationStarts: 302, applications: 118 },
        Facebook: { clicks: 539, applicationStarts: 214, applications: 87 },
      }
    ),
    withPlatformMetrics(
      {
        ...createCampaignFromBrief(
          "Promote the One Health Nursing Hiring Event in Durham, NC. Drive RSVPs and attendance with a direct and energetic tone.",
          ["Instagram", "Facebook", "X"],
          "Nursing Event RSVP Campaign",
          toneOptions[2],
          daysFromNow(-7),
          "https://careers.dukehealth.org/events/duke-health-nursing-hiring-event",
          "demo-campaign-3",
          daysFromNow(-20)
        ),
        events: ["One Health Nursing Hiring Event", "Clinical Careers Open House", "Virtual Nurse Recruitment Webinar"],
        status: "completed",
      },
      {
        Instagram: { clicks: 844, applicationStarts: 398, applications: 166 },
        Facebook: { clicks: 691, applicationStarts: 286, applications: 112 },
        X: { clicks: 254, applicationStarts: 72, applications: 29 },
      }
    ),
    {
      ...withPlatformMetrics(
        {
          ...createCampaignFromBrief(
            "Create a campaign for Patient Care Technicians in Charlotte, NC. Target qualified candidates with a friendly and professional tone.",
            ["LinkedIn", "Instagram", "Facebook", "X"],
            "Patient Care Technician Launch",
            toneOptions[0],
            daysFromNow(3),
            "https://careers.dukehealth.org/search-jobs/patient%20care%20technician",
            "demo-campaign-4",
            daysFromNow(0)
          ),
          status: "scheduled",
        },
        {}
      ),
      metrics: { clicks: 0, applicationStarts: 0, applications: 0 },
    },
    {
      ...createCampaignFromBrief(
        "Create a campaign for Pharmacy Technicians in Durham, NC. Target qualified candidates with a warm and empathetic tone.",
        ["LinkedIn"],
        "Pharmacy Technician Draft",
        toneOptions[1],
        daysFromNow(10),
        "https://careers.dukehealth.org/search-jobs/pharmacy%20technician",
        "demo-campaign-5",
        daysFromNow(0)
      ),
      status: "draft",
      metrics: { clicks: 0, applicationStarts: 0, applications: 0 },
      platforms: createCampaignFromBrief(
        "Create a campaign for Pharmacy Technicians in Durham, NC. Target qualified candidates with a warm and empathetic tone.",
        ["LinkedIn"],
        "Pharmacy Technician Draft",
        toneOptions[1],
        daysFromNow(10),
        "https://careers.dukehealth.org/search-jobs/pharmacy%20technician",
        "demo-campaign-5",
        daysFromNow(0)
      ).platforms.map((platform) => ({ ...platform, metrics: { clicks: 0, applicationStarts: 0, applications: 0 } })),
    },
  ];

  return campaigns;
};

const storageKey = (refNum: string) => `${STORAGE_PREFIX}.${refNum || "demo"}`;
const memoryCampaignStore: Record<string, Campaign[]> = {};

const safeParseCampaigns = (value: string | null): Campaign[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const readStoredCampaigns = (key: string) => {
  const memoryCampaigns = memoryCampaignStore[key] || [];
  try {
    const storedCampaigns = safeParseCampaigns(localStorage.getItem(key));
    return [
      ...memoryCampaigns,
      ...storedCampaigns.filter((storedCampaign) => !memoryCampaigns.some((campaign) => campaign.id === storedCampaign.id)),
    ];
  } catch {
    return memoryCampaigns;
  }
};

const writeStoredCampaigns = (key: string, campaigns: Campaign[]) => {
  const userCampaigns = campaigns.filter((campaign) => !isDemoCampaign(campaign));
  memoryCampaignStore[key] = userCampaigns;
  try {
    localStorage.setItem(key, JSON.stringify(userCampaigns));
  } catch {
    // Keep the session working even when browser storage is blocked or full.
  }
};

const isDemoCampaign = (campaign: Campaign) => campaign.id.startsWith("demo-campaign-");

const isLegacyRoleName = (name: string) => /\b(campaign|event)\b/i.test(name) && /(\s-\s|,|\bregistered\b|\bnurse\b|\bengineer\b|\bdeveloper\b|\bassociate\b|\bpicu\b)/i.test(name);
const normalizeCampaignName = (campaign: Campaign): Campaign => {
  if (!isLegacyRoleName(campaign.name)) return campaign;

  return {
    ...campaign,
    name: makeCampaignName(getCampaignObjectiveBrief(campaign)),
  };
};

const normalizeCampaignTracking = (campaign: Campaign): Campaign => ({
  ...campaign,
  platforms: campaign.platforms.map((platform) => ({
    ...platform,
    utmLink: buildChannelUtmLink(platform.ctaDestination, platform.platform, campaign.id),
  })),
});

const getCampaignObjectiveBrief = (campaign: Campaign) => {
  const location = campaign.location && campaign.location !== "target markets" ? ` in ${campaign.location}` : "";
  return `Create a campaign for ${campaign.role}${location}. Target ${campaign.audience} with a ${campaign.tone.toLowerCase()} tone.`;
};

const withBaseCampaigns = (campaigns: Campaign[]) => {
  const baseCampaigns = demoCampaigns().map(normalizeCampaignName).map(normalizeCampaignTracking);
  const userCampaigns = campaigns.filter((campaign) => !isDemoCampaign(campaign)).map(normalizeCampaignName).map(normalizeCampaignTracking);
  return [
    ...userCampaigns,
    ...baseCampaigns.filter((baseCampaign) => !userCampaigns.some((campaign) => campaign.id === baseCampaign.id)),
  ];
};

export const campaignStudioAdapter: CampaignStudioAdapter = {
  listCampaigns: async (refNum: string) => {
    const key = storageKey(refNum);
    const campaigns = withBaseCampaigns(readStoredCampaigns(key));
    writeStoredCampaigns(key, campaigns);
    return campaigns;
  },
  saveCampaign: async (refNum: string, campaign: Campaign) => {
    const key = storageKey(refNum);
    const campaigns = readStoredCampaigns(key).filter((item) => !isDemoCampaign(item));
    const normalizedCampaign = normalizeCampaignTracking(campaign);
    const nextCampaigns = [normalizedCampaign, ...campaigns.filter((item) => item.id !== campaign.id)];
    writeStoredCampaigns(key, nextCampaigns);
    return normalizedCampaign;
  },
  deleteCampaign: async (refNum: string, campaignId: string) => {
    const key = storageKey(refNum);
    const campaigns = readStoredCampaigns(key);
    writeStoredCampaigns(key, campaigns.filter((campaign) => campaign.id !== campaignId));
  },
};
