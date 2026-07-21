import marcusThumb from "../../../assets/campaign-studio/video-hub/vh-marcus-chen.jpg";
import aishaThumb from "../../../assets/campaign-studio/video-hub/vh-aisha-rahman.jpg";
import priyaThumb from "../../../assets/campaign-studio/video-hub/vh-priya-patel.jpg";
import elenaThumb from "../../../assets/campaign-studio/video-hub/vh-elena-vasquez.jpg";
import jordanThumb from "../../../assets/campaign-studio/video-hub/vh-jordan-blake.jpg";
import samThumb from "../../../assets/campaign-studio/video-hub/vh-sam-okonkwo.jpg";
import taylorThumb from "../../../assets/campaign-studio/video-hub/vh-taylor-brooks.jpg";
import harperThumb from "../../../assets/campaign-studio/video-hub/vh-harper-diaz.jpg";
import { VideoHubVideo } from "./contentBoardTypes";

const thumbs = [
  marcusThumb,
  aishaThumb,
  priyaThumb,
  elenaThumb,
  jordanThumb,
  samThumb,
  taylorThumb,
  harperThumb,
];

/** Demo Video Hub library — used for ready-state nudges and manual picker. */
export const videoHubCatalog: VideoHubVideo[] = [
  {
    id: "vh-marcus-5yr",
    title: "5-year anniversary story",
    employeeName: "Marcus Chen",
    department: "Nursing",
    durationLabel: "0:48",
    thumbnailUrl: marcusThumb,
    uploadedAt: "2026-07-18T14:20:00.000Z",
    sourceRecipient: "Marcus Chen <marcus.chen@dukehealth.org>",
  },
  {
    id: "vh-aisha-bedside",
    title: "A day on the unit",
    employeeName: "Aisha Rahman",
    department: "Nursing",
    durationLabel: "1:05",
    thumbnailUrl: aishaThumb,
    uploadedAt: "2026-07-17T09:10:00.000Z",
    sourceRecipient: "Aisha Rahman <aisha.rahman@dukehealth.org>",
  },
  {
    id: "vh-priya-pathway",
    title: "Intern to full-time RN",
    employeeName: "Priya Patel",
    department: "Clinical Support",
    durationLabel: "0:56",
    thumbnailUrl: priyaThumb,
    uploadedAt: "2026-07-16T16:40:00.000Z",
    sourceRecipient: "Priya Patel <priya.patel@dukehealth.org>",
  },
  {
    id: "vh-elena-cert",
    title: "Certification milestone",
    employeeName: "Elena Vasquez",
    department: "Radiology",
    durationLabel: "0:39",
    thumbnailUrl: elenaThumb,
    uploadedAt: "2026-07-15T11:05:00.000Z",
    sourceRecipient: "Elena Vasquez <elena.vasquez@dukehealth.org>",
  },
  {
    id: "vh-jordan-team",
    title: "Why I chose One Health",
    employeeName: "Jordan Blake",
    department: "Nursing",
    durationLabel: "0:44",
    thumbnailUrl: jordanThumb,
    uploadedAt: "2026-07-14T13:25:00.000Z",
    sourceRecipient: "Jordan Blake <jordan.blake@dukehealth.org>",
  },
  {
    id: "vh-sam-clinical",
    title: "Clinical Support at One Health",
    employeeName: "Sam Okonkwo",
    department: "Clinical Support",
    durationLabel: "1:12",
    thumbnailUrl: samThumb,
    uploadedAt: "2026-07-12T08:50:00.000Z",
    sourceRecipient: "Sam Okonkwo <sam.okonkwo@dukehealth.org>",
  },
  {
    id: "vh-taylor-pharmacy",
    title: "Pharmacy team culture",
    employeeName: "Taylor Brooks",
    department: "Pharmacy",
    durationLabel: "0:51",
    thumbnailUrl: taylorThumb,
    uploadedAt: "2026-07-10T15:15:00.000Z",
    sourceRecipient: "Taylor Brooks <taylor.brooks@dukehealth.org>",
  },
  {
    id: "vh-harper-talent",
    title: "Growing your career here",
    employeeName: "Harper Diaz",
    department: "HR & Talent",
    durationLabel: "0:47",
    thumbnailUrl: harperThumb,
    uploadedAt: "2026-07-08T10:30:00.000Z",
    sourceRecipient: "Harper Diaz <harper.diaz@dukehealth.org>",
  },
];

/** Delay before demo “uploads received” transition after a Video Hub request. */
export const VIDEO_HUB_UPLOAD_DELAY_MS = 5000;

const nameFromRecipient = (recipient: string) => {
  const angle = recipient.match(/^([^<]+)</);
  if (angle) return angle[1].trim();
  const emailLocal = recipient.match(/^([^@]+)@/);
  if (emailLocal) return emailLocal[1].replace(/[._]/g, " ");
  return recipient;
};

/** Build uploaded videos for recipients (matched from catalog when possible). */
export const buildUploadedVideosForRecipients = (
  recipients: string[],
  uploadedAt = new Date().toISOString(),
): VideoHubVideo[] => {
  if (!recipients.length) return [];

  return recipients.map((recipient, index) => {
    const normalized = recipient.toLowerCase();
    const catalogMatch = videoHubCatalog.find(
      (video) =>
        video.sourceRecipient?.toLowerCase() === normalized ||
        normalized.includes(video.employeeName.toLowerCase()) ||
        normalized.includes(video.employeeName.split(" ")[0].toLowerCase()),
    );

    if (catalogMatch) {
      return { ...catalogMatch, id: `${catalogMatch.id}-upload-${index}`, uploadedAt, sourceRecipient: recipient };
    }

    const thumb = thumbs[index % thumbs.length];
    const name = nameFromRecipient(recipient);
    return {
      id: `vh-upload-${index}-${Date.now()}`,
      title: `${name}'s testimonial`,
      employeeName: name,
      durationLabel: "0:45",
      thumbnailUrl: thumb,
      uploadedAt,
      sourceRecipient: recipient,
    };
  });
};

export const videoHubDepartments = Array.from(
  new Set(videoHubCatalog.map((video) => video.department).filter(Boolean) as string[]),
).sort();
