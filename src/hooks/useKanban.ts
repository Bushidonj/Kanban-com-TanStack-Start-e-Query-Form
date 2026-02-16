import { useState, useCallback } from 'react';
import { INITIAL_CARDS } from '../mock/kanbanData';
import type { Card, CardStatus } from '../types/kanban';

export function useKanban() {
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);

  const moveCard = useCallback((cardId: string, newStatus: CardStatus) => {
    setCards((prev) => 
      prev.map((card) => 
        card.id === cardId ? { ...card, status: newStatus } : card
      )
    );
  }, []);

  const updateCard = useCallback((updatedCard: Card) => {
    setCards((prev) => 
      prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
  }, []);

  const addCard = useCallback((card: Card) => {
    setCards((prev) => [...prev, card]);
  }, []);

  const deleteCard = useCallback((cardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== cardId));
  }, []);

  return {
    cards,
    moveCard,
    updateCard,
    addCard,
    deleteCard,
  };
}
