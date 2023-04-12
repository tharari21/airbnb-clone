import axios from "axios";
import { useRouter } from "next/navigation";
import { useMemo, useCallback, useState } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "../types";
import useLoginModal from "./useLoginModal";

interface IUseFavorite {
  listingId: string;
  currentUser?: SafeUser | null;
}
const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];
    return list.includes(listingId);
  }, [currentUser, listingId]);
  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (isLoading) return null;
      setIsLoading(true);
      if (!currentUser) {
        toast.error("You must be logged in to favorite listings.");
        return loginModal.onOpen();
      }
      try {
        let request;
        let operation;
        if (hasFavorited) {
          request = () => axios.delete(`/api/favorites/${listingId}`);
          operation = "removed from";
        } else {
          request = () => axios.post(`/api/favorites/${listingId}`);
          operation = "added to";
        }
        await request();
        toast.success(`Successfully ${operation} favorites.`);
        router.refresh();
      } catch (error) {
        toast.error("Something went wrong.");
      }
      setIsLoading(false);
    },
    [currentUser, hasFavorited, listingId, loginModal, router]
  );
  return { hasFavorited, toggleFavorite };
};
export default useFavorite;
