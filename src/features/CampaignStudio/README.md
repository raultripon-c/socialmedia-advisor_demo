# Campaign Studio

Local Campaign Studio feature module for the TXE shell.

## Entry Points

- `CampaignStudioList`
- `CampaignStudioCreate`
- `CampaignStudioDashboard`
- `CampaignStudioWorkspace`
- `ContentBoardPage` (Social Media Advisor content board — the canonical review surface)
- `EmployerBrandSignals` (proactive nudge strip on the campaigns list, backed by the advisor board)

## Social Media Advisor

The advisor board (`ContentBoard/`) is the single canonical surface for every AI employer-branding
opportunity. Three card types render on one calendar:

- Cultural Calendar Event — permanent, read-only anchors (~40 US observances)
- To Be Reviewed — AI cards from cultural drafts, media listening, and testimonial workflows
- Awaiting videos — Video Hub request sent; waiting for employee uploads
- Ready for campaign — uploaded videos available; configure campaign with Video Hub assets
- Reviewed — approved / configured cards

AI cards originate from workflow generators in `ContentBoard/contentBoardData.ts`:
cultural drafts, media-listening mentions, and testimonial opportunities (subdued yellow).
The Video Hub builder (`ContentBoard/VideoHubBuilder.tsx`) requests employee testimonials.
When uploads complete (demo simulation), nudges move to **Ready for campaign configuration**
and open the campaign wizard with those videos preselected. The **Start Testimonial Campaign**
template also includes a Video Hub video picker on step 1.

## Data Boundary

The UI talks to `CampaignStudioAdapter` from `types.ts`. The current implementation in
`campaignStudioData.ts` uses localStorage demo data and can be replaced by real API calls
without changing route wrappers.

The advisor board uses `advisorBoardAdapter` in `ContentBoard/contentBoardData.ts`
(overrides for edits/review/dismiss/launch keyed by `refNum` + year). The home nudge strip
reads the same adapter, so there is a single nudge system with no parallel store.

## Routes

- `/:customerCode/:refnum/campaign-studio/campaigns`
- `/:customerCode/:refnum/campaign-studio/campaigns/new`
- `/:customerCode/:refnum/campaign-studio/campaigns/workspace/:campaignWorkspaceId`
- `/:customerCode/:refnum/campaign-studio/campaigns/:campaignId/dashboard`
- `/:customerCode/:refnum/campaign-studio/content-board`
