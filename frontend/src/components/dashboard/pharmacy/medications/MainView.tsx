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
} from "@/components/ui";
import { AddMedicationModal, CardSection } from "./";
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
  }, [fetchMedicationStats]);

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

  const handleDeleteMedication = (medicationId: number) => {
    if (window.confirm("Are you sure you want to delete this medication?")) {
      deleteMedication(medicationId);
    }
  };

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Generic Name", accessor: "genericName" },
    { Header: "Category", accessor: "category" },
    { Header: "Price", accessor: "price", Cell: ({ row }: any) => `$${row.price}` },
    { Header: "Stock", accessor: "stockQuantity" },
    {
      Header: "Status",
      accessor: "isAvailable",
      Cell: ({ row }: any) => (
        <StatusPill status={row.isAvailable ? "available" : "unavailable"} />
      ),
    },
    {
      Header: "Prescription",
      accessor: "requiresPrescription",
      Cell: ({ row }: any) => (
        <StatusPill status={row.requiresPrescription ? "required" : "not_required"} />
      ),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }: any) => {
        const items = [
          {
            label: "View Details",
            icon: <Eye size={16} />,
            onClick: () => console.log("View medication", row.id),
          },
          {
            label: "Edit Medication",
            icon: <Edit size={16} />,
            onClick: () => console.log("Edit medication", row.id),
          },
          {
            label: "Delete Medication",
            icon: <Trash2 size={16} />,
            onClick: () => handleDeleteMedication(row.id),
            isDestructive: true,
          },
        ];
        return <DropdownMenu items={items} />;
      },
    },
  ];

  return (
    <section>
      {/* Medication stats */}
      <CardSection medicationStats={medicationStats} loading={loading} />

      {/* Add medication button */}
      <div className="flex flex-wrap items-center justify-end gap-4 my-4">
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
        <Table columns={columns} data={medications} />
        <div className="p-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              onClickHandler={() => fetchMedications(pagination.currentPage - 1)}
              isDisabled={pagination.currentPage <= 1 || loading}
              text="Previous"
            />
            <Button
              onClickHandler={() => fetchMedications(pagination.currentPage + 1)}
              isDisabled={pagination.currentPage >= pagination.totalPages || loading}
              text="Next"
            />
          </div>
        </div>
      </section>

      {isModalOpen && (
        <AddMedicationModal
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
};

export default MainView;
