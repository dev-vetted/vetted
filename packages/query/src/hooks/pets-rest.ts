import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const getRestApiUrl = (path: string) => {
  if (typeof window === 'undefined') {
    // Server-side: use environment variable or fallback
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${path}`;
  }
  
  // Client-side: determine based on current origin
  const currentOrigin = window.location.origin;
  
  if (currentOrigin.includes('3001')) {
    // Vendor web app - point to web-bff
    return `http://localhost:3000${path}`;
  } else {
    // Client web app (same origin as backend)
    return `${path}`;
  }
};

export function usePets(tenantId: string) {
  return useQuery({
    queryKey: ['pets', tenantId],
    queryFn: async () => {
      const res = await fetch(getRestApiUrl('/api/pets'), { 
        headers: { 'x-tenant-id': tenantId } 
      });
      if (!res.ok) throw new Error('Failed to fetch pets');
      return res.json();
    },
  });
}

export function useCreatePet(tenantId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPet: { name: string; species: string }) => {
      const res = await fetch(getRestApiUrl('/api/pets'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'x-tenant-id': tenantId 
        },
        body: JSON.stringify(newPet),
      });
      if (!res.ok) throw new Error('Failed to create pet');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets', tenantId] });
    },
  });
}

export function useUpdatePet(tenantId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string; name?: string; species?: string }) => {
      const res = await fetch(getRestApiUrl(`/api/pets/${id}`), {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'x-tenant-id': tenantId 
        },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error('Failed to update pet');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets', tenantId] });
    },
  });
}

export function useDeletePet(tenantId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (petId: string) => {
      const res = await fetch(getRestApiUrl(`/api/pets/${petId}`), {
        method: 'DELETE',
        headers: { 
          'x-tenant-id': tenantId 
        },
      });
      if (!res.ok) throw new Error('Failed to delete pet');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets', tenantId] });
    },
  });
}

export function usePet(petId: string, tenantId: string) {
  return useQuery({
    queryKey: ['pet', petId, tenantId],
    queryFn: async () => {
      const res = await fetch(getRestApiUrl(`/api/pets/${petId}`), { 
        headers: { 'x-tenant-id': tenantId } 
      });
      if (!res.ok) throw new Error('Failed to fetch pet');
      return res.json();
    },
    enabled: !!petId,
  });
}
