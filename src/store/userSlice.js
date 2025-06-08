import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'

const usersAdapter = createEntityAdapter({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
})

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page = 1, limit = 5, search = '' } = {}, { rejectWithValue }) => {
    try {
      let url = `https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${limit}`
      
      if (search) {
        url += `&q=${encodeURIComponent(search)}`
      }
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const data = await response.json()
      const totalCount = response.headers.get('X-Total-Count')
      
      return {
        users: data,
        totalCount: totalCount ? parseInt(totalCount, 10) : data.length,
        page,
        limit
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create user')
      }
      
      const newUser = await response.json()
      const userWithId = { ...newUser, id: Date.now() }

      return userWithId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update user')
      }
      
      const updatedUser = await response.json()
      const userWithId = { ...updatedUser, id }
      return userWithId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete user')
      }
      
      
      
      return userId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async ({ searchTerm, page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!response.ok) {
        throw new Error('Failed to search users')
      }
      
      const allUsers = await response.json()
      
      const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex)
      
      return {
        users: paginatedUsers,
        totalCount: filteredUsers.length,
        page,
        limit,
        searchTerm
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = usersAdapter.getInitialState({
  selectedUser: null,
  filters: {
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0,
    totalPages: 0
  },
  ui: {
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isSearching: false,
    showCreateModal: false,
    showEditModal: false
  },
  error: null
})

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
    },
    
    clearSelectedUser: (state) => {
      state.selectedUser = null
    },
    
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload
      state.pagination.currentPage = 1
    },
    
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload
    },
    
    setItemsPerPage: (state, action) => {
      state.pagination.itemsPerPage = action.payload
      state.pagination.currentPage = 1
    },
    
    toggleCreateModal: (state) => {
      state.ui.showCreateModal = !state.ui.showCreateModal
    },
    
    toggleEditModal: (state) => {
      state.ui.showEditModal = !state.ui.showEditModal
    },
    
    closeAllModals: (state) => {
      state.ui.showCreateModal = false
      state.ui.showEditModal = false
    },
    
    resetFilters: (state) => {
      state.filters = {
        search: '',
        sortBy: 'name',
        sortOrder: 'asc'
      }
      state.pagination.currentPage = 1
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.ui.isLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.ui.isLoading = false
        const { users, totalCount, page, limit } = action.payload
        
        usersAdapter.setAll(state, users)
        
        state.pagination.totalItems = totalCount
        state.pagination.totalPages = Math.ceil(totalCount / limit)
        state.pagination.currentPage = page
        state.pagination.itemsPerPage = limit
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.ui.isLoading = false
        state.error = action.payload || 'Failed to fetch users'
      })

    builder
      .addCase(searchUsers.pending, (state) => {
        state.ui.isSearching = true
        state.error = null
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.ui.isSearching = false
        const { users, totalCount, page, limit, searchTerm } = action.payload
        
        usersAdapter.setAll(state, users)
        state.pagination.totalItems = totalCount
        state.pagination.totalPages = Math.ceil(totalCount / limit)
        state.pagination.currentPage = page
        state.filters.search = searchTerm
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.ui.isSearching = false
        state.error = action.payload || 'Failed to search users'
      })
    
    builder
      .addCase(createUser.pending, (state) => {
        state.ui.isCreating = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.ui.isCreating = false
        state.ui.showCreateModal = false
        usersAdapter.addOne(state, action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.ui.isCreating = false
        state.error = action.payload || 'Failed to create user'
      })
    
    builder
      .addCase(updateUser.pending, (state) => {
        state.ui.isUpdating = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.ui.isUpdating = false
        state.ui.showEditModal = false
        state.selectedUser = action.payload
        usersAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload
        })
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.ui.isUpdating = false
        state.error = action.payload || 'Failed to update user'
      })
    
    builder
      .addCase(deleteUser.pending, (state) => {
        state.ui.isDeleting = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.ui.isDeleting = false
        
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
          usersAdapter.removeOne(state, action.payload);
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.ui.isDeleting = false
        state.error = action.payload || 'Failed to delete user'
      })
  }
})

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById
} = usersAdapter.getSelectors((state) => state.users)

export const {
  setSelectedUser,
  clearSelectedUser,
  setSearchFilter,
  setCurrentPage,
  setItemsPerPage,
  toggleCreateModal,
  toggleEditModal,
  closeAllModals,
  resetFilters
} = userSlice.actions

export default userSlice.reducer