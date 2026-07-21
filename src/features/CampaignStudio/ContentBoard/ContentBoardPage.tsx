import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRefNum } from "../campaignStudioData";
import {
  advisorBoardAdapter,
  buildAdvisorCampaignHandoff,
  getFilterOptions,
  toIsoDate,
} from "./contentBoardData";
import { ContentBoardCalendar } from "./ContentBoardCalendar";
import { ContentBoardDrawer } from "./ContentBoardDrawer";
import { BoardFiltersBar } from "./BoardFilters";
import { VideoHubBuilder } from "./VideoHubBuilder";
import { CampaignStudioSubNav, getCampaignStudioPaths } from "./CampaignStudioSubNav";
import {
  AdvisorCard,
  BoardDrawerTarget,
  BoardFilters,
  BoardHorizon,
  CampaignInfo,
  CulturalCalendarEvent,
  defaultBoardFilters,
} from "./contentBoardTypes";
import "./ContentBoard.css";

const filtersStorageKey = (refNum: string) => `txe.campaignStudio.advisorBoard.filters.${refNum}`;

const readStoredFilters = (refNum: string): BoardFilters => {
  try {
    const raw = localStorage.getItem(filtersStorageKey(refNum));
    if (!raw) return defaultBoardFilters;
    return { ...defaultBoardFilters, ...JSON.parse(raw) };
  } catch {
    return defaultBoardFilters;
  }
};

