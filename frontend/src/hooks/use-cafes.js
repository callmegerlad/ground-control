import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCafe, deleteCafe, fetchCafes, updateCafe } from '../api/cafes'

export function useCafes(location) {
  return useQuery({
    queryKey: ['cafes', location ?? 'all'],
    queryFn: () => fetchCafes(location),
  })
}

export function useDeleteCafe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCafe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cafes'] })
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

export function useCreateCafe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCafe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cafes'] })
    },
  })
}

export function useUpdateCafe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cafeId, payload }) => updateCafe(cafeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cafes'] })
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}
