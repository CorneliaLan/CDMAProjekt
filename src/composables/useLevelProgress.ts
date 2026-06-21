export type LevelProgressStatus = 'complete' | 'active' | 'locked'

const LEVEL_PROGRESS_STORAGE_KEY = 'cdma_level_progress'
const DEBUG_UNLOCK_STORAGE_KEY = 'cdma_level_progress_debug_unlock'

export const LEVEL_PROGRESS_CHANGED_EVENT = 'cdma-level-progress-changed'

const emitLevelProgressChanged = () => {
  window.dispatchEvent(new Event(LEVEL_PROGRESS_CHANGED_EVENT))
}

const readLevelIds = (storageKey: string): number[] => {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter((id): id is number => Number.isInteger(id))
  } catch (e) {
    console.warn('[cdma] Failed to read level progress', e)
    return []
  }
}

const readCompletedLevelIds = (): number[] => {
  return readLevelIds(LEVEL_PROGRESS_STORAGE_KEY)
}

const writeLevelIds = (storageKey: string, levelIds: number[]) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(levelIds))
  } catch (e) {
    console.warn('[cdma] Failed to persist level progress', e)
  }
}

const writeCompletedLevelIds = (levelIds: number[]) => {
  writeLevelIds(LEVEL_PROGRESS_STORAGE_KEY, levelIds)
}

export const getCompletedLevelIds = (): number[] => {
  return readCompletedLevelIds()
}

export const markLevelComplete = (levelId: number) => {
  const completed = new Set(readCompletedLevelIds())
  completed.add(levelId)

  writeCompletedLevelIds([...completed].sort((a, b) => a - b))
  emitLevelProgressChanged()
}

export const isDebugUnlockEnabled = (): boolean => {
  return localStorage.getItem(DEBUG_UNLOCK_STORAGE_KEY) === 'true'
}

export const enableDebugUnlock = () => {
  localStorage.setItem(DEBUG_UNLOCK_STORAGE_KEY, 'true')
  emitLevelProgressChanged()
}

export const resetDebugUnlock = () => {
  localStorage.removeItem(LEVEL_PROGRESS_STORAGE_KEY)
  localStorage.removeItem(DEBUG_UNLOCK_STORAGE_KEY)
  emitLevelProgressChanged()
}

export const getLevelStatus = (
  levelId: number,
  orderedLevelIds: number[]
): LevelProgressStatus => {
  const completed = new Set(readCompletedLevelIds())
  if (completed.has(levelId)) return 'complete'
  if (isDebugUnlockEnabled()) return 'active'

  const activeLevelId = orderedLevelIds.find((id) => !completed.has(id))
  return levelId === activeLevelId ? 'active' : 'locked'
}
