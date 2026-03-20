import { useState } from 'react';
import { favoriteService } from '../services/favorite';
import { useAuth } from './useAuth';

export function useFavorite(skillId: number, initialState = false) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(initialState);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!user) return;
    setLoading(true);
    try {
      if (isFavorited) {
        await favoriteService.remove(skillId);
        setIsFavorited(false);
      } else {
        await favoriteService.add(skillId);
        setIsFavorited(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return { isFavorited, toggle, loading };
}
