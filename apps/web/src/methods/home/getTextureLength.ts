import homeTexture from '@/data/homeTexture.json'

type PhaseType = 'top0' | 'top1' | 'top2' | 'top3' | 'top4' | 'top5'

const getTextureLength = (phase: PhaseType) => homeTexture[phase].length

export default getTextureLength