"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { consultationsAPI, ConsultationFilters } from "@/api/consultations";
import { Consultation } from "@/types";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import {
  Button,
  Input,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
} from "@/components/ui";

import {
  Calendar,
  Clock,
  User,
  Video,
  Phone,
  MessageSquare,
  MapPin,
  MoreHorizontal,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

interface AppointmentListProps {
  title?: string;
  showFilters?: boolean;
  showActions?: boolean;
  maxItems?: number;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  title = "Appointments",
  showFilters = true,
  showActions = true,
  maxItems,
}) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ConsultationFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Load appointments
  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await consultationsAPI.getConsultations({
        page: pagination.currentPage,
        limit: maxItems || pagination.itemsPerPage,
        filters: {
          ...filters,
          search: searchQuery || undefined,
        },
      });
      setAppointments(response.consultations);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [pagination.currentPage, filters, searchQuery]);

  // Handle appointment actions
  const handleAction = async (action: string, appointmentId: string) => {
    try {
      switch (action) {
        case "start":
          await consultationsAPI.startConsultation(appointmentId);
          toast.success("Consultation started");
          break;
        case "cancel":
          await consultationsAPI.cancelConsultation(appointmentId);
          toast.success("Appointment cancelled");
          break;
        case "reschedule":
          // TODO: Open reschedule modal
          toast.info("Reschedule feature coming soon");
          break;
        case "view":
          // TODO: Navigate to appointment details
          toast.info("View details feature coming soon");
          break;
        default:
          break;
      }
      loadAppointments();
    } catch (error) {
      console.error("Error performing action:", error);
      toast.error("Failed to perform action");
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        label: "Scheduled",
      },
      in_progress: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        label: "In Progress",
      },
      completed: {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        label: "Completed",
      },
      cancelled: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        label: "Cancelled",
      },
      no_show: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        label: "No Show",
      },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.scheduled;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  // Get consultation type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video_call":
        return <Video className="w-4 h-4" />;
      case "voice_call":
        return <Phone className="w-4 h-4" />;
      case "chat":
        return <MessageSquare className="w-4 h-4" />;
      case "in_person":
        return <MapPin className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: format(date, "MMM dd, yyyy"),
      time: format(date, "hh:mm a"),
    };
  };

  // Get user display name
  const getUserDisplayName = (appointment: Consultation) => {
    if (user?.role === "doctor") {
      return `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`;
    } else if (user?.role === "patient") {
      return `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`;
    }
    return "Unknown";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadAppointments}
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChangeHandler={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filters.status || ""}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value || undefined }))
              }
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.type || ""}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, type: value || undefined }))
              }
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="video_call">Video Call</SelectItem>
                <SelectItem value="voice_call">Voice Call</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
                <SelectItem value="in_person">In Person</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No appointments found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            Table is supposed to be here
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems
              )}{" "}
              of {pagination.totalItems} appointments
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage - 1,
                  }))
                }
                disabled={pagination.currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage + 1,
                  }))
                }
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentList;
