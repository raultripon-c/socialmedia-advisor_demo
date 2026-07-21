import {
  AdvisorBoardAdapter,
  AdvisorCard,
  CampaignInfo,
  CulturalCalendarEvent,
} from "./contentBoardTypes";
import {
  VIDEO_HUB_UPLOAD_DELAY_MS,
  buildUploadedVideosForRecipients,
  videoHubCatalog,
} from "./videoHubData";

const STORAGE_PREFIX = "txe.campaignStudio.advisorBoard.v6";
const SEARCH_CTA = "https://careers.onehealth.org/search-jobs";

/**
 * Distinct campaign-generation prompts per angle.
 * Primary = values-led brand campaign; Alternate = story-led talent attraction.
 * Kept intentionally different so previews never look duplicated.
 */
export const buildCulturalCampaignPrompt = (
  event: CulturalCalendarEvent,
  angle: "primary" | "alternate" = "primary",
) => {
  if (angle === "alternate") {
    return [
      `Write a story-led employer brand campaign for One Health around ${event.title}.`,
      `Center the narrative on a real teammate moment that reflects "${event.corporateValue}" — for example growth, belonging, or patient impact.`,
      `Audience: passive candidates in Durham, NC and nearby markets who are evaluating culture before they apply.`,
      `Tone: warm, personal, and human — avoid sounding like a corporate holiday announcement.`,
      `Goal: make candidates feel they could belong on a One Health team, then invite them to explore open roles at ${SEARCH_CTA}.`,
      `Context: ${event.description}`,
    ].join(" ");
  }

  return [
    `Create a values-led employer brand campaign for One Health timed to ${event.title} (${event.category}).`,
    `Make "${event.corporateValue}" the core message and connect it to why ${event.title} matters for careers in care.`,
    `Audience: active job seekers exploring healthcare careers across North Carolina.`,
    `Tone: confident, professional, and purpose-driven.`,
    `Include a clear CTA to browse openings at ${SEARCH_CTA}.`,
    `Brief: ${event.description}`,
  ].join(" ");
};

