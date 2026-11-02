import { IllustrativeTag, Lines, MapField, PhotoTile } from './parts'

const PINS = [
  { x: 21, y: 29, label: 'Baguio' },
  { x: 53, y: 49, active: true },
  { x: 75, y: 34 },
]

export function MemoireCover() {
  return (
    <figure className="ill ill--memoire" role="img" aria-label="Illustrative Memoire concept: a map of pinned memories beside a memory card, above a photo timeline.">
      <div className="ill-app">
        <div className="ill-app__bar">
          <span className="ill-logo accent">m.</span>
          <span className="ill-tabs" aria-hidden="true">
            <span className="is-active">Map</span>
            <span>Timeline</span>
            <span>Albums</span>
          </span>
        </div>
        <div className="mem-body">
          <MapField pins={PINS} />
          <div className="mem-card">
            <PhotoTile tone="clay" className="mem-card__photo" />
            <span className="mem-card__title">Sunday market</span>
            <span className="mem-card__meta">Sample album · 14 photos</span>
            <span className="mem-card__people" aria-hidden="true">
              <span /><span /><span />
            </span>
          </div>
        </div>
        <div className="mem-timeline" aria-hidden="true">
          {['Jan', 'Mar', 'Apr', 'Jun', 'Aug'].map((m, i) => (
            <span key={m} className={`mem-timeline__item${i === 2 ? ' is-active' : ''}`}>
              <PhotoTile tone={['sage', 'sand', 'clay', 'sage', 'sand'][i]} variant={i} />
              <span className="mem-timeline__label">{m}</span>
            </span>
          ))}
        </div>
      </div>
      <IllustrativeTag />
    </figure>
  )
}

export function MemoireFeature({ name }) {
  if (name === 'memoire-map') {
    return (
      <div className="ill ill--feature" aria-hidden="true">
        <div className="ill-app ill-app--flush">
          <MapField pins={[{ x: 28, y: 36 }, { x: 56, y: 58, active: true, label: '6 memories' }, { x: 80, y: 30 }]} />
        </div>
      </div>
    )
  }
  if (name === 'memoire-social') {
    return (
      <div className="ill ill--feature" aria-hidden="true">
        <div className="ill-app mem-post">
          <span className="mem-post__head"><span className="avatar" /><Lines widths={[42, 26]} /></span>
          <PhotoTile tone="sage" variant={2} className="mem-post__photo" />
          <span className="mem-post__actions"><span>♡ 12</span><span>Comment</span><span>Add to album</span></span>
          <Lines widths={[88, 64]} />
        </div>
      </div>
    )
  }
  return (
    <div className="ill ill--feature" aria-hidden="true">
      <div className="ill-app mem-album">
        <PhotoTile tone="clay" className="mem-album__a" />
        <PhotoTile tone="sand" variant={1} className="mem-album__b" />
        <PhotoTile tone="sage" variant={2} className="mem-album__c" />
        <span className="mem-album__caption accent">Summer, sample album</span>
      </div>
    </div>
  )
}
