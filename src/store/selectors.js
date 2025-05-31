import { createSelector } from '@reduxjs/toolkit'
import { selectAllUsers, selectUserById } from './userSlice'

// Basic Selectors
 const selectUsers = selectAllUsers
 export const selectSelectedUser = (state) => state.users.selectedUser
 export const selectFilters = (state) => state.users.filters
 const selectPagination = (state) => state.users.pagination
 const selectUI = (state) => state.users.ui
 export const selectError = (state) => state.users.error

// Export individual user selectors
export { selectUserById }

// Server-paginated users
export const selectPaginatedUsers = selectUsers

// Pagination Info
export const selectPaginationInfo = createSelector(
  [selectPagination],
  (pagination) => {
    const { currentPage, itemsPerPage, totalItems, totalPages } = pagination
    const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      startItem,
      endItem,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages
    }
  }
)

// Loading States
export const selectLoadingStates = createSelector(
  [selectUI],
  (ui) => ({
    isAnyLoading: ui.isLoading || ui.isCreating || ui.isUpdating || ui.isDeleting || ui.isSearching,
    isLoading: ui.isLoading,
    isCreating: ui.isCreating,
    isUpdating: ui.isUpdating,
    isDeleting: ui.isDeleting,
    isSearching: ui.isSearching,
    showCreateModal: ui.showCreateModal,
    showEditModal: ui.showEditModal
  })
)

// Search Results
export const selectSearchResults = createSelector(
  [selectUsers, selectFilters],
  (users, filters) => {
    const hasSearchTerm = filters.search.length > 0
    const resultCount = users.length
    
    return {
      hasSearchTerm,
      resultCount,
      hasResults: resultCount > 0,
      searchTerm: filters.search
    }
  }
)