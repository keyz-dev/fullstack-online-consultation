"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../components/ui";
import { User, Stethoscope, Building2 } from "lucide-react";

const RegisterPage = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: "patient",
      title: "Patient",
      description: "I want to book consultations and order medications",
      icon: User,
      color:
        "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700",
      textColor: "text-accent dark:text-blue-400",
      path: "/register/patient",
    },
    {
      id: "doctor",
      title: "Doctor",
      description: "I want to provide consultations and medical services",
      icon: Stethoscope,
      color:
        "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700",
      textColor: "text-green-600 dark:text-green-400",
      path: "/register/doctor",
    },
    {
      id: "pharmacy",
      title: "Pharmacy",
      description: "I want to sell medications and healthcare products",
      icon: Building2,
      color:
        "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700",
      textColor: "text-purple-600 dark:text-purple-400",
      path: "/register/pharmacy",
    },
    // {
    //   id: "admin",
    //   title: "Admin",
    //   description: "I want to manage the platform and users",
    //   icon: Shield,
    //   color:
    //     "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700",
    //   textColor: "text-orange-600 dark:text-orange-400",
    //   path: "/register/admin",
    // },
  ];

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      const role = roles.find((r) => r.id === selectedRole);
      if (role) {
        router.push(role.path);
      }
    }
  };

  return (
    <div className="min-h-fit flex items-center justify-center py-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Role
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Select the type of account you want to create
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <div
                key={role.id}
                className={`p-6 rounded-xs border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedRole === role.id
                    ? `${role.color} border-2 shadow-lg`
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md"
                }`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-lg ${role.color} ${role.textColor}`}
                  >
                    <IconComponent size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {role.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {role.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-row gap-4 justify-between sm:justify-center">
          <Link href="/login">
            <Button type="button" additionalClasses="secondarybtn">
              Back to Login
            </Button>
          </Link>

          <Button
            type="button"
            onClickHandler={handleContinue}
            disabled={!selectedRole}
            additionalClasses="primarybtn px-8"
          >
            Continue
          </Button>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-accent dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
