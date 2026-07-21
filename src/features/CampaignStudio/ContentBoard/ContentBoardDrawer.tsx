import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  buildCulturalCampaignPrompt,
  contentTypeLabel,
  formatBoardDate,
  parseIsoDate,
  supportsCampaignCreation,
} from "./contentBoardData";
import { AdvisorCard, BoardDrawerTarget } from "./contentBoardTypes";

type SaveState = "idle" | "saving" | "saved";

interface ContentBoardDrawerProps {
  target: BoardDrawerTarget | null;
  onClose: () => void;
  onAutosave: (updates: { title: string; copy: string }) => void;
  onMarkReviewed: (updates: { title: string; copy: string }) => void;
  onLaunchTestimonial: (card: AdvisorCard) => void;
  onCreateCampaign: (card: AdvisorCard) => void;
}

const MetaRow: React.FC<{ label: string; value?: string }> = ({ label, value }) =>
  value ? (
    <div className="cb-meta-row">
      <span className="cb-meta-row__label">{label}</span>
      <span className="cb-meta-row__value">{value}</span>
    </div>
  ) : null;

export const ContentBoardDrawer: React.FC<ContentBoardDrawerProps> = ({
  target,
  onClose,
  onAutosave,
  onMarkReviewed,
  onLaunchTestimonial,
  onCreateCampaign,
}) => {
  const card = target?.card;
  const isAnchor = target?.kind === "anchor";
  const [title, setTitle] = useState("");
  const [copy, setCopy] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const dirtyRef = useRef(false);

  useEffect(() => {
    if (!target) return;
    if (isAnchor && target.event) {
      setTitle(target.event.title);
      setCopy(target.event.description);
    } else if (card) {
      setTitle(card.title);
      setCopy(card.copy);
    }
    dirtyRef.current = false;
    setSaveState("idle");
  }, [target, card, isAnchor]);

  useEffect(() => {
    if (!card || isAnchor || !dirtyRef.current) return undefined;
    setSaveState("saving");
    const handle = window.setTimeout(() => {
      onAutosave({ title: title.trim() || card.title, copy });
      setSaveState("saved");
    }, 700);
    return () => window.clearTimeout(handle);
  }, [title, copy, card, isAnchor, onAutosave]);

  useEffect(() => {
    if (!target) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && card && card.status !== "reviewed") {
        event.preventDefault();
        onMarkReviewed({ title: title.trim() || card.title, copy: copy.trim() });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [target, card, title, copy, onClose, onMarkReviewed]);

  const reviewHistory = useMemo(() => {
    if (!card?.reviewHistory?.length) return [];
    return [...card.reviewHistory].reverse();
  }, [card]);

  if (!target) return null;

  const dateLabel = formatBoardDate(parseIsoDate(target.date));
  const isReviewed = card?.status === "reviewed";
  const isReady = card?.status === "ready_for_campaign";
  const isAwaiting = card?.status === "awaiting_uploads";
  const isTestimonial = card?.source === "testimonial";
  const isCampaignPromptCard = Boolean(card && supportsCampaignCreation(card));
  const copyFieldLabel = isCampaignPromptCard ? "Prompt" : isTestimonial ? "Opportunity summary" : "Post copy";

  const eyebrow = isAnchor
    ? "Cultural Calendar Event"
    : isReviewed
      ? "Reviewed"
      : isReady
        ? "Ready for campaign"
        : isAwaiting
          ? "Awaiting Video Hub uploads"
          : isTestimonial
            ? "Testimonial Opportunity"
            : "To Be Reviewed";

  return (
    <>
      <button type="button" className="cb-drawer-backdrop" aria-label="Close drawer" onClick={onClose} />
      <aside
        className="cb-drawer cb-drawer--enter"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cb-drawer-title"
      >
        <header className="cb-drawer__header">
          <div>
            <p className={`cb-drawer__eyebrow${isReviewed ? " is-reviewed" : ""}${isTestimonial ? " is-testimonial" : ""}`}>
              {eyebrow}
            </p>
            <h2 id="cb-drawer-title">{isAnchor ? target.event?.title : card?.title}</h2>
            <p className="cb-drawer__meta">
              {dateLabel}
              {card ? ` · ${contentTypeLabel[card.contentType]}` : ""}
            </p>
          </div>
          <button type="button" className="cb-drawer__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="cb-drawer__body">
          {isAnchor && target.event ? (
            <>
              <section>
                <h3>About this anchor</h3>
                <p>{target.event.description}</p>
              </section>
              <section className="cb-drawer__metagrid">
                <MetaRow label="Category" value={target.event.category} />
                <MetaRow label="Corporate value" value={target.event.corporateValue} />
              </section>
              <section>
                <h3>Suggested campaign prompts</h3>
                <p className="cb-prompt-label">Primary — values-led</p>
                <p className="cb-drawer__readonly">{buildCulturalCampaignPrompt(target.event, "primary")}</p>
                <p className="cb-prompt-label">Alternate — story-led</p>
                <p className="cb-drawer__readonly">{buildCulturalCampaignPrompt(target.event, "alternate")}</p>
              </section>
              <p className="cb-drawer__note">
                Cultural Calendar Events are permanent anchors. They cannot be edited or removed. Open a To Be Reviewed
                draft to create a campaign from a prompt.
              </p>
            </>
          ) : card ? (
            <>
              <div className="cb-drawer__savebar">
                <span className={`cb-save-indicator cb-save-indicator--${saveState}`}>
                  {saveState === "saving" ? "Saving…" : saveState === "saved" ? "All changes saved" : "Autosave on"}
                </span>
                <span className="cb-drawer__shortcut">⌘/Ctrl + Enter to review</span>
              </div>

              <label className="cb-drawer__field">
                <span>Title</span>
                <input
                  value={title}
                  onChange={(event) => {
                    dirtyRef.current = true;
                    setTitle(event.target.value);
                  }}
                />
              </label>
              <label className="cb-drawer__field">
                <span>{copyFieldLabel}</span>
                <textarea
                  value={copy}
                  onChange={(event) => {
                    dirtyRef.current = true;
                    setCopy(event.target.value);
                  }}
                  rows={10}
                />
              </label>
              {isReady && card.campaignInfo?.videos && card.campaignInfo.videos.length > 0 && (
                <section className="cb-drawer__videos">
                  <h3>Uploaded Video Hub testimonials</h3>
                  <p className="cb-drawer__hint">Vertical front-camera uploads ready for campaign use.</p>
                  <div className="cb-drawer__video-grid">
                    {card.campaignInfo.videos.map((video) => (
                      <div key={video.id} className="cb-drawer__video-card">
                        <div className="cb-drawer__video-thumb">
                          <img src={video.thumbnailUrl} alt="" />
                          <span>{video.durationLabel}</span>
                        </div>
                        <strong>{video.employeeName}</strong>
                        <span>{video.title}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {isCampaignPromptCard && (
                <p className="cb-drawer__note">
                  {isReady
                    ? "Videos are ready in Video Hub. Continue to campaign configuration with these testimonials selected."
                    : "This is the recommended campaign prompt. Use Create campaign to open the generation flow with these details prefilled."}
                </p>
              )}

              <section className="cb-drawer__ai">
                <h3>Why the advisor suggested this</h3>
                <p>{card.aiExplanation}</p>
              </section>

              <section className="cb-drawer__metagrid">
                <MetaRow label="Content type" value={contentTypeLabel[card.contentType]} />
                <MetaRow label="Category" value={card.category} />
                <MetaRow label="Corporate value" value={card.corporateValue} />
                <MetaRow label="Department" value={card.department} />
                <MetaRow label="Region" value={card.region} />
              </section>

              {(card.sourceLabel || card.sourceUrl) && (
                <section>
                  <h3>Source</h3>
                  {card.sourceUrl ? (
                    <a className="cb-drawer__source" href={card.sourceUrl} target="_blank" rel="noreferrer">
                      {card.sourceLabel || card.sourceUrl}
                    </a>
                  ) : (
                    <p>{card.sourceLabel}</p>
                  )}
                </section>
              )}

              <section>
                <h3>Suggested CTA</h3>
                <a className="cb-drawer__source" href={card.suggestedCta} target="_blank" rel="noreferrer">
                  {card.suggestedCta}
                </a>
              </section>

              <section>
                <h3>Review history</h3>
                {reviewHistory.length === 0 ? (
                  <p className="cb-drawer__note">No review activity yet. Actions you take will appear here.</p>
                ) : (
                  <ul className="cb-history">
                    {reviewHistory.map((entry, index) => (
                      <li key={index}>
                        <span className="cb-history__dot" />
                        <span>{entry.label}</span>
                        <time>{formatBoardDate(new Date(entry.at), { month: "short", day: "numeric" })}</time>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          ) : null}
        </div>

        {card && (
          <footer className="cb-drawer__footer">
            {isTestimonial && !isReady && !isAwaiting && !isReviewed && (
              <button
                type="button"
                className="cs-btn cs-btn--secondary"
                onClick={() => onLaunchTestimonial(card)}
              >
                Request via Video Hub
              </button>
            )}
            {isTestimonial && isAwaiting && (
              <button type="button" className="cs-btn cs-btn--secondary" disabled>
                Waiting for videos…
              </button>
            )}
            {isCampaignPromptCard && (
              <button
                type="button"
                className="cs-btn cs-btn--primary"
                disabled={!title.trim() || !copy.trim()}
                onClick={() =>
                  onCreateCampaign({
                    ...card,
                    title: title.trim() || card.title,
                    copy: copy.trim() || card.copy,
                  })
                }
              >
                {isReady ? "Ready for campaign configuration" : "Create campaign"}
              </button>
            )}
            <button type="button" className="cs-btn cs-btn--secondary" onClick={onClose}>
              Close
            </button>
            {!isReviewed && (
              <button
                type="button"
                className={`cs-btn ${isCampaignPromptCard ? "cs-btn--secondary" : "cs-btn--primary"}`}
                disabled={!title.trim() || !copy.trim()}
                onClick={() => onMarkReviewed({ title: title.trim(), copy: copy.trim() })}
              >
                Mark as Reviewed
              </button>
            )}
          </footer>
        )}
      </aside>
    </>
  );
};
