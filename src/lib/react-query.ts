/**
 * React Query Configuration
 * Setup for data fetching and caching
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Export React Query hooks
export {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
