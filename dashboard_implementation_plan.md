# Online Consultation Dashboard Implementation Plan

## 📋 Project Overview

This document outlines the comprehensive implementation plan for the online consultation platform dashboard system, based on analysis of the frontend_reference and backend_reference projects.

## 🏗️ Architecture Analysis

### Frontend Reference (React + Vite)

- **Role-based routing** with centralized configuration
- **Context-driven state management** for each user type
- **Component-based UI** with reusable design system
- **Hook-based data fetching** with loading states and error handling

### Backend Reference (Node.js + Express)

- **RESTful API design** with role-based authorization
- **Analytics-driven endpoints** for dashboard data
- **Modular controller structure** for different features
- **Comprehensive data aggregation** for dashboard metrics

## 🎯 Key Requirements & Modifications

### User Management

- **Combined Users Section**: All users (admin, doctor, patient, pharmacy) in a single section
- **Role-based Filtering**: Admin can filter users by role, status, etc.
- **Unified User Management**: Single interface for managing all user types

### Consultation Features

- **Video Consultations**: Real-time video calling functionality
- **Chat Consultations**: Text-based consultation system
- **Patient Dashboard**: Access to consultation history, book appointments
- **Doctor Dashboard**: Manage consultations, patient interactions

## 📁 File Structure

```
frontend/src/
├── config/
│   └── userRoles.ts                 # Role-based navigation configuration
├── contexts/
│   ├── BaseDashboardContext.tsx     # Core dashboard state management
│   ├── AdminDashboardContext.tsx    # Admin-specific analytics
│   ├── DoctorDashboardContext.tsx   # Doctor-specific data
│   ├── PatientDashboardContext.tsx  # Patient-specific data
│   └── PharmacyDashboardContext.tsx # Pharmacy-specific data
├── hooks/
│   ├── useAdminAnalytics.ts         # Admin analytics with date filtering
│   ├── useDoctorAnalytics.ts        # Doctor analytics (appointments, earnings)
│   ├── usePatientAnalytics.ts       # Patient analytics (health metrics)
│   ├── usePharmacyAnalytics.ts      # Pharmacy analytics (orders, inventory)
│   └── useConsultation.ts           # Consultation management
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx      # Main dashboard layout
│   │   ├── DashboardSidebar.tsx     # Role-based navigation
│   │   └── DashboardHeader.tsx      # Header with search, notifications
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── AdminOverviewStats.tsx
│   │   │   ├── AdminAnalyticsCharts.tsx
│   │   │   ├── AdminUserTable.tsx
│   │   │   └── AdminQuickActions.tsx
│   │   ├── doctor/
│   │   │   ├── DoctorOverviewStats.tsx
│   │   │   ├── DoctorAppointments.tsx
│   │   │   ├── DoctorConsultations.tsx
│   │   │   └── DoctorEarnings.tsx
│   │   ├── patient/
│   │   │   ├── PatientOverviewStats.tsx
│   │   │   ├── PatientAppointments.tsx
│   │   │   ├── PatientConsultations.tsx
│   │   │   └── PatientPrescriptions.tsx
│   │   ├── pharmacy/
│   │   │   ├── PharmacyOverviewStats.tsx
│   │   │   ├── PharmacyOrders.tsx
│   │   │   └── PharmacyInventory.tsx
│   │   └── shared/
│   │       ├── SearchAndFilters.tsx
│   │       ├── Pagination.tsx
│   │       ├── StatusPill.tsx
│   │       └── LoadingStates.tsx
│   └── consultation/
│       ├── VideoCall.tsx            # Video consultation component
│       ├── ChatInterface.tsx        # Chat consultation component
│       ├── ConsultationHistory.tsx  # Consultation records
│       └── AppointmentBooking.tsx   # Appointment scheduling
└── app/(dashboard)/
    ├── admin/
    │   ├── page.tsx                 # Admin overview
    │   ├── users/
    │   │   └── page.tsx             # Combined users management
    │   ├── doctors/
    │   │   └── page.tsx             # Doctor management
    │   ├── patients/
    │   │   └── page.tsx             # Patient management
    │   ├── pharmacies/
    │   │   └── page.tsx             # Pharmacy management
    │   ├── consultations/
    │   │   └── page.tsx             # Consultation monitoring
    │   └── analytics/
    │       └── page.tsx             # Analytics dashboard
    ├── doctor/
    │   ├── page.tsx                 # Doctor overview
    │   ├── appointments/
    │   │   └── page.tsx             # Appointment management
    │   ├── consultations/
    │   │   └── page.tsx             # Active consultations
    │   ├── patients/
    │   │   └── page.tsx             # Patient list
    │   └── schedule/
    │       └── page.tsx             # Schedule management
    ├── patient/
    │   ├── page.tsx                 # Patient overview
    │   ├── appointments/
    │   │   └── page.tsx             # My appointments
    │   ├── consultations/
    │   │   └── page.tsx             # My consultations
    │   └── prescriptions/
    │       └── page.tsx             # Prescription history
    └── pharmacy/
        ├── page.tsx                 # Pharmacy overview
        ├── orders/
        │   └── page.tsx             # Order management
        └── inventory/
            └── page.tsx             # Inventory management
```