export const culturalCalendarEvents: CulturalCalendarEvent[] = [
  {
    id: "new-years-day",
    title: "New Year's Day",
    month: 1,
    day: 1,
    category: "Seasonal",
    corporateValue: "Innovation, Growth & Fresh Perspectives",
    description: "Open the year with a forward-looking employer brand message rooted in growth and fresh perspectives.",
    contentTemplates: [
      "Happy New Year from One Health. This year we're investing in fresh perspectives, continuous learning, and careers that help our teams grow while serving patients across North Carolina. Explore roles that start with purpose: careers.onehealth.org",
      "A new year, a new chapter. At One Health, growth isn't a resolution — it's how we care. Discover where your next step could lead: careers.onehealth.org",
    ],
  },
  {
    id: "national-mentoring-month",
    title: "National Mentoring Month",
    month: 1,
    rule: "month_start",
    category: "Growth",
    corporateValue: "Mentorship & Development",
    description: "Highlight mentorship culture and how experienced clinicians develop the next generation.",
    contentTemplates: [
      "Great careers are built with great mentors. This National Mentoring Month, we're celebrating the One Health leaders who invest in the next generation of caregivers. Grow with us: careers.onehealth.org",
      "Behind every confident new nurse is a mentor who believed in them. Explore a place where development never stops: careers.onehealth.org",
    ],
  },
  {
    id: "mlk-day",
    title: "Martin Luther King Jr. Day",
    month: 1,
    rule: "third_monday",
    category: "DEI",
    corporateValue: "Diversity, Equity & Inclusion",
    description: "Honor Dr. King's legacy by connecting equity values to everyday care and workplace belonging.",
    contentTemplates: [
      "On Martin Luther King Jr. Day, One Health recommits to equity, inclusion, and care that reflects every community we serve. Join a team where belonging and opportunity grow together: careers.onehealth.org",
      "Dr. King reminded us that the time is always right to do what is right. At One Health, that means equitable care and an inclusive workplace, every day: careers.onehealth.org",
    ],
  },
  {
    id: "black-history-month",
    title: "Black History Month",
    month: 2,
    rule: "month_start",
    category: "DEI",
    corporateValue: "Community, Honor & Equal Opportunity",
    description: "Celebrate community, honor Black excellence, and highlight equal opportunity at One Health.",
    contentTemplates: [
      "During Black History Month, we celebrate the caregivers, researchers, and leaders who strengthen One Health every day. Community, honor, and equal opportunity guide how we hire and how we care: careers.onehealth.org",
      "Excellence has many faces. This Black History Month, we honor the Black professionals shaping the future of care at One Health: careers.onehealth.org",
    ],
  },
  {
    id: "heart-health-day",
    title: "National Wear Red Day",
    month: 2,
    rule: "first_friday",
    category: "Wellbeing",
    corporateValue: "Health & Wellbeing",
    description: "Tie heart-health awareness to One Health's mission and cardiovascular care teams.",
    contentTemplates: [
      "Today we go red for heart health. One Health's cardiovascular teams protect hearts every day — and we're hiring the people who make that possible: careers.onehealth.org",
      "Heart health starts with the people who care for it. Join the One Health teams keeping our communities strong: careers.onehealth.org",
    ],
  },
  {
    id: "random-acts-kindness",
    title: "Random Acts of Kindness Day",
    month: 2,
    day: 17,
    category: "Community",
    corporateValue: "Kindness & Compassion",
    description: "Spotlight everyday compassion shown by care teams.",
    contentTemplates: [
      "Kindness is a clinical skill too. On Random Acts of Kindness Day, we're grateful for the small moments that make One Health feel like family — for patients and teammates alike: careers.onehealth.org",
      "A warm hand, a reassuring word, a coffee for a colleague. Kindness defines care at One Health. Come be part of it: careers.onehealth.org",
    ],
  },
  {
    id: "womens-history-month",
    title: "Women's History Month",
    month: 3,
    rule: "month_start",
    category: "DEI",
    corporateValue: "Equity & Representation",
    description: "Celebrate the women leading care, research, and operations.",
    contentTemplates: [
      "This Women's History Month, One Health celebrates the women advancing care, discovery, and leadership across our health system. Build your career with us: careers.onehealth.org",
      "From the bedside to the boardroom, women lead at One Health. Explore where your leadership belongs: careers.onehealth.org",
    ],
  },
  {
    id: "employee-appreciation-day",
    title: "Employee Appreciation Day",
    month: 3,
    rule: "first_friday",
    category: "Recognition",
    corporateValue: "People-First Culture & Executive Gratitude",
    description: "Spotlight people-first culture and gratitude for the teams behind every patient interaction.",
    contentTemplates: [
      "Today we celebrate the people of One Health. From bedside to research labs, your dedication defines our culture. Thank you for putting patients and each other first: careers.onehealth.org",
      "Our people are our purpose. On Employee Appreciation Day, thank you to every teammate who makes One Health extraordinary: careers.onehealth.org",
    ],
  },
  {
    id: "international-womens-day",
    title: "International Women's Day",
    month: 3,
    day: 8,
    category: "DEI",
    corporateValue: "Equity & Representation",
    description: "Global recognition of women's achievements in healthcare.",
    contentTemplates: [
      "On International Women's Day, we honor the women who drive One Health forward — in nursing, medicine, research, and leadership. Join them: careers.onehealth.org",
      "Equity isn't a moment, it's a mission. This International Women's Day, discover a workplace where women thrive: careers.onehealth.org",
    ],
  },
  {
    id: "doctors-day",
    title: "National Doctors' Day",
    month: 3,
    day: 30,
    category: "Recognition",
    corporateValue: "Clinical Excellence & Gratitude",
    description: "Recognize physicians and the culture that supports them.",
    contentTemplates: [
      "On National Doctors' Day, thank you to the physicians whose expertise and compassion define One Health. Practice where excellence is the standard: careers.onehealth.org",
      "Behind every breakthrough is a physician who never stopped caring. Celebrate Doctors' Day with One Health: careers.onehealth.org",
    ],
  },
  {
    id: "world-health-day",
    title: "World Health Day",
    month: 4,
    day: 7,
    category: "Wellbeing",
    corporateValue: "Health & Wellbeing",
    description: "Connect global health awareness to One Health's mission.",
    contentTemplates: [
      "This World Health Day, One Health reaffirms our commitment to healthier communities — and to the teams that make it happen. Join the mission: careers.onehealth.org",
      "Health is a right, not a privilege. Help One Health advance care for everyone: careers.onehealth.org",
    ],
  },
  {
    id: "national-volunteer-week",
    title: "National Volunteer Week",
    month: 4,
    rule: "month_mid",
    category: "Community",
    corporateValue: "Corporate Citizenship",
    description: "Highlight volunteerism and community service by staff.",
    contentTemplates: [
      "This National Volunteer Week, we celebrate One Health teammates who give their time to strengthen our communities. Care beyond the shift: careers.onehealth.org",
      "Service is in our DNA. Meet a team that shows up for the community — and for each other: careers.onehealth.org",
    ],
  },
  {
    id: "earth-day",
    title: "Earth Day",
    month: 4,
    day: 22,
    category: "Sustainability",
    corporateValue: "Sustainability & Responsibility",
    description: "Connect sustainability and responsible operations to brand and community impact.",
    contentTemplates: [
      "This Earth Day, One Health is focused on responsible care for people and planet — from greener campuses to smarter clinical operations. Build a career with purpose beyond the shift: careers.onehealth.org",
      "Healthy planet, healthy people. Join the One Health teams building a more sustainable future for care: careers.onehealth.org",
    ],
  },
  {
    id: "admin-professionals-day",
    title: "Administrative Professionals Day",
    month: 4,
    rule: "month_mid",
    category: "Recognition",
    corporateValue: "Team Appreciation",
    description: "Recognize the administrative teams that keep care running.",
    contentTemplates: [
      "Care doesn't run without them. On Administrative Professionals Day, thank you to the One Health teams keeping everything moving. Explore roles: careers.onehealth.org",
      "Behind every smooth clinic day is an incredible administrative professional. Join our team: careers.onehealth.org",
    ],
  },
  {
    id: "nurses-week",
    title: "National Nurses Week",
    month: 5,
    day: 6,
    category: "Recognition",
    corporateValue: "Clinical Excellence & Gratitude",
    description: "Celebrate nurses — the heart of One Health.",
    contentTemplates: [
      "It's National Nurses Week. To the nurses of One Health: your skill and heart change lives every shift. Thank you — and if you're a nurse looking for your next home, explore with us: careers.onehealth.org/search-jobs/registered%20nurse",
      "Nurses are the heartbeat of One Health. This Nurses Week, we celebrate you — and invite great nurses to join us: careers.onehealth.org/search-jobs/registered%20nurse",
    ],
  },
  {
    id: "mothers-day",
    title: "Mother's Day",
    month: 5,
    rule: "second_sunday",
    category: "Culture",
    corporateValue: "Family & Belonging",
    description: "Honor working parents and the families behind our teams.",
    contentTemplates: [
      "This Mother's Day, we honor the moms on our teams who care for patients and family alike. One Health supports the people who do it all: careers.onehealth.org",
      "To every mother caring for others at One Health — thank you. Find a workplace that supports your whole life: careers.onehealth.org",
    ],
  },
  {
    id: "mental-health-month",
    title: "Mental Health Awareness Month",
    month: 5,
    rule: "month_start",
    category: "Wellbeing",
    corporateValue: "Psychological Safety & Wellbeing",
    description: "Reinforce psychological safety and wellbeing support.",
    contentTemplates: [
      "This Mental Health Awareness Month, One Health is doubling down on wellbeing — because caring for others starts with caring for our teams. Join a workplace that has your back: careers.onehealth.org",
      "Your wellbeing matters here. Explore a culture built on psychological safety at One Health: careers.onehealth.org",
    ],
  },
  {
    id: "memorial-day",
    title: "Memorial Day",
    month: 5,
    rule: "last_monday",
    category: "Honor",
    corporateValue: "Honor, Sacrifice & Service",
    description: "Acknowledge service and sacrifice with a respectful brand presence.",
    contentTemplates: [
      "This Memorial Day, One Health honors those who served. We remain grateful for the courage that protects our communities — and committed to compassionate care for veterans and families: careers.onehealth.org",
      "We remember and we honor. This Memorial Day, thank you to the families who gave so much: careers.onehealth.org",
    ],
  },
  {
    id: "pride-month",
    title: "Pride Month",
    month: 6,
    rule: "month_start",
    category: "DEI",
    corporateValue: "Authenticity, Belonging & Psychological Safety",
    description: "Champion authenticity, belonging, and psychological safety across teams.",
    contentTemplates: [
      "Pride Month at One Health means authenticity and belonging every day — not just in June. Join teams where psychological safety helps people thrive and patients feel seen: careers.onehealth.org",
      "Bring your whole self to work. This Pride Month, celebrate a One Health culture where everyone belongs: careers.onehealth.org",
    ],
  },
  {
    id: "juneteenth",
    title: "Juneteenth",
    month: 6,
    day: 19,
    category: "DEI",
    corporateValue: "Freedom, Progress & Workplace Equity",
    description: "Recognize freedom, progress, and ongoing commitment to workplace equity.",
    contentTemplates: [
      "On Juneteenth, One Health reflects on freedom, progress, and the work still ahead. We're building workplaces and care experiences grounded in equity for every team member and every patient: careers.onehealth.org",
      "Juneteenth is a celebration of freedom and a call to keep going. Join a One Health team committed to equity: careers.onehealth.org",
    ],
  },
  {
    id: "fathers-day",
    title: "Father's Day",
    month: 6,
    rule: "month_mid",
    category: "Culture",
    corporateValue: "Family & Belonging",
    description: "Honor working fathers across the health system.",
    contentTemplates: [
      "This Father's Day, we celebrate the dads on our teams balancing care at work and at home. One Health supports your whole life: careers.onehealth.org",
      "To the fathers caring for our patients and their own families — thank you. Grow your career with One Health: careers.onehealth.org",
    ],
  },
  {
    id: "independence-day",
    title: "Independence Day",
    month: 7,
    day: 4,
    category: "Community",
    corporateValue: "Unity, Collaboration & Community",
    description: "Celebrate unity, collaboration, and community with a brand-forward post.",
    contentTemplates: [
      "Happy Independence Day from One Health. Across clinics, hospitals, and communities, our teams collaborate to keep care close to home. Find your next role with purpose: careers.onehealth.org",
      "This Fourth of July, we're grateful for the teams who keep our communities cared for, even on the holidays. Join us: careers.onehealth.org",
    ],
  },
  {
    id: "national-intern-day",
    title: "National Intern Day",
    month: 7,
    rule: "month_mid",
    category: "Growth",
    corporateValue: "Early Careers & Development",
    description: "Spotlight internships and early-career pathways.",
    contentTemplates: [
      "This National Intern Day, we celebrate the students launching healthcare careers at One Health. Start yours with us: careers.onehealth.org",
      "Today's intern is tomorrow's leader. Explore early-career pathways at One Health: careers.onehealth.org",
    ],
  },
  {
    id: "world-youth-skills-day",
    title: "World Youth Skills Day",
    month: 7,
    day: 15,
    category: "Growth",
    corporateValue: "Skills & Development",
    description: "Highlight skills-building and training programs.",
    contentTemplates: [
      "Skills change lives. This World Youth Skills Day, discover the training and development that launch careers at One Health: careers.onehealth.org",
      "We invest in potential. Explore skill-building roles and programs at One Health: careers.onehealth.org",
    ],
  },
  {
    id: "wellness-month",
    title: "National Wellness Month",
    month: 8,
    rule: "month_start",
    category: "Wellbeing",
    corporateValue: "Health & Wellbeing",
    description: "Promote wellbeing culture and benefits.",
    contentTemplates: [
      "This National Wellness Month, One Health is prioritizing the wellbeing of the people who care for others. Explore a workplace that supports you: careers.onehealth.org",
      "Wellbeing isn't a perk, it's our culture. Join One Health this Wellness Month: careers.onehealth.org",
    ],
  },
  {
    id: "labor-day",
    title: "Labor Day",
    month: 9,
    rule: "first_monday",
    category: "Wellbeing",
    corporateValue: "Hard Work, Well-being & Work-Life Balance",
    description: "Recognize hard work while reinforcing well-being and sustainable careers.",
    contentTemplates: [
      "This Labor Day, One Health celebrates the dedication behind every patient outcome — and the well-being that sustains it. Explore careers that value hard work and balance: careers.onehealth.org",
      "Hard work deserves real support. This Labor Day, discover a One Health career built to last: careers.onehealth.org",
    ],
  },
  {
    id: "suicide-prevention-month",
    title: "Suicide Prevention Month",
    month: 9,
    rule: "month_start",
    category: "Wellbeing",
    corporateValue: "Psychological Safety",
    description: "Reinforce mental-health support and safe culture.",
    contentTemplates: [
      "This Suicide Prevention Month, One Health stands for support, connection, and hope — for our patients and our teams. Join a workplace that cares: careers.onehealth.org",
      "You are not alone. This month and every month, One Health invests in mental-health support for our people: careers.onehealth.org",
    ],
  },
  {
    id: "hispanic-heritage-month",
    title: "Hispanic Heritage Month",
    month: 9,
    day: 15,
    category: "DEI",
    corporateValue: "Community & Representation",
    description: "Celebrate Hispanic and Latino contributions to care.",
    contentTemplates: [
      "This Hispanic Heritage Month, One Health celebrates the Hispanic and Latino teammates enriching our care and culture. Join us: careers.onehealth.org",
      "Representation strengthens care. Celebrate Hispanic Heritage Month with a One Health team that reflects our communities: careers.onehealth.org",
    ],
  },
  {
    id: "disability-employment-month",
    title: "Disability Employment Awareness Month",
    month: 10,
    rule: "month_start",
    category: "DEI",
    corporateValue: "Inclusion & Accessibility",
    description: "Champion accessible, inclusive hiring.",
    contentTemplates: [
      "This National Disability Employment Awareness Month, One Health reaffirms our commitment to accessible, inclusive careers for all. Explore opportunities: careers.onehealth.org",
      "Inclusion means everyone. Discover an accessible workplace at One Health: careers.onehealth.org",
    ],
  },
  {
    id: "breast-cancer-awareness",
    title: "Breast Cancer Awareness Month",
    month: 10,
    rule: "month_mid",
    category: "Community",
    corporateValue: "Health & Compassion",
    description: "Connect oncology care and community support.",
    contentTemplates: [
      "This Breast Cancer Awareness Month, we honor One Health's oncology teams and the patients they fight alongside. Join a team that cares deeply: careers.onehealth.org",
      "Early detection saves lives — and so do compassionate care teams. Explore oncology careers at One Health: careers.onehealth.org",
    ],
  },
  {
    id: "halloween",
    title: "Halloween",
    month: 10,
    day: 31,
    category: "Culture",
    corporateValue: "Team Camaraderie",
    description: "Lighthearted culture moment showcasing team fun.",
    contentTemplates: [
      "The only thing scary at One Health is how much fun our teams have together. Happy Halloween! Come join the crew: careers.onehealth.org",
      "Treats, team spirit, and great care. Happy Halloween from One Health — we're hiring: careers.onehealth.org",
    ],
  },
  {
    id: "veterans-day",
    title: "National Veterans Day",
    month: 11,
    day: 11,
    category: "Honor",
    corporateValue: "Leadership, Resilience & Integrity",
    description: "Honor veteran leadership, resilience, and integrity on the care team.",
    contentTemplates: [
      "On Veterans Day, One Health thanks the service members and veterans on our teams. Leadership, resilience, and integrity strengthen the care we deliver every day: careers.onehealth.org",
      "Veterans make exceptional caregivers. This Veterans Day, discover a One Health career that values your service: careers.onehealth.org",
    ],
  },
  {
    id: "native-american-heritage",
    title: "Native American Heritage Month",
    month: 11,
    rule: "month_start",
    category: "DEI",
    corporateValue: "Community & Representation",
    description: "Celebrate Native American heritage and inclusive care.",
    contentTemplates: [
      "This Native American Heritage Month, One Health honors the traditions, resilience, and contributions of Native communities and teammates. Join an inclusive team: careers.onehealth.org",
      "Care that respects every culture. Celebrate Native American Heritage Month with One Health: careers.onehealth.org",
    ],
  },
  {
    id: "thanksgiving",
    title: "Thanksgiving Day",
    month: 11,
    rule: "fourth_thursday",
    category: "Recognition",
    corporateValue: "Gratitude, Teamwork & Partner Appreciation",
    description: "Express gratitude for teams, partners, and the communities One Health serves.",
    contentTemplates: [
      "This Thanksgiving, One Health is grateful for the teams and partners who make excellent care possible. Thank you for the teamwork behind every moment that matters: careers.onehealth.org",
      "Grateful for our people, our patients, and our community. Happy Thanksgiving from One Health: careers.onehealth.org",
    ],
  },
  {
    id: "world-kindness-day",
    title: "World Kindness Day",
    month: 11,
    day: 13,
    category: "Community",
    corporateValue: "Kindness & Compassion",
    description: "Reinforce compassion as a core value.",
    contentTemplates: [
      "On World Kindness Day, we celebrate the compassion that defines One Health. Join a team where kindness is care: careers.onehealth.org",
      "Small kindnesses, big impact. Discover a workplace built on compassion at One Health: careers.onehealth.org",
    ],
  },
  {
    id: "international-volunteer-day",
    title: "International Volunteer Day",
    month: 12,
    day: 5,
    category: "Community",
    corporateValue: "Corporate Citizenship",
    description: "Celebrate volunteerism and giving back.",
    contentTemplates: [
      "This International Volunteer Day, we celebrate One Health teammates who give back to our communities. Care that goes further: careers.onehealth.org",
      "Giving back is part of who we are. Join a One Health team that shows up for the community: careers.onehealth.org",
    ],
  },
  {
    id: "human-rights-day",
    title: "Human Rights Day",
    month: 12,
    day: 10,
    category: "DEI",
    corporateValue: "Equity & Dignity",
    description: "Connect dignity and equity to care and hiring.",
    contentTemplates: [
      "On Human Rights Day, One Health reaffirms that dignity and equity belong to everyone — patients and teammates alike. Join us: careers.onehealth.org",
      "Care is a human right. This Human Rights Day, build a career grounded in dignity at One Health: careers.onehealth.org",
    ],
  },
  {
    id: "winter-holidays",
    title: "Winter Holidays & End of Year",
    month: 12,
    rule: "month_mid",
    category: "Seasonal",
    corporateValue: "Reflection, Rejuvenation & Well-Deserved Rest",
    description: "Close the year with reflection, rejuvenation, and rest as brand themes.",
    contentTemplates: [
      "As the year closes, One Health reflects on the care, discovery, and community impact our teams delivered — and prioritizes well-deserved rest. Start the next chapter with us: careers.onehealth.org",
      "Season's greetings from One Health. Grateful for a year of care, and excited for what's ahead. Explore your future with us: careers.onehealth.org",
    ],
  },
];

