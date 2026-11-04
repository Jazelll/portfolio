// Catalogue helpers shared by the canvas Work frame and the case studies.

export const CATALOGUE_FILTERS = [
  { id: 'all', label: 'All projects', test: () => true },
  { id: 'product', label: 'Product design', test: (p) => p.filters.includes('product') },
  { id: 'mobile', label: 'Mobile apps', test: (p) => p.filters.includes('mobile') },
  { id: 'web', label: 'Web experiences', test: (p) => p.filters.includes('web') },
  { id: 'landing', label: 'Landing pages', test: (p) => p.filters.includes('landing') },
  { id: 'system', label: 'Design systems', test: (p) => p.role.includes('Design System') },
]

export const catalogueNumber = (p) => p.number.padStart(3, '0')
