import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { INITIAL_CARDS } from '../mock/kanbanData';
import type { Card, CardStatus } from '../types/kanban';

// Simulation of API calls
const fetchCards = async (): Promise<Card[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...INITIAL_CARDS];
};

export function useKanban() {
  const queryClient = useQueryClient();

  // Query to fetch cards
  const { data: cards = [], isPending: isQueryPending } = useQuery({
    queryKey: ['cards'],
    queryFn: fetchCards,
    staleTime: Infinity, // Keep in memory
  });

  // Mutation to move card
  const moveCardMutation = useMutation({
    mutationFn: async ({ cardId, newStatus }: { cardId: string; newStatus: CardStatus }) => {
      // Logic would be here for actual API call
      return { cardId, newStatus };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['cards'], (prev: Card[] | undefined) => {
        if (!prev) return [];
        return prev.map((card) =>
          card.id === data.cardId ? { ...card, status: data.newStatus } : card
        );
      });
    },
  });

  // Mutation to update card (includes status change inside modal)
  const updateCardMutation = useMutation({
    mutationFn: async (updatedCard: Card) => updatedCard,
    onSuccess: (data) => {
      queryClient.setQueryData(['cards'], (prev: Card[] | undefined) => {
        if (!prev) return [];
        return prev.map((card) => (card.id === data.id ? data : card));
      });
    },
  });

  // Mutation to add card
  const addCardMutation = useMutation({
    mutationFn: async (card: Card) => card,
    onSuccess: (data) => {
      queryClient.setQueryData(['cards'], (prev: Card[] | undefined) => {
        if (!prev) return [data];
        return [...prev, data];
      });
    },
  });

  // Mutation to delete card
  const deleteCardMutation = useMutation({
    mutationFn: async (cardId: string) => cardId,
    onSuccess: (cardId) => {
      queryClient.setQueryData(['cards'], (prev: Card[] | undefined) => {
        if (!prev) return [];
        return prev.filter((card) => card.id !== cardId);
      });
    },
  });

  return {
    cards,
    moveCard: (cardId: string, newStatus: CardStatus) => moveCardMutation.mutate({ cardId, newStatus }),
    updateCard: updateCardMutation.mutate,
    addCard: addCardMutation.mutate,
    deleteCard: deleteCardMutation.mutate,
    isLoading: isQueryPending || moveCardMutation.isPending || updateCardMutation.isPending || addCardMutation.isPending || deleteCardMutation.isPending,
  };
}
