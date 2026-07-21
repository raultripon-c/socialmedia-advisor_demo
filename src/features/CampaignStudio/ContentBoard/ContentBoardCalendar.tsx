import React, { useMemo } from "react";
import {
  addDays,
  culturalCalendarEvents,
  formatBoardDate,
  getQuarterStartMonth,
  resolveEventDate,
  sameDay,
  startOfWeek,
  toIsoDate,
} from "./contentBoardData";
import { AdvisorCardChip, AnchorPill } from "./ContentBoardCard";
import { AdvisorCard, BoardHorizon, CulturalCalendarEvent } from "./contentBoardTypes";

const HORIZONS: { id: BoardHorizon; label: string }[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "quarter", label: "Quarter" },
];

interface ContentBoardCalendarProps {
  horizon: BoardHorizon;
  focusDate: Date;
  year: number;
  cards: AdvisorCard[];
  onOpenAnchor: (event: CulturalCalendarEvent, date: string) => void;
  onOpenCard: (card: AdvisorCard) => void;
  onHorizonChange: (horizon: BoardHorizon) => void;
  onShiftFocus: (direction: -1 | 1) => void;
}

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const useCardsByDate = (cards: AdvisorCard[]) =>
  useMemo(() => {
    const map = new Map<string, AdvisorCard[]>();
    cards.forEach((card) => {
      const list = map.get(card.date) || [];
      list.push(card);
      map.set(card.date, list);
    });
    return map;
  }, [cards]);

const eventsForDay = (day: Date, year: number) =>
  culturalCalendarEvents.filter((event) => sameDay(resolveEventDate(event, year), day));

