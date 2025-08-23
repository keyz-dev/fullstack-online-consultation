"use client";

import React, { useState } from "react";
import { UsersProvider, useUsers } from "@/contexts/UsersContext";
import {
  UserStatsSection,
  UserFilters,
  UserListView,
  UserDetailsModal,
  UserContactModal,
} from "@/components/dashboard/admin/users";
import {
  Button,
  Pagination,
  LoadingSpinner,
  EmptyState,
  FadeInContainer,
} from "@/components/ui";
import { User } from "@/api/users";

const AdminUsersContent = () => {
  const { users, loading, error, stats, filters, pagination, actions } =
    useUsers();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Handle user details view
  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  // Handle user contact
  const handleContactUser = (user: User) => {
    setSelectedUser(user);
    setIsContactModalOpen(true);
  };

  // Handle user status update
  const handleUpdateStatus = async (userId: number, isActive: boolean) => {
    try {
      await actions.updateUserStatus(userId, isActive);
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    actions.setFilter(filterType, value);
  };

  // Handle search
  const handleSearch = (searchTerm: string) => {
    actions.setSearch(searchTerm);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
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
            <Button
              onClickHandler={handleRefresh}
              additionalClasses="primarybtn"
              text="Try Again"
            />
          }
        />
      </div>
    );
  }

  return (
    <section>
      {/* User Statistics */}
      <FadeInContainer delay={200} duration={600}>
        <UserStatsSection stats={stats} loading={loading} />
      </FadeInContainer>

      {/* Advanced Search and Filters */}
      <FadeInContainer delay={600} duration={600}>
        <UserFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onRefresh={handleRefresh}
        />
      </FadeInContainer>

      {/* Users List */}
      <FadeInContainer delay={800} duration={600}>
        <div className="mt-6">
          <UserListView
            users={users}
            onViewDetails={handleViewDetails}
            onContactUser={handleContactUser}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </FadeInContainer>

      {/* Pagination */}
      <FadeInContainer delay={1000} duration={600}>
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={handlePageChange}
        />
      </FadeInContainer>

      {/* Modals */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedUser(null);
        }}
      />

      <UserContactModal
        user={selectedUser}
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </section>
  );
};

const AdminUsersPage = () => {
  return (
    <UsersProvider>
      <AdminUsersContent />
    </UsersProvider>
  );
};

export default AdminUsersPage;
