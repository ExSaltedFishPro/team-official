export interface LinkItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface HeroCTA {
  label: string;
  href: string;
}

export interface SectionIntro {
  eyebrow?: string;
  title: string;
  description?: string;
  values?: string[];
}

export interface SiteData {
  seo: {
    title: string;
    description: string;
    siteUrl: string;
    ogImage: string;
    favicon: string;
    lang?: string;
  };
  brand: {
    name: string;
    shortName?: string;
    slogan: string;
    subtitle?: string;
    logo: string;
    cta?: HeroCTA;
  };
  navigation: Array<{
    label: string;
    href: string;
  }>;
  sections: {
    about: SectionIntro;
    members: SectionIntro;
    honors: SectionIntro;
    timeline: SectionIntro;
    recruitment: SectionIntro;
  };
  footer: {
    note?: string;
    copyright: string;
    links: LinkItem[];
  };
}

export type MemberStatus = "featured" | "current" | "alumni";

export interface MemberLinks {
  blog?: string;
  github?: string;
  homepage?: string;
  email?: string;
}

export interface Member {
  nickname: string;
  name?: string;
  avatar?: string;
  period?: string;
  title?: string;
  directions?: string[];
  bio?: string;
  quote?: string;
  links?: MemberLinks;
  status?: MemberStatus;
  featured?: boolean;
}

export interface MembersData {
  items: Member[];
}

export interface Honor {
  name: string;
  awardType?: string;
  level?: string;
  location?: string;
  time: string;
  description?: string;
  link?: string;
  featured?: boolean;
}

export interface HonorsData {
  items: Honor[];
}

export type TimelineType =
  | "founding"
  | "milestone"
  | "competition"
  | "media"
  | "community";

export interface TimelineEvent {
  time: string;
  title: string;
  description?: string;
  type?: TimelineType;
  link?: string;
}

export interface TimelineData {
  items: TimelineEvent[];
}

export interface RequirementItem {
  title: string;
  description?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ContactInfo {
  label: string;
  value: string;
  href?: string;
  note?: string;
}

export interface RecruitmentData {
  intro: string;
  tracks?: string[];
  targets?: string[];
  requirements?: RequirementItem[];
  faq?: FAQItem[];
  contact?: ContactInfo;
}
