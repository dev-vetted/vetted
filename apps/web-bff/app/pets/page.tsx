'use client';

import { Button, Card, CardContent, CardHeader, Input, Modal } from '@vetted/ui';
import { trpc } from '../../utils/trpc';
import { useState } from 'react';

interface Pet {
  id: string;
  name: string;
  species: string;
  tenantId: string;
  createdAt: string;
}

export default function ConsumerPetsPage() {
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState('');
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [editName, setEditName] = useState('');
  const [editSpecies, setEditSpecies] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);
  
  const { data: pets, isLoading, error, refetch } = trpc.pet.list.useQuery({ limit: 20 });
  const createPet = trpc.pet.create.useMutation({
    onSuccess: () => {
      setPetName('');
      setPetSpecies('');
      refetch();
    },
  });
  const updatePet = trpc.pet.update.useMutation({
    onSuccess: () => {
      setIsEditModalOpen(false);
      setEditingPet(null);
      setEditName('');
      setEditSpecies('');
      refetch();
    },
  });
  const deletePet = trpc.pet.delete.useMutation({
    onSuccess: () => {
      setDeletingPetId(null);
      refetch();
    },
    onError: () => {
      setDeletingPetId(null);
    },
  });

  const handleCreatePet = () => {
    if (petName && petSpecies) {
      createPet.mutate({
        name: petName,
        species: petSpecies,
        tenantId: 'cmfnrbfso0000bk7wtt4r9bv8', // Using tenant ID
      });
    }
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setEditName(pet.name);
    setEditSpecies(pet.species);
    setIsEditModalOpen(true);
  };

  const handleUpdatePet = () => {
    if (editingPet && editName && editSpecies) {
      updatePet.mutate({
        id: editingPet.id,
        name: editName,
        species: editSpecies,
      });
    }
  };

  const handleDeletePet = (petId: string) => {
    setDeletingPetId(petId);
    deletePet.mutate({ id: petId });
  };

  return (
    <main className="p-6 space-y-4">
      <div className="text-xl font-semibold">Consumer Pet Management (tRPC)</div>
      
      <Card>
        <CardHeader>Add New Pets via tRPC</CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Input 
              placeholder="Pet name" 
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
            />
            <Input 
              placeholder="Species" 
              value={petSpecies}
              onChange={(e) => setPetSpecies(e.target.value)}
            />
            <Button 
              onClick={handleCreatePet}
              disabled={!petName || !petSpecies || createPet.isLoading}
            >
              {createPet.isLoading ? 'Adding...' : 'Add Pet'}
            </Button>
          </div>
          {createPet.error && (
            <div className="text-red-500 text-sm">
              Error: {createPet.error.message}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Current Pets (via tRPC)</CardHeader>
        <CardContent>
          {isLoading && <div>Loading pets...</div>}
          {error && <div className="text-red-500">Error: {error.message}</div>}
          {pets && pets.length === 0 && <div>No pets found.</div>}
          {pets && pets.length > 0 && (
            <ul className="space-y-3">
              {pets.map((pet: Pet) => (
                <li key={pet.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-lg">{pet.name}</div>
                      <div className="text-gray-600">Species: {pet.species}</div>
                      <div className="text-sm text-gray-500">
                        Tenant: {pet.tenantId} | Added: {new Date(pet.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleEditPet(pet)}
                        disabled={updatePet.isLoading}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleDeletePet(pet.id)}
                        disabled={deletingPetId === pet.id}
                      >
                        {deletingPetId === pet.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Edit Pet Modal */}
      <Modal 
        open={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Pet"
      >
        <div className="space-y-4">
          <Input
            placeholder="Pet name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <Input
            placeholder="Species"
            value={editSpecies}
            onChange={(e) => setEditSpecies(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePet}
              disabled={!editName || !editSpecies || updatePet.isLoading}
            >
              {updatePet.isLoading ? 'Updating...' : 'Update Pet'}
            </Button>
          </div>
          {updatePet.error && (
            <div className="text-red-500 text-sm">
              Error: {updatePet.error.message}
            </div>
          )}
        </div>
      </Modal>
    </main>
  );
}
