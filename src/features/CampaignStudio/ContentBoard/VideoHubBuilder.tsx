import React, { useEffect, useMemo, useState } from "react";
import { CampaignInfo, AdvisorCard } from "./contentBoardTypes";

interface VideoHubBuilderProps {
  open: boolean;
  sourceCard?: AdvisorCard | null;
  onClose: () => void;
  onLaunch: (campaignInfo: CampaignInfo) => void;
}

const templateOptions = [
  "Milestone Spotlight",
  "Team Spotlight",
  "Career Pathway Story",
  "Learning Achievement",
  "Recognition Spotlight",
  "Custom Testimonial",
];

const defaultScriptQuestions = [
  "What made you choose One Health?",
  "What does a typical day on your team look like?",
  "What would you tell someone considering this role?",
];

/** Demo directory for bulk / department recipient picks (static MVP data). */
const employeeDirectory: { name: string; email: string; department: string }[] = [
  { name: "Marcus Chen", email: "marcus.chen@onehealth.org", department: "Nursing" },
  { name: "Aisha Rahman", email: "aisha.rahman@onehealth.org", department: "Nursing" },
  { name: "Jordan Blake", email: "jordan.blake@onehealth.org", department: "Nursing" },
  { name: "Priya Patel", email: "priya.patel@onehealth.org", department: "Clinical Support" },
  { name: "Sam Okonkwo", email: "sam.okonkwo@onehealth.org", department: "Clinical Support" },
  { name: "Elena Vasquez", email: "elena.vasquez@onehealth.org", department: "Radiology" },
  { name: "Chris Nguyen", email: "chris.nguyen@onehealth.org", department: "Radiology" },
  { name: "Taylor Brooks", email: "taylor.brooks@onehealth.org", department: "Pharmacy" },
  { name: "Morgan Ellis", email: "morgan.ellis@onehealth.org", department: "Pharmacy" },
  { name: "Riley Santos", email: "riley.santos@onehealth.org", department: "IT & Digital" },
  { name: "Casey Kim", email: "casey.kim@onehealth.org", department: "IT & Digital" },
  { name: "Harper Diaz", email: "harper.diaz@onehealth.org", department: "HR & Talent" },
];

const departmentOptions = Array.from(new Set(employeeDirectory.map((person) => person.department))).sort();

const formatRecipient = (person: { name: string; email: string }) => `${person.name} <${person.email}>`;

const mergeRecipients = (current: string[], additions: string[]) => {
  const next = [...current];
  additions.forEach((value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!next.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      next.push(trimmed);
    }
  });
  return next;
};

const parseBulkRecipients = (raw: string) =>
  raw
    .split(/[\n,;]+/)
    .map((value) => value.trim())
    .filter(Boolean);

