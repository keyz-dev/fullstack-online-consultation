"use client";

import React, { useState } from "react";
import { useSymptom } from "@/contexts/SymptomContext";
import { useSpecialty } from "@/contexts/SpecialtyContext";
import {
  SymptomStatSection,
  SymptomListView,
  AddSymptomModal,
  UpdateSymptomModal,
} from "@/components/dashboard/admin/symptoms";
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
  Symptom,
  UpdateSymptomRequest,
  CreateSymptomRequest,
} from "@/api/symptoms";

const AdminSymptomsPage = () => {
  const {
    filteredSymptoms: symptoms,
    loading,
    error,
    stats,
    filters,
    pagination,
    actions,
    createSymptom,
    updateSymptom,
    deleteSymptom,
  } = useSymptom();

  const { specialties } = useSpecialty();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [symptomToDelete, setSymptomToDelete] = useState<Symptom | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle symptom edit
  const handleSymptomEdit = (symptom: Symptom) => {
    setSelectedSymptom(symptom);
    setIsEditModalOpen(true);
  };

  // Handle symptom delete
  const handleSymptomDelete = (symptom: Symptom) => {
    setSymptomToDelete(symptom);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!symptomToDelete) return;

    setDeleteLoading(true);
    try {
      await deleteSymptom(symptomToDelete.id);
      setIsDeleteModalOpen(false);
      setSymptomToDelete(null);
    } catch (error) {
      console.error("Failed to delete symptom:", error);
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

  // Refresh symptoms
  const handleRefresh = () => {
    actions.refreshSymptoms();
  };

  if (loading && symptoms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && symptoms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          title="Failed to Load Symptoms"
          description={error}
          action={
            <Button onClick={handleRefresh} variant="primary">
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <section>
      {/* Symptom Statistics */}
      <FadeInContainer delay={200} duration={600}>
        <SymptomStatSection stats={stats} loading={loading} />
      </FadeInContainer>

      {/* Add Symptom Button */}
      <FadeInContainer delay={400} duration={600}>
        <div className="flex justify-end items-center my-3">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            additionalClasses="primarybtn"
          >
            Add Symptom
          </Button>
        </div>
      </FadeInContainer>

      {/* Advanced Search and Filters */}
      <FadeInContainer delay={600} duration={600}>
        <AdvancedFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClearAll={() => {
            actions.setFilter("specialtyId", "all");
            actions.setFilter("sortBy", "name");
            actions.setSearch("");
          }}
          refreshFunction={handleRefresh}
          filterConfigs={[
            {
              key: "specialtyId",
              label: "Specialty",
              defaultValue: "all",
              colorClass:
                "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
              options: [
                { value: "all", label: "All Specialties" },
                ...specialties.map((specialty) => ({
                  value: specialty.id.toString(),
                  label: specialty.name,
                })),
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
          searchPlaceholder="Search symptoms by name..."
          loading={loading}
        />
      </FadeInContainer>

      {/* Symptoms List */}
      <FadeInContainer delay={800} duration={600}>
        <div className="mt-6">
          <SymptomListView
            symptoms={symptoms}
            loading={loading}
            onEdit={handleSymptomEdit}
            onDelete={handleSymptomDelete}
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
      <AddSymptomModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (data: CreateSymptomRequest) => {
          try {
            await createSymptom(data);
            return true;
          } catch (error) {
            return false;
          }
        }}
        loading={loading}
        specialties={specialties}
      />

      <UpdateSymptomModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSymptom(null);
        }}
        onSubmit={async (id: number, data: UpdateSymptomRequest) => {
          try {
            await updateSymptom(id, data);
            return true;
          } catch (error) {
            return false;
          }
        }}
        symptom={selectedSymptom}
        loading={loading}
        specialties={specialties}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSymptomToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Symptom"
        message="Are you sure you want to delete"
        itemName={symptomToDelete?.name}
        loading={deleteLoading}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </section>
  );
};

export default AdminSymptomsPage;