const weekday = (year: number, month: number, day: number) => new Date(year, month - 1, day).getDay();

const nthWeekdayOfMonth = (year: number, month: number, targetWeekday: number, n: number) => {
  let count = 0;
  for (let day = 1; day <= 31; day += 1) {
    const date = new Date(year, month - 1, day);
    if (date.getMonth() !== month - 1) break;
    if (date.getDay() === targetWeekday) {
      count += 1;
      if (count === n) return day;
    }
  }
  return 1;
};

const lastWeekdayOfMonth = (year: number, month: number, targetWeekday: number) => {
  const lastDay = new Date(year, month, 0).getDate();
  for (let day = lastDay; day >= 1; day -= 1) {
    if (weekday(year, month, day) === targetWeekday) return day;
  }
  return lastDay;
};

export const resolveEventDate = (event: CulturalCalendarEvent, year: number): Date => {
  let day = event.day || 1;
  if (event.rule === "third_monday") day = nthWeekdayOfMonth(year, event.month, 1, 3);
  if (event.rule === "first_friday") day = nthWeekdayOfMonth(year, event.month, 5, 1);
  if (event.rule === "last_monday") day = lastWeekdayOfMonth(year, event.month, 1);
  if (event.rule === "first_monday") day = nthWeekdayOfMonth(year, event.month, 1, 1);
  if (event.rule === "fourth_thursday") day = nthWeekdayOfMonth(year, event.month, 4, 4);
  if (event.rule === "second_sunday") day = nthWeekdayOfMonth(year, event.month, 0, 2);
  if (event.rule === "month_start") day = 1;
  if (event.rule === "month_mid") day = 15;
  return new Date(year, event.month - 1, day);
};

