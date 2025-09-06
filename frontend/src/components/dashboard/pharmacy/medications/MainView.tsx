"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { usePharmacyMedications } from "@/hooks/usePharmacyMedications";

// Import reusable UI components
import {
  Button,
  Table,
  StatusPill,
  DropdownMenu,
  AdvancedFilters,
  DeleteModal,
} from "@/components/ui";
import { AddMedicationModal, UpdateMedicationModal, CardSection } from "./";
import { Trash2, Eye, Edit, Plus } from "lucide-react";

const MainView = ({ setView }: { setView: () => void }) => {
  const {
    medications,
    medicationStats,
    pagination,
    loading,
    fetchMedications,
    fetchMedicationStats,
    deleteMedication,
  } = usePharmacyMedications();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [medicationToDelete, setMedicationToDelete] = useState<any>(null);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    isAvailable: "all",
    requiresPrescription: "all",
  });

  useEffect(() => {
    fetchMedicationStats();
    fetchMedications(1); // Load initial medications list
  }, [fetchMedicationStats, fetchMedications]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAddOptions(false);
      }
    };

    if (showAddOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddOptions]);

  useEffect(() => {
    const filterParams = {
      search: filters.search || undefined,
      category: filters.category !== "all" ? filters.category : undefined,
      isAvailable: filters.isAvailable !== "all" ? filters.isAvailable === "true" : undefined,
      requiresPrescription: filters.requiresPrescription !== "all" ? filters.requiresPrescription === "true" : undefined,
    };
    fetchMedications(pagination.currentPage, filterParams);
  }, [
    filters.search,
    filters.category,
    filters.isAvailable,
    filters.requiresPrescription,
    pagination.currentPage,
  ]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (searchValue: string) => {
    setFilters((prev) => ({ ...prev, search: searchValue }));
  };

  const handleClearAll = () => {
    setFilters({
      search: "",
      category: "all",
      isAvailable: "all",
      requiresPrescription: "all",
    });
  };

  const handleAddMedication = (type: string) => {
    setShowAddOptions(false);
    if (type === "single") {
      setIsModalOpen(true);
    } else if (type === "bulk") {
      setView();
    }
  };

  const handleDeleteMedication = (medication: unknown) => {
    setMedicationToDelete(medication);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (medicationToDelete) {
      const result = await deleteMedication(medicationToDelete.id);
      if (result.success) {
        setIsDeleteModalOpen(false);
        setMedicationToDelete(null);
      }
    }
  };

  const handleEditMedication = (medication: unknown) => {
    setSelectedMedication(medication);
    setIsUpdateModalOpen(true);
  };

  const columns = [
    { 
      Header: "Name", 
      accessor: "name",
      Cell: ({ row }: unknown) => (
        <div className="flex items-center space-x-3">
          {row.imageUrl ? (
            <img 
              src={row.imageUrl} 
              alt={row.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xs">No Image</span>
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            {row.genericName && (
              <div className="text-sm text-gray-500">{row.genericName}</div>
            )}
          </div>
        </div>
      )
    },
    { Header: "Category", accessor: "category" },
    { Header: "Price", accessor: "price", Cell: ({ row }: unknown) => `${row.price} XAF` },
    { Header: "Stock", accessor: "stockQuantity" },
    {
      Header: "Status",
      accessor: "isAvailable",
      Cell: ({ row }: unknown) => (
        <StatusPill status={row.isAvailable ? "available" : "unavailable"} />
      ),
    },
    {
      Header: "Prescription",
      accessor: "requiresPrescription",
      Cell: ({ row }: unknown) => (
        <StatusPill status={row.requiresPrescription ? "required" : "not_required"} />
      ),
    },
    {
      accessor: "actions",
      Cell: ({ row }: unknown) => {
        const items = [
          {
            label: "View Details",
            icon: <Eye size={16} />,
            onClick: () => console.log("View medication", row.id),
          },
          {
            label: "Edit",
            icon: <Edit size={16} />,
            onClick: () => handleEditMedication(row),
          },
          {
            label: "Delete",
            icon: <Trash2 size={16} />,
            onClick: () => handleDeleteMedication(row),
            isDestructive: true,
          },
        ];
        return <DropdownMenu items={items} />;
      },
    },
  ];

  // Debug: Log medications state
  console.log("MainView - medications:", medications);
  console.log("MainView - loading:", loading);
  console.log("MainView - pagination:", pagination);

  return (
    <section>
      {/* Medication stats */}
      <CardSection medicationStats={medicationStats} loading={loading} />

      {/* Add medication button */}
      <div className="flex flex-wrap items-center justify-between gap-4 my-4">
        <Button
          onClickHandler={() => {
            console.log("Manual refresh triggered");
            fetchMedications(1);
            fetchMedicationStats();
          }}
          additionalClasses="text-blue-600 border-blue-600 hover:bg-blue-50"
          text="Refresh"
        />
        
        <div className="relative" ref={dropdownRef}>
          <Button
            onClickHandler={() => setShowAddOptions(!showAddOptions)}
            additionalClasses="primarybtn bg-accent text-white"
            leadingIcon={<Plus size={16} />}
            text="Add New Medication"
          />
          {showAddOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <button
                onClick={() => handleAddMedication("single")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Single Insert
              </button>
              <button
                onClick={setView}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Bulk Import
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search and filter */}
      <AdvancedFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onClearAll={handleClearAll}
        searchPlaceholder="Search medications..."
        filterConfigs={[
          {
            key: "category",
            label: "Category",
            options: [
              { value: "all", label: "All Categories" },
              { value: "antibiotic", label: "Antibiotic" },
              { value: "painkiller", label: "Painkiller" },
              { value: "vitamin", label: "Vitamin" },
              { value: "supplement", label: "Supplement" },
            ],
            defaultValue: "all",
          },
          {
            key: "isAvailable",
            label: "Availability",
            options: [
              { value: "all", label: "All" },
              { value: "true", label: "Available" },
              { value: "false", label: "Unavailable" },
            ],
            defaultValue: "all",
          },
          {
            key: "requiresPrescription",
            label: "Prescription",
            options: [
              { value: "all", label: "All" },
              { value: "true", label: "Required" },
              { value: "false", label: "Not Required" },
            ],
            defaultValue: "all",
          },
        ]}
        loading={loading}
      />

      {/* Medication table */}
      <section>
        {medications.length === 0 && !loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No medications found. Add your first medication to get started!</p>
          </div>
        ) : (
          <Table columns={columns} data={medications} />
        )}
        {/* Pagination - Only show if there are multiple pages */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems
              )}{" "}
              of {pagination.totalItems} medications
            </p>
            <div className="flex space-x-2">
              <Button
                onClickHandler={() => fetchMedications(pagination.currentPage - 1)}
                isDisabled={pagination.currentPage <= 1 || loading}
                additionalClasses="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                text="Previous"
              />
              <Button
                onClickHandler={() => fetchMedications(pagination.currentPage + 1)}
                isDisabled={pagination.currentPage >= pagination.totalPages || loading}
                additionalClasses="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                text="Next"
              />
            </div>
          </div>
        )}
      </section>

      {isModalOpen && (
        <AddMedicationModal
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isUpdateModalOpen && (
        <UpdateMedicationModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedMedication(null);
          }}
          medication={selectedMedication}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setMedicationToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Medication"
          message="Are you sure you want to delete this medication?"
          itemName={medicationToDelete?.name}
          loading={loading}
          confirmText="Delete Medication"
          cancelText="Cancel"
        />
      )}
    </section>
  );
};

export default MainView;
