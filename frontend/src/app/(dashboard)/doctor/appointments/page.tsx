"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppointmentList from "@/components/dashboard/appointments/AppointmentList";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import {
  Calendar,
  Clock,
  User,
  Video,
  Phone,
  MessageSquare,
  MapPin,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";

const DoctorAppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("today");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Appointments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your patient appointments and consultations
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
          <Button variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Manage Schedule
          </Button>
        </div>
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
                  Today
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
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This Week
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  23
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This Month
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  89
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Success Rate
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  94%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Time slots */}
            {[
              {
                time: "09:00 AM",
                patient: "John Doe",
                type: "video_call",
                status: "completed",
              },
              {
                time: "10:30 AM",
                patient: "Jane Smith",
                type: "voice_call",
                status: "in_progress",
              },
              {
                time: "02:00 PM",
                patient: "Mike Johnson",
                type: "chat",
                status: "scheduled",
              },
              {
                time: "03:30 PM",
                patient: "Sarah Wilson",
                type: "in_person",
                status: "scheduled",
              },
              {
                time: "05:00 PM",
                patient: "David Brown",
                type: "video_call",
                status: "scheduled",
              },
            ].map((appointment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white w-20">
                    {appointment.time}
                  </div>
                  <div className="flex items-center space-x-2">
                    {appointment.type === "video_call" && (
                      <Video className="w-4 h-4 text-blue-600" />
                    )}
                    {appointment.type === "voice_call" && (
                      <Phone className="w-4 h-4 text-green-600" />
                    )}
                    {appointment.type === "chat" && (
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                    )}
                    {appointment.type === "in_person" && (
                      <MapPin className="w-4 h-4 text-orange-600" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {appointment.type.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {appointment.patient}
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : appointment.status === "in_progress"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    }`}
                  >
                    {appointment.status.replace("_", " ")}
                  </div>
                  {appointment.status === "scheduled" && (
                    <Button size="sm" variant="outline">
                      Start
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Consultation Types Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Consultation Types This Month
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
                  45 consultations
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
                  23 consultations
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
                  12 consultations
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
                  9 consultations
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-6">
          <AppointmentList
            title="Today's Appointments"
            showFilters={false}
            showActions={true}
          />
        </TabsContent>

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
    </div>
  );
};

export default DoctorAppointmentsPage;
