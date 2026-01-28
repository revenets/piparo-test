import { create } from 'zustand';
import { ImageDto } from 'types/image-dto.type';

type ImagesStoreState = {
  images: ImageDto[];

  setImages: (images: ImageDto[]) => void;
  addImages: (images: ImageDto[]) => void;
};

export const useImagesStore = create<ImagesStoreState>((set) => ({
  images: [],

  setImages: (images: ImageDto[]) => set({ images }),

  addImages: (images: ImageDto[]) =>
    set((state) => {
      if (images.length === 0) return state;

      const existingIds = new Set(state.images.map((img) => img.id));
      const uniqueIncoming = images.filter((img) => !existingIds.has(img.id));

      if (uniqueIncoming.length === 0) return state;
      return { images: [...state.images, ...uniqueIncoming] };
    }),
}));