export const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseIsoDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const startOfWeek = (date: Date) => {
  const next = new Date(date);
  const day = next.getDay();
  next.setDate(next.getDate() - day);
  next.setHours(0, 0, 0, 0);
  return next;
};

export const addDays = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const formatBoardDate = (date: Date, options?: Intl.DateTimeFormatOptions) =>
  date.toLocaleDateString("en-US", options || { month: "short", day: "numeric", year: "numeric" });

export const getQuarterStartMonth = (month: number) => Math.floor(month / 3) * 3;

export const getEventById = (eventId?: string) =>
  eventId ? culturalCalendarEvents.find((event) => event.id === eventId) : undefined;

export const getEventForDate = (date: Date, year: number) =>
  culturalCalendarEvents.find((event) => sameDay(resolveEventDate(event, year), date));

// --- Card generation -------------------------------------------------------

const REVIEWED_SEED_EVENT_IDS = new Set(["labor-day", "employee-appreciation-day", "pride-month"]);

const generateCulturalCards = (year: number): AdvisorCard[] => {
  const cards: AdvisorCard[] = [];
  culturalCalendarEvents.forEach((event) => {
    const date = toIsoDate(resolveEventDate(event, year));
    (["primary", "alternate"] as const).forEach((angle, index) => {
      const reviewed = index === 0 && REVIEWED_SEED_EVENT_IDS.has(event.id);
      cards.push({
        id: `cul-${event.id}-${index}-${year}`,
        source: "cultural",
        contentType: "Calendar Draft",
        status: reviewed ? "reviewed" : "to_be_reviewed",
        date,
        eventId: event.id,
        title: `${event.title} — ${angle === "primary" ? "Values-led prompt" : "Story-led prompt"}`,
        copy: buildCulturalCampaignPrompt(event, angle),
        category: event.category,
        corporateValue: event.corporateValue,
        aiExplanation: `Campaign prompt auto-generated from the ${event.title} cultural anchor to reinforce "${event.corporateValue}". Recommended distribution: 5-10% calendar-driven mix.`,
        suggestedCta: SEARCH_CTA,
        reviewedAt: reviewed ? date : undefined,
      });
    });
  });
  return cards;
};

