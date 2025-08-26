"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppointmentList from "@/components/dashboard/appointments/AppointmentList";
import AppointmentBooking from "@/components/dashboard/appointments/AppointmentBooking";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Calendar,
  Clock,
  User,
  Video,
  Phone,
  MessageSquare,
  MapPin,
} from "lucide-react";
import { ModalWrapper } from "@/components/ui/ModalWrapper";

const PatientAppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");

  const handleBookingComplete = (appointment: any) => {
    setShowBookingModal(false);
    // Refresh the appointment list
    window.location.reload();
  };

  const getTabFilters = (tab: string) => {
    switch (tab) {
      case "upcoming":
        return { status: "scheduled" };
      case "completed":
        return { status: "completed" };
      case "cancelled":
        return { status: "cancelled" };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Appointments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your medical appointments and consultations
          </p>
        </div>
        <Button
          onClick={() => setShowBookingModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Book Appointment
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upcoming
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  3
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  12
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <Video className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This Month
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  5
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Doctors Seen
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  8
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Types Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Consultation Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Video className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Video Call
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Face-to-face consultation
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Phone className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Voice Call
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Audio consultation
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Chat
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Text-based consultation
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <MapPin className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  In Person
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Physical consultation
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <AppointmentList
            title="Upcoming Appointments"
            showFilters={true}
            showActions={true}
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <AppointmentList
            title="Completed Appointments"
            showFilters={true}
            showActions={false}
          />
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          <AppointmentList
            title="Cancelled Appointments"
            showFilters={true}
            showActions={false}
          />
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <AppointmentList
            title="All Appointments"
            showFilters={true}
            showActions={true}
          />
        </TabsContent>
      </Tabs>

      {/* Booking Modal */}
      <ModalWrapper
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Book New Appointment"
        size="4xl"
      >
        <AppointmentBooking
          onBookingComplete={handleBookingComplete}
          onCancel={() => setShowBookingModal(false)}
        />
      </ModalWrapper>
    </div>
  );
};

export default PatientAppointmentsPage;
