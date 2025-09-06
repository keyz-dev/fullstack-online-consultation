"use client";

import React from "react";
import {
  Users,
  Stethoscope,
  User,
  Building2,
  CalendarCheck,
  MessageSquare,
  TrendingUp,
  FolderOpen,
  Thermometer,
  Package,
} from "lucide-react";

const AdminOverviewPage: React.FC = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Doctors",
      value: "89",
      change: "+5%",
      changeType: "positive" as const,
      icon: Stethoscope,
      color: "bg-green-500",
    },
    {
      title: "Patients",
      value: "1,045",
      change: "+18%",
      changeType: "positive" as const,
      icon: User,
      color: "bg-purple-500",
    },
    {
      title: "Pharmacies",
      value: "23",
      change: "+2%",
      changeType: "positive" as const,
      icon: Building2,
      color: "bg-orange-500",
    },
    {
      title: "Specialties",
      value: "15",
      change: "+3%",
      changeType: "positive" as const,
      icon: FolderOpen,
      color: "bg-indigo-500",
    },
    {
      title: "Symptoms",
      value: "45",
      change: "+7%",
      changeType: "positive" as const,
      icon: Thermometer,
      color: "bg-red-500",
    },
    {
      title: "Appointments",
      value: "156",
      change: "+8%",
      changeType: "positive" as const,
      icon: CalendarCheck,
      color: "bg-teal-500",
    },
    {
      title: "Consultations",
      value: "89",
      change: "+15%",
      changeType: "positive" as const,
      icon: MessageSquare,
      color: "bg-pink-500",
    },
    {
      title: "Medications",
      value: "234",
      change: "+6%",
      changeType: "positive" as const,
      icon: Package,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, Administrator!
        </h1>
        <p className="text-gray-600">
          Here&apos;s what&apos;s happening with your online consultation platform today.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">
                  from last month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-5 w-5 text-blue-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">
              Manage Users
            </span>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FolderOpen className="h-5 w-5 text-indigo-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">
              Manage Specialties
            </span>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CalendarCheck className="h-5 w-5 text-green-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">
              View Appointments
            </span>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageSquare className="h-5 w-5 text-purple-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">
              Monitor Consultations
            </span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-gray-600">
              New doctor registration: Dr. Sarah Johnson
            </p>
            <span className="text-xs text-gray-500">2 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-gray-600">
              Consultation completed: Patient ID #1234
            </p>
            <span className="text-xs text-gray-500">15 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <p className="text-sm text-gray-600">
              New pharmacy added: MedCare Pharmacy
            </p>
            <span className="text-xs text-gray-500">1 hour ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <p className="text-sm text-gray-600">
              New specialty added: Cardiology
            </p>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <p className="text-sm text-gray-600">
              System maintenance completed
            </p>
            <span className="text-xs text-gray-500">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
