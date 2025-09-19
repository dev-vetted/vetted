export * from './client';
export * from './hooks/pets-trpc';
export * from './hooks/pets-rest';

// Re-export specific hooks for easier importing
export { usePets, useCreatePet } from './hooks/pets-rest';
export { usePetsTRPC, useCreatePetTRPC } from './hooks/pets-trpc';
