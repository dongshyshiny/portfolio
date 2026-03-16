export interface Translations {
  nav: {
    about: string;
    skills: string;
    experience: string;
    projects: string;
    contact: string;
    letsTalk: string;
  };
  hero: {
    greeting: string;
    name: string;
    rolePrefix: string;
    typewriterWords: string[];
    description: string;
    descHighlight: string;
    exploreWork: string;
    getInTouch: string;
    availableForHire: string;
    scroll: string;
  };
  about: {
    title: string;
    bio: string[];
    tags: string[];
    stats: { label: string }[];
  };
  skills: {
    title: string;
    categories: Record<string, string>;
  };
  experience: {
    title: string;
    currentBadge: string;
    items: {
      role: string;
      description: string;
    }[];
  };
  projects: {
    title: string;
    filterAll: string;
    viewDetails: string;
    visitWebsite: string;
    keyFeatures: string;
    highlightsLabel: string;
    technologies: string;
    downloadApp: string;
    items: {
      title: string;
      description: string;
      role: string;
      features: string[];
      highlights?: string[];
    }[];
  };
  contact: {
    title: string;
    lead: string;
    sayHello: string;
    formName: string;
    formEmail: string;
    formMessage: string;
    formSend: string;
  };
  footer: {
    designedBy: string;
  };
}

export type Locale = 'vi' | 'en' | 'ko';
