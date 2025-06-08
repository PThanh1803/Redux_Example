import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Checkbox,
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Stack,
  Grid,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop
} from '@mui/material'
import {
  Add,
  Search,
  GetApp,
  Publish,
  MoreVert,
  Edit,
  Delete,
  FilterList,
  Refresh
} from '@mui/icons-material'

// Import Redux actions
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  setSelectedUser,
  clearSelectedUser,
  setSearchFilter,
  toggleCreateModal,
  toggleEditModal,
  resetFilters,
  setCurrentPage,
  setItemsPerPage,
  closeAllModals,
  searchUsers
} from '../store/userSlice'

// Import Redux selectors
import {
  selectPaginatedUsers,
  selectLoadingStates,
  selectSearchResults,
  selectSelectedUser,
  selectError,
  selectFilters,
  selectPaginationInfo
} from '../store/selectors'

const UserManagement = () => {
  const dispatch = useDispatch()

  // Redux state via selectors
  const users = useSelector(selectPaginatedUsers)
  const loading = useSelector(selectLoadingStates)
  const searchResults = useSelector(selectSearchResults)
  const selectedUser = useSelector(selectSelectedUser)
  const error = useSelector(selectError)
  const filters = useSelector(selectFilters)
  const paginationInfo = useSelector(selectPaginationInfo)

  // Local state for UI only
  const [anchorEl, setAnchorEl] = useState(null)
  const [filterType, setFilterType] = useState('all')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [selected, setSelected] = React.useState([]);


    const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = users.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    website: '',
    company: { name: '', catchPhrase: '', bs: '' },
    address: { street: '', suite: '', city: '', zipcode: '' }
  })

  const transformedUsers = users.map(user => ({
    ...user,
    location: user.address ? `${user.address.city}, ${user.address.zipcode}` : 'Unknown',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7c3aed&color=fff`,
    companyName: user.company?.name || 'N/A',
    phone: user.phone || 'N/A',
    website: user.website || 'N/A'
  }))

  const filteredUsers = transformedUsers.filter(user => {
    if (filterType === 'all') return true
    if (filterType === 'has-company') return user.companyName && user.companyName !== 'N/A'
    if (filterType === 'no-company') return !user.companyName || user.companyName === 'N/A'
    return true
  })

  useEffect(() => {
    dispatch(fetchUsers({
      page: paginationInfo.currentPage,
      limit: paginationInfo.itemsPerPage
    }))
  }, [dispatch, paginationInfo.currentPage, paginationInfo.itemsPerPage])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search) {
        dispatch(searchUsers({
          searchTerm: filters.search,
          page: 1,
          limit: paginationInfo.itemsPerPage
        }))
      } 
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [dispatch, filters.search, paginationInfo.itemsPerPage])

  const handlePageChange = (event, newPage) => {
    const targetPage = newPage + 1
    dispatch(setCurrentPage(targetPage))

    if (filters.search) {
      dispatch(searchUsers({
        searchTerm: filters.search,
        page: targetPage,
        limit: paginationInfo.itemsPerPage
      }))
    } else {
      dispatch(fetchUsers({
        page: targetPage,
        limit: paginationInfo.itemsPerPage
      }))
    }
  }

  const handleRowsPerPageChange = (event) => {
    const newLimit = parseInt(event.target.value, 10)
    dispatch(setItemsPerPage(newLimit))

    if (filters.search) {
      dispatch(searchUsers({
        searchTerm: filters.search,
        page: 1,
        limit: newLimit
      }))
    } else {
      dispatch(fetchUsers({
        page: 1,
        limit: newLimit
      }))
    }
  }

  const handleSearch = (event) => {
    dispatch(setSearchFilter(event.target.value))
  }

  const handleActionClick = (event, customer) => {
    setAnchorEl(event.currentTarget)
    dispatch(setSelectedUser(customer))
  }

  const handleActionClose = () => {
    setAnchorEl(null)
    dispatch(clearSelectedUser())
  }

  const handleAddCustomer = () => {
    dispatch(toggleCreateModal())
    setFormData({
      name: '',
      email: '',
      username: '',
      phone: '',
      website: '',
      company: { name: '', catchPhrase: '', bs: '' },
      address: { street: '', suite: '', city: '', zipcode: '' }
    })

    setAnchorEl(null)
    dispatch(clearSelectedUser())
  }

  const handleEditCustomer = () => {
    if (selectedUser) {

      dispatch(toggleEditModal())
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        username: selectedUser.username,
        phone: selectedUser.phone || '',
        website: selectedUser.website || '',
        company: {
          name: selectedUser.company?.name || '',
          catchPhrase: selectedUser.company?.catchPhrase || '',
          bs: selectedUser.company?.bs || ''
        },
        address: {
          street: selectedUser.address?.street || '',
          suite: selectedUser.address?.suite || '',
          city: selectedUser.address?.city || '',
          zipcode: selectedUser.address?.zipcode || ''
        }
      })
    }

    setAnchorEl(null)
  }

  const handleDeleteCustomer = async () => {
    if (selectedUser) {
      try {
        await dispatch(deleteUser(selectedUser.id)).unwrap()
        setSnackbar({
          open: true,
          message: `Customer ${selectedUser.name} deleted successfully`,
          severity: 'success'
        })
      } catch {
        setSnackbar({
          open: true,
          message: 'Error deleting customer. Please try again.',
          severity: 'error'
        })
      }
    }
    handleActionClose()
  }

  const handleDialogClose = () => {
    dispatch(closeAllModals())
    dispatch(clearSelectedUser())
    setFormData({
      name: '',
      email: '',
      username: '',
      phone: '',
      website: '',
      company: { name: '', catchPhrase: '', bs: '' },
      address: { street: '', suite: '', city: '', zipcode: '' }
    })
  }

  const handleFormSubmit = async () => {
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        phone: formData.phone,
        website: formData.website,
        company: formData.company,
        address: formData.address
      }
 

      if (loading.showCreateModal) {
        await dispatch(createUser(userData)).unwrap()
        setSnackbar({
          open: true,
          message: `Customer ${formData.name} added successfully`,
          severity: 'success'
        })
      } else if (loading.showEditModal && selectedUser) {
        console.log('Updating user with ID:', selectedUser.id)
        await dispatch(updateUser({ id: selectedUser.id, userData })).unwrap()
        setSnackbar({
          open: true,
          message: `Customer ${formData.name} updated successfully`,
          severity: 'success'
        })
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSnackbar({
        open: true,
        message: `Error ${loading.showCreateModal ? 'adding' : 'updating'} customer. Please try again.`,
        severity: 'error'
      })
    }
  }

  const handleRefreshData = () => {
    if (filters.search) {
      dispatch(searchUsers({
        searchTerm: filters.search,
        page: paginationInfo.currentPage,
        limit: paginationInfo.itemsPerPage
      }))
    } else {
      dispatch(fetchUsers({
        page: paginationInfo.currentPage,
        limit: paginationInfo.itemsPerPage
      }))
    }
  }

  const handleResetFilters = () => {
    dispatch(resetFilters())
    setFilterType('all')
    dispatch(fetchUsers({
      page: 1,
      limit: paginationInfo.itemsPerPage
    }))
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading.isAnyLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="column" spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a1a1a' ,  }}>
              Customers
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Manage your customers efficiently
            </Typography>
         </Stack>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Publish />}
              sx={{
                textTransform: 'none',
                borderColor: '#e0e0e0',
                color: '#666'
              }}
            >
              Import
            </Button>
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              sx={{
                textTransform: 'none',
                borderColor: '#e0e0e0',
                color: '#666'
              }}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefreshData}
              disabled={loading.isLoading}
              sx={{
                textTransform: 'none',
                borderColor: '#e0e0e0',
                color: '#666'
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddCustomer}
              disabled={loading.isAnyLoading}
              sx={{
                textTransform: 'none',
                backgroundColor: '#7c3aed',
                '&:hover': {
                  backgroundColor: '#6d28d9'
                }
              }}
            >
              Add Customers
            </Button>
          </Stack>
        </Stack>


        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={handleRefreshData}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <Stack direction="row" spacing={4} alignItems="center" sx={{ mb: 3 }} border={1} borderColor="#e0e0e0" p={2} borderRadius="8px">
          <Stack direction="row " spacing={0.5} alignItems="center" sx={{ flexGrow: 1, gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }} >
              {paginationInfo.totalItems} customer{paginationInfo.totalItems !== 1 ? 's' : ''} total
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Showing {paginationInfo.startItem}-{paginationInfo.endItem} of {paginationInfo.totalItems}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={filterType}
                
                displayEmpty
                onChange={(e) => setFilterType(e.target.value)}
                sx={{
                  
                  '& .MuiSelect-select': {
                    paddingLeft: '8px',
                    paddingRight: '24px',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="has-company">Has Company</MenuItem>
                <MenuItem value="no-company">No Company</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="text"
              onClick={handleResetFilters}
              sx={{
                textTransform: 'none',
                color: '#666',
                minWidth: 'auto'
              }}
            >
              Reset Filters
            </Button>
          </Stack>
        </Stack>
        
        <Stack direction="row" spacing={2} justifyContent={'space-between'} alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" width={'40%'}>
            <TextField
              fullWidth
              placeholder="Search customer by name, email, username, phone, website, or company"
              value={filters.search || ''}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#999' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: 'white',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                },
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" >
              <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilterType('all')}
              disabled={loading.isLoading}
              alignItems="center"
              
              sx={{

                padding: '14px 16px',
                textTransform: 'none',
                borderColor: '#e0e0e0',
                color: '#666',
                mt: 1,
                '&:hover': {
                  borderColor: '#7c3aed',
                  color: '#7c3aed'
                }
              }}
            />
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefreshData}
              disabled={loading.isLoading}
              alignItems="center"
              justifyContent="center"
              sx={{
                textTransform: 'none',
                borderColor: '#e0e0e0',
                color: '#666',
                padding: '14px 16px',
                mt: 1,
                '&:hover': {
                  borderColor: '#7c3aed',
                  color: '#7c3aed'
                }
              }}
            />
              
          </Stack>
        </Stack>
       

        {searchResults.hasSearchTerm && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Found {searchResults.resultCount} user(s) matching "{searchResults.searchTerm}"
          </Alert>
        )}
      </Box>
      <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                 <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < users.length}
                    checked={users.length > 0 && selected.length === users.length}
                    onChange={handleSelectAllClick}
                    inputProps={{
                      'aria-label': 'select all desserts',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: '0.875rem' }}>
                  Customers
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: '0.875rem' }}>
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: '0.875rem' }}>
                  Phone
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: '0.875rem' }}>
                  Website
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: '0.875rem' }}>
                  Company
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: '0.875rem' }}>
                  Location
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: '0.875rem' }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((customer) => {
                const isItemSelected = selected.includes(customer.id);
                return (

                <TableRow 
                  hover
                    onClick={(event) => handleClick(event, customer.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f8f9fa' } }}
                  key={customer.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onChange={(event) => handleClick(event, customer.id)}
                      inputProps={{
                        'aria-labelledby': `customer-checkbox-${customer.id}`,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={customer.avatar}
                        sx={{ width: 40, height: 40 }}
                      >
                        {customer.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {customer.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {customer.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {customer.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: customer.website !== 'N/A' ? '#7c3aed' : '#666',
                        textDecoration: customer.website !== 'N/A' ? 'underline' : 'none',
                        cursor: customer.website !== 'N/A' ? 'pointer' : 'default'
                      }}
                      onClick={() => {
                        if (customer.website !== 'N/A') {
                          window.open(`https://${customer.website}`, '_blank')
                        }
                      }}
                    >
                      {customer.website}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {customer.companyName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {customer.location}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleActionClick(e, customer)}
                      sx={{ color: '#666' }}
                      disabled={loading.isAnyLoading}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )})}
              {filteredUsers.length === 0 && !loading.isLoading && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {transformedUsers.length === 0 ? 'No customers available. Click "Add Customers" to get started.' : 'No customers found matching your criteria'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={paginationInfo.totalItems}
          page={paginationInfo.currentPage - 1}
          onPageChange={handlePageChange}
          rowsPerPage={paginationInfo.itemsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Cus per page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count} customers`
          }
          sx={{
            borderTop: '1px solid #e0e0e0',
            '& .MuiTablePagination-toolbar': {
              justifyContent: 'flex-start',
              paddingLeft: 2,
              paddingRight: 2
            },
            '& .MuiTablePagination-spacer': {
              display: 'none'
            },
            '& .MuiTablePagination-actions': {
              marginLeft: 2
            }
          }}
        />
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEditCustomer}>
          <Edit sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteCustomer} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={loading.showCreateModal || loading.showEditModal}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {loading.showCreateModal ? 'Add New Customer' : 'Edit Customer'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.company.name}
                onChange={(e) => setFormData({
                  ...formData,
                  company: { ...formData.company, name: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Catch Phrase"
                value={formData.company.catchPhrase}
                onChange={(e) => setFormData({
                  ...formData,
                  company: { ...formData.company, catchPhrase: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Street"
                value={formData.address.street}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, street: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Suite"
                value={formData.address.suite}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, suite: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.address.city}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, city: e.target.value }
                })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Zipcode"
                value={formData.address.zipcode}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, zipcode: e.target.value }
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose} disabled={loading.isAnyLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            disabled={!formData.name || !formData.email || !formData.username || loading.isAnyLoading}
            sx={{
              backgroundColor: '#7c3aed',
              '&:hover': {
                backgroundColor: '#6d28d9'
              }
            }}
          >
            {loading.isCreating || loading.isUpdating ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              loading.showCreateModal ? 'Add Customer' : 'Update Customer'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>


    </Box>
  )
}

export default UserManagement 