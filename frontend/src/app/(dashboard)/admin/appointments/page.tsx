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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import {
  Calendar,
  Clock,
  User,
  Video,
  Phone,
  MessageSquare,
  MapPin,
  TrendingUp,
  Activity,
  BarChart3,
  Filter,
} from "lucide-react";

const AdminAppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Platform Appointments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor and manage all appointments across the platform
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Today
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  156
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
                  1,234
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
                  5,678
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
                  92%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  time: "2 min ago",
                  action: "New appointment booked",
                  user: "Dr. Smith",
                  patient: "John Doe",
                },
                {
                  time: "5 min ago",
                  action: "Consultation completed",
                  user: "Dr. Johnson",
                  patient: "Jane Smith",
                },
                {
                  time: "12 min ago",
                  action: "Appointment cancelled",
                  user: "Dr. Wilson",
                  patient: "Mike Brown",
                },
                {
                  time: "18 min ago",
                  action: "New appointment booked",
                  user: "Dr. Davis",
                  patient: "Sarah Wilson",
                },
                {
                  time: "25 min ago",
                  action: "Consultation started",
                  user: "Dr. Miller",
                  patient: "David Lee",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {activity.user} • {activity.patient}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Consultation Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Consultation Types (This Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Video className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Video Call
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    2,456
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    43%
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Voice Call
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    1,234
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    22%
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Chat
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    1,123
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    20%
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    In Person
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    865
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    15%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Doctors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Performing Doctors (This Month)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "Dr. Sarah Johnson",
                specialty: "Cardiology",
                consultations: 89,
                rating: 4.9,
              },
              {
                name: "Dr. Michael Chen",
                specialty: "Neurology",
                consultations: 76,
                rating: 4.8,
              },
              {
                name: "Dr. Emily Davis",
                specialty: "Pediatrics",
                consultations: 72,
                rating: 4.9,
              },
              {
                name: "Dr. Robert Wilson",
                specialty: "Orthopedics",
                consultations: 68,
                rating: 4.7,
              },
              {
                name: "Dr. Lisa Brown",
                specialty: "Dermatology",
                consultations: 65,
                rating: 4.8,
              },
            ].map((doctor, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {doctor.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {doctor.specialty}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {doctor.consultations}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      consultations
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {doctor.rating}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      rating
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appointments Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <AppointmentList
            title="Recent Appointments"
            showFilters={true}
            showActions={true}
            maxItems={10}
          />
        </TabsContent>

        <TabsContent value="today" className="mt-6">
          <AppointmentList
            title="Today's Appointments"
            showFilters={true}
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

export default AdminAppointmentsPage;
