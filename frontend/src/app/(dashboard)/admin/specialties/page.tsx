"use client";

import React, { useState } from "react";
import { useSpecialty } from "@/contexts/SpecialtyContext";
import {
  SpecialtyStatSection,
  SpecialtyListView,
  AddSpecialtyModal,
  UpdateSpecialtyModal,
} from "@/components/dashboard/admin/specialties";
import {
  Button,
  AdvancedFilters,
  Pagination,
  LoadingSpinner,
  EmptyState,
  FadeInContainer,
  DeleteModal,
} from "@/components/ui";
import {
  Specialty,
  UpdateSpecialtyRequest,
  CreateSpecialtyRequest,
} from "@/api/specialties";

const AdminSpecialtiesPage = () => {
  const {
    filteredSpecialties: specialties,
    loading,
    error,
    stats,
    filters,
    pagination,
    actions,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
  } = useSpecialty();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(
    null
  );
  const [specialtyToDelete, setSpecialtyToDelete] = useState<Specialty | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle specialty edit
  const handleSpecialtyEdit = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setIsEditModalOpen(true);
  };

  // Handle specialty delete
  const handleSpecialtyDelete = (specialty: Specialty) => {
    setSpecialtyToDelete(specialty);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!specialtyToDelete) return;

    setDeleteLoading(true);
    try {
      await deleteSpecialty(specialtyToDelete.id);
      setIsDeleteModalOpen(false);
      setSpecialtyToDelete(null);
    } catch (error) {
      console.error("Failed to delete specialty:", error);
    } finally {
      setDeleteLoading(false);
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

  // Refresh specialties
  const handleRefresh = () => {
    actions.refreshSpecialties();
  };

  if (loading && specialties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && specialties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          title="Failed to Load Specialties"
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
      {/* Specialty Statistics */}
      <FadeInContainer delay={200} duration={600}>
        <SpecialtyStatSection stats={stats} loading={loading} />
      </FadeInContainer>

      {/* Add Specialty Button */}
      <FadeInContainer delay={400} duration={600}>
        <div className="flex justify-end items-center my-3">
          <Button
            onClickHandler={() => setIsAddModalOpen(true)}
            additionalClasses="primarybtn"
            text="Add Specialty"
          />
        </div>
      </FadeInContainer>

      {/* Advanced Search and Filters */}
      <FadeInContainer delay={600} duration={600}>
        <AdvancedFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClearAll={() => {
            actions.setFilter("status", "all");
            actions.setFilter("sortBy", "name");
            actions.setSearch("");
          }}
          refreshFunction={handleRefresh}
          filterConfigs={[
            {
              key: "status",
              label: "Status",
              defaultValue: "all",
              colorClass:
                "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
              options: [
                { value: "all", label: "All Statuses" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ],
            },
            {
              key: "sortBy",
              label: "Sort By",
              defaultValue: "name",
              colorClass:
                "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
              options: [
                { value: "name", label: "Name" },
                { value: "createdAt", label: "Date Created" },
                { value: "updatedAt", label: "Last Updated" },
              ],
            },
          ]}
          searchPlaceholder="Search specialties by name or description..."
          loading={loading}
        />
      </FadeInContainer>

      {/* Specialties List */}
      <FadeInContainer delay={800} duration={600}>
        <div className="mt-6">
          <SpecialtyListView
            specialties={specialties}
            loading={loading}
            onEdit={handleSpecialtyEdit}
            onDelete={handleSpecialtyDelete}
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
      <AddSpecialtyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (data: CreateSpecialtyRequest) => {
          try {
            await createSpecialty(data);
            return true;
          } catch (error) {
            return false;
          }
        }}
        loading={loading}
      />

      <UpdateSpecialtyModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSpecialty(null);
        }}
        onSubmit={async (id: number, data: UpdateSpecialtyRequest) => {
          try {
            await updateSpecialty(id, data);
            return true;
          } catch (error) {
            return false;
          }
        }}
        specialty={selectedSpecialty}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSpecialtyToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Specialty"
        message="Are you sure you want to delete"
        itemName={specialtyToDelete?.name}
        loading={deleteLoading}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </section>
  );
};

export default AdminSpecialtiesPage;
