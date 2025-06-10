// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TenantsPage from './pages/TenantsPage';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import PermissionsPage from './pages/PermissionsPage';
import LoginPage from './pages/LoginPage';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { usePermissions } from './hooks/usePermissions';

function App() {
    const { hasPermission } = usePermissions();
  

  return (
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <HomePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tenants"
            element={
              <ProtectedRoute>
                <MainLayout>
                   {hasPermission('Access Tenant') && <TenantsPage />}
                   {!hasPermission('Access Tenant') && <p>You do not have access.</p>}
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="access-control/users"
            element={
              <ProtectedRoute>
                <MainLayout>
                   {hasPermission('Access Users') && <UsersPage />}
                   {!hasPermission('Access Users') && <p>You do not have access.</p>}
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Access Control Routes */}
          <Route
            path="/access-control/roles"
            element={
              <ProtectedRoute>
                <MainLayout>
                   {hasPermission('Access Roles') && <RolesPage />}
                   {!hasPermission('Access Roles') && <p>You do not have access.</p>}
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/access-control/permissions"
            element={
              <ProtectedRoute>
                <MainLayout>
                  {hasPermission('Access Permissions') && <PermissionsPage />}
                   {!hasPermission('Access Permissions') && <p>You do not have access.</p>}
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/access-control"
            element={<Navigate to="/access-control/roles" replace />}
          />
        </Routes>
  );
}

export default App;
