import { images } from './images'

// Single source of truth for project content.
// Copy is taken from the previous portfolio and resume; nothing here is invented.
// Optional fields (problem, goals, process, features, gallery, reflection) are skipped by the
// case-study template when absent, so a project can be documented as lightly as it needs to be.
//
// cover.kind: 'image'  -> a real screenshot from images.js
//             'illustration' -> an original, clearly-labelled CSS composition (no real screenshots exist)

export const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'product', label: 'Product design' },
  { id: 'landing', label: 'Landing pages' },
]

export const projects = [
  {
    slug: 'fido',
    number: '01',
    title: 'Fido',
    subtitle: 'Adoption platform for animal shelters in the Philippines',
    summary:
      'An animal adoption platform designed to help connect potential adopters with animal shelters in the Philippines.',
    category: 'Product Design / Responsive Web',
    industry: 'Animal welfare',
    platform: 'Responsive web',
    year: '2023',
    duration: '2 months',
    role: ['UI/UX Designer', 'User Researcher', 'Prototyping'],
    team: ['Developer', 'UI/UX Designer'],
    keyContribution: 'Accessible, filterable pet discovery and shelter profiles',
    filters: ['web', 'product'],
    featured: true,
    cover: {
      kind: 'image',
      caption: 'Landing page, hero',
      image: images.fido.landing.cover,
      alt: 'Fido landing page hero: “Adopt, Don’t Shop” headline with Find a Pet and List Your Shelter buttons above a collage of rescued pets.',
    },
    overview:
      'Fido is a responsive web platform designed to connect users with adoptable pets from verified animal shelters across the Philippines. It promotes ethical adoption by making the process accessible, inclusive, and trustworthy. The platform features filterable pet listings, informative shelter profiles, and user-friendly navigation, all designed to streamline the adoption journey.',
    problem:
      'Many animal shelters in the Philippines rely on social media to find adopters, making the process inconsistent, hard to search, and inaccessible to users without tech-savvy skills. There was a need for a centralized, user-friendly platform to streamline pet discovery, improve trust, and support shelter operations.',
    solution:
      'A mobile-responsive adoption platform with filterable pet listings, detailed shelter profiles, and accessible UI components. The design focused on inclusive language, easy navigation, and WCAG-compliant interfaces to accommodate users from various backgrounds and abilities.',
    goals: [
      'Make pet discovery searchable instead of scattered across social feeds.',
      'Build trust through transparent shelter profiles.',
      'Meet WCAG guidance for contrast, sizing, and hierarchy on every device.',
    ],
    process: {
      method: 'Design Thinking',
      steps: [
        { title: 'Empathize', description: 'Conducted interviews with potential adopters and shelter staff to understand their needs, frustrations with current platforms, and goals for a better adoption experience.' },
        { title: 'Define', description: 'Synthesized research findings into key user personas and identified core problems: difficulty finding pets, lack of trust in shelters, and confusing adoption steps.' },
        { title: 'Ideate', description: 'Brainstormed features including filterable listings, shelter ratings, and guided adoption steps, focusing on discoverability and trust.' },
        { title: 'Prototype', description: 'Created wireframes and interactive prototypes in Figma, designed with accessibility in mind and focused on clear CTAs, hierarchy, and mobile responsiveness.' },
        { title: 'Test', description: 'Gathered feedback from mock adoption scenarios and iterated on layout, button placement, and flow clarity.' },
      ],
    },
    features: [
      { title: 'Explore adoptable pets', description: 'Browse available pets across shelters with filters for species, age, size, and location. Each listing includes pet details, photos, and adoption readiness status.' },
      { title: 'Shelter profiles & ratings', description: 'Each shelter has a profile with contact info, social links, location map, reviews, and currently available animals, building trust and transparency.' },
      { title: 'Accessible & inclusive design', description: 'From color contrast to button sizing, the design follows WCAG guidance. Visual hierarchy and clear CTAs guide users regardless of device or ability.' },
    ],
    gallery: [
      {
        kind: 'page',
        image: images.fido.landing.full,
        alt: 'Full Fido landing page: hero, “What makes our adoption process ethical” values, featured pets, a four-step adoption process, and a closing call to action.',
        caption: 'Landing page, full length',
      },
    ],
    reflection:
      'On a two-person team with a developer, I covered UI/UX design, user research, and prototyping: from interviews with adopters and shelter staff to accessible Figma prototypes refined through feedback rounds.',
  },
  {
    slug: 'fixo',
    number: '02',
    title: 'Fixo',
    subtitle: 'A mobile solution for hiring trusted tradies in New Zealand',
    summary:
      'A service marketplace connecting homeowners with trusted tradespeople in New Zealand.',
    category: 'Mobile Product Design',
    industry: 'Service marketplace',
    platform: 'iOS & Android',
    year: '2025',
    duration: '4 months',
    role: ['Lead UI/UX Designer', 'User Research', 'Prototyping', 'Design System'],
    team: ['Project Manager', 'Developers', 'UI/UX Designers', 'QA Testers'],
    keyContribution: 'Full UI system and component library, built from scratch',
    filters: ['mobile', 'product'],
    featured: true,
    cover: {
      kind: 'image',
      caption: 'Key screens: address, splash, payment',
      image: images.fixo.screens,
      alt: 'Three Fixo phone screens: an address picker over a map of Mount Victoria, the Fixo splash screen, and a bank-transfer payment summary.',
    },
    overview:
      'A mobile-first platform connecting New Zealand homeowners with local tradies. I designed the full UI system from scratch, including wireframes, high-fidelity prototypes, and a scalable component library in Figma, focused on user-friendly flows for job posting, tradie discovery, and real-time scheduling. I collaborated closely with the development team in an Agile environment to support implementation across iOS and Android.',
    problem:
      'Homeowners in New Zealand often struggle to find trusted local tradespeople because of fragmented listings, a lack of user reviews, and outdated interfaces. The goal was a seamless platform that connects users with verified tradies efficiently and with confidence.',
    solution:
      'Fixo is a streamlined mobile app where users post job requests, browse verified tradies, and schedule services. The solution focused on a clean UI, intuitive flows, and real-time booking tailored to Kiwi homeowners.',
    goals: [
      'Reduce friction when describing a job.',
      'Surface credentials and past work so homeowners can trust who they hire.',
      'Keep booking and payment inside one clear flow.',
    ],
    process: {
      method: 'Agile UX',
      steps: [
        { title: 'Planning & research', description: 'User and cultural research to define personas, map user needs, and plan sprint-aligned design goals.' },
        { title: 'Design & prototyping', description: 'Wireframes, prototypes, and UI components in Figma, shaped by sprint priorities and evolving requirements.' },
        { title: 'Collaboration & handoff', description: 'Worked closely with developers during sprints to align on implementation and keep feedback flowing in real time.' },
        { title: 'Testing & iteration', description: 'Tested designs with QA after each sprint and refined UI elements to improve usability and clarity.' },
      ],
    },
    features: [
      { title: 'Post a job', description: 'Browse job categories and submit detailed requests. Form steps guide the user to reduce friction.', image: images.fixo.postJob, alt: 'Fixo “Browse Job Services” screen with a search field and a grid of trade categories: Electrical, Painting, Plumbing, Carpentry, and more.' },
      { title: 'Find a reliable tradie', description: 'Search by location, reviews, and specialization. Tradie profiles surface credentials and previous work to build trust.', image: images.fixo.tradieProfile, alt: 'Fixo tradie profile for a junior electrician showing hourly, daily and fixed rates, licences, certifications and a Book Tradie button.' },
      { title: 'Schedule work', description: 'Calendar and booking features let users set appointments directly with their chosen tradie, with responsive feedback throughout.', image: images.fixo.schedule, alt: 'Fixo electrical job form with Standard, Emergency, Urgent and Recurring job types, preferred date, duration estimate and job title fields.' },
    ],
    reflection:
      'As Lead UI/UX Designer I owned the UI system end to end: research, flows, high-fidelity prototypes, and the Figma component library the development team built from for iOS and Android.',
  },
  {
    slug: 'memoire',
    number: '03',
    title: 'Memoire',
    subtitle: 'Memory photo & video sharing platform',
    summary:
      'A memory-sharing platform that helps users organize and revisit photos and videos through location-based experiences.',
    category: 'Product Design / Social Platform',
    industry: 'Social platform',
    platform: 'Web app',
    year: '2025',
    duration: 'Ongoing',
    role: ['UX Research', 'Sketching', 'Prototyping', 'Design System'],
    team: ['Developer', 'UI/UX Designer'],
    keyContribution: 'Map-based albums and collaborative memory curation',
    filters: ['web', 'product'],
    featured: true,
    cover: { kind: 'illustration', name: 'memoire', caption: 'Illustrative concept' },
    illustrative: true,
    brandMark: { image: images.memoire.mark, alt: 'Memoire handwritten “m.” logo mark.' },
    overview:
      'A digital scrapbook that lets users save, organize, and share photo and video memories tied to specific locations. It features map-based albums, collaborative options, and print-ready layouts for memory preservation.',
    problem:
      'People struggle to preserve and relive travel and life memories in a way that feels organized and emotionally engaging. Existing photo-sharing platforms lacked spatial storytelling, collaborative albums, or a focus on meaningful curation.',
    solution:
      'Memoire organizes memories visually through maps, timelines, and customizable albums. Users upload, tag, and categorize content by date and place, and create albums together with family and friends.',
    process: {
      method: 'Agile UX',
      steps: [
        { title: 'Planning & research', description: 'Interviews and surveys on how people store and revisit personal media, and how they share memories with loved ones.' },
        { title: 'Design & prototyping', description: 'Low-fidelity wireframes moved quickly into Figma prototypes, prioritising map-based flows and streamlined album creation.' },
        { title: 'Collaboration & handoff', description: 'Worked hand-in-hand with the developer for component consistency, with regular sprint check-ins to adapt to technical feedback.' },
        { title: 'Testing & iteration', description: 'Remote usability tests with early adopters informed changes to layouts, icon clarity, and navigation.' },
      ],
    },
    features: [
      { title: 'Map integration', description: 'Geotag photos and videos to view and organize memories by location, turning a library into a visual journey.', illustration: 'memoire-map' },
      { title: 'Lightweight social layer', description: 'Likes, comments, and collaborative albums let friends and family contribute while keeping the experience personal.', illustration: 'memoire-social' },
      { title: 'Digital photo album', description: 'Group content into themed albums, sort by timeline or tags, and generate layouts for viewing or printing.', illustration: 'memoire-album' },
    ],
    reflection:
      'Working alongside a developer, I lead UX research, sketching, prototyping, and the design system. The project is ongoing, so the visuals here are illustrative rather than final screens.',
  },
  {
    slug: 'financial-platforms',
    number: '04',
    title: 'Financial Platforms',
    subtitle: 'Interfaces and a design system for rural banking',
    summary:
      'Designing web and mobile interfaces for financial platforms supporting rural banks, with a focus on consistency, usability, and scalable design systems.',
    category: 'Fintech / Professional Experience',
    industry: 'Fintech',
    platform: 'Web, mobile & cash teller machines',
    year: '2025 – Present',
    duration: 'Ongoing',
    role: ['UI/UX Designer', 'Design System'],
    team: ['Developers', 'Business Analysts', 'Stakeholders'],
    keyContribution: 'Initiated a cross-platform design system',
    filters: ['web', 'mobile', 'product'],
    featured: true,
    cover: { kind: 'illustration', name: 'finance', caption: 'Abstracted illustration, no client data' },
    illustrative: true,
    confidential: true,
    overview:
      'At Traxion Tech, Inc., I design user interfaces and high-fidelity prototypes for financial platforms used by rural banks. I initiated and helped establish a scalable cross-platform design system used across web applications, mobile applications, and cash teller machine interfaces.',
    problem:
      'Products that span web, mobile, and teller-machine hardware drift apart quickly when every team designs its own patterns. A shared foundation was needed so interfaces stay consistent and implementation stays predictable.',
    goals: [
      'One set of foundations (type, color, spacing, components) across three very different surfaces.',
      'Interfaces that stay clear for everyday banking tasks.',
      'Designs that translate cleanly into implementation.',
    ],
    process: {
      method: 'How the work runs',
      steps: [
        { title: 'Foundations', description: 'Typography, color, and spacing foundations shared across platforms.' },
        { title: 'Components', description: 'Reusable components with documented states and interaction patterns.' },
        { title: 'Interfaces', description: 'User interfaces and high-fidelity prototypes for financial platforms.' },
        { title: 'Collaboration', description: 'Working with developers, business analysts, and stakeholders to improve usability and implementation.' },
      ],
    },
    reflection:
      'I initiated and help maintain the design system, design interfaces and high-fidelity prototypes, and collaborate with developers, business analysts, and stakeholders. Because this is client work, real screens stay private.',
  },
  {
    slug: 'the-pasta-place',
    number: '05',
    title: 'The Pasta Place',
    subtitle: 'Restaurant landing page',
    summary:
      'A single-page website for an artisan pasta restaurant, showcasing signature dishes and driving online reservations.',
    category: 'Visual Design / Landing Page',
    industry: 'Food & hospitality',
    platform: 'Responsive web',
    year: '2024',
    duration: '1 week',
    role: ['UI Designer', 'UX Researcher'],
    team: ['UI/UX Designer'],
    keyContribution: 'Menu discovery and one-step reservations',
    filters: ['web', 'landing'],
    cover: {
      kind: 'image',
      caption: 'Landing page, hero',
      image: images.pasta.landing.cover,
      alt: 'The Pasta Place landing page hero: white headline over a dark photo of a pasta dish, with View Menu and Reserve a Table buttons.',
    },
    overview:
      'A single-page website for an artisan pasta restaurant, crafted to showcase signature dishes, highlight daily specials, and drive online reservations through a clean, appetizing visual style.',
    problem:
      'The restaurant relied on social media posts for marketing, which lacked a cohesive brand presence and offered no direct way to reserve tables or view the full menu. Customers frequently messaged staff for basic information.',
    solution:
      'A responsive landing page with an inviting hero, an interactive menu gallery, and a one-click reservation form, using rich food photography, warm tones, and clear calls to action.',
    process: {
      method: 'Design Thinking',
      steps: [
        { title: 'Empathize', description: 'Interviewed owners and frequent customers about menu visibility and booking friction.' },
        { title: 'Define', description: 'Framed the core problem: how might we help diners discover dishes and book a table in under two minutes?' },
        { title: 'Ideate', description: 'Sketched layout concepts prioritising food photography, a warm palette, and mobile-first navigation.' },
        { title: 'Prototype & test', description: 'Built a high-fidelity Figma prototype and ran hallway tests, iterating on CTA placement and menu card readability.' },
      ],
    },
    features: [
      { title: 'Hero with quick actions', description: '“View Menu” and “Reserve a Table” let visitors act immediately.' },
      { title: 'Top picks carousel', description: 'Best-selling dishes with images and short descriptions.' },
      { title: 'Branch locations', description: 'Branches with maps, contact info, and store hours.' },
    ],
    gallery: [
      { kind: 'page', image: images.pasta.landing.full, alt: 'Full Pasta Place landing page: hero, top picks, menu, reservation form, and branch locations.', caption: 'Landing page, full length' },
    ],
  },
  {
    slug: 'gcrait',
    number: '06',
    title: 'GCRAIT',
    subtitle: 'Global Conference on Robotics and AI Technologies',
    summary:
      'The official landing page for a school-wide conference on robotics and artificial intelligence.',
    category: 'Information Architecture / Landing Page',
    industry: 'Education & events',
    platform: 'Responsive web',
    year: '2024',
    duration: '2 months',
    role: ['UI/UX Designer', 'Information Architect', 'UX Researcher'],
    team: ['Organizers', 'Developer', 'UI/UX Designer'],
    keyContribution: 'Centralised event information and registration flows',
    filters: ['web', 'landing'],
    cover: {
      kind: 'image',
      caption: 'Landing page, hero',
      image: images.gcrait.landing.cover,
      alt: 'GCRAIT landing page hero on deep navy: partner logos, “Global Conference on Robotics and Artificial Intelligence Technologies”, a Register Now button and a countdown.',
    },
    overview:
      'GCRAIT is the official landing page for a school-wide conference on robotics and artificial intelligence. It centralises the event’s activities, showcases featured talks and competitions, and guides participants through registration and submission requirements for students and industry professionals alike.',
    problem:
      'Information about activities, submission guidelines, and registration was scattered across social media posts and documents, confusing both participants and organizers.',
    solution:
      'A landing page that clearly lays out schedules, speaker profiles, competition mechanics, and submission guidelines, with a clean hierarchy and intuitive navigation for quick access to key information.',
    process: {
      method: 'Design Thinking',
      steps: [
        { title: 'Empathize', description: 'Interviewed organizers, faculty, and participants about their needs and confusion points.' },
        { title: 'Define', description: 'Mapped journeys for registrants, competitors, and visitors to identify key pages and flows.' },
        { title: 'Ideate', description: 'Low-fidelity wireframes explored ways to present the event’s content.' },
        { title: 'Prototype & test', description: 'A clickable prototype went through rapid feedback sessions with stakeholders.' },
      ],
    },
    features: [
      { title: 'Robotalks', description: 'A talk series on robotics and AI trends with speakers from local institutions and international partners.' },
      { title: 'Sumobot', description: 'Student-built robots compete to push each other out of a ring.' },
      { title: 'Mobot Race', description: 'A line-tracing race for autonomous mobile bots.' },
    ],
    gallery: [
      { kind: 'page', image: images.gcrait.landing.full, alt: 'Full GCRAIT landing page: hero and countdown, event date, about the conference, call for submissions, FAQs, and venue map.', caption: 'Landing page, full length' },
    ],
  },
  {
    slug: 'animation-festival',
    number: '07',
    title: 'Animation Festival',
    subtitle: 'A creative collaboration with Korean academic partners',
    summary:
      'The central hub for an animation festival between the school and Korean academic partners.',
    category: 'Visual Design / Landing Page',
    industry: 'Education & events',
    platform: 'Responsive web',
    year: '2025',
    duration: '1 month',
    role: ['UI/UX Designer', 'Information Architect', 'Visual Designer'],
    team: ['Organizers', 'UI/UX Designer', 'Developer'],
    keyContribution: 'A unified hub for submissions, schedules, and showcases',
    filters: ['web', 'landing'],
    cover: {
      kind: 'image',
      caption: 'Landing page, hero',
      image: images.animationFest.landing.cover,
      alt: 'Animation Festival landing page hero: partner college logos above a bold “1st Animation Festival” wordmark with Korean subtitle and a Register Now button.',
    },
    overview:
      'The Animation Festival website is the central hub for a creative collaboration between the school and Korean academic partners. It showcases student work, supports participation in workshops and competitions, and provides schedules, speaker features, and submission guidelines.',
    problem:
      'Promotional materials and registration details were spread across posters and chat groups, confusing students and international guests. There was no unified place to showcase student talent.',
    solution:
      'A responsive landing page aligned with the event’s creative theme, with sections for categories, guidelines, submission forms, and organizer updates.',
    process: {
      method: 'Design Thinking',
      steps: [
        { title: 'Empathize', description: 'Gathered insights from organizers, participants, and international partners.' },
        { title: 'Define', description: 'Identified submission, information, and browsing flows and the sections each needed.' },
        { title: 'Ideate', description: 'Wireframes and flows balancing visual storytelling with a functional structure.' },
        { title: 'Prototype & test', description: 'Early prototypes were revised on student and faculty feedback.' },
      ],
    },
    features: [
      { title: '2D animation', description: 'Student entries from frame-by-frame to vector-based storytelling.' },
      { title: '3D animation', description: 'Modeling, rigging, and animated scenes from local and Korean teams.' },
      { title: 'Digital storyboarding', description: 'Narrative flow, timing, and camera movement behind each concept.' },
      { title: 'Digital illustration', description: 'Concept art and character design from participants.' },
    ],
    gallery: [
      { kind: 'page', image: images.animationFest.landing.full, alt: 'Full Animation Festival landing page: hero, categories, judges, partners, keynotes, and registration.', caption: 'Landing page, full length' },
    ],
  },
  {
    slug: 'access-ph',
    number: '08',
    title: 'ACCESS PH',
    subtitle: 'Interface redesign for a software services company',
    summary:
      'A freelance redesign of a software agency’s website for clearer navigation, layout, and visual consistency.',
    category: 'Redesign / Freelance',
    industry: 'Software services',
    platform: 'Responsive web',
    year: '2024',
    duration: '1 month',
    role: ['UI Designer'],
    team: ['Developer', 'UI/UX Designer'],
    keyContribution: 'Restructured navigation and visual hierarchy',
    filters: ['web', 'landing'],
    cover: {
      kind: 'image',
      caption: 'Redesigned homepage, hero',
      image: images.access.landing.cover,
      alt: 'ACCESS PH redesigned hero on a deep blue gradient: “Easily ACCESS your SOLUTION. Plan. Build. Deliver.” with an Explore More button above a partner logo strip.',
    },
    overview:
      'A redesign of a local software development agency’s corporate website to improve navigation, layout clarity, and visual consistency, delivered as high-fidelity mockups aligned with client expectations.',
    problem:
      'The original layout was outdated and cluttered, making it hard for potential clients to understand services and move between sections. There was no clear hierarchy or call to action.',
    solution:
      'Working closely with the developer, I restructured the site with clean sections, stronger hierarchy, more intuitive navigation, and clear CTAs.',
    process: {
      method: 'Design Thinking',
      steps: [
        { title: 'Empathize', description: 'Analysed the client’s goals and the current site’s pain points through feedback and walkthroughs.' },
        { title: 'Define', description: 'Outlined key usability issues in a problem statement centred on clarity and navigation.' },
        { title: 'Ideate', description: 'Sketched layout alternatives and evaluated visual approaches.' },
        { title: 'Prototype & test', description: 'High-fidelity Figma mockups went through two rounds of client revisions before approval.' },
      ],
    },
    gallery: [
      { kind: 'page', image: images.access.landing.full, alt: 'Full ACCESS PH redesigned website: hero, partner strip, services, pricing, and contact sections.', caption: 'Redesigned homepage, full length' },
    ],
  },
]

// Catalogue item code, e.g. "AR-001"
projects.forEach((p) => {
  p.item = `AR-${p.number.padStart(3, '0')}`
})

export const featuredProjects = projects.filter((p) => p.featured)
export const archiveProjects = projects.filter((p) => !p.featured)

export const getProject = (slug) => projects.find((p) => p.slug === slug)

export const getAdjacent = (slug) => {
  const i = projects.findIndex((p) => p.slug === slug)
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  }
}
