import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Container, Box } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import theme from './theme';
import AuthRoute from './components/auth/AuthRoute';
import Navbar from './components/layout/Navbar';
import { ROLES } from './utils/roles';

// Auth Components
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ResetPassword from './components/auth/ResetPassword';
import Profile from './components/profile/Profile';

// Question Components
import QuestionForm from './components/questions/QuestionForm';
import QuestionList from './components/questions/QuestionList';
import QuestionDetail from './components/questions/QuestionDetail';

// Tag and User Components
import TagList from './components/tags/TagList';
import UserList from './components/users/UserList';
import UserProfile from './components/users/UserProfile';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import ReportsManagement from './components/admin/ReportsManagement';

// Create a separate component for the authenticated content
function AuthenticatedApp() {
  const { currentUser } = useAuth();

  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }}>
      {currentUser && <Navbar />}
      
      <Container 
        maxW="container.xl" 
        py={8}
        px={{ base: 4, md: 8 }}
        className="fade-in"
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              currentUser ? (
                <QuestionList />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* User Routes */}
          <Route 
            path="/ask" 
            element={
              <AuthRoute requiredPermission="canCreateContent">
                <QuestionForm />
              </AuthRoute>
            } 
          />

          <Route 
            path="/question/:id" 
            element={
              <AuthRoute>
                <QuestionDetail />
              </AuthRoute>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <AuthRoute>
                <Profile />
              </AuthRoute>
            } 
          />

          {/* Moderator Routes */}
          <Route 
            path="/moderation" 
            element={
              <AuthRoute requiredRole={ROLES.MODERATOR}>
                <ReportsManagement />
              </AuthRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <AuthRoute 
                requiredRole={ROLES.ADMIN}
                requiredPermission="canAccessAdminPanel"
              >
                <AdminDashboard />
              </AuthRoute>
            } 
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Box>
  );
}

// Main App component
function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <AuthProvider>
          <AuthenticatedApp />
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