## 🔧 Implementation Details

### 1. User Role Configuration

```typescript
// frontend/src/config/userRoles.ts
export const USER_ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  PATIENT: "patient",
  PHARMACY: "pharmacy",
};

export const ROLE_CONFIGS = {
  [USER_ROLES.ADMIN]: {
    basePath: "/admin",
    displayName: "Administrator",
    navItems: [
      { path: "", label: "Overview", icon: "LayoutDashboard" },
      { path: "users", label: "Users", icon: "Users" }, // Combined users section
      { path: "doctors", label: "Doctors", icon: "Stethoscope" },
      { path: "patients", label: "Patients", icon: "User" },
      { path: "pharmacies", label: "Pharmacies", icon: "Building2" },
      { path: "specialties", label: "Specialties", icon: "FolderOpen" },
      { path: "appointments", label: "Appointments", icon: "CalendarCheck" },
      { path: "consultations", label: "Consultations", icon: "MessageSquare" },
      { path: "medications", label: "Medications", icon: "Package" },
      { path: "notifications", label: "Notifications", icon: "Bell" },
      { path: "profile", label: "My Profile", icon: "User" },
      { path: "settings", label: "Settings", icon: "Settings" },
    ],
  },
  [USER_ROLES.DOCTOR]: {
    basePath: "/doctor",
    displayName: "Doctor",
    navItems: [
      { path: "", label: "Overview", icon: "LayoutDashboard" },
      { path: "appointments", label: "Appointments", icon: "CalendarCheck" },
      { path: "consultations", label: "Consultations", icon: "MessageSquare" },
      { path: "video-calls", label: "Video Calls", icon: "Video" },
      { path: "patients", label: "My Patients", icon: "Users" },
      { path: "schedule", label: "Schedule", icon: "Clock" },
      { path: "earnings", label: "Earnings", icon: "DollarSign" },
      { path: "profile", label: "My Profile", icon: "User" },
      { path: "settings", label: "Settings", icon: "Settings" },
    ],
  },
  [USER_ROLES.PATIENT]: {
    basePath: "/patient",
    displayName: "Patient",
    navItems: [
      { path: "", label: "Overview", icon: "LayoutDashboard" },
      { path: "appointments", label: "My Appointments", icon: "CalendarCheck" },
      { path: "consultations", label: "Consultations", icon: "MessageSquare" },
      { path: "video-calls", label: "Video Calls", icon: "Video" },
      { path: "medications", label: "Medications", icon: "Package" },
      { path: "prescriptions", label: "Prescriptions", icon: "FileText" },
      { path: "profile", label: "My Profile", icon: "User" },
      { path: "settings", label: "Settings", icon: "Settings" },
    ],
  },
  [USER_ROLES.PHARMACY]: {
    basePath: "/pharmacy",
    displayName: "Pharmacy",
    navItems: [
      { path: "", label: "Overview", icon: "LayoutDashboard" },
      { path: "orders", label: "Orders", icon: "ShoppingCart" },
      { path: "medications", label: "Medications", icon: "Package" },
      { path: "inventory", label: "Inventory", icon: "Database" },
      { path: "earnings", label: "Earnings", icon: "DollarSign" },
      { path: "profile", label: "My Profile", icon: "User" },
      { path: "settings", label: "Settings", icon: "Settings" },
    ],
  },
};
```

