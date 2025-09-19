// tRPC hooks for pets - these will be used in consumer web
// Note: These are placeholder types. Actual implementation will use the tRPC client from the consumer app

export interface Pet {
  id: string;
  name: string;
  species: string;
  tenantId: string;
  createdAt: Date;
}

export interface PetTRPCHooks {
  usePets: () => {
    data?: Pet[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };
  useCreatePet: () => {
    mutate: (data: { name: string; species: string; tenantId?: string }) => void;
    isLoading: boolean;
    error: Error | null;
  };
  useUpdatePet: () => {
    mutate: (data: { id: string; name?: string; species?: string }) => void;
    isLoading: boolean;
    error: Error | null;
  };
  useDeletePet: () => {
    mutate: (petId: string) => void;
    isLoading: boolean;
    error: Error | null;
  };
}

// These will be implemented in the consumer web app using the actual tRPC client
export const usePetsTRPC = () => {
  throw new Error('usePetsTRPC should be implemented in the consumer web app with actual tRPC client');
};

export const useCreatePetTRPC = () => {
  throw new Error('useCreatePetTRPC should be implemented in the consumer web app with actual tRPC client');
};

export const useUpdatePetTRPC = () => {
  throw new Error('useUpdatePetTRPC should be implemented in the consumer web app with actual tRPC client');
};

export const useDeletePetTRPC = () => {
  throw new Error('useDeletePetTRPC should be implemented in the consumer web app with actual tRPC client');
};