const mapToYear = (isoMonthDay: string, year: number) => `${year}-${isoMonthDay}`;

const generateMediaListeningCards = (year: number): AdvisorCard[] => [
  {
    id: `media-forbes-new-grads-${year}`,
    source: "media_listening",
    contentType: "Award",
    status: "to_be_reviewed",
    date: mapToYear("05-19", year),
    title: "Forbes: Best Employers for New Grads",
    copy:
      "Create an employer brand campaign for One Health inspired by Forbes naming One Health one of America's Best Employers for New Grads. Emphasize early-career growth, mentorship, learning, and patient impact. Target new graduates and early-career healthcare talent nationally with a warm, professional tone. Drive candidates to explore open roles at https://careers.onehealth.org/search-jobs.",
    category: "Recognition",
    corporateValue: "Employer Brand & Early Careers",
    region: "National",
    aiExplanation:
      "Detected a positive award mention in Forbes via media listening. Awards carry strong trust signals for early-career candidates — recommended to amplify.",
    sourceLabel: "One Health Today",
    sourceUrl: "https://today.onehealth.org/",
    suggestedCta: SEARCH_CTA,
  },
  {
    id: `media-minimum-wage-${year}`,
    source: "media_listening",
    contentType: "Brand Mention",
    status: "to_be_reviewed",
    date: mapToYear("03-18", year),
    title: "One Health raises minimum wage to $20/hr",
    copy:
      "Create an employer brand campaign for One Health highlighting the announcement that the minimum wage was raised to $20/hour. Position this as a people-first investment in caregivers and support teams. Target qualified candidates in Durham, NC and surrounding markets with a warm, professional tone. Drive candidates to explore careers at https://careers.onehealth.org/search-jobs.",
    category: "Culture",
    corporateValue: "People-First Culture",
    region: "Durham, NC",
    aiExplanation:
      "Positive PR announcement detected. Compensation news resonates with active and passive candidates — strong employer-brand signal.",
    sourceLabel: "One Health Corporate",
    sourceUrl: "https://corporate.onehealth.org/",
    suggestedCta: SEARCH_CTA,
  },
  {
    id: `media-homegrown-${year}`,
    source: "media_listening",
    contentType: "Brand Mention",
    status: "to_be_reviewed",
    date: mapToYear("02-12", year),
    title: "$203M HomeGrown community initiative",
    copy:
      "Create an employer brand campaign for One Health based on the $203 million HomeGrown initiative covering local opportunity, community health, and workforce pathways. Emphasize corporate citizenship and mission-driven careers. Target qualified candidates in Durham, NC with a warm, professional tone. CTA: https://careers.onehealth.org/search-jobs.",
    category: "Community",
    corporateValue: "Corporate Citizenship",
    region: "Durham, NC",
    aiExplanation:
      "Community-impact coverage detected via media listening. Corporate citizenship stories build brand trust with mission-driven candidates.",
    sourceLabel: "WRAL",
    sourceUrl: "https://www.wral.com/",
    suggestedCta: SEARCH_CTA,
  },
  {
    id: `media-diversity-ranking-${year}`,
    source: "media_listening",
    contentType: "Award",
    status: "to_be_reviewed",
    date: mapToYear("06-03", year),
    title: "Recognized for workplace diversity",
    copy:
      "Create an employer brand campaign for One Health celebrating recognition for workplace diversity. Emphasize belonging, inclusive hiring, and how diverse teams strengthen patient outcomes. Target diverse talent pools nationally with a warm, professional tone. Drive candidates to https://careers.onehealth.org/search-jobs.",
    category: "DEI",
    corporateValue: "Diversity, Equity & Inclusion",
    region: "National",
    aiExplanation:
      "Ranking detected via media listening. DEI recognition is a high-trust signal for diverse talent pools.",
    sourceLabel: "DiversityJobs",
    sourceUrl: "https://www.diversityjobs.com/",
    suggestedCta: SEARCH_CTA,
  },
  {
    id: `media-nurse-magnet-${year}`,
    source: "media_listening",
    contentType: "Award",
    status: "to_be_reviewed",
    date: mapToYear("04-22", year),
    title: "Nursing earns Magnet recognition",
    copy:
      "Create an employer brand campaign for One Health Nursing celebrating Magnet-level recognition for care, leadership, and professional practice. Target experienced Registered Nurses in Durham, NC with a warm, professional tone that highlights excellence and growth. Drive candidates to https://careers.onehealth.org/search-jobs/registered%20nurse.",
    category: "Recognition",
    corporateValue: "Clinical Excellence",
    department: "Nursing",
    region: "Durham, NC",
    aiExplanation:
      "Magnet recognition coverage detected. Nursing excellence awards directly influence RN candidate decisions.",
    sourceLabel: "Nurse.org",
    sourceUrl: "https://nurse.org/",
    suggestedCta: "https://careers.onehealth.org/search-jobs/registered%20nurse",
  },
];

