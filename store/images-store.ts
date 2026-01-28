import { create } from 'zustand';
import { ImageDto } from 'types/image-dto.type';

type ImagesStoreState = {
  images: Record<string, ImageDto>;
  imageIds: string[];
  hiddenImageIds: Record<string, true>;

  setImages: (images: Record<string, ImageDto>, ids: string[]) => void;
  addImages: (images: Record<string, ImageDto>, ids: string[]) => void;

  hideImage: (id: string) => void;
};

export const useImagesStore = create<ImagesStoreState>((set) => ({
  images: {},
  imageIds: [],
  hiddenImageIds: {},

  hideImage: (id: string) =>
    set((state) => {
      return {
        hiddenImageIds: {
          ...state.hiddenImageIds,
          [id]: true,
        },

        imageIds: state.imageIds.filter((imgId) => imgId !== id),
      };
    }),

  setImages: (images: Record<string, ImageDto>, ids: string[]) =>
    set(() => ({
      images,
      imageIds: ids,
    })),

  addImages: (images: Record<string, ImageDto>, ids: string[]) =>
    set((state) => {
      if (ids.length === 0) return state;

      const existing = new Set(state.imageIds);
      const uniqueIds: string[] = [];
      for (const id of ids) {
        if (!existing.has(id)) uniqueIds.push(id);
      }

      if (uniqueIds.length === 0) return state;

      const mergedImages: Record<string, ImageDto> = {
        ...state.images,
      };

      for (const id of uniqueIds) {
        const img = images[id];
        if (img) mergedImages[id] = img;
      }

      return {
        images: mergedImages,
        imageIds: [...state.imageIds, ...uniqueIds],
      };
    }),
}));
