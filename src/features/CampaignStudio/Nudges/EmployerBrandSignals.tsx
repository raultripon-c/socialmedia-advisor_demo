import React, { useEffect, useState } from "react";
import { advisorBoardAdapter, contentTypeLabel } from "../ContentBoard/contentBoardData";
import { AdvisorCard, CampaignInfo, CardStatus } from "../ContentBoard/contentBoardTypes";
import { VIDEO_HUB_UPLOAD_DELAY_MS } from "../ContentBoard/videoHubData";
import { VideoHubBuilder } from "../ContentBoard/VideoHubBuilder";
import "./Nudges.css";

interface EmployerBrandSignalsProps {
  refNum: string;
  onUseMedia: (card: AdvisorCard) => void;
  onUseTestimonialReady: (card: AdvisorCard) => void;
}

const nudgeStatuses: CardStatus[] = ["to_be_reviewed", "awaiting_uploads", "ready_for_campaign"];

const badgeClass = (card: AdvisorCard) => {
  if (card.status === "ready_for_campaign") return "ready";
  if (card.status === "awaiting_uploads") return "awaiting";
  if (card.accent === "yellow") return "testimonial";
  if (card.contentType === "Award") return "award";
  return "mention";
};

const badgeLabel = (card: AdvisorCard) => {
  if (card.status === "ready_for_campaign") return "Ready";
  if (card.status === "awaiting_uploads") return "Awaiting videos";
  return contentTypeLabel[card.contentType];
};

/** Short conversational lead — one or two lines max */
const nudgeLead = (card: AdvisorCard) => {
  if (card.source === "testimonial") {
    if (card.status === "ready_for_campaign") {
      const count = card.campaignInfo?.videos?.length || 0;
      return count > 0
        ? `${count} testimonial video${count === 1 ? "" : "s"} ready. Configure your campaign?`
        : "Videos are in from Video Hub. Ready to configure your campaign?";
    }
    if (card.status === "awaiting_uploads") {
      const count = card.campaignInfo?.recipients?.length || 0;
      return count > 0
        ? `Waiting on ${count} Video Hub upload${count === 1 ? "" : "s"}. We'll notify you when they're in.`
        : "Video Hub request sent. Waiting for uploads…";
    }
    if (card.title.toLowerCase().includes("marcus")) return "Marcus just hit 5 years. Request a testimonial?";
    if (card.title.toLowerCase().includes("applications") || card.title.toLowerCase().includes("slowed"))
      return "Clinical Support apps slowed in Raleigh. Feature a local teammate?";
    if (card.title.toLowerCase().includes("priya") || card.title.toLowerCase().includes("intern"))
      return "Priya went intern → full-time RN. Share her story?";
    if (card.title.toLowerCase().includes("certification"))
      return "Radiology teammates earned new certifications. Spotlight them?";
    if (card.title.toLowerCase().includes("daisy"))
      return "A nurse won a DAISY Award. Capture a quick story?";
    if (card.title.toLowerCase().includes("anniversary"))
      return "Marcus Chen’s 5-year story is ready to publish.";
    return `${card.title}. Request a testimonial?`;
  }

  if (card.contentType === "Award") return `We noticed an award: ${card.title}. Share it?`;
  return `We noticed this mention: ${card.title}. Share it?`;
};

/** One short supporting line — no long AI rationale on the card */
const nudgeDetail = (card: AdvisorCard) => {
  if (card.source === "testimonial") {
    if (card.status === "ready_for_campaign" && card.campaignInfo?.videos?.length) {
      const names = card.campaignInfo.videos.map((video) => video.employeeName).slice(0, 2).join(", ");
      const extra = card.campaignInfo.videos.length > 2 ? ` +${card.campaignInfo.videos.length - 2}` : "";
      return `${names}${extra} · Video Hub`;
    }
    if (card.status === "awaiting_uploads") return "Checking Video Hub for new uploads…";
    if (card.department && card.region) return `${card.department} · ${card.region}`;
    if (card.department) return card.department;
    return "Strong employee-story opportunity.";
  }
  if (card.sourceLabel) return `From ${card.sourceLabel}`;
  return "Positive brand signal to amplify.";
};

