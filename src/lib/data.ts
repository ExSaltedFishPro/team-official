import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

import type {
  ContactInfo,
  FAQItem,
  Honor,
  HonorsData,
  Member,
  MemberLinks,
  MemberStatus,
  MembersData,
  RecruitmentData,
  RequirementItem,
  SiteData,
  TimelineData,
  TimelineEvent,
  TimelineType,
} from "../types/content";

// Resolve against the project root so build-time bundling does not break data lookup.
const DATA_DIR = path.join(process.cwd(), "src", "data");
const DATA_EXTENSIONS = ["yaml", "yml", "json"] as const;

const DEFAULT_SITE: SiteData = {
  seo: {
    title: "CTF Team",
    description: "A static, data-driven website for a CTF team.",
    siteUrl: "https://example.com",
    ogImage: "/og-card.svg",
    favicon: "/favicon.svg",
    lang: "en",
  },
  brand: {
    name: "CTF Team",
    shortName: "CTF Team",
    slogan: "Think precisely. Build quietly. Break elegantly.",
    subtitle: "",
    logo: "/images/brand/logo-mark.svg",
    cta: {
      label: "Explore",
      href: "#about",
    },
  },
  navigation: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Members", href: "#members" },
    { label: "Honors", href: "#honors" },
    { label: "Timeline", href: "#timeline" },
    { label: "Join", href: "#recruitment" },
  ],
  sections: {
    about: {
      eyebrow: "About",
      title: "We train with discipline, not noise.",
      description: "A calm, durable team built around fundamentals and shared learning.",
      values: [],
    },
    members: {
      eyebrow: "Members",
      title: "People who shaped the team",
      description: "Key contributors across different seasons and specialties.",
    },
    honors: {
      eyebrow: "Honors",
      title: "Selected results",
      description: "Representative moments, curated rather than over-listed.",
    },
    timeline: {
      eyebrow: "Timeline",
      title: "Built one season at a time",
      description: "Key points in how the team matured.",
    },
    recruitment: {
      eyebrow: "Recruitment",
      title: "Join the next chapter",
      description: "We welcome patient learners and careful problem solvers.",
    },
  },
  footer: {
    note: "Static, content-driven, and easy to maintain.",
    copyright: "(c) 2026 CTF Team. All rights reserved.",
    links: [],
  },
};

const cache = new Map<string, unknown>();

async function exists(filePath: string) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function loadStructuredFile<T>(baseName: string, fallback: T): Promise<T> {
  if (cache.has(baseName)) {
    return cache.get(baseName) as T;
  }

  for (const extension of DATA_EXTENSIONS) {
    const targetPath = path.join(DATA_DIR, `${baseName}.${extension}`);
    if (!(await exists(targetPath))) {
      continue;
    }

    const raw = await readFile(targetPath, "utf-8");
    const parsed =
      extension === "json"
        ? (JSON.parse(raw) as T)
        : (parseYaml(raw) as T);

    cache.set(baseName, parsed);
    return parsed;
  }

  cache.set(baseName, fallback);
  return fallback;
}

function asOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asRequiredString(value: unknown, fallback: string) {
  return asOptionalString(value) ?? fallback;
}

function asStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => asOptionalString(entry))
      .filter((entry): entry is string => Boolean(entry));
  }

  const single = asOptionalString(value);
  return single ? [single] : [];
}

function asRecord(value: unknown) {
  return value && typeof value === "object" ? value : {};
}

function normalizeStatus(value: unknown): MemberStatus | undefined {
  if (value === "featured" || value === "current" || value === "alumni") {
    return value;
  }

  return undefined;
}

function normalizeMemberLinks(value: unknown): MemberLinks {
  const links = asRecord(value) as Record<string, unknown>;

  return {
    blog: asOptionalString(links.blog),
    github: asOptionalString(links.github),
    homepage: asOptionalString(links.homepage),
    email: asOptionalString(links.email),
  };
}

function normalizeMember(value: unknown): Member {
  const item = asRecord(value) as Record<string, unknown>;
  const status = normalizeStatus(item.status) ?? (item.featured ? "featured" : "current");

  return {
    nickname: asRequiredString(item.nickname, "Anonymous"),
    name: asOptionalString(item.name),
    avatar: asOptionalString(item.avatar),
    period: asOptionalString(item.period) ?? asOptionalString(item.time),
    title: asOptionalString(item.title),
    directions: asStringArray(item.directions ?? item.direction),
    bio: asOptionalString(item.bio),
    quote: asOptionalString(item.quote),
    links: normalizeMemberLinks(item.links),
    status,
    featured: Boolean(item.featured) || status === "featured",
  };
}

function normalizeHonor(value: unknown): Honor {
  const item = asRecord(value) as Record<string, unknown>;

  return {
    name: asRequiredString(item.name, "Untitled Honor"),
    awardType: asOptionalString(item.awardType ?? item.rank ?? item.type),
    level: asOptionalString(item.level),
    location: asOptionalString(item.location),
    time: asRequiredString(item.time, "TBA"),
    description: asOptionalString(item.description),
    link: asOptionalString(item.link),
    featured: Boolean(item.featured),
  };
}

function normalizeTimelineType(value: unknown): TimelineType | undefined {
  if (
    value === "founding" ||
    value === "milestone" ||
    value === "competition" ||
    value === "media" ||
    value === "community"
  ) {
    return value;
  }

  return undefined;
}

