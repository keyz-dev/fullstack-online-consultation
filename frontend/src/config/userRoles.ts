export const USER_ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  PATIENT: "patient",
  PHARMACY: "pharmacy",
  PENDING_DOCTOR: "pending_doctor",
  PENDING_PHARMACY: "pending_pharmacy",
};

export const ROLE_CONFIGS = {
  [USER_ROLES.ADMIN]: {
    basePath: "/admin",
    displayName: "Administrator",
    navItems: [
      { path: "", label: "Overview", icon: "LayoutDashboard" },
      { path: "users", label: "Users", icon: "Users" },
      { path: "specialties", label: "Specialties", icon: "FolderOpen" },
      { path: "symptoms", label: "Symptoms", icon: "Thermometer" },
      { path: "appointments", label: "Appointments", icon: "CalendarCheck" },
      { path: "consultations", label: "Consultations", icon: "MessageSquare" },
      { path: "medications", label: "Medications", icon: "Package" },
      { path: "applications", label: "Applications", icon: "FileText" },
      { path: "notifications", label: "Notifications", icon: "Bell" },
      { path: "profile", label: "My Profile", icon: "User" },
      { path: "settings", label: "Settings", icon: "Settings" },
    ],
  },
  [USER_ROLES.DOCTOR]: {
    basePath: "/doctor",
    displayName: "Doctor",
    navItems: [
      { path: "", label: "Overview", icon: "LayoutDashboard" },
      { path: "appointments", label: "Appointments", icon: "CalendarCheck" },
      { path: "consultations", label: "Consultations", icon: "MessageSquare" },
      { path: "patients", label: "My Patients", icon: "Users" },
      { path: "symptoms", label: "Symptoms", icon: "Thermometer" },
      { path: "schedule", label: "Schedule", icon: "Clock" },
      { path: "notifications", label: "Notifications", icon: "Bell" },
      { path: "video-calls", label: "Video Calls", icon: "Video" },
      { path: "chat-rooms", label: "Chat Rooms", icon: "MessageCircle" },
      { path: "prescriptions", label: "Prescriptions", icon: "FileText" },
      { path: "profile", label: "My Profile", icon: "User" },
      { path: "settings", label: "Settings", icon: "Settings" },
    ],
  },
  [USER_ROLES.PATIENT]: {
    basePath: "/patient",
    displayName: "Patient",
    navItems: [
      { path: "", label: "Overview", icon: "LayoutDashboard" },
      { path: "appointments", label: "My Appointments", icon: "CalendarCheck" },
      { path: "consultations", label: "Consultations", icon: "MessageSquare" },
      { path: "medications", label: "Medications", icon: "Package" },
      { path: "prescriptions", label: "Prescriptions", icon: "FileText" },
      { path: "video-calls", label: "Video Calls", icon: "Video" },
      { path: "chat-rooms", label: "Chat Rooms", icon: "MessageCircle" },
      { path: "notifications", label: "Notifications", icon: "Bell" },
      { path: "profile", label: "My Profile", icon: "User" },
      { path: "settings", label: "Settings", icon: "Settings" },
    ],
  },
  [USER_ROLES.PHARMACY]: {
    basePath: "/pharmacy",
    displayName: "Pharmacy",
    navItems: [
      { path: "", label: "Overview", icon: "LayoutDashboard" },
      { path: "orders", label: "Orders", icon: "ShoppingCart" },
      { path: "medications", label: "Medications", icon: "Package" },
      { path: "inventory", label: "Inventory", icon: "Database" },
      { path: "notifications", label: "Notifications", icon: "Bell" },
      { path: "profile", label: "My Profile", icon: "User" },
      { path: "settings", label: "Settings", icon: "Settings" },
    ],
  },
  [USER_ROLES.PENDING_DOCTOR]: {
    basePath: "/pending-doctor",
    displayName: "Pending Doctor",
    navItems: [
      { path: "home", label: "Home", icon: "Home" },
      { path: "", label: "Application Status", icon: "FileText" },
      { path: "notifications", label: "Notifications", icon: "Bell" },
      { path: "profile", label: "My Profile", icon: "User" },
    ],
  },
  [USER_ROLES.PENDING_PHARMACY]: {
    basePath: "/pending-pharmacy",
    displayName: "Pending Pharmacy",
    navItems: [
      { path: "home", label: "Home", icon: "Home" },
      { path: "", label: "Application Status", icon: "FileText" },
      { path: "notifications", label: "Notifications", icon: "Bell" },
      { path: "profile", label: "My Profile", icon: "User" },
    ],
  },
};

export type UserRole = keyof typeof USER_ROLES;
export type RoleConfig = (typeof ROLE_CONFIGS)[UserRole];