const generateTestimonialCards = (year: number): AdvisorCard[] => [
  {
    id: `test-marcus-5yr-${year}`,
    source: "testimonial",
    contentType: "Employee Milestone",
    status: "to_be_reviewed",
    date: mapToYear("03-04", year),
    title: "Marcus reached 5 years with One Health",
    copy:
      "Marcus just celebrated five years with One Health. Milestones like this are perfect testimonial moments — his story of growth from bedside nurse to charge nurse can inspire candidates weighing a long-term career here.",
    category: "Recognition",
    corporateValue: "Retention & Growth",
    department: "Nursing",
    region: "Durham, NC",
    accent: "yellow",
    aiExplanation:
      "Detected a 5-year work anniversary in ERM data. Anniversary stories carry 10x the trust of a corporate post — recommend requesting a testimonial.",
    suggestedCta: "https://careers.onehealth.org/search-jobs/registered%20nurse",
    campaignInfo: {
      template: "Milestone Spotlight",
      purpose: "Celebrate a 5-year work anniversary and encourage long-term candidates.",
    },
  },
  {
    id: `test-clinical-shortage-${year}`,
    source: "testimonial",
    contentType: "Testimonial Opportunity",
    status: "to_be_reviewed",
    date: mapToYear("02-25", year),
    title: "Clinical Support applications slowed in Raleigh",
    copy:
      "Applications for Clinical Support roles in Raleigh have slowed recently. Suggest featuring local clinical employees in short testimonials to rebuild momentum and trust with nearby candidates.",
    category: "Recruitment",
    corporateValue: "Sourcing Efficiency",
    department: "Clinical Support",
    region: "Raleigh, NC",
    accent: "yellow",
    aiExplanation:
      "Detected a decline in application volume for a hiring shortage area. Local employee testimonials are the highest-converting response.",
    suggestedCta: "https://careers.onehealth.org/search-jobs/clinical",
    campaignInfo: {
      template: "Team Spotlight",
      purpose: "Re-energize sourcing for Clinical Support roles in Raleigh with employee voices.",
    },
  },
  {
    id: `test-intern-fulltime-${year}`,
    source: "testimonial",
    contentType: "Employee Story",
    status: "to_be_reviewed",
    date: mapToYear("07-22", year),
    title: "Priya moved from intern to full-time RN",
    copy:
      "Priya just transitioned from a summer intern to a full-time Registered Nurse. Intern-to-FTE stories are powerful proof of One Health's career pathways — a great testimonial to capture now.",
    category: "Growth",
    corporateValue: "Early Careers & Development",
    department: "Nursing",
    region: "Durham, NC",
    accent: "yellow",
    aiExplanation:
      "Detected an intern-to-full-time conversion in CRM data. Conversion stories validate early-career pipelines.",
    suggestedCta: "https://careers.onehealth.org/nursing/new-graduate-nurses",
    campaignInfo: {
      template: "Career Pathway Story",
      purpose: "Showcase intern-to-full-time growth to attract new-grad nurses.",
    },
  },
  {
    id: `test-certification-${year}`,
    source: "testimonial",
    contentType: "Employee Milestone",
    status: "awaiting_uploads",
    date: mapToYear("09-16", year),
    title: "Radiology team earned new certifications",
    copy:
      "Several Radiology teammates just earned advanced certifications. Learning achievements make authentic testimonial content and reinforce a culture of development.",
    category: "Growth",
    corporateValue: "Learning & Development",
    department: "Radiology",
    region: "Durham, NC",
    accent: "yellow",
    aiExplanation:
      "Detected certification milestones in ERM learning data. Development stories appeal to growth-minded candidates.",
    suggestedCta: "https://careers.onehealth.org/search-jobs",
    campaignInfo: {
      template: "Learning Achievement",
      purpose: "Highlight professional development in Radiology.",
      recipients: [
        "Elena Vasquez <elena.vasquez@onehealth.org>",
        "Chris Nguyen <chris.nguyen@onehealth.org>",
      ],
      launchedAt: new Date().toISOString(),
      scriptQuestions: [
        "What made you choose One Health?",
        "What does growing your skills look like on your team?",
      ],
    },
  },
  {
    id: `test-daisy-award-${year}`,
    source: "testimonial",
    contentType: "Employee Story",
    status: "ready_for_campaign",
    date: mapToYear("05-08", year),
    title: "DAISY Award winner — videos ready",
    copy:
      "Create an employee testimonial campaign for One Health featuring a DAISY Award-winning nurse. Highlight compassionate care, teamwork, and why candidates thrive here. Target Registered Nurses in Durham, NC with a warm, professional tone and invite them to explore open roles.",
    category: "Recognition",
    corporateValue: "Clinical Excellence & Compassion",
    department: "Nursing",
    region: "Durham, NC",
    accent: "yellow",
    aiExplanation:
      "Detected an internal award in recognition data. Videos are uploaded in Video Hub and ready for campaign configuration.",
    suggestedCta: "https://careers.onehealth.org/search-jobs/registered%20nurse",
    campaignInfo: {
      template: "Recognition Spotlight",
      purpose: "Feature a DAISY Award winner to showcase compassionate culture.",
      recipients: [
        "Aisha Rahman <aisha.rahman@onehealth.org>",
        "Jordan Blake <jordan.blake@onehealth.org>",
      ],
      launchedAt: new Date(Date.now() - 86_400_000).toISOString(),
      uploadsCompletedAt: new Date(Date.now() - 3_600_000).toISOString(),
      videos: [videoHubCatalog[1], videoHubCatalog[4]].map((video, index) => ({
        ...video,
        id: `${video.id}-daisy-${index}`,
        uploadedAt: new Date(Date.now() - 3_600_000).toISOString(),
      })),
    },
  },
  {
    id: `test-marcus-anniversary-${year}`,
    source: "testimonial",
    contentType: "Employee Story",
    status: "ready_for_campaign",
    date: mapToYear("05-12", year),
    title: "5-year anniversary — video ready",
    copy:
      "Create an employee testimonial campaign featuring Marcus Chen’s 5-year anniversary story. Spotlight belonging, patient impact, and why nurses stay at One Health. Target Registered Nurses in Durham, NC with a warm, professional tone.",
    category: "Employee Milestone",
    corporateValue: "Belonging & Retention",
    department: "Nursing",
    region: "Durham, NC",
    accent: "yellow",
    aiExplanation:
      "Milestone detected from tenure data. A single Video Hub upload is ready — campaign uses this video only.",
    suggestedCta: "https://careers.onehealth.org/search-jobs/registered%20nurse",
    campaignInfo: {
      template: "Anniversary Spotlight",
      purpose: "Feature a 5-year anniversary testimonial with a locked single video.",
      recipients: ["Marcus Chen <marcus.chen@onehealth.org>"],
      launchedAt: new Date(Date.now() - 172_800_000).toISOString(),
      uploadsCompletedAt: new Date(Date.now() - 7_200_000).toISOString(),
      lockVideoSelection: true,
      videos: [
        {
          ...videoHubCatalog[0],
          id: `${videoHubCatalog[0].id}-marcus-ready`,
          uploadedAt: new Date(Date.now() - 7_200_000).toISOString(),
        },
      ],
    },
  },
];

