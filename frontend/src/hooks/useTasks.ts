import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import type { Task, TaskFormValues, TaskListResponse, TaskStatus } from '@/types'

export function useTaskList(params: Record<string, string>) {
  const queryString = new URLSearchParams(params).toString()
  return useQuery<Task[]>({
    queryKey: ['tasks', queryString],
    queryFn: async () => {
      const { data } = await api.get<TaskListResponse>(
        `/tasks${queryString ? `?${queryString}` : ''}`,
      )
      return data.tasks
    },
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation<Task, Error, TaskFormValues>({
    mutationFn: async (payload) => {
      const { data } = await api.post<{ task: Task }>('/tasks', payload)
      return data.task
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useUpdateTask(taskId: string | null) {
  const queryClient = useQueryClient()
  return useMutation<Task, Error, TaskFormValues>({
    mutationFn: async (payload) => {
      const { data } = await api.put<{ task: Task }>(`/tasks/${taskId}`, payload)
      return data.task
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient()
  return useMutation<Task, Error, { taskId: string; status: TaskStatus }>({
    mutationFn: async ({ taskId, status }) => {
      const { data } = await api.put<{ task: Task }>(`/tasks/${taskId}`, { status })
      return data.task
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(`/tasks/${id}`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}
