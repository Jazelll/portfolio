// Central registry for every raster image on the site.
// To swap a screenshot: drop a new .webp into public/images/... and update the entry here.
// width/height are the intrinsic size of the large variant (used to reserve space and avoid layout shift).

const P = '/images/projects'

const page = (dir, name, h) => ({
  full: { src: `${P}/${dir}/${name}.webp`, srcSm: `${P}/${dir}/${name}-sm.webp`, width: 1440, height: h, smWidth: 720 },
  cover: { src: `${P}/${dir}/${name}-cover.webp`, srcSm: `${P}/${dir}/${name}-cover-sm.webp`, width: 1600, height: 1000, smWidth: 800 },
})

const wide = (dir, name) => ({
  src: `${P}/${dir}/${name}.webp`,
  srcSm: `${P}/${dir}/${name}-sm.webp`,
  width: 1800,
  height: 1013,
  smWidth: 900,
})

const logo = (dir, name) => ({ src: `${P}/${dir}/${name}.webp`, width: 1200, height: 675 })

export const images = {
  fido: {
    landing: page('fido', 'fido-landing', 4623),
    logo: logo('fido', 'fido-logo'),
  },
  fixo: {
    screens: wide('fixo', 'fixo-screens'),
    postJob: wide('fixo', 'fixo-post-job'),
    tradieProfile: wide('fixo', 'fixo-tradie-profile'),
    schedule: wide('fixo', 'fixo-schedule'),
    logo: logo('fixo', 'fixo-logo'),
  },
  memoire: {
    mark: logo('memoire', 'memoire-mark'),
  },
  pasta: {
    landing: page('the-pasta-place', 'pasta-landing', 7031),
    logo: logo('the-pasta-place', 'pasta-logo'),
  },
  gcrait: {
    landing: page('gcrait', 'gcrait-landing', 5001),
    logo: logo('gcrait', 'gcrait-logo'),
  },
  animationFest: {
    landing: page('animation-festival', 'animation-fest-landing', 5604),
    logo: logo('animation-festival', 'animation-fest-logo'),
  },
  access: {
    landing: page('access-ph', 'access-landing', 5713),
    logo: logo('access-ph', 'access-logo'),
  },
}