export const generateAllCards = (year: number): AdvisorCard[] => [
  ...generateMediaListeningCards(year),
  ...generateTestimonialCards(year),
  ...generateCulturalCards(year),
];

// --- Persistence -----------------------------------------------------------

type CardOverride = Partial<
  Pick<
    AdvisorCard,
    "status" | "title" | "copy" | "dismissed" | "reviewedAt" | "updatedAt" | "campaignInfo" | "reviewHistory"
  >
>;

const overridesKey = (refNum: string, year: number) => `${STORAGE_PREFIX}.overrides.${refNum}.${year}`;

const readOverrides = (refNum: string, year: number): Record<string, CardOverride> => {
  try {
    const raw = localStorage.getItem(overridesKey(refNum, year));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeOverrides = (refNum: string, year: number, overrides: Record<string, CardOverride>) => {
  localStorage.setItem(overridesKey(refNum, year), JSON.stringify(overrides));
};

const applyOverride = (card: AdvisorCard, override?: CardOverride): AdvisorCard =>
  override ? { ...card, ...override } : card;

/** Auto-promote awaiting Video Hub requests once the demo upload delay has elapsed. */
const resolveUploadTransitions = (refNum: string, year: number, cards: AdvisorCard[]): AdvisorCard[] => {
  const now = Date.now();
  return cards.map((card) => {
    if (card.status !== "awaiting_uploads" || !card.campaignInfo?.launchedAt) return card;
    const launchedAt = new Date(card.campaignInfo.launchedAt).getTime();
    if (Number.isNaN(launchedAt) || now - launchedAt < VIDEO_HUB_UPLOAD_DELAY_MS) return card;

    const uploadsCompletedAt = new Date().toISOString();
    const videos = buildUploadedVideosForRecipients(card.campaignInfo.recipients || [], uploadsCompletedAt);
    const campaignInfo: CampaignInfo = {
      ...card.campaignInfo,
      videos,
      uploadsCompletedAt,
    };
    const reviewHistory = [
      ...(card.reviewHistory || []),
      { at: uploadsCompletedAt, label: "Video Hub uploads received — ready for campaign" },
    ];
    upsertOverride(refNum, year, card.id, {
      status: "ready_for_campaign",
      updatedAt: uploadsCompletedAt,
      campaignInfo,
      reviewHistory,
    });
    return {
      ...card,
      status: "ready_for_campaign",
      updatedAt: uploadsCompletedAt,
      campaignInfo,
      reviewHistory,
    };
  });
};

const composeCards = (refNum: string, year: number): AdvisorCard[] => {
  const overrides = readOverrides(refNum, year);
  const cards = generateAllCards(year).map((card) => applyOverride(card, overrides[card.id]));
  return resolveUploadTransitions(refNum, year, cards);
};

const upsertOverride = (refNum: string, year: number, cardId: string, patch: CardOverride) => {
  const overrides = readOverrides(refNum, year);
  overrides[cardId] = { ...overrides[cardId], ...patch };
  writeOverrides(refNum, year, overrides);
};

export const advisorBoardAdapter: AdvisorBoardAdapter = {
  listCards: async (refNum, year) => composeCards(refNum, year).filter((card) => !card.dismissed),
  saveCard: async (refNum, year, card) => {
    upsertOverride(refNum, year, card.id, {
      title: card.title,
      copy: card.copy,
      status: card.status,
      updatedAt: new Date().toISOString(),
      campaignInfo: card.campaignInfo,
    });
    return card;
  },
  updateCard: async (refNum, year, card) => {
    upsertOverride(refNum, year, card.id, {
      title: card.title,
      copy: card.copy,
      updatedAt: new Date().toISOString(),
      campaignInfo: card.campaignInfo,
      status: card.status,
    });
    return { ...card, updatedAt: new Date().toISOString() };
  },
  markReviewed: async (refNum, year, cardId, updates) => {
    const current = composeCards(refNum, year).find((card) => card.id === cardId);
    if (!current) throw new Error(`Card not found: ${cardId}`);
    const reviewedAt = new Date().toISOString();
    const reviewHistory = [
      ...(current.reviewHistory || []),
      { at: reviewedAt, label: "Marked as Reviewed" },
    ];
    upsertOverride(refNum, year, cardId, {
      title: updates.title,
      copy: updates.copy,
      status: "reviewed",
      reviewedAt,
      updatedAt: reviewedAt,
      reviewHistory,
    });
    return { ...current, ...updates, status: "reviewed", reviewedAt, updatedAt: reviewedAt, reviewHistory };
  },
  dismissCard: async (refNum, year, cardId) => {
    upsertOverride(refNum, year, cardId, { dismissed: true, updatedAt: new Date().toISOString() });
  },
  launchTestimonial: async (refNum, year, cardId, campaignInfo) => {
    const current = composeCards(refNum, year).find((card) => card.id === cardId);
    if (!current) throw new Error(`Card not found: ${cardId}`);
    const launchedAt = new Date().toISOString();
    const mergedInfo: CampaignInfo = {
      ...current.campaignInfo,
      ...campaignInfo,
      launchedAt,
      videos: undefined,
      uploadsCompletedAt: undefined,
    };
    const reviewHistory = [
      ...(current.reviewHistory || []),
      { at: launchedAt, label: "Video Hub request sent — waiting for uploads" },
    ];
    upsertOverride(refNum, year, cardId, {
      status: "awaiting_uploads",
      updatedAt: launchedAt,
      campaignInfo: mergedInfo,
      reviewHistory,
    });
    return {
      ...current,
      status: "awaiting_uploads",
      updatedAt: launchedAt,
      campaignInfo: mergedInfo,
      reviewHistory,
    };
  },
  markTestimonialConfigured: async (refNum, year, cardId) => {
    const current = composeCards(refNum, year).find((card) => card.id === cardId);
    if (!current) throw new Error(`Card not found: ${cardId}`);
    const reviewedAt = new Date().toISOString();
    const reviewHistory = [
      ...(current.reviewHistory || []),
      { at: reviewedAt, label: "Testimonial campaign configured from Video Hub videos" },
    ];
    upsertOverride(refNum, year, cardId, {
      status: "reviewed",
      reviewedAt,
      updatedAt: reviewedAt,
      reviewHistory,
    });
    return { ...current, status: "reviewed", reviewedAt, updatedAt: reviewedAt, reviewHistory };
  },
};

export const buildNudgeCampaignPrompt = (card: AdvisorCard) => card.copy;

export type AdvisorCampaignHandoff = {
  prompt: string;
  campaignName: string;
  tone: string;
  channels: Array<"LinkedIn" | "Instagram" | "Facebook" | "X">;
  dueDate: string;
  ctaDestination: string;
  videos?: CampaignInfo["videos"];
  lockVideoSelection?: boolean;
  sourceCardId?: string;
};

/** Cards that open the standard campaign creation flow (not Video Hub request). */
export const supportsCampaignCreation = (card: AdvisorCard) =>
  card.source === "cultural" ||
  card.source === "media_listening" ||
  (card.source === "testimonial" && card.status === "ready_for_campaign");

export const buildAdvisorCampaignHandoff = (card: AdvisorCard): AdvisorCampaignHandoff => ({
  prompt: card.copy,
  campaignName: card.title
    .replace(/\s+—\s+(Values-led|Story-led|Primary|Alternate)\s+(prompt|draft)$/i, "")
    .replace(/\s+—\s+videos? ready$/i, ""),
  tone: "Warm and empathetic",
  channels: ["LinkedIn", "Instagram", "Facebook", "X"],
  dueDate: card.date,
  ctaDestination: card.suggestedCta,
  videos: card.campaignInfo?.videos,
  lockVideoSelection: Boolean(card.campaignInfo?.lockVideoSelection),
  sourceCardId: card.id,
});

// --- Filter option helpers -------------------------------------------------

const uniqueSorted = (values: (string | undefined)[]) =>
  Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort();

export const getFilterOptions = (cards: AdvisorCard[]) => ({
  categories: uniqueSorted(cards.map((card) => card.category)),
  contentTypes: uniqueSorted(cards.map((card) => card.contentType)),
  departments: uniqueSorted(cards.map((card) => card.department)),
  regions: uniqueSorted(cards.map((card) => card.region)),
  corporateValues: uniqueSorted(cards.map((card) => card.corporateValue)),
});

export const contentTypeLabel: Record<AdvisorCard["contentType"], string> = {
  "Calendar Draft": "Calendar Draft",
  "Brand Mention": "Brand Mention",
  Award: "Award",
  "Hiring Campaign": "Hiring Campaign",
  "Employee Story": "Employee Story",
  "Employee Milestone": "Employee Milestone",
  "Testimonial Opportunity": "Testimonial",
};