function normalizeTimelineEvent(value: unknown): TimelineEvent {
  const item = asRecord(value) as Record<string, unknown>;

  return {
    time: asRequiredString(item.time, "TBA"),
    title: asRequiredString(item.title, "Untitled Event"),
    description: asOptionalString(item.description),
    type: normalizeTimelineType(item.type),
    link: asOptionalString(item.link),
  };
}

function normalizeRequirement(value: unknown): RequirementItem {
  const item = asRecord(value) as Record<string, unknown>;

  return {
    title: asRequiredString(item.title, "Requirement"),
    description: asOptionalString(item.description),
  };
}

function normalizeFaq(value: unknown): FAQItem {
  const item = asRecord(value) as Record<string, unknown>;

  return {
    question: asRequiredString(item.question, "Question"),
    answer: asRequiredString(item.answer, "Answer will be updated soon."),
  };
}

function normalizeContact(value: unknown): ContactInfo | undefined {
  const item = asRecord(value) as Record<string, unknown>;
  const label = asOptionalString(item.label);
  const valueText = asOptionalString(item.value);

  if (!label || !valueText) {
    return undefined;
  }

  return {
    label,
    value: valueText,
    href: asOptionalString(item.href),
    note: asOptionalString(item.note),
  };
}

export async function getSiteData() {
  const raw = await loadStructuredFile<Partial<SiteData>>("site", DEFAULT_SITE);

  return {
    ...DEFAULT_SITE,
    ...raw,
    seo: {
      ...DEFAULT_SITE.seo,
      ...(raw.seo ?? {}),
    },
    brand: {
      ...DEFAULT_SITE.brand,
      ...(raw.brand ?? {}),
      cta: {
        ...DEFAULT_SITE.brand.cta,
        ...(raw.brand?.cta ?? {}),
      },
    },
    navigation: Array.isArray(raw.navigation)
      ? raw.navigation
          .map((item) => {
            const entry = asRecord(item) as Record<string, unknown>;
            const label = asOptionalString(entry.label);
            const href = asOptionalString(entry.href);

            if (!label || !href) {
              return undefined;
            }

            return { label, href };
          })
          .filter(
            (item): item is { label: string; href: string } => Boolean(item),
          )
      : DEFAULT_SITE.navigation,
    sections: {
      about: {
        ...DEFAULT_SITE.sections.about,
        ...(raw.sections?.about ?? {}),
        values: asStringArray(raw.sections?.about?.values),
      },
      members: {
        ...DEFAULT_SITE.sections.members,
        ...(raw.sections?.members ?? {}),
      },
      honors: {
        ...DEFAULT_SITE.sections.honors,
        ...(raw.sections?.honors ?? {}),
      },
      timeline: {
        ...DEFAULT_SITE.sections.timeline,
        ...(raw.sections?.timeline ?? {}),
      },
      recruitment: {
        ...DEFAULT_SITE.sections.recruitment,
        ...(raw.sections?.recruitment ?? {}),
      },
    },
    footer: {
      ...DEFAULT_SITE.footer,
      ...(raw.footer ?? {}),
      links: Array.isArray(raw.footer?.links)
        ? raw.footer.links
            .map((item) => {
              const entry = asRecord(item) as Record<string, unknown>;
              const label = asOptionalString(entry.label);
              const href = asOptionalString(entry.href);

              if (!label || !href) {
                return undefined;
              }

              return {
                label,
                href,
                external: Boolean(entry.external),
              };
            })
            .filter(
              (item): item is { label: string; href: string; external?: boolean } =>
                Boolean(item),
            )
        : DEFAULT_SITE.footer.links,
    },
  } satisfies SiteData;
}

export async function getMembersData(): Promise<MembersData> {
  const raw = await loadStructuredFile<{ items?: unknown[] } | unknown[]>("members", {
    items: [],
  });

  const items = Array.isArray(raw) ? raw : Array.isArray(raw.items) ? raw.items : [];

  return {
    items: items.map(normalizeMember),
  };
}

export async function getHonorsData(): Promise<HonorsData> {
  const raw = await loadStructuredFile<{ items?: unknown[] } | unknown[]>("honors", {
    items: [],
  });

  const items = Array.isArray(raw) ? raw : Array.isArray(raw.items) ? raw.items : [];

  return {
    items: items.map(normalizeHonor),
  };
}

export async function getTimelineData(): Promise<TimelineData> {
  const raw = await loadStructuredFile<{ items?: unknown[] } | unknown[]>("timeline", {
    items: [],
  });

  const items = Array.isArray(raw) ? raw : Array.isArray(raw.items) ? raw.items : [];

  return {
    items: items.map(normalizeTimelineEvent),
  };
}

export async function getRecruitmentData(): Promise<RecruitmentData> {
  const raw = await loadStructuredFile<Partial<RecruitmentData>>("recruitment", {
    intro: "",
  });

  return {
    intro:
      asOptionalString(raw.intro) ??
      "Recruitment details will be updated soon.",
    tracks: asStringArray(raw.tracks),
    targets: asStringArray(raw.targets),
    requirements: Array.isArray(raw.requirements)
      ? raw.requirements.map(normalizeRequirement)
      : [],
    faq: Array.isArray(raw.faq) ? raw.faq.map(normalizeFaq) : [],
    contact: normalizeContact(raw.contact),
  };
}
