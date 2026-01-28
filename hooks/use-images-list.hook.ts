import { useCallback, useEffect, useRef, useState } from 'react';
import { useImagesStore } from 'store/images-store';
import { ImageDto } from 'types/image-dto.type';

const API_URL = 'https://picsum.photos/v2/list';
const PAGE_LIMIT = 10;

const useFetchImagesList = () => {
  const { addImages, setImages } = useImagesStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const initialFetchDoneRef = useRef(false);
  const fetchingMoreRef = useRef(false);
  const lastRequestedPageRef = useRef<number>(1);

  const fetchImagesList = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}?page=1&limit=${PAGE_LIMIT}`);
      const data: ImageDto[] = await response.json();

      setImages(data);
      lastRequestedPageRef.current = 1;
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching images list:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setImages]);

  const fetchMoreImages = useCallback(async () => {
    if (fetchingMoreRef.current) return;
    if (isLoading || isLoadingMore) return;

    try {
      fetchingMoreRef.current = true;
      setIsLoadingMore(true);
      const nextPage = lastRequestedPageRef.current + 1;

      lastRequestedPageRef.current = nextPage;
      const response = await fetch(`${API_URL}?page=${nextPage}&limit=${PAGE_LIMIT}`);
      const data: ImageDto[] = await response.json();

      addImages(data);
    } catch (error) {
      console.error('Error fetching more images:', error);
    } finally {
      setIsLoadingMore(false);
      fetchingMoreRef.current = false;
    }
  }, [addImages, isLoading, isLoadingMore]);

  useEffect(() => {
    if (initialFetchDoneRef.current) return;
    initialFetchDoneRef.current = true;

    fetchImagesList();
  }, [fetchImagesList]);

  return {
    isLoading,
    isLoadingMore,
    fetchImagesList,
    fetchMoreImages,
  };
};

export { useFetchImagesList };