### 2. Dashboard Layout Structure

```typescript
// frontend/src/components/layout/DashboardLayout.tsx
"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useBaseDashboard } from "../../hooks";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

const DashboardLayout = ({ children }) => {
  const {
    user,
    roleConfig,
    updateActiveNavFromPath,
    sidebarCollapsed,
    setSidebarCollapsed,
  } = useBaseDashboard();
  const pathname = usePathname();

  useEffect(() => {
    updateActiveNavFromPath(pathname);
  }, [pathname, updateActiveNavFromPath]);

  if (!user || !roleConfig) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <DashboardHeader />
      <div className="flex-1 flex overflow-hidden relative">
        <DashboardSidebar />

        {/* Mobile Overlay */}
        {!sidebarCollapsed && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        {/* Main Content */}
        <main
          className={`
          flex-1 overflow-y-auto transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "md:ml-0" : "md:ml-0"}
          p-3 overflow-auto h-full w-full [&::-webkit-scrollbar]:hidden
        `}
        >
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
```

### 3. Context Architecture

```typescript
// frontend/src/contexts/BaseDashboardContext.tsx
"use client";

import React, { createContext, useState, useContext } from "react";
import { useAuth } from "../hooks";
import { ROLE_CONFIGS } from "../config/userRoles";

const BaseDashboardContext = createContext();

export const BaseDashboardProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeNavItem, setActiveNavItem] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");

  const roleConfig = ROLE_CONFIGS[user?.role];

  const updateActiveNavFromPath = (currentPath) => {
    if (!roleConfig) return;

    const relativePath = currentPath
      .replace(roleConfig.basePath, "")
      .replace(/^\//, "");
    const navItem = roleConfig.navItems.find(
      (item) => item.path === relativePath
    );

    if (navItem) {
      setActiveNavItem(relativePath);
      setPageTitle(navItem.label);
    }
  };

  const value = {
    user,
    roleConfig,
    pageTitle,
    activeNavItem,
    sidebarCollapsed,
    setPageTitle,
    setActiveNavItem,
    setSidebarCollapsed,
    updateActiveNavFromPath,
  };

  return (
    <BaseDashboardContext.Provider value={value}>
      {children}
    </BaseDashboardContext.Provider>
  );
};

export const useBaseDashboard = () => {
  const context = useContext(BaseDashboardContext);
  if (!context) {
    throw new Error(
      "useBaseDashboard must be used within a BaseDashboardProvider"
    );
  }
  return context;
};
```

### 4. Combined Users Management

