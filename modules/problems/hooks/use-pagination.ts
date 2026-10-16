import { useState, useMemo } from "react";
import { ITEMS_PER_PAGE } from "../constant";

export function usePagination<T>(
  items: T[] = [],
  itemsPerPage: number = ITEMS_PER_PAGE
) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const displayRange = useMemo(() => {
    const start =
      items.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, items.length);

    return {
      start,
      end,
      total: items.length,
    };
  }, [currentPage, itemsPerPage, items.length]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((previousPage) => previousPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((previousPage) => previousPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const resetPage = () => setCurrentPage(1);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    displayRange,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    resetPage,
    canGoNext: currentPage < totalPages,
    canGoPrevious: currentPage > 1,
    // Aliases used by ProblemsTable
    showPagination: totalPages > 1,
  };
}