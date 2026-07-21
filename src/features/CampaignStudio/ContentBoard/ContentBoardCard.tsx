import React from "react";
import { contentTypeLabel } from "./contentBoardData";
import { AdvisorCard, CulturalCalendarEvent } from "./contentBoardTypes";

interface AnchorPillProps {
  event: CulturalCalendarEvent;
  compact?: boolean;
  onClick: () => void;
}

export const AnchorPill: React.FC<AnchorPillProps> = ({ event, compact, onClick }) => (
  <button
    type="button"
    className={`cb-card cb-card--anchor${compact ? " cb-card--compact" : ""}`}
    onClick={onClick}
  >
    <span className="cb-card__badge">Cultural Calendar Event</span>
    <strong className="cb-card__title">{event.title}</strong>
    {!compact && <span className="cb-card__subtitle">{event.corporateValue}</span>}
  </button>
);

interface AdvisorCardChipProps {
  card: AdvisorCard;
  compact?: boolean;
  showCopy?: boolean;
  onClick: () => void;
}

export const AdvisorCardChip: React.FC<AdvisorCardChipProps> = ({ card, compact, showCopy, onClick }) => {
  const variant =
    card.status === "reviewed"
      ? "reviewed"
      : card.status === "ready_for_campaign"
        ? "reviewed"
        : "review";
  const accentClass = card.accent === "yellow" ? " cb-card--testimonial" : "";
  const badge =
    card.status === "reviewed"
      ? "Reviewed"
      : card.status === "ready_for_campaign"
        ? "Ready"
        : card.status === "awaiting_uploads"
          ? "Awaiting videos"
          : card.accent === "yellow"
            ? "Testimonial"
            : "To Be Reviewed";

  return (
    <button
      type="button"
      className={`cb-card cb-card--${variant}${accentClass}${compact ? " cb-card--compact" : ""}`}
      onClick={onClick}
    >
      <span className="cb-card__top">
        <span className="cb-card__badge">{badge}</span>
        <span className="cb-card__type">{contentTypeLabel[card.contentType]}</span>
      </span>
      <strong className="cb-card__title">{card.title}</strong>
      {showCopy && <span className="cb-card__subtitle">{card.copy}</span>}
    </button>
  );
};

interface EmptyAnchorSlotProps {
  compact?: boolean;
  onClick: () => void;
}

export const EmptyAnchorSlot: React.FC<EmptyAnchorSlotProps> = ({ compact, onClick }) => (
  <button
    type="button"
    className={`cb-card cb-card--placeholder${compact ? " cb-card--compact" : ""}`}
    onClick={onClick}
  >
    <span className="cb-card__badge">Suggested draft</span>
    <strong className="cb-card__title">Add suggested draft</strong>
  </button>
);
