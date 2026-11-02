// Renders an entry from data/images.js with srcset, intrinsic size (no layout shift) and lazy loading.
export default function Img({ image, alt, sizes = '100vw', priority = false, className }) {
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
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  )
}
