import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createEmployee,
  deleteEmployee,
  fetchEmployees,
  updateEmployee,
} from '../api/employees'

export function useEmployees(cafeId, queryOptions = {}) {
  return useQuery({
    queryKey: ['employees', cafeId ?? 'all'],
    queryFn: () => fetchEmployees(cafeId),
    ...queryOptions,
  })
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({ queryKey: ['cafes'] })
    },
  })
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({ queryKey: ['cafes'] })
    },
  })
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ employeeId, payload }) => updateEmployee(employeeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({ queryKey: ['cafes'] })
    },
  })
}