```typescript
// frontend/src/app/(dashboard)/admin/users/page.tsx
"use client";

import React, { useState } from "react";
import { useAdminUsers } from "../../../../hooks";
import {
  AdminUserStatSection,
  AdminUserTable,
  AdminViewUserModal,
  AdminEditUserModal,
  AdminDeleteUserModal,
} from "../../../../components/dashboard/admin";
import {
  AdvancedFilters,
  LoadingSpinner,
  EmptyState,
  FadeInContainer,
  Pagination,
} from "../../../../components/ui";

const AdminUsersPage = () => {
  const {
    filteredUsers: users,
    loading,
    error,
    stats,
    pagination,
    filters,
    updateUser,
    deleteUser,
    toggleUserStatus,
    verifyUser,
    actions,
  } = useAdminUsers();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Handle user view
  const handleView = (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  // Handle user edit
  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  // Handle user delete
  const handleDelete = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async (userId) => {
    setDeleteLoading(true);
    const success = await deleteUser(userId);
    setDeleteLoading(false);

    if (success) {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  // Handle user status toggle
  const handleToggleStatus = async (userId) => {
    await toggleUserStatus(userId);
  };

  // Handle user verification
  const handleVerifyUser = async (userId) => {
    await verifyUser(userId);
  };

  // Handle user update
  const handleUpdateUser = async (userId, userData) => {
    await updateUser(userId, userData);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    actions.setFilter(filterType, value);
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    actions.setSearch(searchTerm);
  };

  // Handle searching state change
  const handleSearchingChange = (searching) => {
    setIsSearching(searching);
  };

  // Handle page change
  const handlePageChange = (page) => {
    actions.setPage(page);
  };

  // Refresh users
  const handleRefresh = () => {
    actions.refreshUsers();
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          title="Failed to Load Users"
          description={error}
          action={
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
            >
              Try Again
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="lg:px-3">
      {/* User Statistics */}
      <FadeInContainer delay={200} duration={600}>
        <AdminUserStatSection stats={stats} loading={loading} />
      </FadeInContainer>

      {/* Advanced Search and Filters */}
      <FadeInContainer delay={400} duration={600}>
        <AdvancedFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClearAll={actions.clearAllFilters}
          onSearchingChange={handleSearchingChange}
          refreshApplications={handleRefresh}
          filterConfigs={[
            {
              key: "role",
              label: "Role",
              defaultValue: "all",
              colorClass: "bg-blue-100 text-blue-800",
              options: [
                { value: "all", label: "All Roles" },
                { value: "admin", label: "Admin" },
                { value: "doctor", label: "Doctor" },
                { value: "patient", label: "Patient" },
                { value: "pharmacy", label: "Pharmacy" },
              ],
            },
            {
              key: "status",
              label: "Status",
              defaultValue: "all",
              colorClass: "bg-green-100 text-green-800",
              options: [
                { value: "all", label: "All Statuses" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "verified", label: "Verified" },
                { value: "unverified", label: "Unverified" },
              ],
            },
            {
              key: "sortBy",
              label: "Sort By",
              defaultValue: "createdAt",
              colorClass: "bg-purple-100 text-purple-800",
              options: [
                { value: "createdAt", label: "Date Created" },
                { value: "name", label: "Name" },
                { value: "email", label: "Email" },
                { value: "lastLogin", label: "Last Login" },
              ],
            },
          ]}
          searchPlaceholder="Search users by name, email, or phone..."
          loading={loading}
        />
      </FadeInContainer>

      {/* Users Table */}
      <FadeInContainer delay={600} duration={600}>
        <div className="mt-6">
          <AdminUserTable
            users={users}
            loading={loading || isSearching}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onVerify={handleVerifyUser}
          />
        </div>
      </FadeInContainer>

      {/* Pagination */}
      <FadeInContainer delay={800} duration={600}>
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={handlePageChange}
        />
      </FadeInContainer>

      {/* Modals */}
      <AdminViewUserModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        user={selectedUser}
      />

      <AdminEditUserModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={handleUpdateUser}
      />

      <AdminDeleteUserModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        user={userToDelete}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminUsersPage;
```

### 5. Consultation Components

```typescript
// frontend/src/components/consultation/VideoCall.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useConsultation } from "../../hooks";

const VideoCall = ({ consultationId, onEndCall }) => {
  const { startVideoCall, endVideoCall, localStream, remoteStream } =
    useConsultation();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleStartCall = async () => {
    setIsConnecting(true);
    try {
      await startVideoCall(consultationId);
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to start video call:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleEndCall = async () => {
    try {
      await endVideoCall(consultationId);
      onEndCall();
    } catch (error) {
      console.error("Failed to end video call:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Video Consultation</h2>
        <div className="flex gap-2">
          {!isConnected && (
            <button
              onClick={handleStartCall}
              disabled={isConnecting}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isConnecting ? "Connecting..." : "Start Call"}
            </button>
          )}
          {isConnected && (
            <button
              onClick={handleEndCall}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              End Call
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Local Video */}
        <div className="relative">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-64 bg-gray-900 rounded-lg"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            You
          </div>
        </div>

        {/* Remote Video */}
        <div className="relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-64 bg-gray-900 rounded-lg"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            Patient/Doctor
          </div>
        </div>
      </div>

      {isConnecting && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Connecting to video call...</p>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
```

