// Small outline icon set (24px grid, 1.6 stroke) drawn for this site.
const Icon = ({ children, size = 16, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    {children}
  </svg>
)

export const HomeIcon = (p) => <Icon {...p}><path d="M13 3 4 14h7l-1 7 9-11h-7l1-7Z" /></Icon>
export const AboutIcon = (p) => (
  <Icon {...p}>
    <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12Z" />
    <path d="M8 9h8M8 13h5" />
  </Icon>
)
export const WorkIcon = (p) => (
  <Icon {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
  </Icon>
)
export const MailIcon = (p) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Icon>
)
export const LinkedInIcon = (p) => (
  <Icon {...p}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 0 0-4 0" />
  </Icon>
)
export const GitHubIcon = (p) => (
  <Icon {...p}>
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  </Icon>
)
export const SidebarIcon = (p) => (
  <Icon {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M15 4v16" />
  </Icon>
)
export const ArrowRight = (p) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
export const ArrowLeft = (p) => <Icon {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></Icon>
export const ArrowUpRight = (p) => <Icon {...p}><path d="M7 17 17 7M8 7h9v9" /></Icon>
