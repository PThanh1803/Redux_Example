import React from 'react'
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material'
import UserManagement from './components/UserManagement'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar position="static" className="mb-8">
        <Toolbar>
          <Typography variant="h6" className="flex-grow">
            User Management System
          </Typography>
        </Toolbar>
      </AppBar>
      
      <UserManagement />
    </div>
  )
}

export default App
