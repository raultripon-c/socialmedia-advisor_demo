export type BoardHorizon = "day" | "week" | "month" | "quarter";

export type CardStatus = "to_be_reviewed" | "awaiting_uploads" | "ready_for_campaign" | "reviewed";

/** Origin workflow that produced an AI card */
export type CardSource = "cultural" | "media_listening" | "testimonial" | "campaign";

export type CardContentType =
  | "Calendar Draft"
  | "Brand Mention"
  | "Award"
  | "Hiring Campaign"
  | "Employee Story"
  | "Employee Milestone"
  | "Testimonial Opportunity";

/** Kind of item a drawer/card represents */
export type BoardItemKind = "anchor" | "card";

export type EventRule =
  | "third_monday"
  | "first_friday"
  | "last_monday"
  | "first_monday"
  | "fourth_thursday"
  | "second_sunday"
  | "month_start"
  | "month_mid";

export interface CulturalCalendarEvent {
  id: string;
  title: string;
  /** Month is 1-12 */
  month: number;
  /** Fixed day of month when applicable; omitted for rule-based events */
  day?: number;
  /** Rule used when day is not fixed */
  rule?: EventRule;
  category: string;
  corporateValue: string;
  description: string;
  contentTemplates: string[];
}

export interface ReviewHistoryEntry {
  at: string;
  label: string;
}

/** Uploaded employee testimonial video from Video Hub (demo catalog). */
export interface VideoHubVideo {
  id: string;
  title: string;
  employeeName: string;
  department?: string;
  durationLabel: string;
  thumbnailUrl: string;
  uploadedAt: string;
  sourceRecipient?: string;
}

export interface CampaignInfo {
  template?: string;
  purpose?: string;
  scriptQuestions?: string[];
  recipients?: string[];
  launchedAt?: string;
  /** When Video Hub requests are out and waiting on uploads */
  videos?: VideoHubVideo[];
  uploadsCompletedAt?: string;
  /** Ready flow: show only these videos with no Video Hub library / add-remove */
  lockVideoSelection?: boolean;
}

export interface AdvisorCard {
  id: string;
  source: CardSource;
  contentType: CardContentType;
  status: CardStatus;
  /** ISO date YYYY-MM-DD in the board year */
  date: string;
  /** Linked cultural anchor, when the card is a calendar draft */
  eventId?: string;
  title: string;
  copy: string;
  category: string;
  corporateValue: string;
  department?: string;
  region?: string;
  aiExplanation: string;
  sourceLabel?: string;
  sourceUrl?: string;
  suggestedCta: string;
  /** Subdued yellow treatment (testimonial opportunities) */
  accent?: "yellow";
  campaignInfo?: CampaignInfo;
  dismissed?: boolean;
  reviewedAt?: string;
  updatedAt?: string;
  reviewHistory?: ReviewHistoryEntry[];
}

export interface BoardFilters {
  search: string;
  status: CardStatus | "all";
  category: string;
  contentType: string;
  department: string;
  region: string;
  corporateValue: string;
}

export const defaultBoardFilters: BoardFilters = {
  search: "",
  status: "all",
  category: "all",
  contentType: "all",
  department: "all",
  region: "all",
  corporateValue: "all",
};

export interface BoardDrawerTarget {
  kind: BoardItemKind;
  date: string;
  event?: CulturalCalendarEvent;
  card?: AdvisorCard;
  /** Suggested content when opening an empty anchor slot */
  suggestedCard?: AdvisorCard;
}

export interface AdvisorBoardAdapter {
  listCards: (refNum: string, year: number) => Promise<AdvisorCard[]>;
  saveCard: (refNum: string, year: number, card: AdvisorCard) => Promise<AdvisorCard>;
  updateCard: (refNum: string, year: number, card: AdvisorCard) => Promise<AdvisorCard>;
  markReviewed: (
    refNum: string,
    year: number,
    cardId: string,
    updates: { title: string; copy: string },
  ) => Promise<AdvisorCard>;
  dismissCard: (refNum: string, year: number, cardId: string) => Promise<void>;
  launchTestimonial: (
    refNum: string,
    year: number,
    cardId: string,
    campaignInfo: CampaignInfo,
  ) => Promise<AdvisorCard>;
  /** Mark a ready testimonial as configured into a campaign */
  markTestimonialConfigured: (refNum: string, year: number, cardId: string) => Promise<AdvisorCard>;
}
