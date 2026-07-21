import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import phenomLogo from "../assets/images/phenom-logo.svg";
import "./DemoShell.css";

const deadClick = (event: React.MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

const DeadLink: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <button type="button" className={className} onClick={deadClick} tabIndex={-1} aria-disabled="true">
    {children}
  </button>
);

export const DemoShell: React.FC = () => {
  const location = useLocation();
  const onAdvisor = location.pathname.includes("/campaign-studio");

  return (
    <div className="demo-shell">
      <aside className="demo-sidebar" aria-label="Apps">
        <div className="demo-sidebar__brand">
          <img src={phenomLogo} alt="phenom" />
        </div>

        <div className="demo-sidebar__search" aria-hidden="true">
          <span>Search Navigation</span>
        </div>

        <nav className="demo-sidebar__nav">
          <DeadLink className="demo-nav-item">TXE Home</DeadLink>

          <div className="demo-nav-group">
            <DeadLink className="demo-nav-item demo-nav-item--parent">Journeys</DeadLink>
            <div className="demo-nav-children is-collapsed" aria-hidden="true">
              <DeadLink className="demo-nav-item demo-nav-item--child">Segment Manager</DeadLink>
            </div>
          </div>

          <div className="demo-nav-group">
            <DeadLink className="demo-nav-item demo-nav-item--parent is-open">Experiences</DeadLink>
            <div className="demo-nav-children">
              <DeadLink className="demo-nav-item demo-nav-item--child">Experience Manager</DeadLink>
              <DeadLink className="demo-nav-item demo-nav-item--child">Blog</DeadLink>
              <NavLink
                to="/campaign-studio/campaigns"
                className={({ isActive }) =>
                  `demo-nav-item demo-nav-item--child demo-nav-item--live${isActive || onAdvisor ? " is-active" : ""}`
                }
              >
                Social Media Advisor
              </NavLink>
              <DeadLink className="demo-nav-item demo-nav-item--child">Job Insights</DeadLink>
            </div>
          </div>

          <div className="demo-nav-group">
            <DeadLink className="demo-nav-item demo-nav-item--parent">Content</DeadLink>
            <div className="demo-nav-children is-collapsed" aria-hidden="true">
              <DeadLink className="demo-nav-item demo-nav-item--child">Bot Settings</DeadLink>
              <DeadLink className="demo-nav-item demo-nav-item--child">Knowledge Base</DeadLink>
              <DeadLink className="demo-nav-item demo-nav-item--child">Asset Manager</DeadLink>
              <DeadLink className="demo-nav-item demo-nav-item--child">Content Hub</DeadLink>
            </div>
          </div>

          <DeadLink className="demo-nav-item">Candidate Journeys</DeadLink>
        </nav>
      </aside>

      <div className="demo-main">
        <header className="demo-topbar">
          <div className="demo-topbar__left">
            <span className="demo-topbar__crumb">Apps</span>
            <span className="demo-topbar__sep" aria-hidden="true">›</span>
            <strong className="demo-topbar__app">Social Media Advisor</strong>
          </div>
          <div className="demo-topbar__right">
            <span className="demo-topbar__tenant">One Health</span>
            <button type="button" className="demo-topbar__avatar" onClick={deadClick} tabIndex={-1} aria-disabled="true">
              RT
            </button>
          </div>
        </header>

        <div className="demo-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