export const VideoHubBuilder: React.FC<VideoHubBuilderProps> = ({ open, sourceCard, onClose, onLaunch }) => {
  const [template, setTemplate] = useState(templateOptions[0]);
  const [purpose, setPurpose] = useState("");
  const [scriptQuestions, setScriptQuestions] = useState<string[]>(defaultScriptQuestions);
  const [questionDraft, setQuestionDraft] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientDraft, setRecipientDraft] = useState("");
  const [departmentPick, setDepartmentPick] = useState("");
  const [bulkDraft, setBulkDraft] = useState("");
  const [showBulkPaste, setShowBulkPaste] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);

  const suggestedFromCard = useMemo(() => {
    if (!sourceCard) return [];
    const fromInfo = sourceCard.campaignInfo?.recipients || [];
    if (fromInfo.length > 0) return fromInfo;
    if (sourceCard.title.toLowerCase().includes("marcus")) {
      return [formatRecipient(employeeDirectory[0])];
    }
    return [];
  }, [sourceCard]);

  useEffect(() => {
    if (!open) return;
    setTemplate(sourceCard?.campaignInfo?.template || templateOptions[0]);
    setPurpose(sourceCard?.campaignInfo?.purpose || (sourceCard ? sourceCard.copy : ""));
    setScriptQuestions(sourceCard?.campaignInfo?.scriptQuestions || defaultScriptQuestions);
    setRecipients(sourceCard?.campaignInfo?.recipients || suggestedFromCard);
    setQuestionDraft("");
    setRecipientDraft("");
    setDepartmentPick("");
    setBulkDraft("");
    setShowBulkPaste(false);
    setIsLaunching(false);
    setLaunched(false);
  }, [open, sourceCard, suggestedFromCard]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const addQuestion = () => {
    const value = questionDraft.trim();
    if (!value) return;
    setScriptQuestions((current) => [...current, value]);
    setQuestionDraft("");
  };

  const addRecipient = () => {
    const value = recipientDraft.trim();
    if (!value) return;
    setRecipients((current) => mergeRecipients(current, [value]));
    setRecipientDraft("");
  };

  const addDepartment = (department: string) => {
    if (!department) return;
    const people = employeeDirectory
      .filter((person) => person.department === department)
      .map(formatRecipient);
    setRecipients((current) => mergeRecipients(current, people));
    setDepartmentPick("");
  };

  const addBulk = () => {
    const people = parseBulkRecipients(bulkDraft);
    if (people.length === 0) return;
    setRecipients((current) => mergeRecipients(current, people));
    setBulkDraft("");
    setShowBulkPaste(false);
  };

  const canSend = purpose.trim() !== "" && recipients.length > 0 && scriptQuestions.length > 0;

  const handleSend = () => {
    if (!canSend) return;
    setIsLaunching(true);
    window.setTimeout(() => {
      setIsLaunching(false);
      setLaunched(true);
      window.setTimeout(() => {
        onLaunch({ template, purpose: purpose.trim(), scriptQuestions, recipients });
      }, 900);
    }, 700);
  };

  return (
    <>
      <button type="button" className="cb-drawer-backdrop" aria-label="Close builder" onClick={onClose} />
      <aside className="cb-drawer cb-drawer--wide cb-drawer--enter" role="dialog" aria-modal="true" aria-labelledby="cb-vh-title">
        <header className="cb-drawer__header">
          <div>
            <p className="cb-drawer__eyebrow is-testimonial">Video Hub · Employee Testimonial</p>
            <h2 id="cb-vh-title">New testimonial campaign</h2>
            <p className="cb-drawer__meta">
              {sourceCard ? "Prefilled from an AI testimonial nudge" : "Manual employee testimonial request"}
            </p>
          </div>
          <button type="button" className="cb-drawer__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        {launched ? (
          <div className="cb-vh-success">
            <div className="cb-vh-success__check" aria-hidden="true">
              ✓
            </div>
            <h3>Request sent to Video Hub</h3>
            <p>We&apos;ll notify you in Today&apos;s employer brand signals when recipients upload their videos.</p>
          </div>
        ) : (
          <div className="cb-drawer__body">
            <label className="cb-drawer__field">
              <span>Template</span>
              <select
                className="cb-select"
                value={template}
                onChange={(event) => setTemplate(event.target.value)}
              >
                {templateOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="cb-drawer__field">
              <span>Campaign purpose</span>
              <textarea
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
                rows={3}
                placeholder="What is this testimonial campaign for?"
              />
            </label>

            <section className="cb-vh-list">
              <h3>Script questions</h3>
              <ul className="cb-chip-list">
                {scriptQuestions.map((question, index) => (
                  <li key={index} className="cb-chip">
                    <span>{question}</span>
                    <button
                      type="button"
                      aria-label={`Remove question ${index + 1}`}
                      onClick={() => setScriptQuestions((current) => current.filter((_, i) => i !== index))}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <div className="cb-inline-add">
                <input
                  value={questionDraft}
                  onChange={(event) => setQuestionDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addQuestion();
                    }
                  }}
                  placeholder="Add a script question"
                />
                <button type="button" className="cs-btn cs-btn--secondary" onClick={addQuestion}>
                  Add
                </button>
              </div>
            </section>

            <section className="cb-vh-list">
              <div className="cb-vh-list__heading">
                <h3>Recipients{recipients.length > 0 ? ` (${recipients.length})` : ""}</h3>
                {recipients.length > 0 && (
                  <button type="button" className="cb-link-btn" onClick={() => setRecipients([])}>
                    Clear
                  </button>
                )}
              </div>

              {recipients.length > 0 && (
                <ul className="cb-chip-list">
                  {recipients.map((recipient) => (
                    <li key={recipient} className="cb-chip">
                      <span>{recipient}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${recipient}`}
                        onClick={() => setRecipients((current) => current.filter((item) => item !== recipient))}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="cb-inline-add">
                <input
                  value={recipientDraft}
                  onChange={(event) => setRecipientDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addRecipient();
                    }
                  }}
                  placeholder="Name or email"
                />
                <button type="button" className="cs-btn cs-btn--secondary" onClick={addRecipient}>
                  Add
                </button>
              </div>

              <div className="cb-recipient-quick">
                <select
                  className="cb-select"
                  value={departmentPick}
                  onChange={(event) => {
                    const value = event.target.value;
                    setDepartmentPick(value);
                    addDepartment(value);
                  }}
                  aria-label="Add department team"
                >
                  <option value="">Add a department…</option>
                  {departmentOptions.map((department) => (
                    <option key={department} value={department}>
                      {department} (
                      {employeeDirectory.filter((person) => person.department === department).length})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="cb-link-btn"
                  onClick={() => setShowBulkPaste((openPaste) => !openPaste)}
                >
                  {showBulkPaste ? "Hide paste" : "Paste list"}
                </button>
              </div>

              {showBulkPaste && (
                <div className="cb-bulk-paste-row">
                  <textarea
                    className="cb-bulk-paste"
                    value={bulkDraft}
                    onChange={(event) => setBulkDraft(event.target.value)}
                    rows={2}
                    placeholder="Paste names or emails, separated by commas or new lines"
                  />
                  <button
                    type="button"
                    className="cs-btn cs-btn--secondary"
                    onClick={addBulk}
                    disabled={!bulkDraft.trim()}
                  >
                    Add all
                  </button>
                </div>
              )}
            </section>
          </div>
        )}

        {!launched && (
          <footer className="cb-drawer__footer">
            <button type="button" className="cs-btn cs-btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="cs-btn cs-btn--primary" disabled={!canSend || isLaunching} onClick={handleSend}>
              {isLaunching ? "Sending…" : "Send request"}
            </button>
          </footer>
        )}
      </aside>
    </>
  );
};
