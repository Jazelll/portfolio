// Renders an entry from data/images.js with srcset, intrinsic size (no layout shift) and lazy loading.
// `eager` loads immediately at normal priority: for images inside the clipped canvas, where
// native lazy loading would wait until each card is panned into view.
export default function Img({ image, alt, sizes = '100vw', priority = false, eager = false, className }) {
  const srcSet = image.srcSm ? `${image.srcSm} ${image.smWidth}w, ${image.src} ${image.width}w` : undefined

  return (
    <img
      className={className}
      src={image.src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={priority || eager ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  )
}
