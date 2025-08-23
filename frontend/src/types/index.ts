// Import the existing Address interface
import { Address, ContactInfo, PaymentMethod } from "../api/auth";

export interface User {
  id: string;
  name: string;
  email: string;
  role:
    | "admin"
    | "patient"
    | "doctor"
    | "pharmacy"
    | "pending_doctor"
    | "pending_pharmacy";
  avatar?: string;
  gender?: "male" | "female" | "other";
  dob?: string;
  address?: Address;
  authProvider?: "local" | "google" | "facebook" | "apple";
  isActive: boolean;
  emailVerified: boolean;
  hasPaidApplicationFee: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Patient extends User {
  role: "patient";
  patient?: {
    id: string;
    bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    allergies?: string[];
    emergencyContact?: {
      name: string;
      phone: string;
      relationship?: string;
    };
    contactInfo?: ContactInfo[];
    medicalDocuments?: string[];
    insuranceInfo?: {
      provider?: string;
      policyNumber?: string;
      groupNumber?: string;
      expiryDate?: string;
    };
    preferredLanguage?: string;
  };
}

export interface Doctor extends User {
  role: "doctor" | "pending_doctor";
  doctor?: {
    id: string;
    licenseNumber: string;
    experience: number;
    bio?: string;
    education?: Array<{
      degree: string;
      institution: string;
      year: string;
    }>;
    languages?: string[];
    specialties?: Specialty[]; // Many-to-many relationship
    clinicAddress?: Address;
    operationalHospital?: string;
    contactInfo?: ContactInfo[];
    consultationFee: number;
    consultationDuration: number;
    paymentMethods?: string[]; // Array of payment method strings
    isVerified: boolean;
    isActive: boolean;
    averageRating?: number;
    totalReviews: number;
  };
}

export interface Pharmacy extends User {
  role: "pharmacy" | "pending_pharmacy";
  pharmacy?: {
    id: string;
    name: string; // Not pharmacyName
    licenseNumber: string;
    description?: string;
    logo?: string;
    images?: string[];
    address: Address; // JSONB object, not string
    contactInfo?: ContactInfo[]; // JSONB object, not phoneNumber
    deliveryInfo?: {
      radius?: number;
      fee?: number;
      time?: string;
      freeThreshold?: number;
    };
    paymentMethods?: string[]; // Array of payment method strings
    isVerified: boolean;
    isActive: boolean;
    averageRating?: number;
    totalReviews: number;
  };
}

export interface Specialty {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  doctorsCount?: number;
}

export interface DoctorAvailability {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  specialtyId: string;
  status: "pending" | "active" | "completed" | "cancelled";
  symptoms: string;
  diagnosis?: string;
  prescription?: string;
  consultationFee: number;
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  patient: Patient;
  doctor: Doctor;
  specialty: Specialty;
  messages: ConsultationMessage[];
}

export interface ConsultationMessage {
  id: string;
  consultationId: string;
  senderId: string;
  senderRole: "patient" | "doctor";
  message: string;
  messageType: "text" | "image" | "file";
  createdAt: string;
}

export interface Prescription {
  id: string;
  consultationId: string;
  patientId: string;
  doctorId: string;
  diagnosis: string;
  medications: Medication[];
  instructions: string;
  prescribedAt: string;
  validUntil: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface PharmacyDrug {
  id: string;
  pharmacyId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
  requiresPrescription: boolean;
  category: string;
}

export interface DrugOrder {
  id: string;
  patientId: string;
  pharmacyId: string;
  prescriptionId?: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  totalAmount: number;
  items: DrugOrderItem[];
  shippingAddress: string;
  orderDate: string;
  estimatedDelivery?: string;
}

export interface DrugOrderItem {
  drugId: string;
  quantity: number;
  price: number;
  drug: PharmacyDrug;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  paymentMethod: string;
  reference: string;
  description: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// UI Component Types
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  text?: string;
  onClickHandler?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  additionalClasses?: string;
}

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string;
  icon?: string;
  onClickHandler?: () => void;
  onChangeHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocusHandler?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlurHandler?: (e: React.FocusEvent<HTMLInputElement>) => void;
  labelClasses?: string;
  additionalClasses?: string;
  isSecretField?: boolean;
  required?: boolean;
}

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label?: string;
  error?: string;
  labelClasses?: string;
  additionalClasses?: string;
  onChangeHandler?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocusHandler?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlurHandler?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  additionalClasses?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

export interface FileUploaderProps {
  preview?: string;
  onChange: (file: File) => void;
  className?: string;
  text?: string;
  accept?: string;
  alt?: string;
}

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

// New Component Types
export interface UserInfoProps {
  user?: {
    avatar?: string;
    name?: string;
    email?: string;
  };
  placeholder?: string;
}

export interface TagInputProps {
  label?: string;
  value: string[];
  onChangeHandler: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

export interface TabGroupProps {
  tabs: Array<{
    key?: string;
    id?: string;
    label: string;
    icon?: React.ReactNode;
    component: React.ReactNode;
  }>;
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  className?: string;
}

export interface SubHeadingProps {
  tagline: string;
  description: string;
  title: string;
}

export interface StepSideBarProps {
  currentStep: string;
  visitedSteps: string[];
  steps: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
  }>;
  homePath?: string;
}

export interface StepNavButtonsProps {
  onBack?: () => void;
  onContinue?: () => void;
  canContinue: boolean;
  isLoading: boolean;
  onBackText?: string;
  onContinueText?: string;
}

export interface StatusPillProps {
  status: string;
}

export interface StatRendererProps {
  statCards: Array<{
    title: string;
    value: number | string;
    description?: string;
    icon: React.ComponentType<{ className?: string }>;
    trend?: "up" | "down";
    trendValue?: number;
    colorTheme?: string;
  }>;
  className?: string;
  isLoading?: boolean;
}

export interface StatCardProps {
  title: string;
  value: number | string | React.ReactNode;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down";
  trendValue?: number;
  colorTheme?: string;
  className?: string;
  isLoading?: boolean;
}

export interface StaggeredFadeInProps {
  children: React.ReactNode;
  staggerDelay?: number;
  baseDelay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export interface SecurityNoticeProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: () => void;
}

export interface SearchBarProps {
  placeholder?: string;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  value?: string;
  onChange?: (value: string) => void;
}

export interface ProgressStepsProps {
  steps: Array<{
    label: string;
    description?: string;
  }>;
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export interface PhoneInputProps {
  label?: string;
  name: string;
  id?: string;
  placeholder?: string;
  additionalClasses?: string;
  disabled?: boolean;
  required?: boolean;
  onChangeHandler: (e: { target: { name: string; value: string } }) => void;
  labelClasses?: string;
  value?: string;
  error?: string;
  autoFocus?: boolean;
  onFocusHandler?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlurHandler?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface PDFViewerProps {
  url: string;
  onLoad?: (data: { totalPages: number }) => void;
  onError?: (error: any) => void;
  currentPage?: number;
  zoom?: number;
  rotation?: number;
}

export interface PaginationProps {
  currentPage?: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  page?: number;
  setPage?: (page: number) => void;
  total: number;
  limit?: number;
}

export interface NotificationItemProps {
  notification: {
    _id: string;
    title: string;
    message: string;
    type: string;
    priority: string;
    isRead: boolean;
    createdAt: string;
    relatedId?: any;
    relatedModel?: string;
  };
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface NotificationListProps {
  notifications: NotificationItemProps["notification"][];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onRefresh?: () => void;
  isConnected: boolean;
}

export interface NotificationFiltersProps {
  filters: Record<string, any>;
  onFilterChange: (key: string, value: string) => void;
  onSearch: (search: string) => void;
  onClearAll?: () => void;
  loading?: boolean;
  refreshNotifications?: () => void;
}

export interface NotificationBellProps {
  // This will be handled by context
}

export interface ModalWrapperProps {
  children: React.ReactNode;
}

export interface LogoProps {
  size?: number;
  destination?: string;
}

export interface ImageGridProps {
  existingImages?: string[];
  newImages?: Array<{
    id: string;
    url: string;
    name: string;
  }>;
  onRemoveExisting: (index: number) => void;
  onRemoveNew: (id: string) => void;
  onAddImages: (files: File[]) => void;
  label?: string;
  gridCols?: number;
  imageHeight?: string;
  validationStates?: Map<string, any>;
  getValidationState?: (id: string) => { status: string };
}

export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: string[];
  backgroundImage?: string;
  className?: string;
  children?: React.ReactNode;
}

export interface HeroLoaderProps {
  // No props needed
}

export interface FormHeaderProps {
  title: string;
  description: string;
}

export interface GuaranteeCardProps {
  item: {
    imageUrl: string;
    title: string;
    description: string;
  };
}

export interface FilterDropdownProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  selected?: string;
  setSelected?: (value: string) => void;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export interface FadeInContainerProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: "shopping-bag" | "package" | "search" | "alert";
  action?: React.ReactNode;
}

export interface DropdownMenuProps {
  items: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    isDestructive?: boolean;
    isActive?: boolean;
  }>;
  trigger?: React.ReactNode;
}

export interface DocumentCardProps {
  document: {
    url?: string;
    preview?: string;
    documentName?: string;
    originalName?: string;
    name?: string;
    fileType?: string;
    type?: string;
    size?: number;
    adminRemarks?: string;
  };
  status?: string;
  onPreview?: (document: any) => void;
  showActions?: boolean;
  showStatus?: boolean;
  compact?: boolean;
  className?: string;
}

export interface AnimatedStatCardProps extends StatCardProps {
  duration?: number;
}

export interface AdvancedFiltersProps {
  filters: Record<string, any>;
  onFilterChange: (key: string, value: string) => void;
  onSearch: (search: string) => void;
  onClearAll?: () => void;
  filterConfigs?: Array<{
    key: string;
    label: string;
    defaultValue?: string;
    options: Array<{ value: string; label: string }>;
    colorClass?: string;
  }>;
  searchPlaceholder?: string;
  className?: string;
  loading?: boolean;
  debounceMs?: number;
  onSearchingChange?: (searching: boolean) => void;
  refreshApplications?: () => void;
}

export interface TableProps {
  columns: Array<{
    Header: string;
    accessor: string;
    Cell?: ({ row }: { row: any }) => React.ReactNode;
  }>;
  data: any[];
  emptyStateMessage?: string;
  onRowClick?: (row: any) => void;
  clickableRows?: boolean;
  isLoading?: boolean;
}
