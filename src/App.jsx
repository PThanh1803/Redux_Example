import React from 'react'
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material'
import UserManagement from './pages/UserManagement'
import { Routes, Route, Link } from 'react-router-dom'
import { Button } from '@mui/material'
import RegisterForm from './pages/RegisterForm'
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar position="static" className="mb-8">
        <Toolbar>
          <Typography variant="h6" className="flex-grow">
            User Management System
          </Typography>
          <Button color="inherit" component={Link} to="/user-management">
            User Management
          </Button>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<RegisterForm />} />
        <Route path="/user-management" element={<UserManagement />} />
      </Routes>
    </div>
  )
}

export default App
