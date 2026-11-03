import Img from './Img'
import { MemoireCover } from './illustrations/MemoireIllustration'
import { FinanceCover } from './illustrations/FinanceIllustration'

const ILLUSTRATIONS = { memoire: MemoireCover, finance: FinanceCover }

// A project's cover: a real screenshot when one exists, otherwise its labelled illustration.
export default function ProjectVisual({ project, sizes, priority, eager, className = '' }) {
  const { cover } = project

  if (cover.kind === 'illustration') {
    const Illustration = ILLUSTRATIONS[cover.name]
    return (
      <div className={`project-visual project-visual--ill ${className}`}>
        <Illustration />
      </div>
    )
  }

  return (
    <div className={`project-visual ${className}`}>
      <Img image={cover.image} alt={cover.alt} sizes={sizes} priority={priority} eager={eager} />
    </div>
  )
}
