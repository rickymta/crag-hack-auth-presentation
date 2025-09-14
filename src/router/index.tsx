import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../components';
import { ProtectedRoute } from './ProtectedRoute';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Dashboard Pages
import { DashboardPage } from '../pages/dashboard/DashboardPage';

// User Pages
const UsersPage = React.lazy(() => import('../pages/users/UsersPage'));

// Profile Pages
const UserProfilePage = React.lazy(() => import('../components/profile/UserProfilePage'));

// Lazy load other pages for better performance
const RolesPage = React.lazy(() => import('../pages/roles/RolesPage'));

const PermissionsPage = React.lazy(() => import('../pages/permissions/PermissionsPage'));
const PermissionCreatePage = React.lazy(() => import('../pages/permissions/PermissionCreatePage'));
const PermissionEditPage = React.lazy(() => import('../pages/permissions/PermissionEditPage'));

const AnalyticsPage = React.lazy(() => import('../pages/analytics/AnalyticsPage'));
const NotificationsPage = React.lazy(() => import('../pages/notifications/NotificationsPage'));
const SettingsPage = React.lazy(() => import('../pages/settings/SettingsPage'));
const HelpPage = React.lazy(() => import('../pages/help/HelpPage'));

// Error Pages
const NotFoundPage = React.lazy(() => import('../pages/errors/NotFoundPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/auth',
    children: [
      {
        path: '',
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: 'login',
        element: (
          <ProtectedRoute requireAuth={false}>
            <LoginPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <ProtectedRoute requireAuth={false}>
            <RegisterPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <DashboardPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <UsersPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <UserProfilePage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/roles',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <RolesPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/permissions',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <PermissionsPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/permissions/create',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <PermissionCreatePage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/permissions/:id/edit',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <PermissionEditPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/analytics',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <AnalyticsPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <NotificationsPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <SettingsPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/help',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <HelpPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <NotFoundPage />
      </React.Suspense>
    ),
  },
]);