export const ContentBoardPage: React.FC = () => {
  const navigate = useNavigate();
  const { customerCode, refnum } = useParams();
  const refNum = refnum || getRefNum();
  const paths = getCampaignStudioPaths(customerCode, refnum);

  const [horizon, setHorizon] = useState<BoardHorizon>("month");
  const [focusDate, setFocusDate] = useState(() => new Date());
  const [cards, setCards] = useState<AdvisorCard[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [filters, setFilters] = useState<BoardFilters>(() => readStoredFilters(refNum));
  const [drawerTarget, setDrawerTarget] = useState<BoardDrawerTarget | null>(null);
  const [videoHubCard, setVideoHubCard] = useState<AdvisorCard | null>(null);
  const [videoHubOpen, setVideoHubOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const year = focusDate.getFullYear();

  const loadCards = useCallback(() => {
    setStatus("loading");
    advisorBoardAdapter
      .listCards(refNum, year)
      .then((next) => {
        setCards(next);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [refNum, year]);

  const refreshCardsQuietly = useCallback(() => {
    advisorBoardAdapter.listCards(refNum, year).then(setCards).catch(() => undefined);
  }, [refNum, year]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  useEffect(() => {
    const hasAwaiting = cards.some((card) => card.status === "awaiting_uploads");
    if (!hasAwaiting || status !== "ready") return undefined;
    const handle = window.setInterval(refreshCardsQuietly, 2500);
    return () => window.clearInterval(handle);
  }, [cards, status, refreshCardsQuietly]);

  useEffect(() => {
    localStorage.setItem(filtersStorageKey(refNum), JSON.stringify(filters));
  }, [filters, refNum]);

  useEffect(() => {
    if (!toast) return undefined;
    const handle = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(handle);
  }, [toast]);

  const filterOptions = useMemo(() => getFilterOptions(cards), [cards]);

  const filteredCards = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return cards.filter((card) => {
      if (filters.status !== "all" && card.status !== filters.status) return false;
      if (filters.category !== "all" && card.category !== filters.category) return false;
      if (filters.contentType !== "all" && card.contentType !== filters.contentType) return false;
      if (filters.department !== "all" && card.department !== filters.department) return false;
      if (filters.region !== "all" && card.region !== filters.region) return false;
      if (filters.corporateValue !== "all" && card.corporateValue !== filters.corporateValue) return false;
      if (query) {
        const haystack = [
          card.title,
          card.copy,
          card.category,
          card.corporateValue,
          card.department,
          card.region,
          card.sourceLabel,
          card.contentType,
          card.aiExplanation,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [cards, filters]);

  const reviewCount = useMemo(
    () => cards.filter((card) => card.status === "to_be_reviewed" || card.status === "ready_for_campaign").length,
    [cards],
  );

  const shiftFocus = (direction: -1 | 1) => {
    setFocusDate((current) => {
      const next = new Date(current);
      if (horizon === "day") next.setDate(next.getDate() + direction);
      else if (horizon === "week") next.setDate(next.getDate() + direction * 7);
      else if (horizon === "quarter") next.setMonth(next.getMonth() + direction * 3);
      else next.setMonth(next.getMonth() + direction);
      return next;
    });
  };

  const openAnchor = (event: CulturalCalendarEvent, date: string) => {
    setDrawerTarget({ kind: "anchor", event, date });
  };

  const openCard = (card: AdvisorCard) => {
    setDrawerTarget({ kind: "card", card, date: card.date });
  };

  const applyCardUpdate = (updated: AdvisorCard) => {
    setCards((current) => current.map((card) => (card.id === updated.id ? updated : card)));
  };

  const handleAutosave = (updates: { title: string; copy: string }) => {
    if (!drawerTarget?.card) return;
    const optimistic = { ...drawerTarget.card, ...updates };
    applyCardUpdate(optimistic);
    setDrawerTarget((current) => (current?.card ? { ...current, card: optimistic } : current));
    void advisorBoardAdapter.updateCard(refNum, year, optimistic);
  };

  const handleMarkReviewed = async (updates: { title: string; copy: string }) => {
    if (!drawerTarget?.card) return;
    const target = drawerTarget.card;
    const optimistic: AdvisorCard = { ...target, ...updates, status: "reviewed" };
    applyCardUpdate(optimistic);
    setDrawerTarget(null);
    try {
      const saved = await advisorBoardAdapter.markReviewed(refNum, year, target.id, updates);
      applyCardUpdate(saved);
      setToast("Marked as Reviewed");
    } catch {
      applyCardUpdate(target);
      setToast("Could not save. Please try again.");
    }
  };

  const launchTestimonial = (card: AdvisorCard) => {
    setDrawerTarget(null);
    setVideoHubCard(card);
    setVideoHubOpen(true);
  };

  const handleCreateCampaign = (card: AdvisorCard) => {
    const handoff = buildAdvisorCampaignHandoff(card);
    setDrawerTarget(null);
    navigate(paths.campaigns, { state: { advisorCampaignDraft: handoff } });
  };

  const openManualTestimonial = () => {
    setVideoHubCard(null);
    setVideoHubOpen(true);
  };

  const handleVideoHubLaunch = async (campaignInfo: CampaignInfo) => {
    if (videoHubCard) {
      const optimistic: AdvisorCard = {
        ...videoHubCard,
        status: "awaiting_uploads",
        campaignInfo: { ...videoHubCard.campaignInfo, ...campaignInfo, launchedAt: new Date().toISOString() },
      };
      applyCardUpdate(optimistic);
      try {
        const saved = await advisorBoardAdapter.launchTestimonial(refNum, year, videoHubCard.id, campaignInfo);
        applyCardUpdate(saved);
      } catch {
        applyCardUpdate(videoHubCard);
      }
    }
    setVideoHubOpen(false);
    setVideoHubCard(null);
    setToast("Request sent to Video Hub — waiting for uploads");
  };

  const legend = [
    { className: "cb-legend__swatch cb-legend__swatch--anchor", label: "Cultural Calendar Event" },
    { className: "cb-legend__swatch cb-legend__swatch--review", label: "To Be Reviewed" },
    { className: "cb-legend__swatch cb-legend__swatch--testimonial", label: "Testimonial" },
    { className: "cb-legend__swatch cb-legend__swatch--reviewed", label: "Reviewed" },
  ];

  return (
    <main className="campaign-studio content-board">
      <header className="cs-page-header cb-page-header">
        <div>
          <h1>Social Media Advisor</h1>
          <CampaignStudioSubNav />
        </div>
        <div className="cb-legend" aria-label="Card types">
          {legend.map((item) => (
            <span key={item.label} className="cb-legend__item">
              <span className={item.className} />
              {item.label}
            </span>
          ))}
        </div>
      </header>

      <section className="cb-toolbar">
        <div className="cb-toolbar__main">
          <div className="cb-toolbar__title-block">
            <div className="cb-toolbar__title-row">
              <h2>Content Board</h2>
              {reviewCount > 0 && (
                <span className="cb-toolbar__badge">{reviewCount} to review</span>
              )}
            </div>
            <p>Review AI drafts against cultural anchors, media signals, and employee stories.</p>
          </div>

          <div className="cb-toolbar__actions">
            <button type="button" className="cs-btn cs-btn--primary" onClick={openManualTestimonial}>
              New testimonial campaign
            </button>
          </div>
        </div>
      </section>

      <BoardFiltersBar
        filters={filters}
        options={filterOptions}
        resultCount={filteredCards.length}
        onChange={setFilters}
        onReset={() => setFilters(defaultBoardFilters)}
      />

      <section className="cb-canvas">
        {status === "loading" && <BoardSkeleton />}
        {status === "error" && (
          <div className="cb-error">
            <p>We couldn&apos;t load the advisor board.</p>
            <button type="button" className="cs-btn cs-btn--secondary" onClick={loadCards}>
              Retry
            </button>
          </div>
        )}
        {status === "ready" && (
          <ContentBoardCalendar
            horizon={horizon}
            focusDate={focusDate}
            year={year}
            cards={filteredCards}
            onOpenAnchor={openAnchor}
            onOpenCard={openCard}
            onHorizonChange={setHorizon}
            onShiftFocus={shiftFocus}
          />
        )}
      </section>

      <ContentBoardDrawer
        target={drawerTarget}
        onClose={() => setDrawerTarget(null)}
        onAutosave={handleAutosave}
        onMarkReviewed={handleMarkReviewed}
        onLaunchTestimonial={launchTestimonial}
        onCreateCampaign={handleCreateCampaign}
      />

      <VideoHubBuilder
        open={videoHubOpen}
        sourceCard={videoHubCard}
        onClose={() => {
          setVideoHubOpen(false);
          setVideoHubCard(null);
        }}
        onLaunch={handleVideoHubLaunch}
      />

      {toast && (
        <div className="cb-toast" role="status">
          <span className="cb-toast__check" aria-hidden="true">
            ✓
          </span>
          {toast}
        </div>
      )}

      <span className="cb-focus-date" hidden>
        {toIsoDate(focusDate)}
      </span>
    </main>
  );
};

const BoardSkeleton: React.FC = () => (
  <div className="cb-skeleton" aria-hidden="true">
    <div className="cb-skeleton__header" />
    <div className="cb-skeleton__grid">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="cb-skeleton__cell" />
      ))}
    </div>
  </div>
);
