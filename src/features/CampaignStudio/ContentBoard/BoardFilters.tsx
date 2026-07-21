import React from "react";
import { BoardFilters, CardStatus } from "./contentBoardTypes";

interface FilterOptions {
  categories: string[];
  contentTypes: string[];
  departments: string[];
  regions: string[];
  corporateValues: string[];
}

interface BoardFiltersBarProps {
  filters: BoardFilters;
  options: FilterOptions;
  resultCount: number;
  onChange: (next: BoardFilters) => void;
  onReset: () => void;
}

const statusOptions: { value: CardStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "to_be_reviewed", label: "To Be Reviewed" },
  { value: "awaiting_uploads", label: "Awaiting videos" },
  { value: "ready_for_campaign", label: "Ready for campaign" },
  { value: "reviewed", label: "Reviewed" },
];

const Select: React.FC<{
  label: string;
  value: string;
  options: string[];
  allLabel: string;
  onChange: (value: string) => void;
}> = ({ label, value, options, allLabel, onChange }) => (
  <label className="cb-filter">
    <span className="cb-filter__label">{label}</span>
    <select
      className="cb-filter__select"
      value={value}
      aria-label={label}
      title={label}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="all">{allLabel}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

export const BoardFiltersBar: React.FC<BoardFiltersBarProps> = ({
  filters,
  options,
  resultCount,
  onChange,
  onReset,
}) => {
  const isFiltered =
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.category !== "all" ||
    filters.contentType !== "all" ||
    filters.department !== "all" ||
    filters.region !== "all" ||
    filters.corporateValue !== "all";

  return (
    <div className="cb-filters">
      <div className="cb-filters__search">
        <input
          type="search"
          className="cb-filter__search-input"
          placeholder="Search titles, copy, source, value…"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          aria-label="Search board"
        />
      </div>
      <div className="cb-filters__group">
        <label className="cb-filter">
          <span className="cb-filter__label">Status</span>
          <select
            className="cb-filter__select"
            value={filters.status}
            aria-label="Status"
            title="Status"
            onChange={(event) => onChange({ ...filters, status: event.target.value as BoardFilters["status"] })}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <Select
          label="Category"
          allLabel="All categories"
          value={filters.category}
          options={options.categories}
          onChange={(value) => onChange({ ...filters, category: value })}
        />
        <Select
          label="Content type"
          allLabel="All types"
          value={filters.contentType}
          options={options.contentTypes}
          onChange={(value) => onChange({ ...filters, contentType: value })}
        />
        <Select
          label="Department"
          allLabel="All departments"
          value={filters.department}
          options={options.departments}
          onChange={(value) => onChange({ ...filters, department: value })}
        />
        <Select
          label="Region"
          allLabel="All regions"
          value={filters.region}
          options={options.regions}
          onChange={(value) => onChange({ ...filters, region: value })}
        />
        <Select
          label="Corporate value"
          allLabel="All values"
          value={filters.corporateValue}
          options={options.corporateValues}
          onChange={(value) => onChange({ ...filters, corporateValue: value })}
        />
      </div>
      <div className="cb-filters__meta">
        <span className="cb-filters__count">{resultCount} cards</span>
        {isFiltered && (
          <button type="button" className="cb-filters__reset" onClick={onReset}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};
