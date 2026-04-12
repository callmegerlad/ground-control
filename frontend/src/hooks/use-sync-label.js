import { useEffect, useMemo, useState } from 'react'
import dayjs from '../lib/dayjs'

const RELATIVE_TIME_REFRESH_MS = 10_000

export function useSyncLabel(lastSyncedAt) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (lastSyncedAt <= 0) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setTick((previous) => previous + 1)
    }, RELATIVE_TIME_REFRESH_MS)

    return () => {
      window.clearInterval(timer)
    }
  }, [lastSyncedAt])

  return useMemo(() => {
    if (lastSyncedAt <= 0) {
      return 'Not synced yet'
    }

    return dayjs(lastSyncedAt).fromNow()
  }, [lastSyncedAt, tick])
}