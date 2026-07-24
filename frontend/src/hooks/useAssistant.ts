import { useQuery } from '@tanstack/react-query'
import api from '@/api/client'

interface Suggestion {
  type: 'tip' | 'insight' | 'reminder'
  message: string
}

interface SuggestionsResponse {
  suggestions: Suggestion[]
}

export function useAssistant() {
  return useQuery<Suggestion[]>({
    queryKey: ['assistant', 'suggestions'],
    queryFn: async () => {
      const { data } = await api.get<SuggestionsResponse>('/assistant/suggestions')
      return data.suggestions
    },
    staleTime: 60_000,
    refetchInterval: 120_000,
  })
}