const CalendarHeader: React.FC<{
  title: string;
  subtitle?: string;
  horizon: BoardHorizon;
  onHorizonChange: (horizon: BoardHorizon) => void;
  onShiftFocus: (direction: -1 | 1) => void;
}> = ({ title, subtitle, horizon, onHorizonChange, onShiftFocus }) => (
  <header className="cb-view__header">
    <div className="cb-view__heading">
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
    </div>
    <div className="cb-view__controls">
      <div className="cb-horizon" role="tablist" aria-label="Board horizon">
        {HORIZONS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={horizon === item.id}
            className={`cb-horizon__btn${horizon === item.id ? " is-active" : ""}`}
            onClick={() => onHorizonChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="cb-nav-dates" aria-label="Date navigation">
        <button
          type="button"
          className="cs-btn cs-btn--secondary cb-nav-dates__icon"
          onClick={() => onShiftFocus(-1)}
          aria-label="Previous"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M10 3.5L5.5 8L10 12.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className="cs-btn cs-btn--secondary cb-nav-dates__icon"
          onClick={() => onShiftFocus(1)}
          aria-label="Next"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 3.5L10.5 8L6 12.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>
);

export const ContentBoardCalendar: React.FC<ContentBoardCalendarProps> = (props) => {
  const cardsByDate = useCardsByDate(props.cards);
  const shared = { ...props, cardsByDate };

  if (props.horizon === "day") return <DayView {...shared} />;
  if (props.horizon === "week") return <WeekView {...shared} />;
  if (props.horizon === "quarter") return <QuarterView {...shared} />;
  return <MonthView {...shared} />;
};

type ViewProps = ContentBoardCalendarProps & { cardsByDate: Map<string, AdvisorCard[]> };

const DayView: React.FC<ViewProps> = ({
  focusDate,
  year,
  cardsByDate,
  onOpenAnchor,
  onOpenCard,
  horizon,
  onHorizonChange,
  onShiftFocus,
}) => {
  const iso = toIsoDate(focusDate);
  const events = eventsForDay(focusDate, year);
  const cards = cardsByDate.get(iso) || [];

  return (
    <div className="cb-view cb-view--day cb-fade-in">
      <CalendarHeader
        title={formatBoardDate(focusDate, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        subtitle="Cultural anchors and AI recommendations for the selected day."
        horizon={horizon}
        onHorizonChange={onHorizonChange}
        onShiftFocus={onShiftFocus}
      />
      {events.length === 0 && cards.length === 0 ? (
        <div className="cb-empty-day">
          <p>Nothing scheduled on this day.</p>
          <p>Switch to Week, Month, or Quarter to see upcoming anchors and AI drafts.</p>
        </div>
      ) : (
        <div className="cb-day-stack">
          {events.map((event) => (
            <AnchorPill key={event.id} event={event} onClick={() => onOpenAnchor(event, iso)} />
          ))}
          {cards.map((card) => (
            <AdvisorCardChip key={card.id} card={card} showCopy onClick={() => onOpenCard(card)} />
          ))}
        </div>
      )}
    </div>
  );
};

const WeekView: React.FC<ViewProps> = ({
  focusDate,
  year,
  cardsByDate,
  onOpenAnchor,
  onOpenCard,
  horizon,
  onHorizonChange,
  onShiftFocus,
}) => {
  const days = useMemo(() => {
    const start = startOfWeek(focusDate);
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
  }, [focusDate]);

  return (
    <div className="cb-view cb-view--week cb-fade-in">
      <CalendarHeader
        title={`Week of ${formatBoardDate(days[0], { month: "short", day: "numeric" })} – ${formatBoardDate(days[6], { month: "short", day: "numeric", year: "numeric" })}`}
        horizon={horizon}
        onHorizonChange={onHorizonChange}
        onShiftFocus={onShiftFocus}
      />
      <div className="cb-week-grid">
        {days.map((day) => {
          const iso = toIsoDate(day);
          const events = eventsForDay(day, year);
          const cards = cardsByDate.get(iso) || [];
          return (
            <div key={iso} className={`cb-week-cell${sameDay(day, new Date()) ? " is-today" : ""}`}>
              <div className="cb-week-cell__date">
                <span>{weekdayLabels[day.getDay()]}</span>
                <strong>{day.getDate()}</strong>
              </div>
              {events.length === 0 && cards.length === 0 ? (
                <p className="cb-week-cell__empty">No items</p>
              ) : (
                <div className="cb-day-stack">
                  {events.map((event) => (
                    <AnchorPill key={event.id} event={event} compact onClick={() => onOpenAnchor(event, iso)} />
                  ))}
                  {cards.map((card) => (
                    <AdvisorCardChip key={card.id} card={card} showCopy onClick={() => onOpenCard(card)} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MonthView: React.FC<ViewProps> = ({
  focusDate,
  year,
  cardsByDate,
  onOpenAnchor,
  onOpenCard,
  horizon,
  onHorizonChange,
  onShiftFocus,
}) => {
  const cells = useMemo(() => {
    const monthStart = new Date(year, focusDate.getMonth(), 1);
    const gridStart = startOfWeek(monthStart);
    return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
  }, [focusDate, year]);

  return (
    <div className="cb-view cb-view--month cb-fade-in">
      <CalendarHeader
        title={formatBoardDate(focusDate, { month: "long", year: "numeric" })}
        subtitle="Cultural anchors with AI drafts overlaid. Click any card to review."
        horizon={horizon}
        onHorizonChange={onHorizonChange}
        onShiftFocus={onShiftFocus}
      />
      <div className="cb-month-weekdays">
        {weekdayLabels.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>
      <div className="cb-month-grid">
        {cells.map((day) => {
          const iso = toIsoDate(day);
          const inMonth = day.getMonth() === focusDate.getMonth();
          const events = eventsForDay(day, year);
          const cards = cardsByDate.get(iso) || [];
          return (
            <div
              key={iso}
              className={`cb-month-cell${inMonth ? "" : " is-outside"}${sameDay(day, new Date()) ? " is-today" : ""}`}
            >
              <span className="cb-month-cell__day">{day.getDate()}</span>
              <div className="cb-day-stack">
                {events.map((event) => (
                  <AnchorPill key={event.id} event={event} compact onClick={() => onOpenAnchor(event, iso)} />
                ))}
                {cards.map((card) => (
                  <AdvisorCardChip key={card.id} card={card} compact onClick={() => onOpenCard(card)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const QuarterView: React.FC<ViewProps> = ({
  focusDate,
  year,
  cardsByDate,
  onOpenAnchor,
  onOpenCard,
  horizon,
  onHorizonChange,
  onShiftFocus,
}) => {
  const startMonth = getQuarterStartMonth(focusDate.getMonth());
  const months = [startMonth, startMonth + 1, startMonth + 2];
  const quarterLabel = `Q${Math.floor(startMonth / 3) + 1} ${year}`;

  return (
    <div className="cb-view cb-view--quarter cb-fade-in">
      <CalendarHeader
        title={`${quarterLabel} strategy overview`}
        subtitle="Long-horizon mapping of cultural anchors and AI content readiness for executive review."
        horizon={horizon}
        onHorizonChange={onHorizonChange}
        onShiftFocus={onShiftFocus}
      />
      <div className="cb-quarter-grid">
        {months.map((monthIndex) => {
          const monthDate = new Date(year, monthIndex, 1);
          const monthEvents = culturalCalendarEvents
            .filter((event) => event.month === monthIndex + 1)
            .map((event) => ({ event, date: resolveEventDate(event, year) }))
            .sort((a, b) => a.date.getTime() - b.date.getTime());

          return (
            <section key={monthIndex} className="cb-quarter-month">
              <h4>{formatBoardDate(monthDate, { month: "long", year: "numeric" })}</h4>
              {monthEvents.length === 0 ? (
                <p className="cb-week-cell__empty">No cultural anchors this month</p>
              ) : (
                monthEvents.map(({ event, date }) => {
                  const iso = toIsoDate(date);
                  const cards = cardsByDate.get(iso) || [];
                  return (
                    <div key={event.id} className="cb-quarter-event">
                      <span className="cb-quarter-event__date">
                        {formatBoardDate(date, { month: "short", day: "numeric" })}
                      </span>
                      <div className="cb-day-stack">
                        <AnchorPill event={event} compact onClick={() => onOpenAnchor(event, iso)} />
                        {cards.map((card) => (
                          <AdvisorCardChip key={card.id} card={card} compact onClick={() => onOpenCard(card)} />
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