```typescript
// frontend/src/components/consultation/ChatInterface.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useConsultation } from "../../hooks";
import { Send, Paperclip } from "lucide-react";

const ChatInterface = ({ consultationId }) => {
  const { messages, sendMessage, isTyping } = useConsultation();
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(consultationId, newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg h-96 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Chat Consultation</h3>
        {isTyping && <p className="text-sm text-gray-500">Typing...</p>}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.isFromMe ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isFromMe
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSending}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
```

## 🚀 Implementation Strategy

### Phase 1: Core Infrastructure (Week 1)

1. **User Role Configuration** - Set up role-based navigation
2. **Dashboard Layout** - Create responsive layout with sidebar/header
3. **Base Context** - Implement role-based state management
4. **Routing Structure** - Set up Next.js routing for all user types

### Phase 2: Admin Dashboard (Week 2)

1. **Admin Overview Page** - Statistics cards and charts
2. **Combined Users Management** - Single interface for all user types
3. **Admin Analytics Context** - Data fetching and state management
4. **Search & Filtering** - Reusable components for data management

### Phase 3: Consultation Features (Week 3)

1. **Video Call Component** - WebRTC integration
2. **Chat Interface** - Real-time messaging
3. **Consultation Management** - Booking, scheduling, history
4. **Doctor/Patient Dashboards** - Consultation-specific features

### Phase 4: Other User Dashboards (Week 4)

1. **Doctor Dashboard** - Appointments, patients, earnings
2. **Patient Dashboard** - Health metrics, appointments, prescriptions
3. **Pharmacy Dashboard** - Orders, inventory, earnings

### Phase 5: Advanced Features (Week 5)

1. **Real-time Updates** - WebSocket integration for live data
2. **Advanced Analytics** - Detailed charts and insights
3. **Export Functionality** - PDF/Excel exports for reports
4. **Mobile Optimization** - Enhanced mobile experience

## 🎯 Key Patterns to Implement

### 1. Search & Filtering Pattern

- **Debounced search** with loading states
- **Advanced filters** with clear all functionality
- **URL state management** for bookmarkable filters

### 2. Data Management Pattern

- **Context-based state** for each user type
- **Loading states** (full page, partial, skeleton)
- **Error boundaries** with retry functionality
- **Optimistic updates** for better UX

### 3. Analytics Pattern

- **Date range filtering** (7d, 30d, 90d, custom)
- **Chart components** with responsive design
- **Real-time data updates** where applicable

### 4. Consultation Pattern

- **WebRTC integration** for video calls
- **Real-time messaging** for chat consultations
- **Appointment scheduling** with availability checking
- **Consultation history** with search and filtering

### 5. Table Pattern

- **Sortable columns** with visual indicators
- **Bulk actions** for admin operations
- **Row selection** with action buttons
- **Responsive design** for mobile

## 🔧 Backend API Structure

```javascript
// backend/src/routes/adminAnalytics.js
const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const adminAnalyticsController = require("../controller/adminAnalytics");

const router = express.Router();

router.use(authenticateUser);
router.use(authorizeRoles(["admin"]));

router.get("/overview", adminAnalyticsController.getAdminOverview);
router.get("/users", adminAnalyticsController.getUserAnalytics);
router.get("/consultations", adminAnalyticsController.getConsultationAnalytics);
router.get("/revenue", adminAnalyticsController.getRevenueAnalytics);
router.get("/activity", adminAnalyticsController.getActivityTimeline);

module.exports = router;
```

```javascript
// backend/src/routes/consultation.js
const express = require("express");
const { authenticateUser } = require("../middleware/auth");
const consultationController = require("../controller/consultation");

const router = express.Router();

router.use(authenticateUser);

// Consultation management
router.post("/", consultationController.createConsultation);
router.get("/", consultationController.getConsultations);
router.get("/:id", consultationController.getConsultation);
router.put("/:id", consultationController.updateConsultation);
router.delete("/:id", consultationController.deleteConsultation);

// Video call signaling
router.post("/:id/join", consultationController.joinVideoCall);
router.post("/:id/leave", consultationController.leaveVideoCall);
router.post("/:id/signal", consultationController.handleSignal);

// Chat messages
router.post("/:id/messages", consultationController.sendMessage);
router.get("/:id/messages", consultationController.getMessages);

module.exports = router;
```