export const EmployerBrandSignals: React.FC<EmployerBrandSignalsProps> = ({
  refNum,
  onUseMedia,
  onUseTestimonialReady,
}) => {
  const year = new Date().getFullYear();
  const [signals, setSignals] = useState<AdvisorCard[]>([]);
  const [previewCard, setPreviewCard] = useState<AdvisorCard | null>(null);
  const [videoHubCard, setVideoHubCard] = useState<AdvisorCard | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadSignals = async () => {
    const cards = await advisorBoardAdapter.listCards(refNum, year);
    setSignals(
      cards.filter((card) => {
        if (card.source === "media_listening") return card.status === "to_be_reviewed";
        if (card.source === "testimonial") return nudgeStatuses.includes(card.status);
        return false;
      }),
    );
  };

  useEffect(() => {
    void loadSignals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refNum]);

  /** Poll while any testimonial is awaiting uploads so ready state appears without a full refresh. */
  useEffect(() => {
    const hasAwaiting = signals.some((card) => card.status === "awaiting_uploads");
    if (!hasAwaiting) return undefined;
    const handle = window.setInterval(() => {
      void loadSignals();
    }, Math.min(VIDEO_HUB_UPLOAD_DELAY_MS / 2, 2500));
    return () => window.clearInterval(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signals, refNum]);

  useEffect(() => {
    if (!toast) return undefined;
    const handle = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(handle);
  }, [toast]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadSignals();
    setIsRefreshing(false);
  };

  const handleDismiss = async (cardId: string) => {
    await advisorBoardAdapter.dismissCard(refNum, year, cardId);
    setSignals((current) => current.filter((card) => card.id !== cardId));
    if (previewCard?.id === cardId) setPreviewCard(null);
  };

  const handleVideoHubLaunch = async (campaignInfo: CampaignInfo) => {
    if (videoHubCard) {
      const updated = await advisorBoardAdapter.launchTestimonial(refNum, year, videoHubCard.id, campaignInfo);
      setSignals((current) => current.map((card) => (card.id === updated.id ? updated : card)));
    }
    setVideoHubCard(null);
    setToast("Request sent to Video Hub — waiting for uploads");
  };

  return (
    <section className="cs-nudges">
      <div className="cs-nudges__header">
        <div>
          <h2>Today&apos;s employer brand signals</h2>
          <p>Opportunities discovered for your company — ready to turn into posts.</p>
        </div>
        <button
          type="button"
          className="cs-btn cs-btn--secondary cs-nudges__refresh"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          Refresh
        </button>
      </div>

      {signals.length === 0 ? (
        <div className="cs-nudges__empty">
          <p>No new brand signals right now. Reviewed and dismissed items live on the Content Board.</p>
        </div>
      ) : (
        <div className="cs-nudges__grid">
          {signals.map((card) => {
            const isTestimonial = card.source === "testimonial";
            const isReady = card.status === "ready_for_campaign";
            const isAwaiting = card.status === "awaiting_uploads";
            const stateClass = isReady ? " is-ready" : isAwaiting ? " is-awaiting" : "";

            return (
              <article
                key={card.id}
                className={`cs-nudge-card${isTestimonial ? " cs-nudge-card--testimonial" : ""}${stateClass}`}
              >
                <div className="cs-nudge-card__top">
                  <span className={`cs-nudge-card__badge cs-nudge-card__badge--${badgeClass(card)}`}>
                    {badgeLabel(card)}
                  </span>
                  <time className="cs-nudge-card__date" dateTime={card.date}>
                    {card.date}
                  </time>
                </div>

                <h3 className="cs-nudge-card__message">{nudgeLead(card)}</h3>
                {isTestimonial && <p className="cs-nudge-card__detail">{nudgeDetail(card)}</p>}

                {isReady && card.campaignInfo?.videos && card.campaignInfo.videos.length > 0 && (
                  <div className="cs-nudge-card__videos" aria-label="Uploaded videos">
                    {card.campaignInfo.videos.slice(0, 3).map((video) => (
                      <div key={video.id} className="cs-nudge-card__video-thumb">
                        <img src={video.thumbnailUrl} alt="" />
                        <span>{video.durationLabel}</span>
                      </div>
                    ))}
                  </div>
                )}

                {card.sourceLabel && !isTestimonial && (
                  <a
                    className="cs-nudge-card__source"
                    href={card.sourceUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Source: {card.sourceLabel}
                  </a>
                )}

                <div className="cs-nudge-card__actions">
                  {isTestimonial && isReady ? (
                    <button
                      type="button"
                      className="cs-btn cs-btn--primary"
                      onClick={() => onUseTestimonialReady(card)}
                    >
                      Configure campaign
                    </button>
                  ) : isTestimonial && isAwaiting ? (
                    <button type="button" className="cs-btn cs-btn--secondary" disabled>
                      Waiting for videos…
                    </button>
                  ) : isTestimonial ? (
                    <button type="button" className="cs-btn cs-btn--primary" onClick={() => setVideoHubCard(card)}>
                      Configure Campaign
                    </button>
                  ) : (
                    <button type="button" className="cs-btn cs-btn--primary" onClick={() => setPreviewCard(card)}>
                      Preview Prompt
                    </button>
                  )}
                  {!isAwaiting && (
                    <button type="button" className="cs-btn cs-btn--secondary" onClick={() => handleDismiss(card.id)}>
                      Dismiss
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {previewCard && (
        <NudgeDraftPreview
          card={previewCard}
          onClose={() => setPreviewCard(null)}
          onUse={() => {
            const selected = previewCard;
            setPreviewCard(null);
            onUseMedia(selected);
          }}
        />
      )}

      <VideoHubBuilder
        open={Boolean(videoHubCard)}
        sourceCard={videoHubCard}
        onClose={() => setVideoHubCard(null)}
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
    </section>
  );
};

const NudgeDraftPreview: React.FC<{
  card: AdvisorCard;
  onClose: () => void;
  onUse: () => void;
}> = ({ card, onClose, onUse }) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <>
      <button type="button" className="cs-nudge-preview-backdrop" aria-label="Close preview" onClick={onClose} />
      <div className="cs-nudge-preview" role="dialog" aria-modal="true" aria-labelledby="cs-nudge-preview-title">
        <header className="cs-nudge-preview__header">
          <div>
            <p className="cs-nudge-preview__eyebrow">Campaign prompt</p>
            <h3 id="cs-nudge-preview-title">{card.title}</h3>
          </div>
          <button type="button" className="cs-nudge-preview__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <div className="cs-nudge-preview__body">
          <p className="cs-nudge-preview__draft">{card.copy}</p>
          <p className="cs-nudge-preview__cta">
            Default CTA:{" "}
            <a href={card.suggestedCta} target="_blank" rel="noreferrer">
              {card.suggestedCta}
            </a>
          </p>
        </div>
        <footer className="cs-nudge-preview__footer">
          <button type="button" className="cs-btn cs-btn--secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="cs-btn cs-btn--primary" onClick={onUse}>
            Start Generating Campaign
          </button>
        </footer>
      </div>
    </>
  );
};