## 📊 Analytics Requirements

### Admin Analytics

- **User Growth** - Registration trends by role
- **Consultation Metrics** - Video vs chat usage
- **Revenue Analytics** - Earnings by doctor/pharmacy
- **System Health** - Platform usage statistics

### Doctor Analytics

- **Appointment Statistics** - Bookings, cancellations, completions
- **Patient Metrics** - Patient count, consultation history
- **Earnings Analysis** - Revenue trends, payment status
- **Schedule Optimization** - Availability patterns

### Patient Analytics

- **Health Metrics** - Consultation frequency, prescription history
- **Appointment Tracking** - Upcoming, completed, cancelled
- **Medication Compliance** - Prescription adherence
- **Cost Analysis** - Consultation and medication expenses

### Pharmacy Analytics

- **Order Management** - Order volume, fulfillment rates
- **Inventory Analytics** - Stock levels, reorder points
- **Revenue Tracking** - Sales trends, profit margins
- **Customer Metrics** - Patient satisfaction, repeat orders

## 🎨 Design System

### Color Palette

- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray (#6B7280)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Info**: Indigo (#6366F1)

### Typography

- **Headings**: Inter, font-weight: 600-700
- **Body**: Inter, font-weight: 400-500
- **Monospace**: JetBrains Mono (for code/data)

### Components

- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Consistent padding, hover states
- **Forms**: Clean inputs with focus states
- **Tables**: Striped rows, hover effects

## 🔒 Security Considerations

### Authentication & Authorization

- **JWT tokens** for session management
- **Role-based access control** (RBAC)
- **Route protection** for sensitive pages
- **API endpoint security** with middleware

### Data Protection

- **Input validation** on all forms
- **SQL injection prevention** with parameterized queries
- **XSS protection** with proper escaping
- **CSRF protection** for form submissions

### Consultation Security

- **End-to-end encryption** for video calls
- **Secure WebRTC** implementation
- **Message encryption** for chat
- **Access control** for consultation records

## 📱 Mobile Responsiveness

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations

- **Collapsible sidebar** for navigation
- **Touch-friendly** buttons and inputs
- **Responsive tables** with horizontal scroll
- **Optimized charts** for small screens

## 🧪 Testing Strategy

### Unit Testing

- **Component testing** with React Testing Library
- **Hook testing** for custom hooks
- **Utility function testing**
- **API endpoint testing**

### Integration Testing

- **User flow testing** for complete workflows
- **API integration testing**
- **Database interaction testing**
- **Authentication flow testing**

### E2E Testing

- **Critical user journeys**
- **Cross-browser testing**
- **Mobile device testing**
- **Performance testing**

## 📈 Performance Optimization

### Frontend

- **Code splitting** for route-based loading
- **Lazy loading** for heavy components
- **Image optimization** with Next.js Image
- **Bundle analysis** and optimization

### Backend

- **Database indexing** for query optimization
- **Caching strategy** for frequently accessed data
- **API response optimization**
- **Connection pooling** for database

### Real-time Features

- **WebSocket optimization** for video/chat
- **Message queuing** for high-traffic scenarios
- **Load balancing** for multiple servers
- **CDN integration** for static assets

## 🚀 Deployment Strategy

### Development

- **Local development** with hot reloading
- **Environment variables** for configuration
- **Database migrations** for schema changes
- **API documentation** with Swagger

### Staging

- **Staging environment** for testing
- **Automated testing** on deployment
- **Performance monitoring**
- **Security scanning**

### Production

- **Blue-green deployment** for zero downtime
- **Health checks** for service monitoring
- **Log aggregation** and monitoring
- **Backup strategy** for data protection

---

## 📝 Next Steps

1. **Review and approve** this implementation plan
2. **Set up development environment** with required tools
3. **Create project structure** following the outlined architecture
4. **Implement Phase 1** (Core Infrastructure)
5. **Begin Phase 2** (Admin Dashboard)
6. **Continue with subsequent phases** as outlined

This plan provides a comprehensive roadmap for implementing a robust, scalable, and user-friendly dashboard system for the online consultation platform.
