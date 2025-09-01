--
-- PostgreSQL database dump
--

\restrict jUoM0Vhh1Jxih0glm1IaEhlc1EN9XQ4FJ74HrejxZ5Ny13elBgrHm3ZHHGzH1a2

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-09-01 02:29:43

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 896 (class 1247 OID 16389)
-- Name: enum_ActivityLogs_action; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_ActivityLogs_action" AS ENUM (
    'create',
    'read',
    'update',
    'delete',
    'login',
    'logout',
    'export',
    'import'
);


ALTER TYPE public."enum_ActivityLogs_action" OWNER TO postgres;

--
-- TOC entry 899 (class 1247 OID 16406)
-- Name: enum_Appointments_cancelledBy; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Appointments_cancelledBy" AS ENUM (
    'patient',
    'doctor',
    'system'
);


ALTER TYPE public."enum_Appointments_cancelledBy" OWNER TO postgres;

--
-- TOC entry 902 (class 1247 OID 16414)
-- Name: enum_Appointments_consultationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Appointments_consultationType" AS ENUM (
    'online',
    'physical'
);


ALTER TYPE public."enum_Appointments_consultationType" OWNER TO postgres;

--
-- TOC entry 905 (class 1247 OID 16420)
-- Name: enum_Appointments_paymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Appointments_paymentStatus" AS ENUM (
    'pending',
    'paid',
    'failed',
    'refunded'
);


ALTER TYPE public."enum_Appointments_paymentStatus" OWNER TO postgres;

--
-- TOC entry 908 (class 1247 OID 16430)
-- Name: enum_Appointments_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Appointments_status" AS ENUM (
    'pending_payment',
    'paid',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled',
    'no_show'
);


ALTER TYPE public."enum_Appointments_status" OWNER TO postgres;

--
-- TOC entry 911 (class 1247 OID 16446)
-- Name: enum_ConsultationMessages_senderType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_ConsultationMessages_senderType" AS ENUM (
    'patient',
    'doctor',
    'system'
);


ALTER TYPE public."enum_ConsultationMessages_senderType" OWNER TO postgres;

--
-- TOC entry 914 (class 1247 OID 16454)
-- Name: enum_ConsultationMessages_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_ConsultationMessages_type" AS ENUM (
    'text',
    'image',
    'file',
    'prescription',
    'diagnosis',
    'system'
);


ALTER TYPE public."enum_ConsultationMessages_type" OWNER TO postgres;

--
-- TOC entry 917 (class 1247 OID 16468)
-- Name: enum_Consultations_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Consultations_status" AS ENUM (
    'not_started',
    'in_progress',
    'completed',
    'cancelled',
    'no_show'
);


ALTER TYPE public."enum_Consultations_status" OWNER TO postgres;

--
-- TOC entry 920 (class 1247 OID 16480)
-- Name: enum_Consultations_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Consultations_type" AS ENUM (
    'video_call',
    'voice_call',
    'chat',
    'in_person'
);


ALTER TYPE public."enum_Consultations_type" OWNER TO postgres;

--
-- TOC entry 923 (class 1247 OID 16490)
-- Name: enum_ContactInformations_inputType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_ContactInformations_inputType" AS ENUM (
    'phone',
    'email',
    'url',
    'text',
    'time'
);


ALTER TYPE public."enum_ContactInformations_inputType" OWNER TO postgres;

--
-- TOC entry 926 (class 1247 OID 16502)
-- Name: enum_DoctorAvailabilities_consultationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_DoctorAvailabilities_consultationType" AS ENUM (
    'online',
    'physical',
    'both'
);


ALTER TYPE public."enum_DoctorAvailabilities_consultationType" OWNER TO postgres;

--
-- TOC entry 929 (class 1247 OID 16510)
-- Name: enum_DrugOrders_paymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_DrugOrders_paymentStatus" AS ENUM (
    'pending',
    'paid',
    'failed',
    'refunded'
);


ALTER TYPE public."enum_DrugOrders_paymentStatus" OWNER TO postgres;

--
-- TOC entry 932 (class 1247 OID 16520)
-- Name: enum_DrugOrders_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_DrugOrders_status" AS ENUM (
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
);


ALTER TYPE public."enum_DrugOrders_status" OWNER TO postgres;

--
-- TOC entry 935 (class 1247 OID 16534)
-- Name: enum_Notifications_priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Notifications_priority" AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);


ALTER TYPE public."enum_Notifications_priority" OWNER TO postgres;

--
-- TOC entry 938 (class 1247 OID 16544)
-- Name: enum_Notifications_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Notifications_type" AS ENUM (
    'consultation_reminder',
    'consultation_confirmation',
    'consultation_cancelled',
    'prescription_ready',
    'payment_successful',
    'payment_failed',
    'application_approved',
    'application_rejected',
    'application_under_review',
    'system_announcement',
    'general'
);


ALTER TYPE public."enum_Notifications_type" OWNER TO postgres;

--
-- TOC entry 941 (class 1247 OID 16568)
-- Name: enum_Patients_bloodGroup; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Patients_bloodGroup" AS ENUM (
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-'
);


ALTER TYPE public."enum_Patients_bloodGroup" OWNER TO postgres;

--
-- TOC entry 944 (class 1247 OID 16586)
-- Name: enum_Payments_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Payments_status" AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'refunded'
);


ALTER TYPE public."enum_Payments_status" OWNER TO postgres;

--
-- TOC entry 947 (class 1247 OID 16598)
-- Name: enum_Payments_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Payments_type" AS ENUM (
    'consultation',
    'prescription',
    'application_fee',
    'subscription',
    'order',
    'other'
);


ALTER TYPE public."enum_Payments_type" OWNER TO postgres;

--
-- TOC entry 950 (class 1247 OID 16612)
-- Name: enum_Prescriptions_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Prescriptions_status" AS ENUM (
    'active',
    'completed',
    'cancelled',
    'expired'
);


ALTER TYPE public."enum_Prescriptions_status" OWNER TO postgres;

--
-- TOC entry 953 (class 1247 OID 16622)
-- Name: enum_SystemNotifications_priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_SystemNotifications_priority" AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);


ALTER TYPE public."enum_SystemNotifications_priority" OWNER TO postgres;

--
-- TOC entry 956 (class 1247 OID 16632)
-- Name: enum_SystemNotifications_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_SystemNotifications_type" AS ENUM (
    'announcement',
    'maintenance',
    'update',
    'alert',
    'info'
);


ALTER TYPE public."enum_SystemNotifications_type" OWNER TO postgres;

--
-- TOC entry 959 (class 1247 OID 16644)
-- Name: enum_UserApplications_applicationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_UserApplications_applicationType" AS ENUM (
    'doctor',
    'pharmacy'
);


ALTER TYPE public."enum_UserApplications_applicationType" OWNER TO postgres;

--
-- TOC entry 962 (class 1247 OID 16650)
-- Name: enum_UserApplications_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_UserApplications_status" AS ENUM (
    'pending',
    'under_review',
    'approved',
    'rejected',
    'suspended'
);


ALTER TYPE public."enum_UserApplications_status" OWNER TO postgres;

--
-- TOC entry 965 (class 1247 OID 16662)
-- Name: enum_Users_authProvider; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_authProvider" AS ENUM (
    'local',
    'google',
    'facebook',
    'apple'
);


ALTER TYPE public."enum_Users_authProvider" OWNER TO postgres;

--
-- TOC entry 968 (class 1247 OID 16672)
-- Name: enum_Users_gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_gender" AS ENUM (
    'male',
    'female',
    'prefer_not_to_say'
);


ALTER TYPE public."enum_Users_gender" OWNER TO postgres;

--
-- TOC entry 971 (class 1247 OID 16680)
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'patient',
    'doctor',
    'admin',
    'pharmacy',
    'pending_doctor',
    'pending_pharmacy',
    'incomplete_doctor',
    'incomplete_pharmacy'
);


ALTER TYPE public."enum_Users_role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16697)
-- Name: ActivityLogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ActivityLogs" (
    id integer NOT NULL,
    user_id integer,
    action public."enum_ActivityLogs_action" NOT NULL,
    resource character varying(100) NOT NULL,
    "resourceId" integer,
    description text,
    "ipAddress" character varying(45),
    "userAgent" text,
    metadata jsonb,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ActivityLogs" OWNER TO postgres;

--
-- TOC entry 5532 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN "ActivityLogs".resource; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."ActivityLogs".resource IS 'The resource being acted upon (e.g., ''user'', ''consultation'')';


--
-- TOC entry 5533 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN "ActivityLogs"."resourceId"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."ActivityLogs"."resourceId" IS 'ID of the specific resource';


--
-- TOC entry 5534 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN "ActivityLogs"."ipAddress"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."ActivityLogs"."ipAddress" IS 'IPv4 or IPv6 address';


--
-- TOC entry 5535 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN "ActivityLogs".metadata; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."ActivityLogs".metadata IS 'Additional activity data';


--
-- TOC entry 218 (class 1259 OID 16704)
-- Name: ActivityLogs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ActivityLogs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ActivityLogs_id_seq" OWNER TO postgres;

--
-- TOC entry 5536 (class 0 OID 0)
-- Dependencies: 218
-- Name: ActivityLogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ActivityLogs_id_seq" OWNED BY public."ActivityLogs".id;


--
-- TOC entry 219 (class 1259 OID 16705)
-- Name: ApplicationDocuments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ApplicationDocuments" (
    id integer NOT NULL,
    "applicationId" integer NOT NULL,
    "documentType" character varying(100) NOT NULL,
    "fileName" character varying(255) NOT NULL,
    "fileUrl" character varying(500) NOT NULL,
    "fileSize" integer NOT NULL,
    "mimeType" character varying(100) NOT NULL,
    "uploadedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiryDate" timestamp with time zone,
    "verifiedAt" timestamp with time zone,
    "verifiedBy" integer,
    "verificationNotes" text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ApplicationDocuments" OWNER TO postgres;

--
-- TOC entry 5537 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN "ApplicationDocuments"."documentType"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."ApplicationDocuments"."documentType" IS 'license, certification, reference, etc.';


--
-- TOC entry 220 (class 1259 OID 16713)
-- Name: ApplicationDocuments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ApplicationDocuments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ApplicationDocuments_id_seq" OWNER TO postgres;

--
-- TOC entry 5538 (class 0 OID 0)
-- Dependencies: 220
-- Name: ApplicationDocuments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ApplicationDocuments_id_seq" OWNED BY public."ApplicationDocuments".id;


--
-- TOC entry 221 (class 1259 OID 16714)
-- Name: Appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Appointments" (
    id integer NOT NULL,
    "timeSlotId" integer NOT NULL,
    "patientId" integer NOT NULL,
    status public."enum_Appointments_status" DEFAULT 'pending_payment'::public."enum_Appointments_status" NOT NULL,
    "consultationType" public."enum_Appointments_consultationType" NOT NULL,
    "symptomIds" integer[] DEFAULT ARRAY[]::integer[],
    notes text,
    "cancellationReason" text,
    "cancelledBy" public."enum_Appointments_cancelledBy",
    "cancelledAt" timestamp with time zone,
    "paymentStatus" public."enum_Appointments_paymentStatus" DEFAULT 'pending'::public."enum_Appointments_paymentStatus" NOT NULL,
    "paymentAmount" numeric(10,2),
    "campayTransactionId" character varying(255),
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "doctorId" integer NOT NULL
);


ALTER TABLE public."Appointments" OWNER TO postgres;

--
-- TOC entry 5539 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN "Appointments"."symptomIds"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Appointments"."symptomIds" IS 'Array of symptom IDs from the Symptom model';


--
-- TOC entry 5540 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN "Appointments".notes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Appointments".notes IS 'Additional notes for doctor preparation';


--
-- TOC entry 5541 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN "Appointments"."paymentAmount"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Appointments"."paymentAmount" IS 'Consultation fee amount';


--
-- TOC entry 5542 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN "Appointments"."campayTransactionId"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Appointments"."campayTransactionId" IS 'Campay transaction reference';


--
-- TOC entry 222 (class 1259 OID 16724)
-- Name: Appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Appointments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Appointments_id_seq" OWNER TO postgres;

--
-- TOC entry 5543 (class 0 OID 0)
-- Dependencies: 222
-- Name: Appointments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Appointments_id_seq" OWNED BY public."Appointments".id;


--
-- TOC entry 223 (class 1259 OID 16725)
-- Name: ConsultationMessages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ConsultationMessages" (
    id integer NOT NULL,
    "consultationId" integer NOT NULL,
    "senderId" integer NOT NULL,
    "senderType" public."enum_ConsultationMessages_senderType" NOT NULL,
    type public."enum_ConsultationMessages_type" DEFAULT 'text'::public."enum_ConsultationMessages_type" NOT NULL,
    content text,
    "fileUrl" character varying(500),
    "fileName" character varying(255),
    "fileSize" integer,
    "mimeType" character varying(100),
    "isRead" boolean DEFAULT false NOT NULL,
    "readAt" timestamp with time zone,
    metadata jsonb,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ConsultationMessages" OWNER TO postgres;

--
-- TOC entry 5544 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN "ConsultationMessages".metadata; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."ConsultationMessages".metadata IS 'Additional data for the message';


--
-- TOC entry 224 (class 1259 OID 16734)
-- Name: ConsultationMessages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ConsultationMessages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ConsultationMessages_id_seq" OWNER TO postgres;

--
-- TOC entry 5545 (class 0 OID 0)
-- Dependencies: 224
-- Name: ConsultationMessages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ConsultationMessages_id_seq" OWNED BY public."ConsultationMessages".id;


--
-- TOC entry 225 (class 1259 OID 16735)
-- Name: Consultations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Consultations" (
    id integer NOT NULL,
    "appointmentId" integer NOT NULL,
    status public."enum_Consultations_status" DEFAULT 'not_started'::public."enum_Consultations_status" NOT NULL,
    type public."enum_Consultations_type" NOT NULL,
    "startedAt" timestamp with time zone,
    "endedAt" timestamp with time zone,
    duration integer,
    diagnosis text,
    notes text,
    "followUpDate" timestamp with time zone,
    "followUpNotes" text,
    rating integer,
    review text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "roomId" character varying(255)
);


ALTER TABLE public."Consultations" OWNER TO postgres;

--
-- TOC entry 5546 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN "Consultations".duration; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Consultations".duration IS 'Duration in minutes';


--
-- TOC entry 5547 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN "Consultations"."roomId"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Consultations"."roomId" IS 'Unique identifier for the video/voice call room';


--
-- TOC entry 226 (class 1259 OID 16743)
-- Name: Consultations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Consultations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Consultations_id_seq" OWNER TO postgres;

--
-- TOC entry 5548 (class 0 OID 0)
-- Dependencies: 226
-- Name: Consultations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Consultations_id_seq" OWNED BY public."Consultations".id;


--
-- TOC entry 227 (class 1259 OID 16744)
-- Name: ContactInformations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContactInformations" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "iconUrl" character varying(255) DEFAULT 'defaultIcon.png'::character varying,
    "inputType" public."enum_ContactInformations_inputType" DEFAULT 'text'::public."enum_ContactInformations_inputType" NOT NULL,
    placeholder character varying(255),
    "validationPattern" character varying(500),
    "isRequired" boolean DEFAULT false NOT NULL,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ContactInformations" OWNER TO postgres;

--
-- TOC entry 5549 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN "ContactInformations"."inputType"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."ContactInformations"."inputType" IS 'Type of input field to render in the frontend';


--
-- TOC entry 5550 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN "ContactInformations".placeholder; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."ContactInformations".placeholder IS 'Placeholder text for the input field';


--
-- TOC entry 5551 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN "ContactInformations"."validationPattern"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."ContactInformations"."validationPattern" IS 'Regex pattern for validation (optional)';


--
-- TOC entry 5552 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN "ContactInformations"."isRequired"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."ContactInformations"."isRequired" IS 'Whether this contact method requires a value';


--
-- TOC entry 5553 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN "ContactInformations"."displayOrder"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."ContactInformations"."displayOrder" IS 'Order in which to display this contact method';


--
-- TOC entry 5554 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN "ContactInformations"."isActive"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."ContactInformations"."isActive" IS 'Whether this contact method is available for selection';


--
-- TOC entry 228 (class 1259 OID 16756)
-- Name: ContactInformations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ContactInformations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ContactInformations_id_seq" OWNER TO postgres;

--
-- TOC entry 5555 (class 0 OID 0)
-- Dependencies: 228
-- Name: ContactInformations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ContactInformations_id_seq" OWNED BY public."ContactInformations".id;


--
-- TOC entry 229 (class 1259 OID 16757)
-- Name: DoctorAvailabilities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DoctorAvailabilities" (
    id integer NOT NULL,
    "doctorId" integer NOT NULL,
    "dayOfWeek" integer NOT NULL,
    "startTime" time without time zone NOT NULL,
    "endTime" time without time zone NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "maxPatients" integer,
    "consultationDuration" integer DEFAULT 30 NOT NULL,
    "consultationType" public."enum_DoctorAvailabilities_consultationType" DEFAULT 'online'::public."enum_DoctorAvailabilities_consultationType" NOT NULL,
    "consultationFee" numeric(10,2) DEFAULT 0 NOT NULL,
    "isInvalidated" boolean DEFAULT false NOT NULL,
    "invalidationReason" text,
    "invalidatedAt" timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."DoctorAvailabilities" OWNER TO postgres;

--
-- TOC entry 5556 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN "DoctorAvailabilities"."dayOfWeek"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."DoctorAvailabilities"."dayOfWeek" IS '0 = Sunday, 1 = Monday, ..., 6 = Saturday';


--
-- TOC entry 5557 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN "DoctorAvailabilities"."consultationDuration"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."DoctorAvailabilities"."consultationDuration" IS 'Duration in minutes';


--
-- TOC entry 5558 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN "DoctorAvailabilities"."consultationType"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."DoctorAvailabilities"."consultationType" IS 'The type of consultation';


--
-- TOC entry 5559 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN "DoctorAvailabilities"."consultationFee"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."DoctorAvailabilities"."consultationFee" IS 'Consultation fee in XAF';


--
-- TOC entry 5560 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN "DoctorAvailabilities"."isInvalidated"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."DoctorAvailabilities"."isInvalidated" IS 'Whether this availability has been invalidated';


--
-- TOC entry 5561 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN "DoctorAvailabilities"."invalidationReason"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."DoctorAvailabilities"."invalidationReason" IS 'Reason for invalidation';


--
-- TOC entry 5562 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN "DoctorAvailabilities"."invalidatedAt"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."DoctorAvailabilities"."invalidatedAt" IS 'When this availability was invalidated';


--
-- TOC entry 230 (class 1259 OID 16769)
-- Name: DoctorAvailabilities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DoctorAvailabilities_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DoctorAvailabilities_id_seq" OWNER TO postgres;

--
-- TOC entry 5563 (class 0 OID 0)
-- Dependencies: 230
-- Name: DoctorAvailabilities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DoctorAvailabilities_id_seq" OWNED BY public."DoctorAvailabilities".id;


--
-- TOC entry 231 (class 1259 OID 16770)
-- Name: DoctorSpecialties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DoctorSpecialties" (
    id integer NOT NULL,
    "doctorId" integer NOT NULL,
    "specialtyId" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."DoctorSpecialties" OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16775)
-- Name: DoctorSpecialties_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DoctorSpecialties_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DoctorSpecialties_id_seq" OWNER TO postgres;

--
-- TOC entry 5564 (class 0 OID 0)
-- Dependencies: 232
-- Name: DoctorSpecialties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DoctorSpecialties_id_seq" OWNED BY public."DoctorSpecialties".id;


--
-- TOC entry 233 (class 1259 OID 16776)
-- Name: Doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Doctors" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "licenseNumber" character varying(50) NOT NULL,
    experience integer NOT NULL,
    bio text,
    education character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    languages character varying(255)[] DEFAULT ARRAY['english'::character varying(255)],
    "clinicAddress" jsonb,
    "operationalHospital" character varying(200),
    "contactInfo" jsonb,
    "paymentMethods" jsonb,
    "consultationFee" numeric(10,2) NOT NULL,
    "consultationDuration" integer DEFAULT 30 NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "averageRating" numeric(3,2),
    "totalReviews" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Doctors" OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16789)
-- Name: Doctors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Doctors_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Doctors_id_seq" OWNER TO postgres;

--
-- TOC entry 5565 (class 0 OID 0)
-- Dependencies: 234
-- Name: Doctors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Doctors_id_seq" OWNED BY public."Doctors".id;


--
-- TOC entry 235 (class 1259 OID 16790)
-- Name: DrugOrders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DrugOrders" (
    id integer NOT NULL,
    "patientId" integer NOT NULL,
    "pharmacyId" integer NOT NULL,
    "prescriptionId" integer,
    status public."enum_DrugOrders_status" DEFAULT 'pending'::public."enum_DrugOrders_status" NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    "shippingAddress" jsonb NOT NULL,
    "billingAddress" jsonb,
    "paymentStatus" public."enum_DrugOrders_paymentStatus" DEFAULT 'pending'::public."enum_DrugOrders_paymentStatus" NOT NULL,
    "paymentId" integer,
    "estimatedDelivery" timestamp with time zone,
    "actualDelivery" timestamp with time zone,
    "trackingNumber" character varying(100),
    notes text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."DrugOrders" OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16800)
-- Name: DrugOrders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DrugOrders_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DrugOrders_id_seq" OWNER TO postgres;

--
-- TOC entry 5566 (class 0 OID 0)
-- Dependencies: 236
-- Name: DrugOrders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DrugOrders_id_seq" OWNED BY public."DrugOrders".id;


--
-- TOC entry 237 (class 1259 OID 16801)
-- Name: Notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notifications" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    priority public."enum_Notifications_priority" DEFAULT 'medium'::public."enum_Notifications_priority" NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "readAt" timestamp with time zone,
    data jsonb,
    "scheduledAt" timestamp with time zone,
    "sentAt" timestamp with time zone,
    "expiresAt" timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    type character varying(100) NOT NULL
);


ALTER TABLE public."Notifications" OWNER TO postgres;

--
-- TOC entry 5567 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN "Notifications".data; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Notifications".data IS 'Additional notification data';


--
-- TOC entry 5568 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN "Notifications"."scheduledAt"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Notifications"."scheduledAt" IS 'For scheduled notifications';


--
-- TOC entry 5569 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN "Notifications"."sentAt"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Notifications"."sentAt" IS 'When notification was actually sent';


--
-- TOC entry 5570 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN "Notifications"."expiresAt"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Notifications"."expiresAt" IS 'For scheduled notifications';


--
-- TOC entry 238 (class 1259 OID 16810)
-- Name: Notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Notifications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Notifications_id_seq" OWNER TO postgres;

--
-- TOC entry 5571 (class 0 OID 0)
-- Dependencies: 238
-- Name: Notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Notifications_id_seq" OWNED BY public."Notifications".id;


--
-- TOC entry 239 (class 1259 OID 16811)
-- Name: PatientDocuments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PatientDocuments" (
    id integer NOT NULL,
    "patientId" integer NOT NULL,
    "documentType" character varying(100) NOT NULL,
    "fileName" character varying(255) NOT NULL,
    "fileUrl" character varying(500),
    "fileSize" integer,
    "mimeType" character varying(100),
    "uploadedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PatientDocuments" OWNER TO postgres;

--
-- TOC entry 5572 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN "PatientDocuments"."documentType"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."PatientDocuments"."documentType" IS 'medical_report, prescription, lab_result, xray, etc.';


--
-- TOC entry 240 (class 1259 OID 16819)
-- Name: PatientDocuments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PatientDocuments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PatientDocuments_id_seq" OWNER TO postgres;

--
-- TOC entry 5573 (class 0 OID 0)
-- Dependencies: 240
-- Name: PatientDocuments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PatientDocuments_id_seq" OWNED BY public."PatientDocuments".id;


--
-- TOC entry 241 (class 1259 OID 16820)
-- Name: Patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Patients" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "bloodGroup" public."enum_Patients_bloodGroup",
    allergies character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    "emergencyContact" jsonb,
    "contactInfo" jsonb,
    "medicalDocuments" character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    "insuranceInfo" jsonb,
    "preferredLanguage" character varying(50) DEFAULT 'English'::character varying,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Patients" OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 16830)
-- Name: Patients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Patients_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Patients_id_seq" OWNER TO postgres;

--
-- TOC entry 5574 (class 0 OID 0)
-- Dependencies: 242
-- Name: Patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Patients_id_seq" OWNED BY public."Patients".id;


--
-- TOC entry 243 (class 1259 OID 16831)
-- Name: Payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payments" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "appointmentId" integer,
    "applicationId" integer,
    "prescriptionId" integer,
    amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    status public."enum_Payments_status" DEFAULT 'pending'::public."enum_Payments_status" NOT NULL,
    type public."enum_Payments_type" DEFAULT 'consultation'::public."enum_Payments_type" NOT NULL,
    "paymentMethod" character varying(50) DEFAULT 'card'::character varying NOT NULL,
    "transactionId" character varying(255),
    "gatewayResponse" jsonb,
    description text,
    metadata jsonb,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Payments" OWNER TO postgres;

--
-- TOC entry 5575 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN "Payments"."gatewayResponse"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Payments"."gatewayResponse" IS 'Payment gateway response data';


--
-- TOC entry 5576 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN "Payments".metadata; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Payments".metadata IS 'Additional payment metadata';


--
-- TOC entry 244 (class 1259 OID 16842)
-- Name: Payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Payments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Payments_id_seq" OWNER TO postgres;

--
-- TOC entry 5577 (class 0 OID 0)
-- Dependencies: 244
-- Name: Payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Payments_id_seq" OWNED BY public."Payments".id;


--
-- TOC entry 245 (class 1259 OID 16843)
-- Name: Pharmacies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Pharmacies" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    name character varying(200) NOT NULL,
    "licenseNumber" character varying(50) NOT NULL,
    description text,
    logo character varying(500),
    images character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    address jsonb NOT NULL,
    "contactInfo" jsonb NOT NULL,
    "deliveryInfo" jsonb DEFAULT '{}'::jsonb,
    "paymentMethods" jsonb,
    documents jsonb,
    languages character varying(255)[],
    "isVerified" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "averageRating" numeric(3,2),
    "totalReviews" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Pharmacies" OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 16855)
-- Name: Pharmacies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Pharmacies_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Pharmacies_id_seq" OWNER TO postgres;

--
-- TOC entry 5578 (class 0 OID 0)
-- Dependencies: 246
-- Name: Pharmacies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Pharmacies_id_seq" OWNED BY public."Pharmacies".id;


--
-- TOC entry 247 (class 1259 OID 16856)
-- Name: PharmacyDrugs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PharmacyDrugs" (
    id integer NOT NULL,
    "pharmacyId" integer NOT NULL,
    name character varying(255) NOT NULL,
    "genericName" character varying(255),
    description text,
    "dosageForm" character varying(100),
    strength character varying(100),
    manufacturer character varying(255),
    price numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    "stockQuantity" integer DEFAULT 0 NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "requiresPrescription" boolean DEFAULT false NOT NULL,
    "imageUrl" character varying(500),
    category character varying(100),
    "sideEffects" character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    contraindications character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    "expiryDate" timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PharmacyDrugs" OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 16869)
-- Name: PharmacyDrugs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PharmacyDrugs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PharmacyDrugs_id_seq" OWNER TO postgres;

--
-- TOC entry 5579 (class 0 OID 0)
-- Dependencies: 248
-- Name: PharmacyDrugs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PharmacyDrugs_id_seq" OWNED BY public."PharmacyDrugs".id;


--
-- TOC entry 249 (class 1259 OID 16870)
-- Name: Prescriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Prescriptions" (
    id integer NOT NULL,
    "consultationId" integer,
    status public."enum_Prescriptions_status" DEFAULT 'active'::public."enum_Prescriptions_status" NOT NULL,
    diagnosis text,
    medications jsonb DEFAULT '[]'::jsonb NOT NULL,
    instructions text,
    dosage jsonb,
    duration integer,
    "startDate" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endDate" timestamp with time zone,
    refills integer DEFAULT 0 NOT NULL,
    "refillsRemaining" integer DEFAULT 0 NOT NULL,
    notes text,
    "sideEffects" character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    contraindications character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Prescriptions" OWNER TO postgres;

--
-- TOC entry 5580 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN "Prescriptions".medications; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Prescriptions".medications IS 'Array of prescribed medications';


--
-- TOC entry 5581 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN "Prescriptions".dosage; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Prescriptions".dosage IS 'Dosage information';


--
-- TOC entry 5582 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN "Prescriptions".duration; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Prescriptions".duration IS 'Duration in days';


--
-- TOC entry 5583 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN "Prescriptions"."endDate"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Prescriptions"."endDate" IS 'Prescription expiry date';


--
-- TOC entry 250 (class 1259 OID 16884)
-- Name: Prescriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Prescriptions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Prescriptions_id_seq" OWNER TO postgres;

--
-- TOC entry 5584 (class 0 OID 0)
-- Dependencies: 250
-- Name: Prescriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Prescriptions_id_seq" OWNED BY public."Prescriptions".id;


--
-- TOC entry 251 (class 1259 OID 16885)
-- Name: QAndAs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."QAndAs" (
    id integer NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    category character varying(100),
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."QAndAs" OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 16893)
-- Name: QAndAs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."QAndAs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."QAndAs_id_seq" OWNER TO postgres;

--
-- TOC entry 5585 (class 0 OID 0)
-- Dependencies: 252
-- Name: QAndAs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."QAndAs_id_seq" OWNED BY public."QAndAs".id;


--
-- TOC entry 253 (class 1259 OID 16894)
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 16897)
-- Name: Specialties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Specialties" (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    icon character varying(500),
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Specialties" OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 16905)
-- Name: Specialties_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Specialties_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Specialties_id_seq" OWNER TO postgres;

--
-- TOC entry 5586 (class 0 OID 0)
-- Dependencies: 255
-- Name: Specialties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Specialties_id_seq" OWNED BY public."Specialties".id;


--
-- TOC entry 256 (class 1259 OID 16906)
-- Name: Symptoms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Symptoms" (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    "iconUrl" character varying(500),
    "specialtyId" integer,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Symptoms" OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 16913)
-- Name: Symptoms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Symptoms_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Symptoms_id_seq" OWNER TO postgres;

--
-- TOC entry 5587 (class 0 OID 0)
-- Dependencies: 257
-- Name: Symptoms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Symptoms_id_seq" OWNED BY public."Symptoms".id;


--
-- TOC entry 258 (class 1259 OID 16914)
-- Name: SystemNotifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SystemNotifications" (
    id integer NOT NULL,
    type public."enum_SystemNotifications_type" DEFAULT 'info'::public."enum_SystemNotifications_type" NOT NULL,
    priority public."enum_SystemNotifications_priority" DEFAULT 'medium'::public."enum_SystemNotifications_priority" NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    "targetAudience" character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    "isActive" boolean DEFAULT true NOT NULL,
    "startDate" timestamp with time zone,
    "endDate" timestamp with time zone,
    data jsonb,
    "createdBy" integer,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SystemNotifications" OWNER TO postgres;

--
-- TOC entry 5588 (class 0 OID 0)
-- Dependencies: 258
-- Name: COLUMN "SystemNotifications"."targetAudience"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."SystemNotifications"."targetAudience" IS 'Array of user roles to target (e.g., [''patient'', ''doctor''])';


--
-- TOC entry 5589 (class 0 OID 0)
-- Dependencies: 258
-- Name: COLUMN "SystemNotifications"."startDate"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."SystemNotifications"."startDate" IS 'When to start showing this notification';


--
-- TOC entry 5590 (class 0 OID 0)
-- Dependencies: 258
-- Name: COLUMN "SystemNotifications"."endDate"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."SystemNotifications"."endDate" IS 'When to stop showing this notification';


--
-- TOC entry 5591 (class 0 OID 0)
-- Dependencies: 258
-- Name: COLUMN "SystemNotifications".data; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."SystemNotifications".data IS 'Additional notification data';


--
-- TOC entry 259 (class 1259 OID 16925)
-- Name: SystemNotifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SystemNotifications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SystemNotifications_id_seq" OWNER TO postgres;

--
-- TOC entry 5592 (class 0 OID 0)
-- Dependencies: 259
-- Name: SystemNotifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SystemNotifications_id_seq" OWNED BY public."SystemNotifications".id;


--
-- TOC entry 260 (class 1259 OID 16926)
-- Name: Testimonials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Testimonials" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "patientId" integer,
    "doctorId" integer,
    "pharmacyId" integer,
    rating integer NOT NULL,
    title character varying(255),
    content text NOT NULL,
    "isApproved" boolean DEFAULT false NOT NULL,
    "isAnonymous" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Testimonials" OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 16935)
-- Name: Testimonials_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Testimonials_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Testimonials_id_seq" OWNER TO postgres;

--
-- TOC entry 5593 (class 0 OID 0)
-- Dependencies: 261
-- Name: Testimonials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Testimonials_id_seq" OWNED BY public."Testimonials".id;


--
-- TOC entry 262 (class 1259 OID 16936)
-- Name: TimeSlots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TimeSlots" (
    id integer NOT NULL,
    "doctorAvailabilityId" integer NOT NULL,
    "startTime" time without time zone NOT NULL,
    "endTime" time without time zone NOT NULL,
    date date NOT NULL,
    "isBooked" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TimeSlots" OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 16942)
-- Name: TimeSlots_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TimeSlots_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TimeSlots_id_seq" OWNER TO postgres;

--
-- TOC entry 5594 (class 0 OID 0)
-- Dependencies: 263
-- Name: TimeSlots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TimeSlots_id_seq" OWNED BY public."TimeSlots".id;


--
-- TOC entry 264 (class 1259 OID 16943)
-- Name: UserApplications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserApplications" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "applicationType" public."enum_UserApplications_applicationType" NOT NULL,
    "typeId" integer NOT NULL,
    status public."enum_UserApplications_status" DEFAULT 'pending'::public."enum_UserApplications_status" NOT NULL,
    "applicationVersion" integer DEFAULT 1 NOT NULL,
    "adminReview" jsonb,
    "adminNotes" text,
    "submittedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "reviewedAt" timestamp with time zone,
    "approvedAt" timestamp with time zone,
    "rejectedAt" timestamp with time zone,
    "suspendedAt" timestamp with time zone,
    "rejectionReason" text,
    "suspensionReason" text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."UserApplications" OWNER TO postgres;

--
-- TOC entry 5595 (class 0 OID 0)
-- Dependencies: 264
-- Name: COLUMN "UserApplications"."typeId"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."UserApplications"."typeId" IS 'References Doctor.id or Pharmacy.id based on applicationType';


--
-- TOC entry 265 (class 1259 OID 16953)
-- Name: UserApplications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserApplications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserApplications_id_seq" OWNER TO postgres;

--
-- TOC entry 5596 (class 0 OID 0)
-- Dependencies: 265
-- Name: UserApplications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserApplications_id_seq" OWNED BY public."UserApplications".id;


--
-- TOC entry 266 (class 1259 OID 16954)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    gender public."enum_Users_gender" DEFAULT 'prefer_not_to_say'::public."enum_Users_gender",
    "phoneNumber" character varying(20),
    password character varying(255),
    role public."enum_Users_role" DEFAULT 'patient'::public."enum_Users_role" NOT NULL,
    dob timestamp with time zone,
    address jsonb,
    avatar character varying(500),
    "authProvider" public."enum_Users_authProvider" DEFAULT 'local'::public."enum_Users_authProvider",
    "isActive" boolean DEFAULT true NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "emailVerificationCode" character varying(6),
    "emailVerificationExpires" timestamp with time zone,
    "hasPaidApplicationFee" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 16967)
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO postgres;

--
-- TOC entry 5597 (class 0 OID 0)
-- Dependencies: 267
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- TOC entry 4944 (class 2604 OID 16968)
-- Name: ActivityLogs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLogs" ALTER COLUMN id SET DEFAULT nextval('public."ActivityLogs_id_seq"'::regclass);


--
-- TOC entry 4947 (class 2604 OID 16969)
-- Name: ApplicationDocuments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ApplicationDocuments" ALTER COLUMN id SET DEFAULT nextval('public."ApplicationDocuments_id_seq"'::regclass);


--
-- TOC entry 4951 (class 2604 OID 16970)
-- Name: Appointments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointments" ALTER COLUMN id SET DEFAULT nextval('public."Appointments_id_seq"'::regclass);


--
-- TOC entry 4957 (class 2604 OID 16971)
-- Name: ConsultationMessages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConsultationMessages" ALTER COLUMN id SET DEFAULT nextval('public."ConsultationMessages_id_seq"'::regclass);


--
-- TOC entry 4962 (class 2604 OID 16972)
-- Name: Consultations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Consultations" ALTER COLUMN id SET DEFAULT nextval('public."Consultations_id_seq"'::regclass);


--
-- TOC entry 4966 (class 2604 OID 16973)
-- Name: ContactInformations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactInformations" ALTER COLUMN id SET DEFAULT nextval('public."ContactInformations_id_seq"'::regclass);


--
-- TOC entry 4974 (class 2604 OID 16974)
-- Name: DoctorAvailabilities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DoctorAvailabilities" ALTER COLUMN id SET DEFAULT nextval('public."DoctorAvailabilities_id_seq"'::regclass);


--
-- TOC entry 4982 (class 2604 OID 16975)
-- Name: DoctorSpecialties id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DoctorSpecialties" ALTER COLUMN id SET DEFAULT nextval('public."DoctorSpecialties_id_seq"'::regclass);


--
-- TOC entry 4985 (class 2604 OID 16976)
-- Name: Doctors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Doctors" ALTER COLUMN id SET DEFAULT nextval('public."Doctors_id_seq"'::regclass);


--
-- TOC entry 4994 (class 2604 OID 16977)
-- Name: DrugOrders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DrugOrders" ALTER COLUMN id SET DEFAULT nextval('public."DrugOrders_id_seq"'::regclass);


--
-- TOC entry 5000 (class 2604 OID 16978)
-- Name: Notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notifications" ALTER COLUMN id SET DEFAULT nextval('public."Notifications_id_seq"'::regclass);


--
-- TOC entry 5005 (class 2604 OID 16979)
-- Name: PatientDocuments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PatientDocuments" ALTER COLUMN id SET DEFAULT nextval('public."PatientDocuments_id_seq"'::regclass);


--
-- TOC entry 5009 (class 2604 OID 16980)
-- Name: Patients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patients" ALTER COLUMN id SET DEFAULT nextval('public."Patients_id_seq"'::regclass);


--
-- TOC entry 5015 (class 2604 OID 16981)
-- Name: Payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payments" ALTER COLUMN id SET DEFAULT nextval('public."Payments_id_seq"'::regclass);


--
-- TOC entry 5022 (class 2604 OID 16982)
-- Name: Pharmacies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pharmacies" ALTER COLUMN id SET DEFAULT nextval('public."Pharmacies_id_seq"'::regclass);


--
-- TOC entry 5030 (class 2604 OID 16983)
-- Name: PharmacyDrugs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PharmacyDrugs" ALTER COLUMN id SET DEFAULT nextval('public."PharmacyDrugs_id_seq"'::regclass);


--
-- TOC entry 5039 (class 2604 OID 16984)
-- Name: Prescriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Prescriptions" ALTER COLUMN id SET DEFAULT nextval('public."Prescriptions_id_seq"'::regclass);


--
-- TOC entry 5049 (class 2604 OID 16985)
-- Name: QAndAs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QAndAs" ALTER COLUMN id SET DEFAULT nextval('public."QAndAs_id_seq"'::regclass);


--
-- TOC entry 5053 (class 2604 OID 16986)
-- Name: Specialties id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Specialties" ALTER COLUMN id SET DEFAULT nextval('public."Specialties_id_seq"'::regclass);


--
-- TOC entry 5057 (class 2604 OID 16987)
-- Name: Symptoms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Symptoms" ALTER COLUMN id SET DEFAULT nextval('public."Symptoms_id_seq"'::regclass);


--
-- TOC entry 5060 (class 2604 OID 16988)
-- Name: SystemNotifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemNotifications" ALTER COLUMN id SET DEFAULT nextval('public."SystemNotifications_id_seq"'::regclass);


--
-- TOC entry 5067 (class 2604 OID 16989)
-- Name: Testimonials id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Testimonials" ALTER COLUMN id SET DEFAULT nextval('public."Testimonials_id_seq"'::regclass);


--
-- TOC entry 5072 (class 2604 OID 16990)
-- Name: TimeSlots id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TimeSlots" ALTER COLUMN id SET DEFAULT nextval('public."TimeSlots_id_seq"'::regclass);


--
-- TOC entry 5076 (class 2604 OID 16991)
-- Name: UserApplications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserApplications" ALTER COLUMN id SET DEFAULT nextval('public."UserApplications_id_seq"'::regclass);


--
-- TOC entry 5082 (class 2604 OID 16992)
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- TOC entry 5476 (class 0 OID 16697)
-- Dependencies: 217
-- Data for Name: ActivityLogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ActivityLogs" (id, user_id, action, resource, "resourceId", description, "ipAddress", "userAgent", metadata, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5478 (class 0 OID 16705)
-- Dependencies: 219
-- Data for Name: ApplicationDocuments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ApplicationDocuments" (id, "applicationId", "documentType", "fileName", "fileUrl", "fileSize", "mimeType", "uploadedAt", "expiryDate", "verifiedAt", "verifiedBy", "verificationNotes", "createdAt", "updatedAt") FROM stdin;
1	1	this is cool	4ed31e13d1a896c5d354dd698b3fbc87.jpg	/uploads/documents/doctors/41961e1c-5e02-4447-9960-874a94fc763b.jpg	13388	image	2025-08-26 19:50:45.343+01	\N	\N	\N	\N	2025-08-26 19:50:45.343+01	2025-08-26 19:50:45.343+01
2	1	loving you	2025-TVEE-AL-Results.pdf	/uploads/documents/doctors/6ca5ecf4-3b77-4495-99e4-279bd816d2b4.pdf	383805	pdf	2025-08-26 19:50:45.343+01	\N	2025-08-26 19:52:11.269+01	1	nice work	2025-08-26 19:50:45.343+01	2025-08-26 19:52:11.27+01
3	2	really crazy	setups.txt	/uploads/documents/doctors/9dba375b-860a-4d44-9f00-ff7ed5dd5600.txt	2154	text	2025-08-28 04:48:42.512+01	\N	\N	\N	\N	2025-08-28 04:48:42.514+01	2025-08-28 04:48:42.514+01
4	2	nice work man	Teach_7_Year_Old_Computer_Guide.pdf	/uploads/documents/doctors/216d801f-8c83-4572-a39d-115e42124b35.pdf	4589	pdf	2025-08-28 04:48:42.514+01	\N	\N	\N	\N	2025-08-28 04:48:42.515+01	2025-08-28 04:48:42.515+01
5	3	good job	2024-Subject-Report-ALG.pdf	/uploads/documents/doctors/36ce3ab9-0046-4407-b7a3-112b5dded00a.pdf	3570383	pdf	2025-08-28 05:00:48.994+01	\N	\N	\N	\N	2025-08-28 05:00:48.994+01	2025-08-28 05:00:48.994+01
6	3	i believe it works	IMG_20250409_143326_856.jpg	/uploads/documents/doctors/c4c294c0-e3c8-41fe-a924-f9870c383697.jpg	3253972	image	2025-08-28 05:00:48.995+01	\N	2025-08-28 05:03:55.165+01	1	this makes sense though	2025-08-28 05:00:48.995+01	2025-08-28 05:03:55.166+01
\.


--
-- TOC entry 5480 (class 0 OID 16714)
-- Dependencies: 221
-- Data for Name: Appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Appointments" (id, "timeSlotId", "patientId", status, "consultationType", "symptomIds", notes, "cancellationReason", "cancelledBy", "cancelledAt", "paymentStatus", "paymentAmount", "campayTransactionId", "createdAt", "updatedAt", "doctorId") FROM stdin;
1	2	2	paid	online	{9}	this isn't so great, but yeah.	\N	\N	\N	paid	\N	\N	2025-08-30 09:01:38.313+01	2025-08-30 09:01:50.297+01	2
2	4	2	paid	online	{3}	\N	\N	\N	\N	paid	\N	\N	2025-08-30 09:11:40.871+01	2025-08-30 09:11:52.711+01	2
3	13	2	paid	online	{9}	\N	\N	\N	\N	paid	\N	\N	2025-08-30 09:58:46.389+01	2025-08-30 09:58:58.377+01	2
4	217	2	paid	online	{1}	\N	\N	\N	\N	paid	\N	\N	2025-08-30 10:04:06.325+01	2025-08-30 10:04:18.009+01	1
5	273	1	paid	online	{1,7}	\N	\N	\N	\N	paid	\N	\N	2025-08-30 12:18:06.299+01	2025-08-30 12:18:18.201+01	3
6	15	1	cancelled	online	{4}	\N	\N	\N	2025-08-30 12:22:08.798+01	failed	\N	\N	2025-08-30 12:21:57.283+01	2025-08-30 12:22:08.798+01	2
7	15	1	paid	online	{1}	\N	\N	\N	\N	paid	\N	\N	2025-08-30 12:29:28.394+01	2025-08-30 12:29:40.226+01	2
8	277	1	cancelled	online	{7,6}	\N	\N	\N	2025-08-30 16:13:42.163+01	failed	\N	\N	2025-08-30 16:13:28.627+01	2025-08-30 16:13:42.162+01	3
9	277	1	paid	online	{7,6}	\N	\N	\N	\N	paid	\N	\N	2025-08-30 16:13:49.257+01	2025-08-30 16:14:08.286+01	3
10	25	1	cancelled	physical	{2}	\N	\N	\N	2025-08-30 16:16:48.844+01	failed	\N	\N	2025-08-30 16:16:36.232+01	2025-08-30 16:16:48.844+01	2
11	25	1	paid	physical	{2}	\N	\N	\N	\N	paid	\N	\N	2025-08-30 16:16:55.364+01	2025-08-30 16:17:14.08+01	2
12	26	2	paid	online	{5}	the required docs	\N	\N	\N	paid	\N	\N	2025-08-30 20:36:12.823+01	2025-08-30 20:36:27.632+01	2
13	304	2	cancelled	online	{}	\N	\N	\N	2025-08-31 11:05:01.501+01	failed	\N	\N	2025-08-31 11:04:47.504+01	2025-08-31 11:05:01.501+01	1
14	304	2	cancelled	online	{7}	It works\r\n	\N	\N	2025-08-31 00:02:13.766+01	failed	\N	\N	2025-08-31 00:01:58.605+01	2025-08-31 00:02:13.766+01	1
15	304	2	paid	online	{7}	It works\r\n	\N	\N	\N	paid	\N	\N	2025-08-31 00:02:31.758+01	2025-08-31 00:02:52.557+01	1
16	386	2	cancelled	online	{1}	I like this test, and i wish it really works out	\N	\N	2025-08-31 16:12:56.825+01	failed	\N	\N	2025-08-31 16:12:42.833+01	2025-08-31 16:12:56.825+01	3
17	386	2	cancelled	online	{1}	I like this test, and i wish it really works out	\N	\N	2025-08-31 16:14:30.313+01	failed	\N	\N	2025-08-31 16:14:16.822+01	2025-08-31 16:14:30.313+01	3
18	386	2	cancelled	online	{1}	I like this test, and i wish it really works out	\N	\N	2025-08-31 16:14:56.336+01	failed	\N	\N	2025-08-31 16:14:43.25+01	2025-08-31 16:14:56.335+01	3
19	386	2	cancelled	online	{1}	I like this test, and i wish it really works out	\N	\N	2025-08-31 16:15:41.054+01	failed	\N	\N	2025-08-31 16:15:27.556+01	2025-08-31 16:15:41.054+01	3
20	386	2	cancelled	online	{1}	I like this test, and i wish it really works out	\N	\N	2025-08-31 16:17:29.337+01	failed	\N	\N	2025-08-31 16:17:15.802+01	2025-08-31 16:17:29.336+01	3
21	386	2	paid	online	{1}	I like this test, and i wish it really works out	\N	\N	\N	paid	\N	\N	2025-08-31 16:18:57.237+01	2025-08-31 16:19:11.263+01	3
22	387	2	paid	online	{8}	\N	\N	\N	\N	paid	\N	\N	2025-08-31 17:01:06.56+01	2025-08-31 17:01:20.459+01	3
23	388	2	paid	online	{4}	Makes sense to me	\N	\N	\N	paid	\N	\N	2025-08-31 17:29:51.232+01	2025-08-31 17:30:05.307+01	3
24	389	2	paid	online	{4}	\N	\N	\N	\N	paid	\N	\N	2025-08-31 18:30:48.222+01	2025-08-31 18:31:24.906+01	3
25	391	2	paid	online	{7}	\N	\N	\N	\N	paid	\N	\N	2025-08-31 19:27:37.099+01	2025-08-31 19:28:02.715+01	3
26	43	2	paid	online	{6}	\N	\N	\N	\N	paid	\N	\N	2025-08-31 19:29:02.108+01	2025-08-31 19:29:38.661+01	2
27	392	2	paid	online	{6}	\N	\N	\N	\N	paid	\N	\N	2025-08-31 20:40:18.27+01	2025-08-31 20:40:44.743+01	3
28	901	2	paid	online	{8}	\N	\N	\N	\N	paid	\N	\N	2025-08-31 23:41:37.089+01	2025-08-31 23:42:12.889+01	2
29	1165	2	pending_payment	online	{9}	special notes	\N	\N	\N	pending	\N	\N	2025-09-01 01:37:13.593+01	2025-09-01 01:37:13.593+01	3
30	1165	2	paid	online	{9}	special notes	\N	\N	\N	paid	\N	\N	2025-09-01 01:37:50.347+01	2025-09-01 01:38:11.416+01	3
\.


--
-- TOC entry 5482 (class 0 OID 16725)
-- Dependencies: 223
-- Data for Name: ConsultationMessages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ConsultationMessages" (id, "consultationId", "senderId", "senderType", type, content, "fileUrl", "fileName", "fileSize", "mimeType", "isRead", "readAt", metadata, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5484 (class 0 OID 16735)
-- Dependencies: 225
-- Data for Name: Consultations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Consultations" (id, "appointmentId", status, type, "startedAt", "endedAt", duration, diagnosis, notes, "followUpDate", "followUpNotes", rating, review, "createdAt", "updatedAt", "roomId") FROM stdin;
1	1	not_started	video_call	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-30 09:01:50.285+01	2025-08-30 09:01:50.285+01	\N
2	2	not_started	video_call	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-30 09:11:52.707+01	2025-08-30 09:11:52.707+01	\N
3	3	not_started	video_call	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-30 09:58:58.374+01	2025-08-30 09:58:58.374+01	\N
4	4	in_progress	video_call	2025-08-30 10:05:39.107+01	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-30 10:04:18.002+01	2025-08-30 10:05:39.107+01	f0044a8dbbdf88f22d34f2d78911c2f8
6	7	in_progress	video_call	2025-08-30 12:30:48.109+01	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-30 12:29:40.211+01	2025-08-30 12:30:48.109+01	47ed434c2549df705fce04789bded07f
5	5	in_progress	video_call	2025-08-30 13:00:27.43+01	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-30 12:18:18.185+01	2025-08-30 13:00:27.43+01	e90ed57392f8a68a800a703c0ba69805
7	9	not_started	video_call	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-30 16:14:08.271+01	2025-08-30 16:14:08.271+01	\N
8	11	not_started	in_person	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-30 16:17:14.061+01	2025-08-30 16:17:14.061+01	\N
9	12	not_started	video_call	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-30 20:36:27.616+01	2025-08-30 20:36:27.616+01	\N
10	15	not_started	video_call	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-31 00:02:52.524+01	2025-08-31 00:02:52.524+01	\N
11	21	in_progress	video_call	2025-08-31 16:28:22.343+01	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-31 16:19:11.237+01	2025-08-31 16:28:22.344+01	447eb85dda6a0f40cb2bcabbb6cee7d0
12	22	in_progress	video_call	2025-08-31 17:01:56.143+01	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-31 17:01:20.434+01	2025-08-31 17:01:56.144+01	f34bc5f77adad3530c1b4385f69eaf9b
13	23	in_progress	video_call	2025-08-31 17:51:46.344+01	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-31 17:30:05.292+01	2025-08-31 17:51:46.344+01	58236800ef25b36ba55fe3057fa06c66
14	24	in_progress	video_call	2025-08-31 18:32:15.106+01	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-31 18:31:24.897+01	2025-08-31 18:32:15.106+01	deea7e731569c4ad7f86002c9ecd8185
16	26	in_progress	video_call	2025-08-31 19:30:56.548+01	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-31 19:29:38.651+01	2025-08-31 19:30:56.548+01	ab34766bb536ea433303948f9028d724
15	25	in_progress	video_call	2025-08-31 20:01:34.827+01	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-31 19:28:02.707+01	2025-08-31 20:01:34.828+01	9fcf36e1e069a33c643076f318c28641
17	27	in_progress	video_call	2025-08-31 20:49:14.153+01	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-31 20:40:44.732+01	2025-08-31 20:49:14.153+01	84c24df358a737ec96bbc574949e8942
18	28	in_progress	video_call	2025-09-01 00:52:26.832+01	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-31 23:42:12.882+01	2025-09-01 00:52:26.832+01	8d98e005f96068ad3398b88351d50340
19	30	in_progress	video_call	2025-09-01 01:40:19.832+01	\N	\N	\N	\N	\N	\N	\N	\N	2025-09-01 01:38:11.406+01	2025-09-01 01:40:19.832+01	efe58c2a572b0e0140f3df4d2a443d52
\.


--
-- TOC entry 5486 (class 0 OID 16744)
-- Dependencies: 227
-- Data for Name: ContactInformations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContactInformations" (id, name, "iconUrl", "inputType", placeholder, "validationPattern", "isRequired", "displayOrder", "isActive", "createdAt", "updatedAt") FROM stdin;
1	Phone Call	phone	phone	Enter phone number	^[+]?[0-9\\s\\-\\(\\)]{10,}$	f	1	t	2025-08-26 17:06:41.913+01	2025-08-26 17:06:41.913+01
2	Email	mail	email	Enter email address	^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$	f	2	t	2025-08-26 17:06:41.913+01	2025-08-26 17:06:41.913+01
3	WhatsApp	message-circle	phone	Enter WhatsApp number	^[+]?[0-9\\s\\-\\(\\)]{10,}$	f	3	t	2025-08-26 17:06:41.913+01	2025-08-26 17:06:41.913+01
4	Website	globe	url	Enter website URL	^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$	f	4	t	2025-08-26 17:06:41.913+01	2025-08-26 17:06:41.913+01
5	Office Hours	clock	text	e.g., Mon-Fri 9AM-5PM	\N	f	5	t	2025-08-26 17:06:41.913+01	2025-08-26 17:06:41.913+01
6	Emergency Contact	alert-circle	phone	Enter emergency contact number	^[+]?[0-9\\s\\-\\(\\)]{10,}$	f	6	t	2025-08-26 17:06:41.913+01	2025-08-26 17:06:41.913+01
7	SMS	message-square	phone	Enter SMS number	^[+]?[0-9\\s\\-\\(\\)]{10,}$	f	7	t	2025-08-26 17:06:41.913+01	2025-08-26 17:06:41.913+01
8	Video Call	video	url	Enter video call link (Zoom, Teams, etc.)	^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$	f	8	t	2025-08-26 17:06:41.913+01	2025-08-26 17:06:41.913+01
9	Social Media	share-2	url	Enter social media profile URL	^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$	f	9	t	2025-08-26 17:06:41.913+01	2025-08-26 17:06:41.913+01
10	Fax	printer	phone	Enter fax number	^[+]?[0-9\\s\\-\\(\\)]{10,}$	f	10	t	2025-08-26 17:06:41.913+01	2025-08-26 17:06:41.913+01
\.


--
-- TOC entry 5488 (class 0 OID 16757)
-- Dependencies: 229
-- Data for Name: DoctorAvailabilities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DoctorAvailabilities" (id, "doctorId", "dayOfWeek", "startTime", "endTime", "isAvailable", "maxPatients", "consultationDuration", "consultationType", "consultationFee", "isInvalidated", "invalidationReason", "invalidatedAt", "createdAt", "updatedAt") FROM stdin;
1	2	0	15:00:00	21:00:00	t	\N	15	both	1700.00	f	\N	\N	2025-08-30 08:59:05.988+01	2025-08-30 08:59:05.988+01
2	2	6	09:00:00	15:00:00	t	\N	15	both	5000.00	f	\N	\N	2025-08-30 08:59:05.997+01	2025-08-30 08:59:05.997+01
3	2	6	19:30:00	23:30:00	t	\N	15	online	2000.00	f	\N	\N	2025-08-30 08:59:05.999+01	2025-08-30 08:59:05.999+01
4	1	6	10:15:00	16:00:00	t	\N	30	online	3500.00	f	\N	\N	2025-08-30 10:02:51.267+01	2025-08-30 10:02:51.267+01
5	3	6	12:00:00	18:00:00	t	\N	60	both	12000.00	f	\N	\N	2025-08-30 11:55:40.408+01	2025-08-30 11:55:40.408+01
6	1	0	11:00:00	17:00:00	t	\N	45	both	1500.00	f	\N	\N	2025-08-31 10:56:55.204+01	2025-08-31 10:56:55.204+01
7	1	0	21:00:00	23:30:00	t	\N	45	online	5000.00	f	\N	\N	2025-08-31 10:56:55.227+01	2025-08-31 10:56:55.227+01
8	3	0	16:15:00	22:00:00	t	\N	45	both	12000.00	f	\N	\N	2025-08-31 16:10:10.102+01	2025-08-31 16:10:10.102+01
10	2	0	23:25:00	23:59:00	t	\N	30	online	4500.00	f	\N	\N	2025-08-31 23:20:03.896+01	2025-08-31 23:20:03.896+01
11	2	1	00:30:00	07:30:00	t	\N	60	online	2300.00	f	\N	\N	2025-08-31 23:23:41.793+01	2025-08-31 23:23:41.793+01
12	2	1	10:00:00	15:00:00	t	\N	45	physical	1200.00	f	\N	\N	2025-08-31 23:44:18.099+01	2025-08-31 23:44:18.099+01
13	2	1	19:00:00	23:00:00	t	\N	45	online	3500.00	f	\N	\N	2025-08-31 23:44:18.104+01	2025-08-31 23:44:18.104+01
14	3	1	01:40:00	09:40:00	t	\N	90	online	5000.00	f	\N	\N	2025-09-01 01:36:06.133+01	2025-09-01 01:36:06.133+01
\.


--
-- TOC entry 5490 (class 0 OID 16770)
-- Dependencies: 231
-- Data for Name: DoctorSpecialties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DoctorSpecialties" (id, "doctorId", "specialtyId", "createdAt", "updatedAt") FROM stdin;
1	1	5	2025-08-26 19:50:45.354+01	2025-08-26 19:50:45.354+01
2	1	7	2025-08-26 19:50:45.354+01	2025-08-26 19:50:45.354+01
3	1	14	2025-08-26 19:50:45.354+01	2025-08-26 19:50:45.354+01
4	1	13	2025-08-26 19:50:45.354+01	2025-08-26 19:50:45.354+01
5	2	3	2025-08-28 04:48:42.532+01	2025-08-28 04:48:42.532+01
6	2	11	2025-08-28 04:48:42.532+01	2025-08-28 04:48:42.532+01
7	2	13	2025-08-28 04:48:42.532+01	2025-08-28 04:48:42.532+01
8	2	8	2025-08-28 04:48:42.532+01	2025-08-28 04:48:42.532+01
9	3	12	2025-08-28 05:00:49.006+01	2025-08-28 05:00:49.006+01
10	3	11	2025-08-28 05:00:49.006+01	2025-08-28 05:00:49.006+01
11	3	7	2025-08-28 05:00:49.006+01	2025-08-28 05:00:49.006+01
\.


--
-- TOC entry 5492 (class 0 OID 16776)
-- Dependencies: 233
-- Data for Name: Doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Doctors" (id, "userId", "licenseNumber", experience, bio, education, languages, "clinicAddress", "operationalHospital", "contactInfo", "paymentMethods", "consultationFee", "consultationDuration", "isVerified", "isActive", "averageRating", "totalReviews", "createdAt", "updatedAt") FROM stdin;
1	2	DOCTOR123KAJDSONXC123	3	What the hell is this man, does it work??	{}	{Whadis,English,French}	{"city": "Ndu", "state": "Northwest", "street": "Ndu", "country": "Cameroon", "postalCode": "00000", "coordinates": {"lat": 6.424853, "lng": 10.79407}, "fullAddress": "Ndu, Ndu, Northwest, Cameroon, 00000"}	Ndu Baptist Hospital	[{"type": "phone", "value": "+237682980313"}, {"type": "website", "value": "https://braidster.netlify.app"}]	[{"value": {"accountName": "Vicky", "accountNumber": "+237682980313"}, "method": "OM"}]	2300.00	15	f	t	\N	0	2025-08-26 19:50:45.311+01	2025-08-26 19:50:45.311+01
2	4	JKDTYW5656Y77853442	12	this is my bio	{}	{English,french,wimbum}	{"city": "Mamfe", "state": "Southwest", "street": "Mamfe", "country": "Cameroon", "postalCode": "00000", "coordinates": {"lat": 5.7527723, "lng": 9.315211}, "fullAddress": "Mamfe, Mamfe, Southwest, Cameroon, 00000"}	mamfe	[{"type": "whatsapp", "value": "+237676177173"}, {"type": "website", "value": "https://braidster.netlify.app"}, {"type": "telegram", "value": "+237670084835"}]	[{"value": {"accountName": "vicky", "accountNumber": "+237650087213"}, "method": "OM"}]	3000.00	30	f	t	\N	0	2025-08-28 04:48:42.477+01	2025-08-28 04:48:42.477+01
3	5	AKJ16784ASFKA293	3	wow, isn't this great??	{}	{english}	{"city": "Ndu", "state": "Northwest", "street": "Ndu", "country": "Cameroon", "postalCode": "00000", "coordinates": {"lat": 6.424853, "lng": 10.79407}, "fullAddress": "Ndu, Ndu, Northwest, Cameroon, 00000"}	Ndu central hospital	[{"type": "phone", "value": "+237681236751"}, {"type": "website", "value": "https://drocine.netlify.app"}]	[{"value": {"accountName": "afanyuy", "accountNumber": "+237682880313"}, "method": "MoMo"}]	1000.00	30	f	t	\N	0	2025-08-28 05:00:48.983+01	2025-08-28 05:00:48.983+01
\.


--
-- TOC entry 5494 (class 0 OID 16790)
-- Dependencies: 235
-- Data for Name: DrugOrders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DrugOrders" (id, "patientId", "pharmacyId", "prescriptionId", status, "totalAmount", currency, "shippingAddress", "billingAddress", "paymentStatus", "paymentId", "estimatedDelivery", "actualDelivery", "trackingNumber", notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5496 (class 0 OID 16801)
-- Dependencies: 237
-- Data for Name: Notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notifications" (id, user_id, title, message, priority, "isRead", "readAt", data, "scheduledAt", "sentAt", "expiresAt", "createdAt", "updatedAt", type) FROM stdin;
70	3	Appointment in 15 minutes	Your appointment with Dr. Omni Creative starts in 15 minutes (1:00 PM).	high	f	\N	{"category": "appointments", "reminderType": "15_minutes", "appointmentId": 5, "appointmentDate": "2025-08-30", "appointmentTime": "13:00:00"}	\N	2025-08-30 12:46:00.154+01	\N	2025-08-30 12:46:00.152+01	2025-08-30 12:46:00.152+01	consultation_reminder
210	6	🔴 Your appointment is starting NOW!	Your appointment with Dr. Omni Creative is starting now (1:40 AM)!	high	f	\N	{"category": "appointments", "reminderType": "start_now", "appointmentId": 30, "appointmentDate": "2025-09-01", "appointmentTime": "01:40:00"}	\N	2025-09-01 01:40:00.053+01	\N	2025-09-01 01:40:00.051+01	2025-09-01 01:40:00.051+01	consultation_reminder
211	5	🩺 Consultation starting NOW	Your consultation with Test drive is starting now (1:40 AM).	high	f	\N	{"category": "appointments", "reminderType": "start_now", "appointmentId": 30, "appointmentDate": "2025-09-01", "appointmentTime": "01:40:00"}	\N	2025-09-01 01:40:07.459+01	\N	2025-09-01 01:40:07.457+01	2025-09-01 01:40:07.457+01	consultation_reminder
78	3	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	f	\N	{"category": "appointments", "appointmentId": 8, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-30 16:13:28.8+01	\N	2025-08-30 16:13:28.798+01	2025-08-30 16:13:28.798+01	appointment_created
79	3	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	f	\N	{"amount": "12000.00", "category": "appointments", "appointmentId": 8, "paymentReference": "c29f663d-75d3-4aaa-8c10-1f00cd3b1554"}	\N	2025-08-30 16:13:30.663+01	\N	2025-08-30 16:13:30.663+01	2025-08-30 16:13:30.663+01	payment_initiated
90	3	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	f	\N	{"amount": "1700.00", "category": "appointments", "appointmentId": 11, "paymentStatus": "SUCCESSFUL", "paymentReference": "3c819fb4-58e7-479f-9c5c-4cf628eca306"}	\N	2025-08-30 16:17:14.088+01	\N	2025-08-30 16:17:14.088+01	2025-08-30 16:17:14.088+01	payment_successful
94	3	Your appointment starts in 30 minutes	Your appointment with Dr. Omni Creative starts in 30 minutes (5:00 PM).	high	f	\N	{"category": "appointments", "reminderType": "30_minutes", "appointmentId": 9, "appointmentDate": "2025-08-30", "appointmentTime": "17:00:00"}	\N	2025-08-30 16:30:00.211+01	\N	2025-08-30 16:30:00.209+01	2025-08-30 16:30:00.209+01	consultation_reminder
98	3	Appointment in 10 minutes - Final preparation	Your appointment with Dr. Omni Creative starts in 10 minutes (5:00 PM). Please prepare to join online.	high	f	\N	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 9, "appointmentDate": "2025-08-30", "appointmentTime": "17:00:00"}	\N	2025-08-30 16:50:00.274+01	\N	2025-08-30 16:50:00.268+01	2025-08-30 16:50:00.268+01	consultation_reminder
102	3	🔴 Your appointment is starting NOW!	Your appointment with Dr. Omni Creative is starting now (5:00 PM)!	high	f	\N	{"category": "appointments", "reminderType": "start_now", "appointmentId": 9, "appointmentDate": "2025-08-30", "appointmentTime": "17:00:00"}	\N	2025-08-30 17:00:00.464+01	\N	2025-08-30 17:00:00.459+01	2025-08-30 17:00:00.459+01	consultation_reminder
4	4	New Appointment Confirmed	You have a new confirmed appointment with Test drive on 2025-08-30 at 09:15.	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "patientName": "Test drive", "appointmentId": 1, "appointmentDate": "2025-08-30", "appointmentTime": "09:15", "consultationType": "online"}	\N	2025-08-30 09:01:50.315+01	\N	2025-08-30 09:01:50.314+01	2025-08-30 11:56:18.626+01	appointment_confirmed
6	4	Patient arriving in 15 minutes	Your patient Test drive has an appointment in 15 minutes (9:15 AM).	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "reminderType": "15_minutes", "appointmentId": 1, "appointmentDate": "2025-08-30", "appointmentTime": "09:15:00"}	\N	2025-08-30 09:02:07.267+01	\N	2025-08-30 09:02:07.266+01	2025-08-30 11:56:18.626+01	consultation_reminder
8	4	Patient consultation in 10 minutes	Final reminder: Your consultation with Test drive starts in 10 minutes (9:15 AM).	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 1, "appointmentDate": "2025-08-30", "appointmentTime": "09:15:00"}	\N	2025-08-30 09:06:03.741+01	\N	2025-08-30 09:06:03.74+01	2025-08-30 11:56:18.626+01	consultation_reminder
10	4	🩺 Patient consultation starting in 5 minutes	URGENT: Your consultation with Test drive starts in 5 minutes (9:15 AM).	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 1, "appointmentDate": "2025-08-30", "appointmentTime": "09:15:00"}	\N	2025-08-30 09:10:03.775+01	\N	2025-08-30 09:10:03.774+01	2025-08-30 11:56:18.626+01	consultation_reminder
14	4	New Appointment Confirmed	You have a new confirmed appointment with Test drive on 2025-08-30 at 09:45.	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "patientName": "Test drive", "appointmentId": 2, "appointmentDate": "2025-08-30", "appointmentTime": "09:45", "consultationType": "online"}	\N	2025-08-30 09:11:52.73+01	\N	2025-08-30 09:11:52.73+01	2025-08-30 11:56:18.626+01	appointment_confirmed
16	4	🩺 Consultation starting NOW	Your consultation with Test drive is starting now (9:15 AM).	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 1, "appointmentDate": "2025-08-30", "appointmentTime": "09:15:00"}	\N	2025-08-30 09:14:06.362+01	\N	2025-08-30 09:14:06.362+01	2025-08-30 11:56:18.626+01	consultation_reminder
18	4	Appointment starting in 30 minutes	Your appointment with Test drive starts in 30 minutes (9:45 AM).	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "reminderType": "30_minutes", "appointmentId": 2, "appointmentDate": "2025-08-30", "appointmentTime": "09:45:00"}	\N	2025-08-30 09:16:03.6+01	\N	2025-08-30 09:16:03.599+01	2025-08-30 11:56:18.626+01	consultation_reminder
20	4	Patient arriving in 15 minutes	Your patient Test drive has an appointment in 15 minutes (9:45 AM).	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "reminderType": "15_minutes", "appointmentId": 2, "appointmentDate": "2025-08-30", "appointmentTime": "09:45:00"}	\N	2025-08-30 09:30:03.022+01	\N	2025-08-30 09:30:03.021+01	2025-08-30 11:56:18.626+01	consultation_reminder
71	5	Patient arriving in 15 minutes	Your patient Konfor Cynthia has an appointment in 15 minutes (1:00 PM).	high	t	2025-08-31 16:30:17.372+01	{"category": "appointments", "reminderType": "15_minutes", "appointmentId": 5, "appointmentDate": "2025-08-30", "appointmentTime": "13:00:00"}	\N	2025-08-30 12:46:04.338+01	\N	2025-08-30 12:46:04.334+01	2025-08-31 16:30:17.373+01	consultation_reminder
91	4	New Appointment Confirmed	You have a new confirmed appointment with Konfor Cynthia on 2025-08-31 at 15:00.	high	t	2025-08-31 23:49:41.213+01	{"category": "appointments", "patientName": "Konfor Cynthia", "appointmentId": 11, "appointmentDate": "2025-08-31", "appointmentTime": "15:00", "consultationType": "physical"}	\N	2025-08-30 16:17:14.098+01	\N	2025-08-30 16:17:14.098+01	2025-08-31 23:49:41.214+01	appointment_confirmed
72	3	Appointment in 10 minutes - Final preparation	Your appointment with Dr. Omni Creative starts in 10 minutes (1:00 PM). Please prepare to join online.	high	f	\N	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 5, "appointmentDate": "2025-08-30", "appointmentTime": "13:00:00"}	\N	2025-08-30 12:50:00.111+01	\N	2025-08-30 12:50:00.11+01	2025-08-30 12:50:00.11+01	consultation_reminder
80	3	Payment Failed	Your payment failed. Please try again or contact support.	high	f	\N	{"amount": "12000.00", "category": "appointments", "appointmentId": 8, "paymentStatus": "FAILED", "paymentReference": "c29f663d-75d3-4aaa-8c10-1f00cd3b1554"}	\N	2025-08-30 16:13:42.204+01	\N	2025-08-30 16:13:42.203+01	2025-08-30 16:13:42.203+01	payment_failed
81	3	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	f	\N	{"category": "appointments", "appointmentId": 9, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-30 16:13:49.308+01	\N	2025-08-30 16:13:49.307+01	2025-08-30 16:13:49.307+01	appointment_created
82	3	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	f	\N	{"amount": "12000.00", "category": "appointments", "appointmentId": 9, "paymentReference": "475ebbaa-fef2-4c7e-aa17-e5dd59158676"}	\N	2025-08-30 16:13:50.996+01	\N	2025-08-30 16:13:50.996+01	2025-08-30 16:13:50.996+01	payment_initiated
83	3	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	f	\N	{"amount": "12000.00", "category": "appointments", "appointmentId": 9, "paymentStatus": "SUCCESSFUL", "paymentReference": "475ebbaa-fef2-4c7e-aa17-e5dd59158676"}	\N	2025-08-30 16:14:08.292+01	\N	2025-08-30 16:14:08.292+01	2025-08-30 16:14:08.292+01	payment_successful
96	3	Appointment in 15 minutes	Your appointment with Dr. Omni Creative starts in 15 minutes (5:00 PM).	high	f	\N	{"category": "appointments", "reminderType": "15_minutes", "appointmentId": 9, "appointmentDate": "2025-08-30", "appointmentTime": "17:00:00"}	\N	2025-08-30 16:46:00.247+01	\N	2025-08-30 16:46:00.241+01	2025-08-30 16:46:00.241+01	consultation_reminder
1	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-30 10:04:49.604+01	{"category": "appointments", "appointmentId": 1, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-30 09:01:38.428+01	\N	2025-08-30 09:01:38.427+01	2025-08-30 10:04:49.605+01	appointment_created
2	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-30 10:04:49.604+01	{"amount": "5000.00", "category": "appointments", "appointmentId": 1, "paymentReference": "77ad0924-3530-4504-8f36-cfa3138d9027"}	\N	2025-08-30 09:01:39.314+01	\N	2025-08-30 09:01:39.313+01	2025-08-30 10:04:49.605+01	payment_initiated
3	6	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	t	2025-08-30 10:04:49.604+01	{"amount": "5000.00", "category": "appointments", "appointmentId": 1, "paymentStatus": "SUCCESSFUL", "paymentReference": "77ad0924-3530-4504-8f36-cfa3138d9027"}	\N	2025-08-30 09:01:50.305+01	\N	2025-08-30 09:01:50.304+01	2025-08-30 10:04:49.605+01	payment_successful
5	6	Appointment in 15 minutes	Your appointment with Dr. Keyz Global starts in 15 minutes (9:15 AM).	high	t	2025-08-30 10:04:49.604+01	{"category": "appointments", "reminderType": "15_minutes", "appointmentId": 1, "appointmentDate": "2025-08-30", "appointmentTime": "09:15:00"}	\N	2025-08-30 09:02:00.072+01	\N	2025-08-30 09:02:00.064+01	2025-08-30 10:04:49.605+01	consultation_reminder
31	6	Appointment in 2 hours	Your appointment with Dr. Keyz Global is in 2 hours (12:00 PM).	high	t	2025-08-30 10:04:49.604+01	{"category": "appointments", "reminderType": "2_hours", "appointmentId": 3, "appointmentDate": "2025-08-30", "appointmentTime": "12:00:00"}	\N	2025-08-30 10:00:00.207+01	\N	2025-08-30 10:00:00.205+01	2025-08-30 10:04:49.605+01	consultation_reminder
38	2	New Appointment Confirmed	You have a new confirmed appointment with Test drive on 2025-08-30 at 10:15.	high	t	2025-08-30 11:53:45.811+01	{"category": "appointments", "patientName": "Test drive", "appointmentId": 4, "appointmentDate": "2025-08-30", "appointmentTime": "10:15", "consultationType": "online"}	\N	2025-08-30 10:04:18.022+01	\N	2025-08-30 10:04:18.022+01	2025-08-30 11:53:45.811+01	appointment_confirmed
22	4	Patient consultation in 10 minutes	Final reminder: Your consultation with Test drive starts in 10 minutes (9:45 AM).	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 2, "appointmentDate": "2025-08-30", "appointmentTime": "09:45:00"}	\N	2025-08-30 09:36:04.402+01	\N	2025-08-30 09:36:04.4+01	2025-08-30 11:56:18.626+01	consultation_reminder
24	4	🩺 Patient consultation starting in 5 minutes	URGENT: Your consultation with Test drive starts in 5 minutes (9:45 AM).	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 2, "appointmentDate": "2025-08-30", "appointmentTime": "09:45:00"}	\N	2025-08-30 09:40:05.925+01	\N	2025-08-30 09:40:05.923+01	2025-08-30 11:56:18.626+01	consultation_reminder
26	4	🩺 Consultation starting NOW	Your consultation with Test drive is starting now (9:45 AM).	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 2, "appointmentDate": "2025-08-30", "appointmentTime": "09:45:00"}	\N	2025-08-30 09:44:10.07+01	\N	2025-08-30 09:44:10.068+01	2025-08-30 11:56:18.626+01	consultation_reminder
30	4	New Appointment Confirmed	You have a new confirmed appointment with Test drive on 2025-08-30 at 12:00.	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "patientName": "Test drive", "appointmentId": 3, "appointmentDate": "2025-08-30", "appointmentTime": "12:00", "consultationType": "online"}	\N	2025-08-30 09:58:58.397+01	\N	2025-08-30 09:58:58.396+01	2025-08-30 11:56:18.626+01	appointment_confirmed
33	4	Appointment in 2 hours	Your appointment with Test drive is in 2 hours (12:00 PM).	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "reminderType": "2_hours", "appointmentId": 3, "appointmentDate": "2025-08-30", "appointmentTime": "12:00:00"}	\N	2025-08-30 10:00:05.523+01	\N	2025-08-30 10:00:05.521+01	2025-08-30 11:56:18.626+01	consultation_reminder
34	4	Appointment in 2 hours	Your appointment with Test drive is in 2 hours (12:00 PM).	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "reminderType": "2_hours", "appointmentId": 3, "appointmentDate": "2025-08-30", "appointmentTime": "12:00:00"}	\N	2025-08-30 10:00:05.775+01	\N	2025-08-30 10:00:05.773+01	2025-08-30 11:56:18.626+01	consultation_reminder
93	4	Tomorrow's Appointment Schedule	You have an appointment with Konfor Cynthia tomorrow (Sunday, August 31, 2025) at 3:00 PM.	high	t	2025-08-31 23:49:41.213+01	{"category": "appointments", "reminderType": "day_before", "appointmentId": 11, "appointmentDate": "2025-08-31", "appointmentTime": "15:00:00"}	\N	2025-08-30 16:18:03.693+01	\N	2025-08-30 16:18:03.692+01	2025-08-31 23:49:41.214+01	consultation_reminder
7	6	Appointment in 10 minutes - Final preparation	Your appointment with Dr. Keyz Global starts in 10 minutes (9:15 AM). Please prepare to join online.	high	t	2025-08-30 10:04:49.604+01	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 1, "appointmentDate": "2025-08-30", "appointmentTime": "09:15:00"}	\N	2025-08-30 09:06:00.151+01	\N	2025-08-30 09:06:00.149+01	2025-08-30 10:04:49.605+01	consultation_reminder
9	6	🚨 Appointment starting in 5 minutes!	URGENT: Your appointment with Dr. Keyz Global starts in 5 minutes (9:15 AM)!	high	t	2025-08-30 10:04:49.604+01	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 1, "appointmentDate": "2025-08-30", "appointmentTime": "09:15:00"}	\N	2025-08-30 09:10:00.161+01	\N	2025-08-30 09:10:00.16+01	2025-08-30 10:04:49.605+01	consultation_reminder
11	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-30 10:04:49.604+01	{"category": "appointments", "appointmentId": 2, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-30 09:11:40.951+01	\N	2025-08-30 09:11:40.95+01	2025-08-30 10:04:49.605+01	appointment_created
12	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-30 10:04:49.604+01	{"amount": "5000.00", "category": "appointments", "appointmentId": 2, "paymentReference": "40ab510e-4136-4125-a32c-8307a0b3c189"}	\N	2025-08-30 09:11:41.889+01	\N	2025-08-30 09:11:41.889+01	2025-08-30 10:04:49.605+01	payment_initiated
13	6	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	t	2025-08-30 10:04:49.604+01	{"amount": "5000.00", "category": "appointments", "appointmentId": 2, "paymentStatus": "SUCCESSFUL", "paymentReference": "40ab510e-4136-4125-a32c-8307a0b3c189"}	\N	2025-08-30 09:11:52.719+01	\N	2025-08-30 09:11:52.718+01	2025-08-30 10:04:49.605+01	payment_successful
15	6	🔴 Your appointment is starting NOW!	Your appointment with Dr. Keyz Global is starting now (9:15 AM)!	high	t	2025-08-30 10:04:49.604+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 1, "appointmentDate": "2025-08-30", "appointmentTime": "09:15:00"}	\N	2025-08-30 09:14:00.198+01	\N	2025-08-30 09:14:00.192+01	2025-08-30 10:04:49.605+01	consultation_reminder
17	6	Your appointment starts in 30 minutes	Your appointment with Dr. Keyz Global starts in 30 minutes (9:45 AM).	high	t	2025-08-30 10:04:49.604+01	{"category": "appointments", "reminderType": "30_minutes", "appointmentId": 2, "appointmentDate": "2025-08-30", "appointmentTime": "09:45:00"}	\N	2025-08-30 09:16:00.238+01	\N	2025-08-30 09:16:00.234+01	2025-08-30 10:04:49.605+01	consultation_reminder
19	6	Appointment in 15 minutes	Your appointment with Dr. Keyz Global starts in 15 minutes (9:45 AM).	high	t	2025-08-30 10:04:49.604+01	{"category": "appointments", "reminderType": "15_minutes", "appointmentId": 2, "appointmentDate": "2025-08-30", "appointmentTime": "09:45:00"}	\N	2025-08-30 09:30:00.146+01	\N	2025-08-30 09:30:00.145+01	2025-08-30 10:04:49.605+01	consultation_reminder
21	6	Appointment in 10 minutes - Final preparation	Your appointment with Dr. Keyz Global starts in 10 minutes (9:45 AM). Please prepare to join online.	high	t	2025-08-30 10:04:49.604+01	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 2, "appointmentDate": "2025-08-30", "appointmentTime": "09:45:00"}	\N	2025-08-30 09:36:00.135+01	\N	2025-08-30 09:36:00.133+01	2025-08-30 10:04:49.605+01	consultation_reminder
23	6	🚨 Appointment starting in 5 minutes!	URGENT: Your appointment with Dr. Keyz Global starts in 5 minutes (9:45 AM)!	high	t	2025-08-30 10:04:49.604+01	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 2, "appointmentDate": "2025-08-30", "appointmentTime": "09:45:00"}	\N	2025-08-30 09:40:00.138+01	\N	2025-08-30 09:40:00.136+01	2025-08-30 10:04:49.605+01	consultation_reminder
25	6	🔴 Your appointment is starting NOW!	Your appointment with Dr. Keyz Global is starting now (9:45 AM)!	high	t	2025-08-30 10:04:49.604+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 2, "appointmentDate": "2025-08-30", "appointmentTime": "09:45:00"}	\N	2025-08-30 09:44:00.184+01	\N	2025-08-30 09:44:00.181+01	2025-08-30 10:04:49.605+01	consultation_reminder
27	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-30 10:04:49.604+01	{"category": "appointments", "appointmentId": 3, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-30 09:58:46.436+01	\N	2025-08-30 09:58:46.435+01	2025-08-30 10:04:49.605+01	appointment_created
28	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-30 10:04:49.604+01	{"amount": "5000.00", "category": "appointments", "appointmentId": 3, "paymentReference": "a0bf2936-3f70-455f-a99d-b1bf1c60a314"}	\N	2025-08-30 09:58:47.609+01	\N	2025-08-30 09:58:47.609+01	2025-08-30 10:04:49.605+01	payment_initiated
29	6	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	t	2025-08-30 10:04:49.604+01	{"amount": "5000.00", "category": "appointments", "appointmentId": 3, "paymentStatus": "SUCCESSFUL", "paymentReference": "a0bf2936-3f70-455f-a99d-b1bf1c60a314"}	\N	2025-08-30 09:58:58.382+01	\N	2025-08-30 09:58:58.381+01	2025-08-30 10:04:49.605+01	payment_successful
32	6	Appointment in 2 hours	Your appointment with Dr. Keyz Global is in 2 hours (12:00 PM).	high	t	2025-08-30 10:04:49.604+01	{"category": "appointments", "reminderType": "2_hours", "appointmentId": 3, "appointmentDate": "2025-08-30", "appointmentTime": "12:00:00"}	\N	2025-08-30 10:00:00.241+01	\N	2025-08-30 10:00:00.239+01	2025-08-30 10:04:49.605+01	consultation_reminder
35	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-30 10:04:49.604+01	{"category": "appointments", "appointmentId": 4, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-30 10:04:06.366+01	\N	2025-08-30 10:04:06.366+01	2025-08-30 10:04:49.605+01	appointment_created
36	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-30 10:04:49.604+01	{"amount": "3500.00", "category": "appointments", "appointmentId": 4, "paymentReference": "4973370e-0bf5-48a6-9044-43d39cf65726"}	\N	2025-08-30 10:04:07.285+01	\N	2025-08-30 10:04:07.284+01	2025-08-30 10:04:49.605+01	payment_initiated
37	6	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	t	2025-08-30 10:04:49.604+01	{"amount": "3500.00", "category": "appointments", "appointmentId": 4, "paymentStatus": "SUCCESSFUL", "paymentReference": "4973370e-0bf5-48a6-9044-43d39cf65726"}	\N	2025-08-30 10:04:18.018+01	\N	2025-08-30 10:04:18.018+01	2025-08-30 10:04:49.605+01	payment_successful
74	3	🚨 Appointment starting in 5 minutes!	URGENT: Your appointment with Dr. Omni Creative starts in 5 minutes (1:00 PM)!	high	f	\N	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 5, "appointmentDate": "2025-08-30", "appointmentTime": "13:00:00"}	\N	2025-08-30 12:56:00.173+01	\N	2025-08-30 12:56:00.172+01	2025-08-30 12:56:00.172+01	consultation_reminder
85	3	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	f	\N	{"category": "appointments", "appointmentId": 10, "consultationType": "physical", "appointmentStatus": "pending_payment"}	\N	2025-08-30 16:16:36.287+01	\N	2025-08-30 16:16:36.287+01	2025-08-30 16:16:36.287+01	appointment_created
40	2	Patient consultation in 10 minutes	Final reminder: Your consultation with Test drive starts in 10 minutes (10:15 AM).	high	t	2025-08-30 11:53:45.811+01	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 4, "appointmentDate": "2025-08-30", "appointmentTime": "10:15:00"}	\N	2025-08-30 10:06:05.148+01	\N	2025-08-30 10:06:05.148+01	2025-08-30 11:53:45.811+01	consultation_reminder
86	3	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	f	\N	{"amount": "1700.00", "category": "appointments", "appointmentId": 10, "paymentReference": "84469d1a-07dc-4b4b-9780-1866961d95ba"}	\N	2025-08-30 16:16:37.688+01	\N	2025-08-30 16:16:37.687+01	2025-08-30 16:16:37.687+01	payment_initiated
39	6	Appointment in 10 minutes - Final preparation	Your appointment with Dr. Keyz Tester starts in 10 minutes (10:15 AM). Please prepare to join online.	high	t	2025-08-30 11:33:45.535+01	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 4, "appointmentDate": "2025-08-30", "appointmentTime": "10:15:00"}	\N	2025-08-30 10:06:00.301+01	\N	2025-08-30 10:06:00.297+01	2025-08-30 11:33:45.535+01	consultation_reminder
41	6	🚨 Appointment starting in 5 minutes!	URGENT: Your appointment with Dr. Keyz Tester starts in 5 minutes (10:15 AM)!	high	t	2025-08-30 11:33:45.535+01	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 4, "appointmentDate": "2025-08-30", "appointmentTime": "10:15:00"}	\N	2025-08-30 10:10:00.203+01	\N	2025-08-30 10:10:00.202+01	2025-08-30 11:33:45.535+01	consultation_reminder
43	6	🔴 Your appointment is starting NOW!	Your appointment with Dr. Keyz Tester is starting now (10:15 AM)!	high	t	2025-08-30 11:33:45.535+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 4, "appointmentDate": "2025-08-30", "appointmentTime": "10:15:00"}	\N	2025-08-30 10:14:00.195+01	\N	2025-08-30 10:14:00.194+01	2025-08-30 11:33:45.535+01	consultation_reminder
45	6	Your appointment starts in 30 minutes	Your appointment with Dr. Keyz Global starts in 30 minutes (12:00 PM).	high	t	2025-08-30 11:33:45.535+01	{"category": "appointments", "reminderType": "30_minutes", "appointmentId": 3, "appointmentDate": "2025-08-30", "appointmentTime": "12:00:00"}	\N	2025-08-30 11:30:00.222+01	\N	2025-08-30 11:30:00.21+01	2025-08-30 11:33:45.535+01	consultation_reminder
42	2	🩺 Patient consultation starting in 5 minutes	URGENT: Your consultation with Test drive starts in 5 minutes (10:15 AM).	high	t	2025-08-30 11:53:45.811+01	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 4, "appointmentDate": "2025-08-30", "appointmentTime": "10:15:00"}	\N	2025-08-30 10:10:04.615+01	\N	2025-08-30 10:10:04.614+01	2025-08-30 11:53:45.811+01	consultation_reminder
44	2	🩺 Consultation starting NOW	Your consultation with Test drive is starting now (10:15 AM).	high	t	2025-08-30 11:53:45.811+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 4, "appointmentDate": "2025-08-30", "appointmentTime": "10:15:00"}	\N	2025-08-30 10:14:09.635+01	\N	2025-08-30 10:14:09.635+01	2025-08-30 11:53:45.811+01	consultation_reminder
46	4	Appointment starting in 30 minutes	Your appointment with Test drive starts in 30 minutes (12:00 PM).	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "reminderType": "30_minutes", "appointmentId": 3, "appointmentDate": "2025-08-30", "appointmentTime": "12:00:00"}	\N	2025-08-30 11:30:03.611+01	\N	2025-08-30 11:30:03.608+01	2025-08-30 11:56:18.626+01	consultation_reminder
48	4	Patient arriving in 15 minutes	Your patient Test drive has an appointment in 15 minutes (12:00 PM).	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "reminderType": "15_minutes", "appointmentId": 3, "appointmentDate": "2025-08-30", "appointmentTime": "12:00:00"}	\N	2025-08-30 11:46:11.275+01	\N	2025-08-30 11:46:11.273+01	2025-08-30 11:56:18.626+01	consultation_reminder
50	4	Patient consultation in 10 minutes	Final reminder: Your consultation with Test drive starts in 10 minutes (12:00 PM).	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 3, "appointmentDate": "2025-08-30", "appointmentTime": "12:00:00"}	\N	2025-08-30 11:50:03.381+01	\N	2025-08-30 11:50:03.378+01	2025-08-30 11:56:18.626+01	consultation_reminder
52	4	🩺 Patient consultation starting in 5 minutes	URGENT: Your consultation with Test drive starts in 5 minutes (12:00 PM).	high	t	2025-08-30 11:56:18.626+01	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 3, "appointmentDate": "2025-08-30", "appointmentTime": "12:00:00"}	\N	2025-08-30 11:56:05.743+01	\N	2025-08-30 11:56:05.741+01	2025-08-30 11:56:18.626+01	consultation_reminder
58	5	New Appointment Confirmed	You have a new confirmed appointment with Konfor Cynthia on 2025-08-30 at 13:00.	high	t	2025-08-30 12:18:31.538+01	{"category": "appointments", "patientName": "Konfor Cynthia", "appointmentId": 5, "appointmentDate": "2025-08-30", "appointmentTime": "13:00", "consultationType": "online"}	\N	2025-08-30 12:18:18.221+01	\N	2025-08-30 12:18:18.221+01	2025-08-30 12:18:31.538+01	appointment_confirmed
57	3	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	t	2025-08-30 12:19:49.245+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 5, "paymentStatus": "SUCCESSFUL", "paymentReference": "6ff72954-6d87-4175-8890-b955ee8ce654"}	\N	2025-08-30 12:18:18.208+01	\N	2025-08-30 12:18:18.208+01	2025-08-30 12:19:49.245+01	payment_successful
55	3	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-30 12:20:02.901+01	{"category": "appointments", "appointmentId": 5, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-30 12:18:06.33+01	\N	2025-08-30 12:18:06.33+01	2025-08-30 12:20:02.901+01	appointment_created
56	3	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-30 12:20:02.901+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 5, "paymentReference": "6ff72954-6d87-4175-8890-b955ee8ce654"}	\N	2025-08-30 12:18:07.228+01	\N	2025-08-30 12:18:07.227+01	2025-08-30 12:20:02.901+01	payment_initiated
54	4	🩺 Consultation starting NOW	Your consultation with Test drive is starting now (12:00 PM).	high	t	2025-08-30 12:33:25.965+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 3, "appointmentDate": "2025-08-30", "appointmentTime": "12:00:00"}	\N	2025-08-30 12:00:04.571+01	\N	2025-08-30 12:00:04.57+01	2025-08-30 12:33:25.965+01	consultation_reminder
76	3	🔴 Your appointment is starting NOW!	Your appointment with Dr. Omni Creative is starting now (1:00 PM)!	high	f	\N	{"category": "appointments", "reminderType": "start_now", "appointmentId": 5, "appointmentDate": "2025-08-30", "appointmentTime": "13:00:00"}	\N	2025-08-30 13:00:00.262+01	\N	2025-08-30 13:00:00.26+01	2025-08-30 13:00:00.26+01	consultation_reminder
87	3	Payment Failed	Your payment failed. Please try again or contact support.	high	f	\N	{"amount": "1700.00", "category": "appointments", "appointmentId": 10, "paymentStatus": "FAILED", "paymentReference": "84469d1a-07dc-4b4b-9780-1866961d95ba"}	\N	2025-08-30 16:16:48.879+01	\N	2025-08-30 16:16:48.878+01	2025-08-30 16:16:48.878+01	payment_failed
88	3	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	f	\N	{"category": "appointments", "appointmentId": 11, "consultationType": "physical", "appointmentStatus": "pending_payment"}	\N	2025-08-30 16:16:55.4+01	\N	2025-08-30 16:16:55.4+01	2025-08-30 16:16:55.4+01	appointment_created
89	3	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	f	\N	{"amount": "1700.00", "category": "appointments", "appointmentId": 11, "paymentReference": "3c819fb4-58e7-479f-9c5c-4cf628eca306"}	\N	2025-08-30 16:16:56.355+01	\N	2025-08-30 16:16:56.354+01	2025-08-30 16:16:56.354+01	payment_initiated
92	3	Appointment Reminder - Tomorrow	Hi Konfor Cynthia, you have an appointment with Dr. Keyz Global tomorrow (Sunday, August 31, 2025) at 3:00 PM.	high	t	2025-08-30 16:29:08.121+01	{"category": "appointments", "reminderType": "day_before", "appointmentId": 11, "appointmentDate": "2025-08-31", "appointmentTime": "15:00:00"}	\N	2025-08-30 16:18:00.197+01	\N	2025-08-30 16:18:00.191+01	2025-08-30 16:29:08.121+01	consultation_reminder
100	3	🚨 Appointment starting in 5 minutes!	URGENT: Your appointment with Dr. Omni Creative starts in 5 minutes (5:00 PM)!	high	f	\N	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 9, "appointmentDate": "2025-08-30", "appointmentTime": "17:00:00"}	\N	2025-08-30 16:56:00.292+01	\N	2025-08-30 16:56:00.291+01	2025-08-30 16:56:00.291+01	consultation_reminder
59	3	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-30 12:32:01.937+01	{"category": "appointments", "appointmentId": 6, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-30 12:21:57.333+01	\N	2025-08-30 12:21:57.333+01	2025-08-30 12:32:01.937+01	appointment_created
60	3	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-30 12:32:01.937+01	{"amount": "5000.00", "category": "appointments", "appointmentId": 6, "paymentReference": "5f5a3549-6be6-466e-8ce4-3ce2dd6c92cd"}	\N	2025-08-30 12:21:58.056+01	\N	2025-08-30 12:21:58.055+01	2025-08-30 12:32:01.937+01	payment_initiated
61	3	Payment Failed	Your payment failed. Please try again or contact support.	high	t	2025-08-30 12:32:01.937+01	{"amount": "5000.00", "category": "appointments", "appointmentId": 6, "paymentStatus": "FAILED", "paymentReference": "5f5a3549-6be6-466e-8ce4-3ce2dd6c92cd"}	\N	2025-08-30 12:22:08.808+01	\N	2025-08-30 12:22:08.807+01	2025-08-30 12:32:01.937+01	payment_failed
62	3	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-30 12:32:01.937+01	{"category": "appointments", "appointmentId": 7, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-30 12:29:28.463+01	\N	2025-08-30 12:29:28.463+01	2025-08-30 12:32:01.937+01	appointment_created
63	3	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-30 12:32:01.937+01	{"amount": "5000.00", "category": "appointments", "appointmentId": 7, "paymentReference": "df5af4b0-7a9d-402e-8ff8-95b5564df57c"}	\N	2025-08-30 12:29:29.413+01	\N	2025-08-30 12:29:29.412+01	2025-08-30 12:32:01.937+01	payment_initiated
64	3	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	t	2025-08-30 12:32:01.937+01	{"amount": "5000.00", "category": "appointments", "appointmentId": 7, "paymentStatus": "SUCCESSFUL", "paymentReference": "df5af4b0-7a9d-402e-8ff8-95b5564df57c"}	\N	2025-08-30 12:29:40.24+01	\N	2025-08-30 12:29:40.238+01	2025-08-30 12:32:01.937+01	payment_successful
66	3	🔴 Your appointment is starting NOW!	Your appointment with Dr. Keyz Global is starting now (12:30 PM)!	high	t	2025-08-30 12:32:01.937+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 7, "appointmentDate": "2025-08-30", "appointmentTime": "12:30:00"}	\N	2025-08-30 12:30:00.197+01	\N	2025-08-30 12:30:00.195+01	2025-08-30 12:32:01.937+01	consultation_reminder
68	3	Your appointment starts in 30 minutes	Your appointment with Dr. Omni Creative starts in 30 minutes (1:00 PM).	high	t	2025-08-30 12:32:01.937+01	{"category": "appointments", "reminderType": "30_minutes", "appointmentId": 5, "appointmentDate": "2025-08-30", "appointmentTime": "13:00:00"}	\N	2025-08-30 12:30:06.534+01	\N	2025-08-30 12:30:06.531+01	2025-08-30 12:32:01.937+01	consultation_reminder
65	4	New Appointment Confirmed	You have a new confirmed appointment with Konfor Cynthia on 2025-08-30 at 12:30.	high	t	2025-08-30 12:33:25.965+01	{"category": "appointments", "patientName": "Konfor Cynthia", "appointmentId": 7, "appointmentDate": "2025-08-30", "appointmentTime": "12:30", "consultationType": "online"}	\N	2025-08-30 12:29:40.251+01	\N	2025-08-30 12:29:40.249+01	2025-08-30 12:33:25.965+01	appointment_confirmed
67	4	🩺 Consultation starting NOW	Your consultation with Konfor Cynthia is starting now (12:30 PM).	high	t	2025-08-30 12:33:25.965+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 7, "appointmentDate": "2025-08-30", "appointmentTime": "12:30:00"}	\N	2025-08-30 12:30:03.899+01	\N	2025-08-30 12:30:03.898+01	2025-08-30 12:33:25.965+01	consultation_reminder
47	6	Appointment in 15 minutes	Your appointment with Dr. Keyz Global starts in 15 minutes (12:00 PM).	high	t	2025-08-30 20:37:06.951+01	{"category": "appointments", "reminderType": "15_minutes", "appointmentId": 3, "appointmentDate": "2025-08-30", "appointmentTime": "12:00:00"}	\N	2025-08-30 11:46:00.144+01	\N	2025-08-30 11:46:00.141+01	2025-08-30 20:37:06.953+01	consultation_reminder
49	6	Appointment in 10 minutes - Final preparation	Your appointment with Dr. Keyz Global starts in 10 minutes (12:00 PM). Please prepare to join online.	high	t	2025-08-30 20:37:06.951+01	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 3, "appointmentDate": "2025-08-30", "appointmentTime": "12:00:00"}	\N	2025-08-30 11:50:00.128+01	\N	2025-08-30 11:50:00.126+01	2025-08-30 20:37:06.953+01	consultation_reminder
51	6	🚨 Appointment starting in 5 minutes!	URGENT: Your appointment with Dr. Keyz Global starts in 5 minutes (12:00 PM)!	high	t	2025-08-30 20:37:06.951+01	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 3, "appointmentDate": "2025-08-30", "appointmentTime": "12:00:00"}	\N	2025-08-30 11:56:00.14+01	\N	2025-08-30 11:56:00.138+01	2025-08-30 20:37:06.953+01	consultation_reminder
53	6	🔴 Your appointment is starting NOW!	Your appointment with Dr. Keyz Global is starting now (12:00 PM)!	high	t	2025-08-30 20:37:06.951+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 3, "appointmentDate": "2025-08-30", "appointmentTime": "12:00:00"}	\N	2025-08-30 12:00:00.183+01	\N	2025-08-30 12:00:00.181+01	2025-08-30 20:37:06.953+01	consultation_reminder
104	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-30 20:37:06.951+01	{"category": "appointments", "appointmentId": 12, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-30 20:36:13.082+01	\N	2025-08-30 20:36:13.082+01	2025-08-30 20:37:06.953+01	appointment_created
107	4	New Appointment Confirmed	You have a new confirmed appointment with Test drive on 2025-08-31 at 15:15.	high	t	2025-08-31 23:49:41.213+01	{"category": "appointments", "patientName": "Test drive", "appointmentId": 12, "appointmentDate": "2025-08-31", "appointmentTime": "15:15", "consultationType": "online"}	\N	2025-08-30 20:36:27.742+01	\N	2025-08-30 20:36:27.741+01	2025-08-31 23:49:41.214+01	appointment_confirmed
105	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-30 20:37:06.951+01	{"amount": "1700.00", "category": "appointments", "appointmentId": 12, "paymentReference": "3804759d-84fb-4408-a5b2-90fcad070afa"}	\N	2025-08-30 20:36:15.185+01	\N	2025-08-30 20:36:15.184+01	2025-08-30 20:37:06.953+01	payment_initiated
106	6	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	t	2025-08-30 20:37:06.951+01	{"amount": "1700.00", "category": "appointments", "appointmentId": 12, "paymentStatus": "SUCCESSFUL", "paymentReference": "3804759d-84fb-4408-a5b2-90fcad070afa"}	\N	2025-08-30 20:36:27.701+01	\N	2025-08-30 20:36:27.7+01	2025-08-30 20:37:06.953+01	payment_successful
110	3	Appointment in 4 hours	Your appointment with Dr. Keyz Global is in 4 hours (3:00 PM) on Sunday, August 31, 2025.	high	f	\N	{"category": "appointments", "reminderType": "4_hours", "appointmentId": 11, "appointmentDate": "2025-08-31", "appointmentTime": "15:00:00"}	\N	2025-08-31 10:30:00.122+01	\N	2025-08-31 10:30:00.118+01	2025-08-31 10:30:00.118+01	consultation_reminder
108	6	Appointment Reminder - Tomorrow	Hi Test drive, you have an appointment with Dr. Keyz Global tomorrow (Sunday, August 31, 2025) at 3:15 PM.	high	t	2025-08-31 00:08:12.444+01	{"category": "appointments", "reminderType": "day_before", "appointmentId": 12, "appointmentDate": "2025-08-31", "appointmentTime": "15:15:00"}	\N	2025-08-30 20:38:00.233+01	\N	2025-08-30 20:38:00.23+01	2025-08-31 00:08:12.444+01	consultation_reminder
112	6	Appointment in 4 hours	Your appointment with Dr. Keyz Global is in 4 hours (3:15 PM) on Sunday, August 31, 2025.	high	t	2025-08-31 00:08:12.444+01	{"category": "appointments", "reminderType": "4_hours", "appointmentId": 12, "appointmentDate": "2025-08-31", "appointmentTime": "15:15:00"}	\N	2025-08-31 10:30:10.484+01	\N	2025-08-31 10:30:10.48+01	2025-08-31 00:08:12.444+01	consultation_reminder
114	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-31 00:08:12.444+01	{"category": "appointments", "appointmentId": 13, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-31 11:04:47.612+01	\N	2025-08-31 11:04:47.611+01	2025-08-31 00:08:12.444+01	appointment_created
115	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-31 00:08:12.444+01	{"amount": "1500.00", "category": "appointments", "appointmentId": 13, "paymentReference": "5fcd27d0-3be0-4082-bc5d-289c00702007"}	\N	2025-08-31 11:04:49.561+01	\N	2025-08-31 11:04:49.56+01	2025-08-31 00:08:12.444+01	payment_initiated
116	6	Payment Failed	Your payment failed. Please try again or contact support.	high	t	2025-08-31 00:08:12.444+01	{"amount": "1500.00", "category": "appointments", "appointmentId": 13, "paymentStatus": "FAILED", "paymentReference": "5fcd27d0-3be0-4082-bc5d-289c00702007"}	\N	2025-08-31 11:05:01.515+01	\N	2025-08-31 11:05:01.515+01	2025-08-31 00:08:12.444+01	payment_failed
117	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-31 00:08:12.444+01	{"category": "appointments", "appointmentId": 14, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-31 00:01:58.668+01	\N	2025-08-31 00:01:58.667+01	2025-08-31 00:08:12.444+01	appointment_created
118	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-31 00:08:12.444+01	{"amount": "1500.00", "category": "appointments", "appointmentId": 14, "paymentReference": "68564fc8-82fa-4ce4-8230-cfde9ac1825e"}	\N	2025-08-31 00:02:01.221+01	\N	2025-08-31 00:02:01.221+01	2025-08-31 00:08:12.444+01	payment_initiated
119	6	Payment Failed	Your payment failed. Please try again or contact support.	high	t	2025-08-31 00:08:12.444+01	{"amount": "1500.00", "category": "appointments", "appointmentId": 14, "paymentStatus": "FAILED", "paymentReference": "68564fc8-82fa-4ce4-8230-cfde9ac1825e"}	\N	2025-08-31 00:02:13.778+01	\N	2025-08-31 00:02:13.778+01	2025-08-31 00:08:12.444+01	payment_failed
120	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-31 00:08:12.444+01	{"category": "appointments", "appointmentId": 15, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-31 00:02:31.887+01	\N	2025-08-31 00:02:31.887+01	2025-08-31 00:08:12.444+01	appointment_created
121	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-31 00:08:12.444+01	{"amount": "1500.00", "category": "appointments", "appointmentId": 15, "paymentReference": "a9665240-a6ea-481d-b9b6-07f44d237e6e"}	\N	2025-08-31 00:02:40.292+01	\N	2025-08-31 00:02:40.292+01	2025-08-31 00:08:12.444+01	payment_initiated
122	6	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	t	2025-08-31 00:08:12.444+01	{"amount": "1500.00", "category": "appointments", "appointmentId": 15, "paymentStatus": "SUCCESSFUL", "paymentReference": "a9665240-a6ea-481d-b9b6-07f44d237e6e"}	\N	2025-08-31 00:02:52.565+01	\N	2025-08-31 00:02:52.565+01	2025-08-31 00:08:12.444+01	payment_successful
123	2	New Appointment Confirmed	You have a new confirmed appointment with Test drive on 2025-08-31 at 12:30.	high	t	2025-08-31 00:09:46.462+01	{"category": "appointments", "patientName": "Test drive", "appointmentId": 15, "appointmentDate": "2025-08-31", "appointmentTime": "12:30", "consultationType": "online"}	\N	2025-08-31 00:02:52.598+01	\N	2025-08-31 00:02:52.598+01	2025-08-31 00:09:46.461+01	appointment_confirmed
124	3	Appointment in 2 hours	Your appointment with Dr. Keyz Global is in 2 hours (3:00 PM).	high	f	\N	{"category": "appointments", "reminderType": "2_hours", "appointmentId": 11, "appointmentDate": "2025-08-31", "appointmentTime": "15:00:00"}	\N	2025-08-31 12:42:00.25+01	\N	2025-08-31 12:42:00.243+01	2025-08-31 12:42:00.243+01	consultation_reminder
126	6	Appointment in 2 hours	Your appointment with Dr. Keyz Global is in 2 hours (3:15 PM).	high	t	2025-08-31 12:47:40.78+01	{"category": "appointments", "reminderType": "2_hours", "appointmentId": 12, "appointmentDate": "2025-08-31", "appointmentTime": "15:15:00"}	\N	2025-08-31 12:42:11.675+01	\N	2025-08-31 12:42:11.673+01	2025-08-31 12:47:40.779+01	consultation_reminder
103	5	🩺 Consultation starting NOW	Your consultation with Konfor Cynthia is starting now (5:00 PM).	high	t	2025-08-31 16:10:18.752+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 9, "appointmentDate": "2025-08-30", "appointmentTime": "17:00:00"}	\N	2025-08-30 17:00:04.102+01	\N	2025-08-30 17:00:04.096+01	2025-08-31 16:10:18.752+01	consultation_reminder
128	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-31 16:28:50.158+01	{"category": "appointments", "appointmentId": 16, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-31 16:12:42.939+01	\N	2025-08-31 16:12:42.938+01	2025-08-31 16:28:50.162+01	appointment_created
146	5	New Appointment Confirmed	You have a new confirmed appointment with Test drive on 2025-08-31 at 16:15.	high	t	2025-08-31 16:30:07.005+01	{"category": "appointments", "patientName": "Test drive", "appointmentId": 21, "appointmentDate": "2025-08-31", "appointmentTime": "16:15", "consultationType": "online"}	\N	2025-08-31 16:19:11.282+01	\N	2025-08-31 16:19:11.281+01	2025-08-31 16:30:07.005+01	appointment_confirmed
129	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-31 16:28:50.158+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 16, "paymentReference": "91ea14e8-cfeb-4f5a-9ff7-6d70a6a53f95"}	\N	2025-08-31 16:12:44.956+01	\N	2025-08-31 16:12:44.955+01	2025-08-31 16:28:50.162+01	payment_initiated
130	6	Payment Failed	Your payment failed. Please try again or contact support.	high	t	2025-08-31 16:28:50.158+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 16, "paymentStatus": "FAILED", "paymentReference": "91ea14e8-cfeb-4f5a-9ff7-6d70a6a53f95"}	\N	2025-08-31 16:12:56.851+01	\N	2025-08-31 16:12:56.851+01	2025-08-31 16:28:50.162+01	payment_failed
131	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-31 16:28:50.158+01	{"category": "appointments", "appointmentId": 17, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-31 16:14:16.863+01	\N	2025-08-31 16:14:16.863+01	2025-08-31 16:28:50.162+01	appointment_created
132	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-31 16:28:50.158+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 17, "paymentReference": "7ffea6d4-0b3a-4e0d-90c2-b90358e8a9ec"}	\N	2025-08-31 16:14:18.614+01	\N	2025-08-31 16:14:18.614+01	2025-08-31 16:28:50.162+01	payment_initiated
133	6	Payment Failed	Your payment failed. Please try again or contact support.	high	t	2025-08-31 16:28:50.158+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 17, "paymentStatus": "FAILED", "paymentReference": "7ffea6d4-0b3a-4e0d-90c2-b90358e8a9ec"}	\N	2025-08-31 16:14:30.333+01	\N	2025-08-31 16:14:30.333+01	2025-08-31 16:28:50.162+01	payment_failed
134	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-31 16:28:50.158+01	{"category": "appointments", "appointmentId": 18, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-31 16:14:43.299+01	\N	2025-08-31 16:14:43.299+01	2025-08-31 16:28:50.162+01	appointment_created
135	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-31 16:28:50.158+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 18, "paymentReference": "617c8e92-4d2d-4c88-8ce7-2607ce89662d"}	\N	2025-08-31 16:14:45.058+01	\N	2025-08-31 16:14:45.058+01	2025-08-31 16:28:50.162+01	payment_initiated
136	6	Payment Failed	Your payment failed. Please try again or contact support.	high	t	2025-08-31 16:28:50.158+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 18, "paymentStatus": "FAILED", "paymentReference": "617c8e92-4d2d-4c88-8ce7-2607ce89662d"}	\N	2025-08-31 16:14:56.358+01	\N	2025-08-31 16:14:56.357+01	2025-08-31 16:28:50.162+01	payment_failed
137	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-31 16:28:50.158+01	{"category": "appointments", "appointmentId": 19, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-31 16:15:27.598+01	\N	2025-08-31 16:15:27.598+01	2025-08-31 16:28:50.162+01	appointment_created
138	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-31 16:28:50.158+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 19, "paymentReference": "0b27dc90-6f1a-4e65-826d-32bb21f89478"}	\N	2025-08-31 16:15:29.271+01	\N	2025-08-31 16:15:29.27+01	2025-08-31 16:28:50.162+01	payment_initiated
139	6	Payment Failed	Your payment failed. Please try again or contact support.	high	t	2025-08-31 16:28:50.158+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 19, "paymentStatus": "FAILED", "paymentReference": "0b27dc90-6f1a-4e65-826d-32bb21f89478"}	\N	2025-08-31 16:15:41.075+01	\N	2025-08-31 16:15:41.075+01	2025-08-31 16:28:50.162+01	payment_failed
140	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-31 16:28:50.158+01	{"category": "appointments", "appointmentId": 20, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-31 16:17:15.998+01	\N	2025-08-31 16:17:15.998+01	2025-08-31 16:28:50.162+01	appointment_created
141	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-31 16:28:50.158+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 20, "paymentReference": "62205a0d-1882-42ad-825d-b5063976b918"}	\N	2025-08-31 16:17:17.839+01	\N	2025-08-31 16:17:17.838+01	2025-08-31 16:28:50.162+01	payment_initiated
142	6	Payment Failed	Your payment failed. Please try again or contact support.	high	t	2025-08-31 16:28:50.158+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 20, "paymentStatus": "FAILED", "paymentReference": "62205a0d-1882-42ad-825d-b5063976b918"}	\N	2025-08-31 16:17:29.354+01	\N	2025-08-31 16:17:29.354+01	2025-08-31 16:28:50.162+01	payment_failed
143	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-31 16:28:50.158+01	{"category": "appointments", "appointmentId": 21, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-31 16:18:57.409+01	\N	2025-08-31 16:18:57.409+01	2025-08-31 16:28:50.162+01	appointment_created
144	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-31 16:28:50.158+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 21, "paymentReference": "004ce3e2-0089-4a45-a833-0f4ded5903f9"}	\N	2025-08-31 16:18:59.76+01	\N	2025-08-31 16:18:59.759+01	2025-08-31 16:28:50.162+01	payment_initiated
145	6	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	t	2025-08-31 16:28:50.158+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 21, "paymentStatus": "SUCCESSFUL", "paymentReference": "004ce3e2-0089-4a45-a833-0f4ded5903f9"}	\N	2025-08-31 16:19:11.272+01	\N	2025-08-31 16:19:11.271+01	2025-08-31 16:28:50.162+01	payment_successful
77	5	🩺 Consultation starting NOW	Your consultation with Konfor Cynthia is starting now (1:00 PM).	high	t	2025-08-31 16:30:17.372+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 5, "appointmentDate": "2025-08-30", "appointmentTime": "13:00:00"}	\N	2025-08-30 13:00:35.006+01	\N	2025-08-30 13:00:35.002+01	2025-08-31 16:30:17.373+01	consultation_reminder
95	5	Appointment starting in 30 minutes	Your appointment with Konfor Cynthia starts in 30 minutes (5:00 PM).	high	t	2025-08-31 16:30:17.372+01	{"category": "appointments", "reminderType": "30_minutes", "appointmentId": 9, "appointmentDate": "2025-08-30", "appointmentTime": "17:00:00"}	\N	2025-08-30 16:30:03.465+01	\N	2025-08-30 16:30:03.46+01	2025-08-31 16:30:17.373+01	consultation_reminder
99	5	Patient consultation in 10 minutes	Final reminder: Your consultation with Konfor Cynthia starts in 10 minutes (5:00 PM).	high	t	2025-08-31 16:30:17.372+01	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 9, "appointmentDate": "2025-08-30", "appointmentTime": "17:00:00"}	\N	2025-08-30 16:50:03.754+01	\N	2025-08-30 16:50:03.747+01	2025-08-31 16:30:17.373+01	consultation_reminder
73	5	Patient consultation in 10 minutes	Final reminder: Your consultation with Konfor Cynthia starts in 10 minutes (1:00 PM).	high	t	2025-08-31 16:30:17.372+01	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 5, "appointmentDate": "2025-08-30", "appointmentTime": "13:00:00"}	\N	2025-08-30 12:50:03.982+01	\N	2025-08-30 12:50:03.978+01	2025-08-31 16:30:17.373+01	consultation_reminder
84	5	New Appointment Confirmed	You have a new confirmed appointment with Konfor Cynthia on 2025-08-30 at 17:00.	high	t	2025-08-31 16:30:17.372+01	{"category": "appointments", "patientName": "Konfor Cynthia", "appointmentId": 9, "appointmentDate": "2025-08-30", "appointmentTime": "17:00", "consultationType": "online"}	\N	2025-08-30 16:14:08.305+01	\N	2025-08-30 16:14:08.304+01	2025-08-31 16:30:17.373+01	appointment_confirmed
75	5	🩺 Patient consultation starting in 5 minutes	URGENT: Your consultation with Konfor Cynthia starts in 5 minutes (1:00 PM).	high	t	2025-08-31 16:30:17.372+01	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 5, "appointmentDate": "2025-08-30", "appointmentTime": "13:00:00"}	\N	2025-08-30 12:57:14.436+01	\N	2025-08-30 12:57:14.431+01	2025-08-31 16:30:17.373+01	consultation_reminder
97	5	Patient arriving in 15 minutes	Your patient Konfor Cynthia has an appointment in 15 minutes (5:00 PM).	high	t	2025-08-31 16:30:17.372+01	{"category": "appointments", "reminderType": "15_minutes", "appointmentId": 9, "appointmentDate": "2025-08-30", "appointmentTime": "17:00:00"}	\N	2025-08-30 16:46:05.651+01	\N	2025-08-30 16:46:05.646+01	2025-08-31 16:30:17.373+01	consultation_reminder
101	5	🩺 Patient consultation starting in 5 minutes	URGENT: Your consultation with Konfor Cynthia starts in 5 minutes (5:00 PM).	high	t	2025-08-31 16:30:17.372+01	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 9, "appointmentDate": "2025-08-30", "appointmentTime": "17:00:00"}	\N	2025-08-30 16:56:03.762+01	\N	2025-08-30 16:56:03.756+01	2025-08-31 16:30:17.373+01	consultation_reminder
69	5	Appointment starting in 30 minutes	Your appointment with Konfor Cynthia starts in 30 minutes (1:00 PM).	high	t	2025-08-31 16:30:17.372+01	{"category": "appointments", "reminderType": "30_minutes", "appointmentId": 5, "appointmentDate": "2025-08-30", "appointmentTime": "13:00:00"}	\N	2025-08-30 12:30:09.283+01	\N	2025-08-30 12:30:09.28+01	2025-08-31 16:30:17.373+01	consultation_reminder
150	5	New Appointment Confirmed	You have a new confirmed appointment with Test drive on 2025-08-31 at 17:00.	high	t	2025-08-31 17:30:36.368+01	{"category": "appointments", "patientName": "Test drive", "appointmentId": 22, "appointmentDate": "2025-08-31", "appointmentTime": "17:00", "consultationType": "online"}	\N	2025-08-31 17:01:20.504+01	\N	2025-08-31 17:01:20.503+01	2025-08-31 17:30:36.373+01	appointment_confirmed
152	5	🩺 Consultation starting NOW	Your consultation with Test drive is starting now (5:00 PM).	high	t	2025-08-31 17:30:36.368+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 22, "appointmentDate": "2025-08-31", "appointmentTime": "17:00:00"}	\N	2025-08-31 17:02:09.459+01	\N	2025-08-31 17:02:09.452+01	2025-08-31 17:30:36.373+01	consultation_reminder
156	5	New Appointment Confirmed	You have a new confirmed appointment with Test drive on 2025-08-31 at 17:45.	high	t	2025-08-31 17:30:36.368+01	{"category": "appointments", "patientName": "Test drive", "appointmentId": 23, "appointmentDate": "2025-08-31", "appointmentTime": "17:45", "consultationType": "online"}	\N	2025-08-31 17:30:05.34+01	\N	2025-08-31 17:30:05.339+01	2025-08-31 17:30:36.373+01	appointment_confirmed
158	5	Patient arriving in 15 minutes	Your patient Test drive has an appointment in 15 minutes (5:45 PM).	high	t	2025-09-01 01:39:23.189+01	{"category": "appointments", "reminderType": "15_minutes", "appointmentId": 23, "appointmentDate": "2025-08-31", "appointmentTime": "17:45:00"}	\N	2025-08-31 17:32:10.444+01	\N	2025-08-31 17:32:10.437+01	2025-09-01 01:39:23.19+01	consultation_reminder
160	5	Patient consultation in 10 minutes	Final reminder: Your consultation with Test drive starts in 10 minutes (5:45 PM).	high	t	2025-09-01 01:39:23.189+01	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 23, "appointmentDate": "2025-08-31", "appointmentTime": "17:45:00"}	\N	2025-08-31 17:36:08.587+01	\N	2025-08-31 17:36:08.581+01	2025-09-01 01:39:23.19+01	consultation_reminder
162	5	🩺 Patient consultation starting in 5 minutes	URGENT: Your consultation with Test drive starts in 5 minutes (5:45 PM).	high	t	2025-09-01 01:39:23.189+01	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 23, "appointmentDate": "2025-08-31", "appointmentTime": "17:45:00"}	\N	2025-08-31 17:40:09.825+01	\N	2025-08-31 17:40:09.818+01	2025-09-01 01:39:23.19+01	consultation_reminder
178	4	New Appointment Confirmed	You have a new confirmed appointment with Test drive on 2025-08-31 at 19:30.	high	t	2025-08-31 23:49:41.213+01	{"category": "appointments", "patientName": "Test drive", "appointmentId": 26, "appointmentDate": "2025-08-31", "appointmentTime": "19:30", "consultationType": "online"}	\N	2025-08-31 19:29:38.681+01	\N	2025-08-31 19:29:38.681+01	2025-08-31 23:49:41.214+01	appointment_confirmed
182	4	🩺 Consultation starting NOW	Your consultation with Test drive is starting now (7:30 PM).	high	t	2025-08-31 23:49:41.213+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 26, "appointmentDate": "2025-08-31", "appointmentTime": "19:30:00"}	\N	2025-08-31 19:30:20.494+01	\N	2025-08-31 19:30:20.492+01	2025-08-31 23:49:41.214+01	consultation_reminder
164	5	🩺 Consultation starting NOW	Your consultation with Test drive is starting now (5:45 PM).	high	t	2025-09-01 01:39:23.189+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 23, "appointmentDate": "2025-08-31", "appointmentTime": "17:45:00"}	\N	2025-08-31 17:44:02.54+01	\N	2025-08-31 17:44:02.538+01	2025-09-01 01:39:23.19+01	consultation_reminder
168	5	New Appointment Confirmed	You have a new confirmed appointment with Test drive on 2025-08-31 at 18:30.	high	t	2025-09-01 01:39:23.189+01	{"category": "appointments", "patientName": "Test drive", "appointmentId": 24, "appointmentDate": "2025-08-31", "appointmentTime": "18:30", "consultationType": "online"}	\N	2025-08-31 18:31:24.927+01	\N	2025-08-31 18:31:24.926+01	2025-09-01 01:39:23.19+01	appointment_confirmed
170	5	🩺 Consultation starting NOW	Your consultation with Test drive is starting now (6:30 PM).	high	t	2025-09-01 01:39:23.189+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 24, "appointmentDate": "2025-08-31", "appointmentTime": "18:30:00"}	\N	2025-08-31 18:32:07.673+01	\N	2025-08-31 18:32:07.671+01	2025-09-01 01:39:23.19+01	consultation_reminder
174	5	New Appointment Confirmed	You have a new confirmed appointment with Test drive on 2025-08-31 at 20:00.	high	t	2025-09-01 01:39:23.189+01	{"category": "appointments", "patientName": "Test drive", "appointmentId": 25, "appointmentDate": "2025-08-31", "appointmentTime": "20:00", "consultationType": "online"}	\N	2025-08-31 19:28:02.742+01	\N	2025-08-31 19:28:02.742+01	2025-09-01 01:39:23.19+01	appointment_confirmed
180	5	Appointment starting in 30 minutes	Your appointment with Test drive starts in 30 minutes (8:00 PM).	high	t	2025-09-01 01:39:23.189+01	{"category": "appointments", "reminderType": "30_minutes", "appointmentId": 25, "appointmentDate": "2025-08-31", "appointmentTime": "20:00:00"}	\N	2025-08-31 19:30:09.889+01	\N	2025-08-31 19:30:09.887+01	2025-09-01 01:39:23.19+01	consultation_reminder
188	5	🩺 Patient consultation starting in 5 minutes	URGENT: Your consultation with Test drive starts in 5 minutes (8:00 PM).	high	t	2025-08-31 19:59:00.982+01	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 25, "appointmentDate": "2025-08-31", "appointmentTime": "20:00:00"}	\N	2025-08-31 19:56:02.579+01	\N	2025-08-31 19:56:02.576+01	2025-08-31 19:59:00.981+01	consultation_reminder
147	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-31 20:01:06.56+01	{"category": "appointments", "appointmentId": 22, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-31 17:01:06.637+01	\N	2025-08-31 17:01:06.635+01	2025-08-31 20:01:06.561+01	appointment_created
148	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-31 20:01:06.56+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 22, "paymentReference": "ca405819-4140-4c79-b3c3-939aba8e6ed8"}	\N	2025-08-31 17:01:08.962+01	\N	2025-08-31 17:01:08.962+01	2025-08-31 20:01:06.561+01	payment_initiated
149	6	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	t	2025-08-31 20:01:06.56+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 22, "paymentStatus": "SUCCESSFUL", "paymentReference": "ca405819-4140-4c79-b3c3-939aba8e6ed8"}	\N	2025-08-31 17:01:20.475+01	\N	2025-08-31 17:01:20.474+01	2025-08-31 20:01:06.561+01	payment_successful
151	6	🔴 Your appointment is starting NOW!	Your appointment with Dr. Omni Creative is starting now (5:00 PM)!	high	t	2025-08-31 20:01:06.56+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 22, "appointmentDate": "2025-08-31", "appointmentTime": "17:00:00"}	\N	2025-08-31 17:02:00.171+01	\N	2025-08-31 17:02:00.155+01	2025-08-31 20:01:06.561+01	consultation_reminder
153	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-31 20:01:06.56+01	{"category": "appointments", "appointmentId": 23, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-31 17:29:51.3+01	\N	2025-08-31 17:29:51.299+01	2025-08-31 20:01:06.561+01	appointment_created
154	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-31 20:01:06.56+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 23, "paymentReference": "94ef0b76-660d-487e-9a1b-0b4ea460dd43"}	\N	2025-08-31 17:29:53.195+01	\N	2025-08-31 17:29:53.195+01	2025-08-31 20:01:06.561+01	payment_initiated
155	6	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	t	2025-08-31 20:01:06.56+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 23, "paymentStatus": "SUCCESSFUL", "paymentReference": "94ef0b76-660d-487e-9a1b-0b4ea460dd43"}	\N	2025-08-31 17:30:05.318+01	\N	2025-08-31 17:30:05.317+01	2025-08-31 20:01:06.561+01	payment_successful
157	6	Appointment in 15 minutes	Your appointment with Dr. Omni Creative starts in 15 minutes (5:45 PM).	high	t	2025-08-31 20:01:06.56+01	{"category": "appointments", "reminderType": "15_minutes", "appointmentId": 23, "appointmentDate": "2025-08-31", "appointmentTime": "17:45:00"}	\N	2025-08-31 17:32:00.452+01	\N	2025-08-31 17:32:00.444+01	2025-08-31 20:01:06.561+01	consultation_reminder
159	6	Appointment in 10 minutes - Final preparation	Your appointment with Dr. Omni Creative starts in 10 minutes (5:45 PM). Please prepare to join online.	high	t	2025-08-31 20:01:06.56+01	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 23, "appointmentDate": "2025-08-31", "appointmentTime": "17:45:00"}	\N	2025-08-31 17:36:00.743+01	\N	2025-08-31 17:36:00.738+01	2025-08-31 20:01:06.561+01	consultation_reminder
161	6	🚨 Appointment starting in 5 minutes!	URGENT: Your appointment with Dr. Omni Creative starts in 5 minutes (5:45 PM)!	high	t	2025-08-31 20:01:06.56+01	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 23, "appointmentDate": "2025-08-31", "appointmentTime": "17:45:00"}	\N	2025-08-31 17:40:00.225+01	\N	2025-08-31 17:40:00.22+01	2025-08-31 20:01:06.561+01	consultation_reminder
163	6	🔴 Your appointment is starting NOW!	Your appointment with Dr. Omni Creative is starting now (5:45 PM)!	high	t	2025-08-31 20:01:06.56+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 23, "appointmentDate": "2025-08-31", "appointmentTime": "17:45:00"}	\N	2025-08-31 17:44:00.172+01	\N	2025-08-31 17:44:00.167+01	2025-08-31 20:01:06.561+01	consultation_reminder
165	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-31 20:01:06.56+01	{"category": "appointments", "appointmentId": 24, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-31 18:30:48.256+01	\N	2025-08-31 18:30:48.256+01	2025-08-31 20:01:06.561+01	appointment_created
166	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-31 20:01:06.56+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 24, "paymentReference": "0323ab4b-c172-406f-b759-223db107e339"}	\N	2025-08-31 18:30:50.379+01	\N	2025-08-31 18:30:50.378+01	2025-08-31 20:01:06.561+01	payment_initiated
185	6	Appointment in 10 minutes - Final preparation	Your appointment with Dr. Omni Creative starts in 10 minutes (8:00 PM). Please prepare to join online.	high	t	2025-08-31 20:01:06.56+01	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 25, "appointmentDate": "2025-08-31", "appointmentTime": "20:00:00"}	\N	2025-08-31 19:52:00.105+01	\N	2025-08-31 19:52:00.09+01	2025-08-31 20:01:06.561+01	consultation_reminder
184	5	Patient arriving in 15 minutes	Your patient Test drive has an appointment in 15 minutes (8:00 PM).	high	t	2025-09-01 01:39:23.189+01	{"category": "appointments", "reminderType": "15_minutes", "appointmentId": 25, "appointmentDate": "2025-08-31", "appointmentTime": "20:00:00"}	\N	2025-08-31 19:46:07.71+01	\N	2025-08-31 19:46:07.708+01	2025-09-01 01:39:23.19+01	consultation_reminder
186	5	Patient consultation in 10 minutes	Final reminder: Your consultation with Test drive starts in 10 minutes (8:00 PM).	high	t	2025-09-01 01:39:23.189+01	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 25, "appointmentDate": "2025-08-31", "appointmentTime": "20:00:00"}	\N	2025-08-31 19:52:08.561+01	\N	2025-08-31 19:52:08.555+01	2025-09-01 01:39:23.19+01	consultation_reminder
190	5	🩺 Consultation starting NOW	Your consultation with Test drive is starting now (8:00 PM).	high	t	2025-09-01 01:39:23.189+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 25, "appointmentDate": "2025-08-31", "appointmentTime": "20:00:00"}	\N	2025-08-31 20:00:09.048+01	\N	2025-08-31 20:00:09.046+01	2025-09-01 01:39:23.19+01	consultation_reminder
167	6	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	t	2025-08-31 20:01:06.56+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 24, "paymentStatus": "SUCCESSFUL", "paymentReference": "0323ab4b-c172-406f-b759-223db107e339"}	\N	2025-08-31 18:31:24.913+01	\N	2025-08-31 18:31:24.913+01	2025-08-31 20:01:06.561+01	payment_successful
169	6	🔴 Your appointment is starting NOW!	Your appointment with Dr. Omni Creative is starting now (6:30 PM)!	high	t	2025-08-31 20:01:06.56+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 24, "appointmentDate": "2025-08-31", "appointmentTime": "18:30:00"}	\N	2025-08-31 18:32:00.052+01	\N	2025-08-31 18:32:00.051+01	2025-08-31 20:01:06.561+01	consultation_reminder
171	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-31 20:01:06.56+01	{"category": "appointments", "appointmentId": 25, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-31 19:27:37.14+01	\N	2025-08-31 19:27:37.14+01	2025-08-31 20:01:06.561+01	appointment_created
172	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-31 20:01:06.56+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 25, "paymentReference": "30aa8ac6-f8f7-43b4-93c6-f69c71bcfced"}	\N	2025-08-31 19:27:39.465+01	\N	2025-08-31 19:27:39.465+01	2025-08-31 20:01:06.561+01	payment_initiated
173	6	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	t	2025-08-31 20:01:06.56+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 25, "paymentStatus": "SUCCESSFUL", "paymentReference": "30aa8ac6-f8f7-43b4-93c6-f69c71bcfced"}	\N	2025-08-31 19:28:02.729+01	\N	2025-08-31 19:28:02.728+01	2025-08-31 20:01:06.561+01	payment_successful
175	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-31 20:01:06.56+01	{"category": "appointments", "appointmentId": 26, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-31 19:29:02.14+01	\N	2025-08-31 19:29:02.14+01	2025-08-31 20:01:06.561+01	appointment_created
176	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-31 20:01:06.56+01	{"amount": "1700.00", "category": "appointments", "appointmentId": 26, "paymentReference": "de0ba040-f5bf-41d7-8f45-f310648588d1"}	\N	2025-08-31 19:29:03.292+01	\N	2025-08-31 19:29:03.292+01	2025-08-31 20:01:06.561+01	payment_initiated
177	6	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	t	2025-08-31 20:01:06.56+01	{"amount": "1700.00", "category": "appointments", "appointmentId": 26, "paymentStatus": "SUCCESSFUL", "paymentReference": "de0ba040-f5bf-41d7-8f45-f310648588d1"}	\N	2025-08-31 19:29:38.668+01	\N	2025-08-31 19:29:38.668+01	2025-08-31 20:01:06.561+01	payment_successful
179	6	Your appointment starts in 30 minutes	Your appointment with Dr. Omni Creative starts in 30 minutes (8:00 PM).	high	t	2025-08-31 20:01:06.56+01	{"category": "appointments", "reminderType": "30_minutes", "appointmentId": 25, "appointmentDate": "2025-08-31", "appointmentTime": "20:00:00"}	\N	2025-08-31 19:30:00.123+01	\N	2025-08-31 19:30:00.122+01	2025-08-31 20:01:06.561+01	consultation_reminder
181	6	🔴 Your appointment is starting NOW!	Your appointment with Dr. Keyz Global is starting now (7:30 PM)!	high	t	2025-08-31 20:01:06.56+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 26, "appointmentDate": "2025-08-31", "appointmentTime": "19:30:00"}	\N	2025-08-31 19:30:15.895+01	\N	2025-08-31 19:30:15.887+01	2025-08-31 20:01:06.561+01	consultation_reminder
183	6	Appointment in 15 minutes	Your appointment with Dr. Omni Creative starts in 15 minutes (8:00 PM).	high	t	2025-08-31 20:01:06.56+01	{"category": "appointments", "reminderType": "15_minutes", "appointmentId": 25, "appointmentDate": "2025-08-31", "appointmentTime": "20:00:00"}	\N	2025-08-31 19:46:00.133+01	\N	2025-08-31 19:46:00.129+01	2025-08-31 20:01:06.561+01	consultation_reminder
187	6	🚨 Appointment starting in 5 minutes!	URGENT: Your appointment with Dr. Omni Creative starts in 5 minutes (8:00 PM)!	high	t	2025-08-31 20:01:06.56+01	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 25, "appointmentDate": "2025-08-31", "appointmentTime": "20:00:00"}	\N	2025-08-31 19:56:00.229+01	\N	2025-08-31 19:56:00.223+01	2025-08-31 20:01:06.561+01	consultation_reminder
189	6	🔴 Your appointment is starting NOW!	Your appointment with Dr. Omni Creative is starting now (8:00 PM)!	high	t	2025-08-31 20:01:06.56+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 25, "appointmentDate": "2025-08-31", "appointmentTime": "20:00:00"}	\N	2025-08-31 20:00:00.161+01	\N	2025-08-31 20:00:00.154+01	2025-08-31 20:01:06.561+01	consultation_reminder
194	5	New Appointment Confirmed	You have a new confirmed appointment with Test drive on 2025-08-31 at 20:45.	high	t	2025-09-01 01:39:23.189+01	{"category": "appointments", "patientName": "Test drive", "appointmentId": 27, "appointmentDate": "2025-08-31", "appointmentTime": "20:45", "consultationType": "online"}	\N	2025-08-31 20:40:44.783+01	\N	2025-08-31 20:40:44.782+01	2025-09-01 01:39:23.19+01	appointment_confirmed
196	5	🩺 Patient consultation starting in 5 minutes	URGENT: Your consultation with Test drive starts in 5 minutes (8:45 PM).	high	t	2025-09-01 01:39:23.189+01	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 27, "appointmentDate": "2025-08-31", "appointmentTime": "20:45:00"}	\N	2025-08-31 20:42:02.95+01	\N	2025-08-31 20:42:02.945+01	2025-09-01 01:39:23.19+01	consultation_reminder
198	5	🩺 Consultation starting NOW	Your consultation with Test drive is starting now (8:45 PM).	high	t	2025-09-01 01:39:23.189+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 27, "appointmentDate": "2025-08-31", "appointmentTime": "20:45:00"}	\N	2025-08-31 20:44:09.154+01	\N	2025-08-31 20:44:09.148+01	2025-09-01 01:39:23.19+01	consultation_reminder
191	6	Appointment Created	Your appointment has been created successfully. Please complete payment to confirm your booking.	medium	t	2025-08-31 23:39:43.385+01	{"category": "appointments", "appointmentId": 27, "consultationType": "online", "appointmentStatus": "pending_payment"}	\N	2025-08-31 20:40:18.314+01	\N	2025-08-31 20:40:18.313+01	2025-08-31 23:39:43.386+01	appointment_created
192	6	Payment Initiated	Payment has been initiated for your appointment. Please check your phone and complete the payment.	high	t	2025-08-31 23:39:43.385+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 27, "paymentReference": "ac501703-0818-4894-95fc-94f5da6c3fd2"}	\N	2025-08-31 20:40:21.258+01	\N	2025-08-31 20:40:21.256+01	2025-08-31 23:39:43.386+01	payment_initiated
193	6	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	t	2025-08-31 23:39:43.385+01	{"amount": "12000.00", "category": "appointments", "appointmentId": 27, "paymentStatus": "SUCCESSFUL", "paymentReference": "ac501703-0818-4894-95fc-94f5da6c3fd2"}	\N	2025-08-31 20:40:44.772+01	\N	2025-08-31 20:40:44.771+01	2025-08-31 23:39:43.386+01	payment_successful
195	6	🚨 Appointment starting in 5 minutes!	URGENT: Your appointment with Dr. Omni Creative starts in 5 minutes (8:45 PM)!	high	t	2025-08-31 23:39:43.385+01	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 27, "appointmentDate": "2025-08-31", "appointmentTime": "20:45:00"}	\N	2025-08-31 20:42:00.108+01	\N	2025-08-31 20:42:00.106+01	2025-08-31 23:39:43.386+01	consultation_reminder
197	6	🔴 Your appointment is starting NOW!	Your appointment with Dr. Omni Creative is starting now (8:45 PM)!	high	t	2025-08-31 23:39:43.385+01	{"category": "appointments", "reminderType": "start_now", "appointmentId": 27, "appointmentDate": "2025-08-31", "appointmentTime": "20:45:00"}	\N	2025-08-31 20:44:00.106+01	\N	2025-08-31 20:44:00.082+01	2025-08-31 23:39:43.386+01	consultation_reminder
109	4	Tomorrow's Appointment Schedule	You have an appointment with Test drive tomorrow (Sunday, August 31, 2025) at 3:15 PM.	high	t	2025-08-31 23:49:41.213+01	{"category": "appointments", "reminderType": "day_before", "appointmentId": 12, "appointmentDate": "2025-08-31", "appointmentTime": "15:15:00"}	\N	2025-08-30 20:38:10.892+01	\N	2025-08-30 20:38:10.887+01	2025-08-31 23:49:41.214+01	consultation_reminder
111	4	Appointment in 4 hours	Your appointment with Konfor Cynthia is in 4 hours (3:00 PM) on Sunday, August 31, 2025.	high	t	2025-08-31 23:49:41.213+01	{"category": "appointments", "reminderType": "4_hours", "appointmentId": 11, "appointmentDate": "2025-08-31", "appointmentTime": "15:00:00"}	\N	2025-08-31 10:30:08.077+01	\N	2025-08-31 10:30:08.076+01	2025-08-31 23:49:41.214+01	consultation_reminder
113	4	Appointment in 4 hours	Your appointment with Test drive is in 4 hours (3:15 PM) on Sunday, August 31, 2025.	high	t	2025-08-31 23:49:41.213+01	{"category": "appointments", "reminderType": "4_hours", "appointmentId": 12, "appointmentDate": "2025-08-31", "appointmentTime": "15:15:00"}	\N	2025-08-31 10:30:12.777+01	\N	2025-08-31 10:30:12.776+01	2025-08-31 23:49:41.214+01	consultation_reminder
125	4	Appointment in 2 hours	Your appointment with Konfor Cynthia is in 2 hours (3:00 PM).	high	t	2025-08-31 23:49:41.213+01	{"category": "appointments", "reminderType": "2_hours", "appointmentId": 11, "appointmentDate": "2025-08-31", "appointmentTime": "15:00:00"}	\N	2025-08-31 12:42:09.183+01	\N	2025-08-31 12:42:09.182+01	2025-08-31 23:49:41.214+01	consultation_reminder
127	4	Appointment in 2 hours	Your appointment with Test drive is in 2 hours (3:15 PM).	high	t	2025-08-31 23:49:41.213+01	{"category": "appointments", "reminderType": "2_hours", "appointmentId": 12, "appointmentDate": "2025-08-31", "appointmentTime": "15:15:00"}	\N	2025-08-31 12:42:14.072+01	\N	2025-08-31 12:42:14.071+01	2025-08-31 23:49:41.214+01	consultation_reminder
200	4	New Appointment Confirmed	You have a new confirmed appointment with Test drive on 2025-09-01 at 00:30.	high	t	2025-08-31 23:49:41.213+01	{"category": "appointments", "patientName": "Test drive", "appointmentId": 28, "appointmentDate": "2025-09-01", "appointmentTime": "00:30", "consultationType": "online"}	\N	2025-08-31 23:42:12.953+01	\N	2025-08-31 23:42:12.953+01	2025-08-31 23:49:41.214+01	appointment_confirmed
202	4	Appointment starting in 30 minutes	Your appointment with Test drive starts in 30 minutes (12:30 AM).	high	f	\N	{"category": "appointments", "reminderType": "30_minutes", "appointmentId": 28, "appointmentDate": "2025-09-01", "appointmentTime": "00:30:00"}	\N	2025-09-01 00:00:09.869+01	\N	2025-09-01 00:00:09.866+01	2025-09-01 00:00:09.866+01	consultation_reminder
204	4	Patient arriving in 15 minutes	Your patient Test drive has an appointment in 15 minutes (12:30 AM).	high	f	\N	{"category": "appointments", "reminderType": "15_minutes", "appointmentId": 28, "appointmentDate": "2025-09-01", "appointmentTime": "00:30:00"}	\N	2025-09-01 00:16:09.016+01	\N	2025-09-01 00:16:09.015+01	2025-09-01 00:16:09.015+01	consultation_reminder
206	4	Patient consultation in 10 minutes	Final reminder: Your consultation with Test drive starts in 10 minutes (12:30 AM).	high	f	\N	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 28, "appointmentDate": "2025-09-01", "appointmentTime": "00:30:00"}	\N	2025-09-01 00:20:02.633+01	\N	2025-09-01 00:20:02.632+01	2025-09-01 00:20:02.632+01	consultation_reminder
199	6	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	t	2025-09-01 00:50:50.376+01	{"amount": "2300.00", "category": "appointments", "appointmentId": 28, "paymentStatus": "SUCCESSFUL", "paymentReference": "7376b167-7a94-4992-88ec-6ef963cb6aa0"}	\N	2025-08-31 23:42:12.905+01	\N	2025-08-31 23:42:12.904+01	2025-09-01 00:50:50.376+01	payment_successful
201	6	Your appointment starts in 30 minutes	Your appointment with Dr. Keyz Global starts in 30 minutes (12:30 AM).	high	t	2025-09-01 00:51:32.765+01	{"category": "appointments", "reminderType": "30_minutes", "appointmentId": 28, "appointmentDate": "2025-09-01", "appointmentTime": "00:30:00"}	\N	2025-09-01 00:00:00.176+01	\N	2025-09-01 00:00:00.165+01	2025-09-01 00:51:32.766+01	consultation_reminder
203	6	Appointment in 15 minutes	Your appointment with Dr. Keyz Global starts in 15 minutes (12:30 AM).	high	t	2025-09-01 00:51:32.765+01	{"category": "appointments", "reminderType": "15_minutes", "appointmentId": 28, "appointmentDate": "2025-09-01", "appointmentTime": "00:30:00"}	\N	2025-09-01 00:16:00.412+01	\N	2025-09-01 00:16:00.407+01	2025-09-01 00:51:32.766+01	consultation_reminder
205	6	Appointment in 10 minutes - Final preparation	Your appointment with Dr. Keyz Global starts in 10 minutes (12:30 AM). Please prepare to join online.	high	t	2025-09-01 00:51:32.765+01	{"category": "appointments", "reminderType": "10_minutes", "appointmentId": 28, "appointmentDate": "2025-09-01", "appointmentTime": "00:30:00"}	\N	2025-09-01 00:20:00.106+01	\N	2025-09-01 00:20:00.103+01	2025-09-01 00:51:32.766+01	consultation_reminder
207	6	🚨 Appointment starting in 5 minutes!	URGENT: Your appointment with Dr. Keyz Global starts in 5 minutes (12:30 AM)!	high	t	2025-09-01 00:51:32.765+01	{"category": "appointments", "reminderType": "5_minutes", "appointmentId": 28, "appointmentDate": "2025-09-01", "appointmentTime": "00:30:00"}	\N	2025-09-01 00:26:00.231+01	\N	2025-09-01 00:26:00.208+01	2025-09-01 00:51:32.766+01	consultation_reminder
208	6	Payment Successful	Your payment has been completed successfully! Your appointment is now confirmed.	high	t	2025-09-01 01:38:31.256+01	{"amount": "5000.00", "category": "appointments", "appointmentId": 30, "paymentStatus": "SUCCESSFUL", "paymentReference": "cee5d180-4de8-4396-9e37-722551e6740d"}	\N	2025-09-01 01:38:11.435+01	\N	2025-09-01 01:38:11.433+01	2025-09-01 01:38:31.255+01	payment_successful
209	5	New Appointment Confirmed	You have a new confirmed appointment with Test drive on 2025-09-01 at 01:40.	high	t	2025-09-01 01:39:23.189+01	{"category": "appointments", "patientName": "Test drive", "appointmentId": 30, "appointmentDate": "2025-09-01", "appointmentTime": "01:40", "consultationType": "online"}	\N	2025-09-01 01:38:11.47+01	\N	2025-09-01 01:38:11.47+01	2025-09-01 01:39:23.19+01	appointment_confirmed
\.


--
-- TOC entry 5498 (class 0 OID 16811)
-- Dependencies: 239
-- Data for Name: PatientDocuments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PatientDocuments" (id, "patientId", "documentType", "fileName", "fileUrl", "fileSize", "mimeType", "uploadedAt", "createdAt", "updatedAt") FROM stdin;
1	2	medical	original-ec0a19ccfded1a1640077d91738715d0.webp	/uploads/documents/patients/8abdf495-5f04-4e97-95ab-20ed56b8661c.webp	250132	image	2025-08-30 09:01:38.373+01	2025-08-30 09:01:38.373+01	2025-08-30 09:01:38.373+01
2	2	wow	original-bf4702d861bbba406452fdbd42c3fb53.webp	/uploads/documents/patients/5784103e-29e6-4aa1-a797-0b1f07876df0.webp	107494	image	2025-08-30 10:04:06.33+01	2025-08-30 10:04:06.33+01	2025-08-30 10:04:06.33+01
3	1	the sample doc	Example.pdf	/uploads/documents/patients/d66d8c26-328b-4e4e-98ed-1002f5a23732.pdf	115242	pdf	2025-08-30 12:18:06.303+01	2025-08-30 12:18:06.303+01	2025-08-30 12:18:06.303+01
4	1	clustering	Calculating eigenvectors and eigenvalues from covariance matrix.pdf	/uploads/documents/patients/5bde9e10-14f7-454c-aa43-4ebf6409fabb.pdf	72484	pdf	2025-08-30 16:16:36.241+01	2025-08-30 16:16:36.241+01	2025-08-30 16:16:36.241+01
5	1	clustering	Calculating eigenvectors and eigenvalues from covariance matrix.pdf	/uploads/documents/patients/0eb905da-3084-4c0b-b3ae-c85097d22c17.pdf	72484	pdf	2025-08-30 16:16:55.371+01	2025-08-30 16:16:55.371+01	2025-08-30 16:16:55.371+01
6	2	badge	JC BADGE.pdf	/uploads/documents/patients/2056ff9c-ed66-474e-baf8-4d59b5afa85e.pdf	1137185	pdf	2025-08-30 20:36:12.958+01	2025-08-30 20:36:12.959+01	2025-08-30 20:36:12.959+01
7	2	this is it	IMG-20241012-WA0005.pdf	/uploads/documents/patients/08690ee7-3d10-4ff9-8e49-f341134ebb22.pdf	495337	pdf	2025-08-31 11:04:47.53+01	2025-08-31 11:04:47.53+01	2025-08-31 11:04:47.53+01
8	2	wow, this is good	ZALYdocx_083135.pdf	/uploads/documents/patients/f7749a25-61cd-4be6-9f68-0f13e88f445d.pdf	3327385	pdf	2025-08-31 16:12:42.856+01	2025-08-31 16:12:42.856+01	2025-08-31 16:12:42.856+01
9	2	wow, this is good	ZALYdocx_083135.pdf	/uploads/documents/patients/0035403a-89b7-4cc2-8748-813c73f95c07.pdf	3327385	pdf	2025-08-31 16:14:16.828+01	2025-08-31 16:14:16.828+01	2025-08-31 16:14:16.828+01
10	2	wow, this is good	ZALYdocx_083135.pdf	/uploads/documents/patients/152a597a-10a9-4ba1-89e1-ad1cfd995174.pdf	3327385	pdf	2025-08-31 16:14:43.255+01	2025-08-31 16:14:43.255+01	2025-08-31 16:14:43.255+01
11	2	wow, this is good	ZALYdocx_083135.pdf	/uploads/documents/patients/13df8361-447b-4a94-9267-70b35beb3d89.pdf	3327385	pdf	2025-08-31 16:15:27.562+01	2025-08-31 16:15:27.562+01	2025-08-31 16:15:27.562+01
12	2	wow, this is good	ZALYdocx_083135.pdf	/uploads/documents/patients/853d66e6-47cc-4369-a3ca-6aab7c1b0c0d.pdf	3327385	pdf	2025-08-31 16:17:15.824+01	2025-08-31 16:17:15.825+01	2025-08-31 16:17:15.825+01
13	2	wow, this is good	ZALYdocx_083135.pdf	/uploads/documents/patients/d8c81d57-f879-4d4c-b5bb-2a2ed27b5e91.pdf	3327385	pdf	2025-08-31 16:18:57.261+01	2025-08-31 16:18:57.261+01	2025-08-31 16:18:57.261+01
14	2	this is bad	phytotechnie special notes 2024.pdf	/uploads/documents/patients/7c678c4a-f566-409f-b0d7-5d34a1fce6c1.pdf	1859295	pdf	2025-08-31 18:30:48.229+01	2025-08-31 18:30:48.229+01	2025-08-31 18:30:48.229+01
15	2	resume	Resume_Marqueurs_Enzymatiques.pdf	/uploads/documents/patients/1f08f13d-c495-4d2c-a62d-c22b5041a4bb.pdf	140875	pdf	2025-08-31 19:29:02.112+01	2025-08-31 19:29:02.112+01	2025-08-31 19:29:02.112+01
16	2	poly	phytotechnie special notes 2024.pdf	/uploads/documents/patients/a91df30c-d6cd-4641-b2dc-f3d28528928e.pdf	1859295	pdf	2025-09-01 01:37:13.599+01	2025-09-01 01:37:13.6+01	2025-09-01 01:37:13.6+01
17	2	poly	phytotechnie special notes 2024.pdf	/uploads/documents/patients/b76d7b8f-f633-49ad-a2a0-94cf71ecebe5.pdf	1859295	pdf	2025-09-01 01:37:50.355+01	2025-09-01 01:37:50.355+01	2025-09-01 01:37:50.355+01
\.


--
-- TOC entry 5500 (class 0 OID 16820)
-- Dependencies: 241
-- Data for Name: Patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Patients" (id, "userId", "bloodGroup", allergies, "emergencyContact", "contactInfo", "medicalDocuments", "insuranceInfo", "preferredLanguage", "createdAt", "updatedAt") FROM stdin;
1	3	\N	{}	{"name": "Njeba Ibrahim", "phoneNumber": "+237675588704", "relationship": "Parent"}	\N	{}	\N	English	2025-08-27 12:52:31.917+01	2025-08-27 12:52:31.917+01
2	6	\N	{}	{"name": "Biggy", "phoneNumber": "+237672134528", "relationship": "Tight friend"}	\N	{}	\N	English	2025-08-28 07:34:32.15+01	2025-08-28 07:34:32.15+01
3	7	\N	{}	{"name": "Mumy success", "phoneNumber": "+237670084835", "relationship": "Mother"}	\N	{}	\N	English	2025-08-29 13:38:20.513+01	2025-08-29 13:38:20.513+01
4	8	\N	{}	{"name": "omni team", "phoneNumber": "+237670084835", "relationship": "Friend"}	\N	{}	\N	English	2025-08-29 17:32:57.134+01	2025-08-29 17:32:57.134+01
\.


--
-- TOC entry 5502 (class 0 OID 16831)
-- Dependencies: 243
-- Data for Name: Payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payments" (id, "userId", "appointmentId", "applicationId", "prescriptionId", amount, currency, status, type, "paymentMethod", "transactionId", "gatewayResponse", description, metadata, "createdAt", "updatedAt") FROM stdin;
1	6	1	\N	\N	5000.00	XAF	completed	consultation	mobile_money	77ad0924-3530-4504-8f36-cfa3138d9027	{"status": "SUCCESSFUL", "reference": "77ad0924-3530-4504-8f36-cfa3138d9027"}	Payment for appointment with Dr. Keyz Global	{"processedAt": "2025-08-30T08:01:50.295Z", "lastPollingAt": "2025-08-30T08:01:50.295Z", "lastPollingStatus": "SUCCESSFUL"}	2025-08-30 09:01:38.384+01	2025-08-30 09:01:50.295+01
2	6	2	\N	\N	5000.00	XAF	completed	consultation	mobile_money	40ab510e-4136-4125-a32c-8307a0b3c189	{"status": "SUCCESSFUL", "reference": "40ab510e-4136-4125-a32c-8307a0b3c189"}	Payment for appointment with Dr. Keyz Global	{"processedAt": "2025-08-30T08:11:52.710Z", "lastPollingAt": "2025-08-30T08:11:52.710Z", "lastPollingStatus": "SUCCESSFUL"}	2025-08-30 09:11:40.886+01	2025-08-30 09:11:52.71+01
3	6	3	\N	\N	5000.00	XAF	completed	consultation	mobile_money	a0bf2936-3f70-455f-a99d-b1bf1c60a314	{"status": "SUCCESSFUL", "reference": "a0bf2936-3f70-455f-a99d-b1bf1c60a314"}	Payment for appointment with Dr. Keyz Global	{"processedAt": "2025-08-30T08:58:58.376Z", "lastPollingAt": "2025-08-30T08:58:58.376Z", "lastPollingStatus": "SUCCESSFUL"}	2025-08-30 09:58:46.397+01	2025-08-30 09:58:58.376+01
4	6	4	\N	\N	3500.00	XAF	completed	consultation	mobile_money	4973370e-0bf5-48a6-9044-43d39cf65726	{"status": "SUCCESSFUL", "reference": "4973370e-0bf5-48a6-9044-43d39cf65726"}	Payment for appointment with Dr. Keyz Tester	{"processedAt": "2025-08-30T09:04:18.006Z", "lastPollingAt": "2025-08-30T09:04:18.006Z", "lastPollingStatus": "SUCCESSFUL"}	2025-08-30 10:04:06.333+01	2025-08-30 10:04:18.006+01
5	3	5	\N	\N	12000.00	XAF	completed	consultation	mobile_money	6ff72954-6d87-4175-8890-b955ee8ce654	{"status": "SUCCESSFUL", "reference": "6ff72954-6d87-4175-8890-b955ee8ce654"}	Payment for appointment with Dr. Omni Creative	{"processedAt": "2025-08-30T11:18:18.192Z", "lastPollingAt": "2025-08-30T11:18:18.192Z", "lastPollingStatus": "SUCCESSFUL"}	2025-08-30 12:18:06.306+01	2025-08-30 12:18:18.193+01
6	3	6	\N	\N	5000.00	XAF	failed	consultation	mobile_money	5f5a3549-6be6-466e-8ce4-3ce2dd6c92cd	{"status": "FAILED", "reference": "5f5a3549-6be6-466e-8ce4-3ce2dd6c92cd"}	Payment for appointment with Dr. Keyz Global	{"processedAt": null, "lastPollingAt": "2025-08-30T11:22:08.796Z", "lastPollingStatus": "FAILED"}	2025-08-30 12:21:57.292+01	2025-08-30 12:22:08.796+01
7	3	7	\N	\N	5000.00	XAF	completed	consultation	mobile_money	df5af4b0-7a9d-402e-8ff8-95b5564df57c	{"status": "SUCCESSFUL", "reference": "df5af4b0-7a9d-402e-8ff8-95b5564df57c"}	Payment for appointment with Dr. Keyz Global	{"processedAt": "2025-08-30T11:29:40.220Z", "lastPollingAt": "2025-08-30T11:29:40.220Z", "lastPollingStatus": "SUCCESSFUL"}	2025-08-30 12:29:28.415+01	2025-08-30 12:29:40.221+01
8	3	8	\N	\N	12000.00	XAF	failed	consultation	mobile_money	c29f663d-75d3-4aaa-8c10-1f00cd3b1554	{"status": "FAILED", "reference": "c29f663d-75d3-4aaa-8c10-1f00cd3b1554"}	Payment for appointment with Dr. Omni Creative	{"processedAt": null, "lastPollingAt": "2025-08-30T15:13:42.131Z", "lastPollingStatus": "FAILED"}	2025-08-30 16:13:28.697+01	2025-08-30 16:13:42.132+01
9	3	9	\N	\N	12000.00	XAF	completed	consultation	mobile_money	475ebbaa-fef2-4c7e-aa17-e5dd59158676	{"status": "SUCCESSFUL", "reference": "475ebbaa-fef2-4c7e-aa17-e5dd59158676"}	Payment for appointment with Dr. Omni Creative	{"processedAt": "2025-08-30T15:14:08.281Z", "lastPollingAt": "2025-08-30T15:14:08.281Z", "lastPollingStatus": "SUCCESSFUL"}	2025-08-30 16:13:49.266+01	2025-08-30 16:14:08.282+01
10	3	10	\N	\N	1700.00	XAF	failed	consultation	mobile_money	84469d1a-07dc-4b4b-9780-1866961d95ba	{"status": "FAILED", "reference": "84469d1a-07dc-4b4b-9780-1866961d95ba"}	Payment for appointment with Dr. Keyz Global	{"processedAt": null, "lastPollingAt": "2025-08-30T15:16:48.818Z", "lastPollingStatus": "FAILED"}	2025-08-30 16:16:36.25+01	2025-08-30 16:16:48.818+01
11	3	11	\N	\N	1700.00	XAF	completed	consultation	mobile_money	3c819fb4-58e7-479f-9c5c-4cf628eca306	{"status": "SUCCESSFUL", "reference": "3c819fb4-58e7-479f-9c5c-4cf628eca306"}	Payment for appointment with Dr. Keyz Global	{"processedAt": "2025-08-30T15:17:14.072Z", "lastPollingAt": "2025-08-30T15:17:14.072Z", "lastPollingStatus": "SUCCESSFUL"}	2025-08-30 16:16:55.374+01	2025-08-30 16:17:14.072+01
12	6	12	\N	\N	1700.00	XAF	completed	consultation	mobile_money	3804759d-84fb-4408-a5b2-90fcad070afa	{"status": "SUCCESSFUL", "reference": "3804759d-84fb-4408-a5b2-90fcad070afa"}	Payment for appointment with Dr. Keyz Global	{"processedAt": "2025-08-30T19:36:27.624Z", "lastPollingAt": "2025-08-30T19:36:27.624Z", "lastPollingStatus": "SUCCESSFUL"}	2025-08-30 20:36:12.983+01	2025-08-30 20:36:27.624+01
13	6	13	\N	\N	1500.00	XAF	failed	consultation	mobile_money	5fcd27d0-3be0-4082-bc5d-289c00702007	{"status": "FAILED", "reference": "5fcd27d0-3be0-4082-bc5d-289c00702007"}	Payment for appointment with Dr. Keyz Tester	{"processedAt": null, "lastPollingAt": "2025-08-31T10:05:01.490Z", "lastPollingStatus": "FAILED"}	2025-08-31 11:04:47.54+01	2025-08-31 11:05:01.49+01
14	6	14	\N	\N	1500.00	XAF	failed	consultation	mobile_money	68564fc8-82fa-4ce4-8230-cfde9ac1825e	{"status": "FAILED", "reference": "68564fc8-82fa-4ce4-8230-cfde9ac1825e"}	Payment for appointment with Dr. Keyz Tester	{"processedAt": null, "lastPollingAt": "2025-08-30T23:02:13.757Z", "lastPollingStatus": "FAILED", "lastNotificationAt": "2025-08-30T23:02:13.788Z", "lastNotificationStatus": "FAILED"}	2025-08-31 00:01:58.627+01	2025-08-31 00:02:13.789+01
15	6	15	\N	\N	1500.00	XAF	completed	consultation	mobile_money	a9665240-a6ea-481d-b9b6-07f44d237e6e	{"status": "SUCCESSFUL", "reference": "a9665240-a6ea-481d-b9b6-07f44d237e6e"}	Payment for appointment with Dr. Keyz Tester	{"processedAt": "2025-08-30T23:02:52.542Z", "lastPollingAt": "2025-08-30T23:02:52.542Z", "lastPollingStatus": "SUCCESSFUL", "lastNotificationAt": "2025-08-30T23:02:52.589Z", "lastNotificationStatus": "SUCCESSFUL"}	2025-08-31 00:02:31.769+01	2025-08-31 00:02:52.59+01
16	6	16	\N	\N	12000.00	XAF	failed	consultation	mobile_money	91ea14e8-cfeb-4f5a-9ff7-6d70a6a53f95	{"status": "FAILED", "reference": "91ea14e8-cfeb-4f5a-9ff7-6d70a6a53f95"}	Payment for appointment with Dr. Omni Creative	{"processedAt": null, "lastPollingAt": "2025-08-31T15:12:56.811Z", "lastPollingStatus": "FAILED", "lastNotificationAt": "2025-08-31T15:12:56.857Z", "lastNotificationStatus": "FAILED"}	2025-08-31 16:12:42.866+01	2025-08-31 16:12:56.858+01
17	6	17	\N	\N	12000.00	XAF	failed	consultation	mobile_money	7ffea6d4-0b3a-4e0d-90c2-b90358e8a9ec	{"status": "FAILED", "reference": "7ffea6d4-0b3a-4e0d-90c2-b90358e8a9ec"}	Payment for appointment with Dr. Omni Creative	{"processedAt": null, "lastPollingAt": "2025-08-31T15:14:30.307Z", "lastPollingStatus": "FAILED", "lastNotificationAt": "2025-08-31T15:14:30.338Z", "lastNotificationStatus": "FAILED"}	2025-08-31 16:14:16.831+01	2025-08-31 16:14:30.338+01
18	6	18	\N	\N	12000.00	XAF	failed	consultation	mobile_money	617c8e92-4d2d-4c88-8ce7-2607ce89662d	{"status": "FAILED", "reference": "617c8e92-4d2d-4c88-8ce7-2607ce89662d"}	Payment for appointment with Dr. Omni Creative	{"processedAt": null, "lastPollingAt": "2025-08-31T15:14:56.321Z", "lastPollingStatus": "FAILED", "lastNotificationAt": "2025-08-31T15:14:56.365Z", "lastNotificationStatus": "FAILED"}	2025-08-31 16:14:43.258+01	2025-08-31 16:14:56.365+01
19	6	19	\N	\N	12000.00	XAF	failed	consultation	mobile_money	0b27dc90-6f1a-4e65-826d-32bb21f89478	{"status": "FAILED", "reference": "0b27dc90-6f1a-4e65-826d-32bb21f89478"}	Payment for appointment with Dr. Omni Creative	{"processedAt": null, "lastPollingAt": "2025-08-31T15:15:41.047Z", "lastPollingStatus": "FAILED", "lastNotificationAt": "2025-08-31T15:15:41.082Z", "lastNotificationStatus": "FAILED"}	2025-08-31 16:15:27.569+01	2025-08-31 16:15:41.082+01
20	6	20	\N	\N	12000.00	XAF	failed	consultation	mobile_money	62205a0d-1882-42ad-825d-b5063976b918	{"status": "FAILED", "reference": "62205a0d-1882-42ad-825d-b5063976b918"}	Payment for appointment with Dr. Omni Creative	{"processedAt": null, "lastPollingAt": "2025-08-31T15:17:29.327Z", "lastPollingStatus": "FAILED", "lastNotificationAt": "2025-08-31T15:17:29.364Z", "lastNotificationStatus": "FAILED"}	2025-08-31 16:17:15.831+01	2025-08-31 16:17:29.365+01
21	6	21	\N	\N	12000.00	XAF	completed	consultation	mobile_money	004ce3e2-0089-4a45-a833-0f4ded5903f9	{"status": "SUCCESSFUL", "reference": "004ce3e2-0089-4a45-a833-0f4ded5903f9"}	Payment for appointment with Dr. Omni Creative	{"processedAt": "2025-08-31T15:19:11.251Z", "lastPollingAt": "2025-08-31T15:19:11.251Z", "lastPollingStatus": "SUCCESSFUL", "lastNotificationAt": "2025-08-31T15:19:11.277Z", "lastNotificationStatus": "SUCCESSFUL"}	2025-08-31 16:18:57.273+01	2025-08-31 16:19:11.277+01
22	6	22	\N	\N	12000.00	XAF	completed	consultation	mobile_money	ca405819-4140-4c79-b3c3-939aba8e6ed8	{"status": "SUCCESSFUL", "reference": "ca405819-4140-4c79-b3c3-939aba8e6ed8"}	Payment for appointment with Dr. Omni Creative	{"processedAt": "2025-08-31T16:01:20.449Z", "lastPollingAt": "2025-08-31T16:01:20.449Z", "lastPollingStatus": "SUCCESSFUL", "lastNotificationAt": "2025-08-31T16:01:20.491Z", "lastNotificationStatus": "SUCCESSFUL"}	2025-08-31 17:01:06.578+01	2025-08-31 17:01:20.492+01
23	6	23	\N	\N	12000.00	XAF	completed	consultation	mobile_money	94ef0b76-660d-487e-9a1b-0b4ea460dd43	{"status": "SUCCESSFUL", "reference": "94ef0b76-660d-487e-9a1b-0b4ea460dd43"}	Payment for appointment with Dr. Omni Creative	{"processedAt": "2025-08-31T16:30:05.300Z", "lastPollingAt": "2025-08-31T16:30:05.300Z", "lastPollingStatus": "SUCCESSFUL", "lastNotificationAt": "2025-08-31T16:30:05.328Z", "lastNotificationStatus": "SUCCESSFUL"}	2025-08-31 17:29:51.242+01	2025-08-31 17:30:05.328+01
24	6	24	\N	\N	12000.00	XAF	completed	consultation	mobile_money	0323ab4b-c172-406f-b759-223db107e339	{"operator": "MTN", "reference": "0323ab4b-c172-406f-b759-223db107e339", "ussd_code": "*126#"}	Payment for appointment with Dr. Omni Creative	{"processedAt": "2025-08-31T17:31:24.902Z", "lastPollingAt": "2025-08-31T17:31:24.902Z", "lastPollingStatus": "SUCCESSFUL", "lastNotificationAt": "2025-08-31T17:31:24.924Z", "lastNotificationStatus": "SUCCESSFUL"}	2025-08-31 18:30:48.231+01	2025-08-31 18:31:24.924+01
25	6	25	\N	\N	12000.00	XAF	completed	consultation	mobile_money	30aa8ac6-f8f7-43b4-93c6-f69c71bcfced	{"operator": "MTN", "reference": "30aa8ac6-f8f7-43b4-93c6-f69c71bcfced", "ussd_code": "*126#"}	Payment for appointment with Dr. Omni Creative	{"processedAt": "2025-08-31T18:28:02.712Z", "lastPollingAt": "2025-08-31T18:28:02.713Z", "lastPollingStatus": "SUCCESSFUL", "lastNotificationAt": "2025-08-31T18:28:02.736Z", "lastNotificationStatus": "SUCCESSFUL"}	2025-08-31 19:27:37.106+01	2025-08-31 19:28:02.736+01
27	6	27	\N	\N	12000.00	XAF	completed	consultation	mobile_money	ac501703-0818-4894-95fc-94f5da6c3fd2	{"operator": "MTN", "reference": "ac501703-0818-4894-95fc-94f5da6c3fd2", "ussd_code": "*126#"}	Payment for appointment with Dr. Omni Creative	{"processedAt": "2025-08-31T19:40:44.738Z", "lastPollingAt": "2025-08-31T19:40:44.738Z", "lastPollingStatus": "SUCCESSFUL", "lastNotificationAt": "2025-08-31T19:40:44.776Z", "lastNotificationStatus": "SUCCESSFUL"}	2025-08-31 20:40:18.278+01	2025-08-31 20:40:44.776+01
26	6	26	\N	\N	1700.00	XAF	completed	consultation	mobile_money	de0ba040-f5bf-41d7-8f45-f310648588d1	{"operator": "MTN", "reference": "de0ba040-f5bf-41d7-8f45-f310648588d1", "ussd_code": "*126#"}	Payment for appointment with Dr. Keyz Global	{"processedAt": "2025-08-31T18:29:38.657Z", "lastPollingAt": "2025-08-31T18:29:38.657Z", "lastPollingStatus": "SUCCESSFUL", "lastNotificationAt": "2025-08-31T18:29:38.676Z", "lastNotificationStatus": "SUCCESSFUL"}	2025-08-31 19:29:02.113+01	2025-08-31 19:29:38.676+01
28	6	28	\N	\N	2300.00	XAF	completed	consultation	mobile_money	7376b167-7a94-4992-88ec-6ef963cb6aa0	{"operator": "MTN", "reference": "7376b167-7a94-4992-88ec-6ef963cb6aa0", "ussd_code": "*126#"}	Payment for appointment with Dr. Keyz Global	{"processedAt": "2025-08-31T22:42:12.885Z", "lastPollingAt": "2025-08-31T22:42:12.885Z", "lastPollingStatus": "SUCCESSFUL", "lastNotificationAt": "2025-08-31T22:42:12.942Z", "lastNotificationStatus": "SUCCESSFUL"}	2025-08-31 23:41:37.096+01	2025-08-31 23:42:12.943+01
30	6	30	\N	\N	5000.00	XAF	completed	consultation	mobile_money	cee5d180-4de8-4396-9e37-722551e6740d	{"operator": "MTN", "reference": "cee5d180-4de8-4396-9e37-722551e6740d", "ussd_code": "*126#"}	Payment for appointment with Dr. Omni Creative	{"processedAt": "2025-09-01T00:38:11.411Z", "lastPollingAt": "2025-09-01T00:38:11.411Z", "lastPollingStatus": "SUCCESSFUL", "lastNotificationAt": "2025-09-01T00:38:11.455Z", "lastNotificationStatus": "SUCCESSFUL"}	2025-09-01 01:37:50.359+01	2025-09-01 01:38:11.456+01
29	6	29	\N	\N	5000.00	XAF	processing	consultation	mobile_money	d212cad7-9a96-45ec-b925-93adf8bc6acc	{"operator": "MTN", "reference": "d212cad7-9a96-45ec-b925-93adf8bc6acc", "ussd_code": "*126#"}	Payment for appointment with Dr. Omni Creative	{"processedAt": null, "lastPollingAt": "2025-09-01T00:47:12.453Z", "lastPollingStatus": "PENDING"}	2025-09-01 01:37:13.603+01	2025-09-01 01:47:12.454+01
\.


--
-- TOC entry 5504 (class 0 OID 16843)
-- Dependencies: 245
-- Data for Name: Pharmacies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Pharmacies" (id, "userId", name, "licenseNumber", description, logo, images, address, "contactInfo", "deliveryInfo", "paymentMethods", documents, languages, "isVerified", "isActive", "averageRating", "totalReviews", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5506 (class 0 OID 16856)
-- Dependencies: 247
-- Data for Name: PharmacyDrugs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PharmacyDrugs" (id, "pharmacyId", name, "genericName", description, "dosageForm", strength, manufacturer, price, currency, "stockQuantity", "isAvailable", "requiresPrescription", "imageUrl", category, "sideEffects", contraindications, "expiryDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5508 (class 0 OID 16870)
-- Dependencies: 249
-- Data for Name: Prescriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Prescriptions" (id, "consultationId", status, diagnosis, medications, instructions, dosage, duration, "startDate", "endDate", refills, "refillsRemaining", notes, "sideEffects", contraindications, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5510 (class 0 OID 16885)
-- Dependencies: 251
-- Data for Name: QAndAs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QAndAs" (id, question, answer, category, "isActive", "createdAt", "updatedAt") FROM stdin;
1	What are the common symptoms of COVID-19?	Common symptoms include fever, cough, fatigue, loss of taste or smell, sore throat, headache, and body aches. Severe symptoms may include difficulty breathing, chest pain, and confusion.	infectious_diseases	t	2025-08-26 17:06:41.891+01	2025-08-26 17:06:41.891+01
2	How often should I get a physical checkup?	Adults should get a physical checkup at least once a year. However, the frequency may vary based on age, health conditions, and risk factors. Consult with your doctor for personalized recommendations.	preventive_care	t	2025-08-26 17:06:41.891+01	2025-08-26 17:06:41.891+01
3	What is the recommended daily water intake?	The general recommendation is 8 glasses (64 ounces) of water per day, but this varies based on factors like age, weight, activity level, and climate. Listen to your body's thirst signals.	nutrition	t	2025-08-26 17:06:41.891+01	2025-08-26 17:06:41.891+01
4	How can I manage stress and anxiety?	Effective stress management includes regular exercise, meditation, deep breathing exercises, adequate sleep, maintaining a healthy diet, and seeking professional help when needed.	mental_health	t	2025-08-26 17:06:41.891+01	2025-08-26 17:06:41.891+01
5	What are the warning signs of a heart attack?	Warning signs include chest pain or pressure, pain spreading to arms, neck, or jaw, shortness of breath, nausea, lightheadedness, and cold sweats. Seek immediate medical attention if you experience these symptoms.	emergency_care	t	2025-08-26 17:06:41.891+01	2025-08-26 17:06:41.891+01
6	How much sleep do adults need?	Most adults need 7-9 hours of sleep per night. Quality sleep is essential for physical health, mental well-being, and cognitive function.	sleep_health	t	2025-08-26 17:06:41.891+01	2025-08-26 17:06:41.891+01
7	What are the benefits of regular exercise?	Regular exercise improves cardiovascular health, strengthens muscles and bones, boosts mood, helps maintain healthy weight, reduces risk of chronic diseases, and improves sleep quality.	fitness	t	2025-08-26 17:06:41.891+01	2025-08-26 17:06:41.891+01
8	How can I maintain a healthy diet?	A healthy diet includes plenty of fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods, added sugars, and excessive salt. Portion control is also important.	nutrition	t	2025-08-26 17:06:41.891+01	2025-08-26 17:06:41.891+01
9	What should I do if I have a fever?	Rest, stay hydrated, take acetaminophen or ibuprofen for comfort, and monitor your temperature. Seek medical attention if fever is high (above 103°F/39.4°C) or persists for more than 3 days.	home_care	t	2025-08-26 17:06:41.891+01	2025-08-26 17:06:41.891+01
10	How can I prevent the common cold?	Prevent colds by washing hands frequently, avoiding close contact with sick people, maintaining a healthy lifestyle, getting adequate sleep, and considering vitamin C supplements.	preventive_care	t	2025-08-26 17:06:41.891+01	2025-08-26 17:06:41.891+01
\.


--
-- TOC entry 5512 (class 0 OID 16894)
-- Dependencies: 253
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20250822150607-create-users.js
20250822150628-create-contact-informations.js
20250822150646-create-specialties.js
20250822150651-create-symptoms.js
20250822150659-create-patients.js
20250822150706-create-doctors.js
20250822150712-create-pharmacies.js
20250822150719-create-doctor-specialties.js
20250822150736-create-user-applications.js
20250822150743-create-application-documents.js
20250822150815-create-pharmacy-drugs.js
20250822150841-create-testimonials.js
20250822150846-create-q-and-as.js
20250822150852-create-doctor-availabilities.js
20250822150855-create-timeslots.js
20250822150857-create-appointments.js
20250822150858-create-consultations.js
20250822150859-create-notifications.js
20250822150905-create-system-notifications.js
20250822150907-create-prescriptions.js
20250822150910-create-payments.js
20250822150913-create-activity-logs.js
20250822150915-create-consultation-messages.js
20250822150921-create-drug-orders.js
20250827223808-create-patient-documents.js
20250828080602-add-notification-types.js
20250828100246-add-doctorId-to-appointment.js
20250828100250-clean-timeslot-data.js
20250828100251-clean-timeslot-data.js
20250830010112-add-roomId-to-consultation.js
20250838010115-clean-timeslot-data.js
\.


--
-- TOC entry 5513 (class 0 OID 16897)
-- Dependencies: 254
-- Data for Name: Specialties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Specialties" (id, name, description, icon, "isActive", "createdAt", "updatedAt") FROM stdin;
1	Cardiology	Specializes in heart and cardiovascular system disorders	\N	t	2025-08-26 17:06:41.906+01	2025-08-26 17:06:41.906+01
2	Dermatology	Specializes in skin, hair, and nail conditions	\N	t	2025-08-26 17:06:41.906+01	2025-08-26 17:06:41.906+01
3	Endocrinology	Specializes in hormone-related disorders and diabetes	\N	t	2025-08-26 17:06:41.906+01	2025-08-26 17:06:41.906+01
4	Gastroenterology	Specializes in digestive system disorders	\N	t	2025-08-26 17:06:41.906+01	2025-08-26 17:06:41.906+01
5	Neurology	Specializes in nervous system disorders	\N	t	2025-08-26 17:06:41.906+01	2025-08-26 17:06:41.906+01
6	Oncology	Specializes in cancer diagnosis and treatment	\N	t	2025-08-26 17:06:41.906+01	2025-08-26 17:06:41.906+01
7	Orthopedics	Specializes in bone and joint disorders	\N	t	2025-08-26 17:06:41.906+01	2025-08-26 17:06:41.906+01
8	Pediatrics	Specializes in children's health and development	\N	t	2025-08-26 17:06:41.906+01	2025-08-26 17:06:41.906+01
9	Psychiatry	Specializes in mental health and behavioral disorders	\N	t	2025-08-26 17:06:41.906+01	2025-08-26 17:06:41.906+01
10	Pulmonology	Specializes in respiratory system disorders	\N	t	2025-08-26 17:06:41.906+01	2025-08-26 17:06:41.906+01
11	Radiology	Specializes in medical imaging and diagnosis	\N	t	2025-08-26 17:06:41.906+01	2025-08-26 17:06:41.906+01
12	Urology	Specializes in urinary system and male reproductive health	\N	t	2025-08-26 17:06:41.906+01	2025-08-26 17:06:41.906+01
13	General Medicine	Provides comprehensive primary care for adults	\N	t	2025-08-26 17:06:41.906+01	2025-08-26 17:06:41.906+01
14	Family Medicine	Provides comprehensive care for all family members	\N	t	2025-08-26 17:06:41.906+01	2025-08-26 17:06:41.906+01
15	Emergency Medicine	Specializes in acute care and emergency situations	\N	t	2025-08-26 17:06:41.906+01	2025-08-26 17:06:41.906+01
\.


--
-- TOC entry 5515 (class 0 OID 16906)
-- Dependencies: 256
-- Data for Name: Symptoms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Symptoms" (id, name, "iconUrl", "specialtyId", "createdAt", "updatedAt") FROM stdin;
1	Tooth ache	/uploads/symptoms/dd904e13-2fa4-4930-aa5a-a870c4719c7c.png	2	2025-08-27 00:53:00.197+01	2025-08-27 00:53:00.197+01
2	Chest Pain	/uploads/symptoms/e7e232d0-b45e-4c4c-a65c-d2dca60ecf39.png	1	2025-08-27 00:53:18.085+01	2025-08-27 00:53:18.085+01
3	Flu	/uploads/symptoms/02e2dec2-001d-4953-9545-d796228f69fd.png	8	2025-08-27 00:53:43.692+01	2025-08-27 00:53:43.692+01
4	Head ache	/uploads/symptoms/79693cd7-abbc-4067-b25e-37f5208e28dc.png	5	2025-08-27 00:54:04.177+01	2025-08-27 00:54:04.177+01
5	Fatigue	/uploads/symptoms/0a581bae-3c1e-4400-a290-ac862bfeef42.png	5	2025-08-27 00:54:35.439+01	2025-08-27 00:54:35.439+01
6	Vomiting	/uploads/symptoms/1d2b3f29-1e49-4d1c-ba75-28bdac484bc1.jpg	6	2025-08-27 00:55:00.462+01	2025-08-27 00:55:00.462+01
7	High blood	/uploads/symptoms/edbc35f3-d0c2-4474-84d6-11e4ad8819f5.png	12	2025-08-27 00:55:37.538+01	2025-08-27 00:55:37.538+01
8	Dizziness	/uploads/symptoms/a5795895-cbc5-48a9-8e28-29276b234f60.png	5	2025-08-27 00:56:06.329+01	2025-08-27 00:56:06.329+01
9	Severe fever	/uploads/symptoms/961fcdfb-85d0-4f71-bdf4-e006e2376818.png	11	2025-08-27 00:56:58.773+01	2025-08-27 00:56:58.773+01
\.


--
-- TOC entry 5517 (class 0 OID 16914)
-- Dependencies: 258
-- Data for Name: SystemNotifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SystemNotifications" (id, type, priority, title, message, "targetAudience", "isActive", "startDate", "endDate", data, "createdBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5519 (class 0 OID 16926)
-- Dependencies: 260
-- Data for Name: Testimonials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Testimonials" (id, "userId", "patientId", "doctorId", "pharmacyId", rating, title, content, "isApproved", "isAnonymous", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5521 (class 0 OID 16936)
-- Dependencies: 262
-- Data for Name: TimeSlots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TimeSlots" (id, "doctorAvailabilityId", "startTime", "endTime", date, "isBooked", "createdAt", "updatedAt") FROM stdin;
1	2	09:00:00	09:15:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
3	2	09:30:00	09:45:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
5	2	10:00:00	10:15:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
6	2	10:15:00	10:30:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
7	2	10:30:00	10:45:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
8	2	10:45:00	11:00:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
9	2	11:00:00	11:15:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
10	2	11:15:00	11:30:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
11	2	11:30:00	11:45:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
12	2	11:45:00	12:00:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
14	2	12:15:00	12:30:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
16	2	12:45:00	13:00:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
17	2	13:00:00	13:15:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
18	2	13:15:00	13:30:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
19	2	13:30:00	13:45:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
20	2	13:45:00	14:00:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
21	2	14:00:00	14:15:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
22	2	14:15:00	14:30:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
23	2	14:30:00	14:45:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
24	2	14:45:00	15:00:00	2025-08-30	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
27	1	15:30:00	15:45:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
28	1	15:45:00	16:00:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
29	1	16:00:00	16:15:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
30	1	16:15:00	16:30:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
31	1	16:30:00	16:45:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
32	1	16:45:00	17:00:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
33	1	17:00:00	17:15:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
34	1	17:15:00	17:30:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
35	1	17:30:00	17:45:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
36	1	17:45:00	18:00:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
37	1	18:00:00	18:15:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
38	1	18:15:00	18:30:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
39	1	18:30:00	18:45:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
40	1	18:45:00	19:00:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
41	1	19:00:00	19:15:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
42	1	19:15:00	19:30:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
44	1	19:45:00	20:00:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
45	1	20:00:00	20:15:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
46	1	20:15:00	20:30:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
47	1	20:30:00	20:45:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
48	1	20:45:00	21:00:00	2025-08-31	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
49	2	09:00:00	09:15:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
50	2	09:15:00	09:30:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
51	2	09:30:00	09:45:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
52	2	09:45:00	10:00:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
53	2	10:00:00	10:15:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
54	2	10:15:00	10:30:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
55	2	10:30:00	10:45:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
56	2	10:45:00	11:00:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
57	2	11:00:00	11:15:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
58	2	11:15:00	11:30:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
59	2	11:30:00	11:45:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
60	2	11:45:00	12:00:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
61	2	12:00:00	12:15:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
62	2	12:15:00	12:30:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
63	2	12:30:00	12:45:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
64	2	12:45:00	13:00:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
65	2	13:00:00	13:15:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
66	2	13:15:00	13:30:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
67	2	13:30:00	13:45:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
68	2	13:45:00	14:00:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
69	2	14:00:00	14:15:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
70	2	14:15:00	14:30:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
71	2	14:30:00	14:45:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
72	2	14:45:00	15:00:00	2025-09-06	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
73	1	15:00:00	15:15:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
74	1	15:15:00	15:30:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
75	1	15:30:00	15:45:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
76	1	15:45:00	16:00:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
77	1	16:00:00	16:15:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
78	1	16:15:00	16:30:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
79	1	16:30:00	16:45:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
80	1	16:45:00	17:00:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
81	1	17:00:00	17:15:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
82	1	17:15:00	17:30:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
83	1	17:30:00	17:45:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
84	1	17:45:00	18:00:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
85	1	18:00:00	18:15:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
86	1	18:15:00	18:30:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
87	1	18:30:00	18:45:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
88	1	18:45:00	19:00:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
89	1	19:00:00	19:15:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
90	1	19:15:00	19:30:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
91	1	19:30:00	19:45:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
92	1	19:45:00	20:00:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
93	1	20:00:00	20:15:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
94	1	20:15:00	20:30:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
95	1	20:30:00	20:45:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
96	1	20:45:00	21:00:00	2025-09-07	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
97	2	09:00:00	09:15:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
98	2	09:15:00	09:30:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
99	2	09:30:00	09:45:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
100	2	09:45:00	10:00:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
101	2	10:00:00	10:15:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
102	2	10:15:00	10:30:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
103	2	10:30:00	10:45:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
104	2	10:45:00	11:00:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
105	2	11:00:00	11:15:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
106	2	11:15:00	11:30:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
107	2	11:30:00	11:45:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
4	2	09:45:00	10:00:00	2025-08-30	t	2025-08-30 08:59:06.006+01	2025-08-30 09:11:52.694+01
13	2	12:00:00	12:15:00	2025-08-30	t	2025-08-30 08:59:06.006+01	2025-08-30 09:58:58.364+01
15	2	12:30:00	12:45:00	2025-08-30	t	2025-08-30 08:59:06.006+01	2025-08-30 12:29:40.199+01
25	1	15:00:00	15:15:00	2025-08-31	t	2025-08-30 08:59:06.006+01	2025-08-30 16:17:14.045+01
108	2	11:45:00	12:00:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
109	2	12:00:00	12:15:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
110	2	12:15:00	12:30:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
111	2	12:30:00	12:45:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
112	2	12:45:00	13:00:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
113	2	13:00:00	13:15:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
114	2	13:15:00	13:30:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
115	2	13:30:00	13:45:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
116	2	13:45:00	14:00:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
117	2	14:00:00	14:15:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
118	2	14:15:00	14:30:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
119	2	14:30:00	14:45:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
120	2	14:45:00	15:00:00	2025-09-13	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
121	1	15:00:00	15:15:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
122	1	15:15:00	15:30:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
123	1	15:30:00	15:45:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
124	1	15:45:00	16:00:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
125	1	16:00:00	16:15:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
126	1	16:15:00	16:30:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
127	1	16:30:00	16:45:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
128	1	16:45:00	17:00:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
129	1	17:00:00	17:15:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
130	1	17:15:00	17:30:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
131	1	17:30:00	17:45:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
132	1	17:45:00	18:00:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
133	1	18:00:00	18:15:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
134	1	18:15:00	18:30:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
135	1	18:30:00	18:45:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
136	1	18:45:00	19:00:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
137	1	19:00:00	19:15:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
138	1	19:15:00	19:30:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
139	1	19:30:00	19:45:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
140	1	19:45:00	20:00:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
141	1	20:00:00	20:15:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
142	1	20:15:00	20:30:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
143	1	20:30:00	20:45:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
144	1	20:45:00	21:00:00	2025-09-14	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
145	2	09:00:00	09:15:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
146	2	09:15:00	09:30:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
147	2	09:30:00	09:45:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
148	2	09:45:00	10:00:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
149	2	10:00:00	10:15:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
150	2	10:15:00	10:30:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
151	2	10:30:00	10:45:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
152	2	10:45:00	11:00:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
153	2	11:00:00	11:15:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
154	2	11:15:00	11:30:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
155	2	11:30:00	11:45:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
156	2	11:45:00	12:00:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
157	2	12:00:00	12:15:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
158	2	12:15:00	12:30:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
159	2	12:30:00	12:45:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
160	2	12:45:00	13:00:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
161	2	13:00:00	13:15:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
162	2	13:15:00	13:30:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
163	2	13:30:00	13:45:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
164	2	13:45:00	14:00:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
165	2	14:00:00	14:15:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
166	2	14:15:00	14:30:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
167	2	14:30:00	14:45:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
168	2	14:45:00	15:00:00	2025-09-20	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
169	1	15:00:00	15:15:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
170	1	15:15:00	15:30:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
171	1	15:30:00	15:45:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
172	1	15:45:00	16:00:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
173	1	16:00:00	16:15:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
174	1	16:15:00	16:30:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
175	1	16:30:00	16:45:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
176	1	16:45:00	17:00:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
177	1	17:00:00	17:15:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
178	1	17:15:00	17:30:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
179	1	17:30:00	17:45:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
180	1	17:45:00	18:00:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
181	1	18:00:00	18:15:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
182	1	18:15:00	18:30:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
183	1	18:30:00	18:45:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
184	1	18:45:00	19:00:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
185	1	19:00:00	19:15:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
186	1	19:15:00	19:30:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
187	1	19:30:00	19:45:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
188	1	19:45:00	20:00:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
189	1	20:00:00	20:15:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
190	1	20:15:00	20:30:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
191	1	20:30:00	20:45:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
192	1	20:45:00	21:00:00	2025-09-21	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
193	2	09:00:00	09:15:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
194	2	09:15:00	09:30:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
195	2	09:30:00	09:45:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
196	2	09:45:00	10:00:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
197	2	10:00:00	10:15:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
198	2	10:15:00	10:30:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
199	2	10:30:00	10:45:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
200	2	10:45:00	11:00:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
201	2	11:00:00	11:15:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
202	2	11:15:00	11:30:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
203	2	11:30:00	11:45:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
204	2	11:45:00	12:00:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
205	2	12:00:00	12:15:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
206	2	12:15:00	12:30:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
207	2	12:30:00	12:45:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
208	2	12:45:00	13:00:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
209	2	13:00:00	13:15:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
210	2	13:15:00	13:30:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
211	2	13:30:00	13:45:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
212	2	13:45:00	14:00:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
213	2	14:00:00	14:15:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
214	2	14:15:00	14:30:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
215	2	14:30:00	14:45:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
216	2	14:45:00	15:00:00	2025-09-27	f	2025-08-30 08:59:06.006+01	2025-08-30 08:59:06.006+01
2	2	09:15:00	09:30:00	2025-08-30	t	2025-08-30 08:59:06.006+01	2025-08-30 09:01:50.273+01
218	4	10:45:00	11:15:00	2025-08-30	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
219	4	11:15:00	11:45:00	2025-08-30	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
220	4	11:45:00	12:15:00	2025-08-30	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
221	4	12:15:00	12:45:00	2025-08-30	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
222	4	12:45:00	13:15:00	2025-08-30	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
223	4	13:15:00	13:45:00	2025-08-30	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
224	4	13:45:00	14:15:00	2025-08-30	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
225	4	14:15:00	14:45:00	2025-08-30	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
226	4	14:45:00	15:15:00	2025-08-30	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
227	4	15:15:00	15:45:00	2025-08-30	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
228	4	10:15:00	10:45:00	2025-09-06	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
229	4	10:45:00	11:15:00	2025-09-06	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
230	4	11:15:00	11:45:00	2025-09-06	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
231	4	11:45:00	12:15:00	2025-09-06	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
232	4	12:15:00	12:45:00	2025-09-06	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
233	4	12:45:00	13:15:00	2025-09-06	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
234	4	13:15:00	13:45:00	2025-09-06	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
235	4	13:45:00	14:15:00	2025-09-06	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
236	4	14:15:00	14:45:00	2025-09-06	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
237	4	14:45:00	15:15:00	2025-09-06	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
238	4	15:15:00	15:45:00	2025-09-06	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
239	4	10:15:00	10:45:00	2025-09-13	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
240	4	10:45:00	11:15:00	2025-09-13	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
241	4	11:15:00	11:45:00	2025-09-13	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
242	4	11:45:00	12:15:00	2025-09-13	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
243	4	12:15:00	12:45:00	2025-09-13	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
244	4	12:45:00	13:15:00	2025-09-13	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
245	4	13:15:00	13:45:00	2025-09-13	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
246	4	13:45:00	14:15:00	2025-09-13	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
247	4	14:15:00	14:45:00	2025-09-13	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
248	4	14:45:00	15:15:00	2025-09-13	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
249	4	15:15:00	15:45:00	2025-09-13	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
250	4	10:15:00	10:45:00	2025-09-20	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
251	4	10:45:00	11:15:00	2025-09-20	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
252	4	11:15:00	11:45:00	2025-09-20	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
253	4	11:45:00	12:15:00	2025-09-20	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
254	4	12:15:00	12:45:00	2025-09-20	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
255	4	12:45:00	13:15:00	2025-09-20	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
256	4	13:15:00	13:45:00	2025-09-20	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
257	4	13:45:00	14:15:00	2025-09-20	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
258	4	14:15:00	14:45:00	2025-09-20	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
259	4	14:45:00	15:15:00	2025-09-20	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
260	4	15:15:00	15:45:00	2025-09-20	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
261	4	10:15:00	10:45:00	2025-09-27	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
262	4	10:45:00	11:15:00	2025-09-27	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
263	4	11:15:00	11:45:00	2025-09-27	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
264	4	11:45:00	12:15:00	2025-09-27	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
265	4	12:15:00	12:45:00	2025-09-27	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
266	4	12:45:00	13:15:00	2025-09-27	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
267	4	13:15:00	13:45:00	2025-09-27	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
268	4	13:45:00	14:15:00	2025-09-27	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
269	4	14:15:00	14:45:00	2025-09-27	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
270	4	14:45:00	15:15:00	2025-09-27	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
271	4	15:15:00	15:45:00	2025-09-27	f	2025-08-30 10:02:51.278+01	2025-08-30 10:02:51.278+01
217	4	10:15:00	10:45:00	2025-08-30	t	2025-08-30 10:02:51.278+01	2025-08-30 10:04:17.992+01
272	5	12:00:00	13:00:00	2025-08-30	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
274	5	14:00:00	15:00:00	2025-08-30	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
275	5	15:00:00	16:00:00	2025-08-30	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
276	5	16:00:00	17:00:00	2025-08-30	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
278	5	12:00:00	13:00:00	2025-09-06	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
279	5	13:00:00	14:00:00	2025-09-06	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
280	5	14:00:00	15:00:00	2025-09-06	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
281	5	15:00:00	16:00:00	2025-09-06	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
282	5	16:00:00	17:00:00	2025-09-06	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
283	5	17:00:00	18:00:00	2025-09-06	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
284	5	12:00:00	13:00:00	2025-09-13	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
285	5	13:00:00	14:00:00	2025-09-13	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
286	5	14:00:00	15:00:00	2025-09-13	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
287	5	15:00:00	16:00:00	2025-09-13	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
288	5	16:00:00	17:00:00	2025-09-13	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
289	5	17:00:00	18:00:00	2025-09-13	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
290	5	12:00:00	13:00:00	2025-09-20	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
291	5	13:00:00	14:00:00	2025-09-20	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
292	5	14:00:00	15:00:00	2025-09-20	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
293	5	15:00:00	16:00:00	2025-09-20	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
294	5	16:00:00	17:00:00	2025-09-20	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
295	5	17:00:00	18:00:00	2025-09-20	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
296	5	12:00:00	13:00:00	2025-09-27	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
297	5	13:00:00	14:00:00	2025-09-27	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
298	5	14:00:00	15:00:00	2025-09-27	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
299	5	15:00:00	16:00:00	2025-09-27	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
300	5	16:00:00	17:00:00	2025-09-27	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
301	5	17:00:00	18:00:00	2025-09-27	f	2025-08-30 11:55:40.417+01	2025-08-30 11:55:40.417+01
273	5	13:00:00	14:00:00	2025-08-30	t	2025-08-30 11:55:40.417+01	2025-08-30 12:18:18.166+01
277	5	17:00:00	18:00:00	2025-08-30	t	2025-08-30 11:55:40.417+01	2025-08-30 16:14:08.241+01
26	1	15:15:00	15:30:00	2025-08-31	t	2025-08-30 08:59:06.006+01	2025-08-30 20:36:27.601+01
302	6	11:00:00	11:45:00	2025-08-31	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
303	6	11:45:00	12:30:00	2025-08-31	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
305	6	13:15:00	14:00:00	2025-08-31	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
306	6	14:00:00	14:45:00	2025-08-31	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
307	6	14:45:00	15:30:00	2025-08-31	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
308	6	15:30:00	16:15:00	2025-08-31	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
309	6	16:15:00	17:00:00	2025-08-31	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
310	4	10:15:00	10:45:00	2025-09-06	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
311	4	10:45:00	11:15:00	2025-09-06	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
312	4	11:15:00	11:45:00	2025-09-06	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
313	4	11:45:00	12:15:00	2025-09-06	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
314	4	12:15:00	12:45:00	2025-09-06	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
315	4	12:45:00	13:15:00	2025-09-06	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
316	4	13:15:00	13:45:00	2025-09-06	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
317	4	13:45:00	14:15:00	2025-09-06	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
318	4	14:15:00	14:45:00	2025-09-06	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
319	4	14:45:00	15:15:00	2025-09-06	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
320	4	15:15:00	15:45:00	2025-09-06	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
321	6	11:00:00	11:45:00	2025-09-07	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
322	6	11:45:00	12:30:00	2025-09-07	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
323	6	12:30:00	13:15:00	2025-09-07	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
324	6	13:15:00	14:00:00	2025-09-07	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
325	6	14:00:00	14:45:00	2025-09-07	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
326	6	14:45:00	15:30:00	2025-09-07	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
327	6	15:30:00	16:15:00	2025-09-07	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
328	6	16:15:00	17:00:00	2025-09-07	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
329	4	10:15:00	10:45:00	2025-09-13	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
330	4	10:45:00	11:15:00	2025-09-13	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
331	4	11:15:00	11:45:00	2025-09-13	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
332	4	11:45:00	12:15:00	2025-09-13	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
333	4	12:15:00	12:45:00	2025-09-13	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
334	4	12:45:00	13:15:00	2025-09-13	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
335	4	13:15:00	13:45:00	2025-09-13	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
336	4	13:45:00	14:15:00	2025-09-13	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
337	4	14:15:00	14:45:00	2025-09-13	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
338	4	14:45:00	15:15:00	2025-09-13	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
339	4	15:15:00	15:45:00	2025-09-13	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
340	6	11:00:00	11:45:00	2025-09-14	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
341	6	11:45:00	12:30:00	2025-09-14	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
342	6	12:30:00	13:15:00	2025-09-14	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
343	6	13:15:00	14:00:00	2025-09-14	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
344	6	14:00:00	14:45:00	2025-09-14	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
345	6	14:45:00	15:30:00	2025-09-14	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
346	6	15:30:00	16:15:00	2025-09-14	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
347	6	16:15:00	17:00:00	2025-09-14	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
348	4	10:15:00	10:45:00	2025-09-20	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
349	4	10:45:00	11:15:00	2025-09-20	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
350	4	11:15:00	11:45:00	2025-09-20	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
351	4	11:45:00	12:15:00	2025-09-20	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
352	4	12:15:00	12:45:00	2025-09-20	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
353	4	12:45:00	13:15:00	2025-09-20	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
354	4	13:15:00	13:45:00	2025-09-20	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
355	4	13:45:00	14:15:00	2025-09-20	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
356	4	14:15:00	14:45:00	2025-09-20	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
357	4	14:45:00	15:15:00	2025-09-20	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
358	4	15:15:00	15:45:00	2025-09-20	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
359	6	11:00:00	11:45:00	2025-09-21	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
360	6	11:45:00	12:30:00	2025-09-21	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
361	6	12:30:00	13:15:00	2025-09-21	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
362	6	13:15:00	14:00:00	2025-09-21	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
363	6	14:00:00	14:45:00	2025-09-21	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
364	6	14:45:00	15:30:00	2025-09-21	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
365	6	15:30:00	16:15:00	2025-09-21	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
366	6	16:15:00	17:00:00	2025-09-21	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
367	4	10:15:00	10:45:00	2025-09-27	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
368	4	10:45:00	11:15:00	2025-09-27	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
369	4	11:15:00	11:45:00	2025-09-27	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
370	4	11:45:00	12:15:00	2025-09-27	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
371	4	12:15:00	12:45:00	2025-09-27	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
372	4	12:45:00	13:15:00	2025-09-27	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
373	4	13:15:00	13:45:00	2025-09-27	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
374	4	13:45:00	14:15:00	2025-09-27	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
375	4	14:15:00	14:45:00	2025-09-27	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
376	4	14:45:00	15:15:00	2025-09-27	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
377	4	15:15:00	15:45:00	2025-09-27	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
378	6	11:00:00	11:45:00	2025-09-28	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
379	6	11:45:00	12:30:00	2025-09-28	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
380	6	12:30:00	13:15:00	2025-09-28	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
381	6	13:15:00	14:00:00	2025-09-28	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
382	6	14:00:00	14:45:00	2025-09-28	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
383	6	14:45:00	15:30:00	2025-09-28	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
384	6	15:30:00	16:15:00	2025-09-28	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
385	6	16:15:00	17:00:00	2025-09-28	f	2025-08-31 10:56:55.236+01	2025-08-31 10:56:55.236+01
304	6	12:30:00	13:15:00	2025-08-31	t	2025-08-31 10:56:55.236+01	2025-08-31 00:02:52.44+01
390	8	19:15:00	20:00:00	2025-08-31	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
393	5	12:00:00	13:00:00	2025-09-06	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
394	5	13:00:00	14:00:00	2025-09-06	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
395	5	14:00:00	15:00:00	2025-09-06	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
396	5	15:00:00	16:00:00	2025-09-06	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
397	5	16:00:00	17:00:00	2025-09-06	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
398	5	17:00:00	18:00:00	2025-09-06	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
399	8	16:15:00	17:00:00	2025-09-07	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
400	8	17:00:00	17:45:00	2025-09-07	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
401	8	17:45:00	18:30:00	2025-09-07	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
402	8	18:30:00	19:15:00	2025-09-07	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
403	8	19:15:00	20:00:00	2025-09-07	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
404	8	20:00:00	20:45:00	2025-09-07	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
405	8	20:45:00	21:30:00	2025-09-07	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
406	5	12:00:00	13:00:00	2025-09-13	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
407	5	13:00:00	14:00:00	2025-09-13	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
408	5	14:00:00	15:00:00	2025-09-13	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
409	5	15:00:00	16:00:00	2025-09-13	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
410	5	16:00:00	17:00:00	2025-09-13	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
411	5	17:00:00	18:00:00	2025-09-13	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
412	8	16:15:00	17:00:00	2025-09-14	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
413	8	17:00:00	17:45:00	2025-09-14	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
414	8	17:45:00	18:30:00	2025-09-14	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
415	8	18:30:00	19:15:00	2025-09-14	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
416	8	19:15:00	20:00:00	2025-09-14	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
417	8	20:00:00	20:45:00	2025-09-14	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
418	8	20:45:00	21:30:00	2025-09-14	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
419	5	12:00:00	13:00:00	2025-09-20	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
420	5	13:00:00	14:00:00	2025-09-20	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
421	5	14:00:00	15:00:00	2025-09-20	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
422	5	15:00:00	16:00:00	2025-09-20	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
423	5	16:00:00	17:00:00	2025-09-20	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
424	5	17:00:00	18:00:00	2025-09-20	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
425	8	16:15:00	17:00:00	2025-09-21	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
426	8	17:00:00	17:45:00	2025-09-21	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
427	8	17:45:00	18:30:00	2025-09-21	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
428	8	18:30:00	19:15:00	2025-09-21	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
387	8	17:00:00	17:45:00	2025-08-31	t	2025-08-31 16:10:10.136+01	2025-08-31 17:01:20.41+01
388	8	17:45:00	18:30:00	2025-08-31	t	2025-08-31 16:10:10.136+01	2025-08-31 17:30:05.278+01
389	8	18:30:00	19:15:00	2025-08-31	t	2025-08-31 16:10:10.136+01	2025-08-31 18:31:24.889+01
391	8	20:00:00	20:45:00	2025-08-31	t	2025-08-31 16:10:10.136+01	2025-08-31 19:28:02.7+01
392	8	20:45:00	21:30:00	2025-08-31	t	2025-08-31 16:10:10.136+01	2025-08-31 20:40:44.723+01
429	8	19:15:00	20:00:00	2025-09-21	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
430	8	20:00:00	20:45:00	2025-09-21	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
431	8	20:45:00	21:30:00	2025-09-21	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
432	5	12:00:00	13:00:00	2025-09-27	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
433	5	13:00:00	14:00:00	2025-09-27	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
434	5	14:00:00	15:00:00	2025-09-27	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
435	5	15:00:00	16:00:00	2025-09-27	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
436	5	16:00:00	17:00:00	2025-09-27	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
437	5	17:00:00	18:00:00	2025-09-27	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
438	8	16:15:00	17:00:00	2025-09-28	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
439	8	17:00:00	17:45:00	2025-09-28	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
440	8	17:45:00	18:30:00	2025-09-28	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
441	8	18:30:00	19:15:00	2025-09-28	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
442	8	19:15:00	20:00:00	2025-09-28	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
443	8	20:00:00	20:45:00	2025-09-28	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
444	8	20:45:00	21:30:00	2025-09-28	f	2025-08-31 16:10:10.136+01	2025-08-31 16:10:10.136+01
386	8	16:15:00	17:00:00	2025-08-31	t	2025-08-31 16:10:10.136+01	2025-08-31 16:19:11.211+01
43	1	19:30:00	19:45:00	2025-08-31	t	2025-08-30 08:59:06.006+01	2025-08-31 19:29:38.644+01
445	1	15:00:00	15:15:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
446	1	15:15:00	15:30:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
447	1	15:30:00	15:45:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
448	1	15:45:00	16:00:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
449	1	16:00:00	16:15:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
450	1	16:15:00	16:30:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
451	1	16:30:00	16:45:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
452	1	16:45:00	17:00:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
453	1	17:00:00	17:15:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
454	1	17:15:00	17:30:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
455	1	17:30:00	17:45:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
456	1	17:45:00	18:00:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
457	1	18:00:00	18:15:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
458	1	18:15:00	18:30:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
459	1	18:30:00	18:45:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
460	1	18:45:00	19:00:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
461	1	19:00:00	19:15:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
462	1	19:15:00	19:30:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
463	1	19:30:00	19:45:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
464	1	19:45:00	20:00:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
465	1	20:00:00	20:15:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
466	1	20:15:00	20:30:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
467	1	20:30:00	20:45:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
468	1	20:45:00	21:00:00	2025-08-31	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
469	2	09:00:00	09:15:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
470	2	09:15:00	09:30:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
471	2	09:30:00	09:45:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
472	2	09:45:00	10:00:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
473	2	10:00:00	10:15:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
474	2	10:15:00	10:30:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
475	2	10:30:00	10:45:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
476	2	10:45:00	11:00:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
477	2	11:00:00	11:15:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
478	2	11:15:00	11:30:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
479	2	11:30:00	11:45:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
480	2	11:45:00	12:00:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
481	2	12:00:00	12:15:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
482	2	12:15:00	12:30:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
483	2	12:30:00	12:45:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
484	2	12:45:00	13:00:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
485	2	13:00:00	13:15:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
486	2	13:15:00	13:30:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
487	2	13:30:00	13:45:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
488	2	13:45:00	14:00:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
489	2	14:00:00	14:15:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
490	2	14:15:00	14:30:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
491	2	14:30:00	14:45:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
492	2	14:45:00	15:00:00	2025-09-06	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
493	1	15:00:00	15:15:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
494	1	15:15:00	15:30:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
495	1	15:30:00	15:45:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
496	1	15:45:00	16:00:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
497	1	16:00:00	16:15:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
498	1	16:15:00	16:30:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
499	1	16:30:00	16:45:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
500	1	16:45:00	17:00:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
501	1	17:00:00	17:15:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
502	1	17:15:00	17:30:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
503	1	17:30:00	17:45:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
504	1	17:45:00	18:00:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
505	1	18:00:00	18:15:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
506	1	18:15:00	18:30:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
507	1	18:30:00	18:45:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
508	1	18:45:00	19:00:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
509	1	19:00:00	19:15:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
510	1	19:15:00	19:30:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
511	1	19:30:00	19:45:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
512	1	19:45:00	20:00:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
513	1	20:00:00	20:15:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
514	1	20:15:00	20:30:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
515	1	20:30:00	20:45:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
516	1	20:45:00	21:00:00	2025-09-07	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
517	2	09:00:00	09:15:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
518	2	09:15:00	09:30:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
519	2	09:30:00	09:45:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
520	2	09:45:00	10:00:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
521	2	10:00:00	10:15:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
522	2	10:15:00	10:30:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
523	2	10:30:00	10:45:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
524	2	10:45:00	11:00:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
525	2	11:00:00	11:15:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
526	2	11:15:00	11:30:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
527	2	11:30:00	11:45:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
528	2	11:45:00	12:00:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
529	2	12:00:00	12:15:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
530	2	12:15:00	12:30:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
531	2	12:30:00	12:45:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
532	2	12:45:00	13:00:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
533	2	13:00:00	13:15:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
534	2	13:15:00	13:30:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
535	2	13:30:00	13:45:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
536	2	13:45:00	14:00:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
537	2	14:00:00	14:15:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
538	2	14:15:00	14:30:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
539	2	14:30:00	14:45:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
540	2	14:45:00	15:00:00	2025-09-13	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
541	1	15:00:00	15:15:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
542	1	15:15:00	15:30:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
543	1	15:30:00	15:45:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
544	1	15:45:00	16:00:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
545	1	16:00:00	16:15:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
546	1	16:15:00	16:30:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
547	1	16:30:00	16:45:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
548	1	16:45:00	17:00:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
549	1	17:00:00	17:15:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
550	1	17:15:00	17:30:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
551	1	17:30:00	17:45:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
552	1	17:45:00	18:00:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
553	1	18:00:00	18:15:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
554	1	18:15:00	18:30:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
555	1	18:30:00	18:45:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
556	1	18:45:00	19:00:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
557	1	19:00:00	19:15:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
558	1	19:15:00	19:30:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
559	1	19:30:00	19:45:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
560	1	19:45:00	20:00:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
561	1	20:00:00	20:15:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
562	1	20:15:00	20:30:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
563	1	20:30:00	20:45:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
564	1	20:45:00	21:00:00	2025-09-14	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
565	2	09:00:00	09:15:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
566	2	09:15:00	09:30:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
567	2	09:30:00	09:45:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
568	2	09:45:00	10:00:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
569	2	10:00:00	10:15:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
570	2	10:15:00	10:30:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
571	2	10:30:00	10:45:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
572	2	10:45:00	11:00:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
573	2	11:00:00	11:15:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
574	2	11:15:00	11:30:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
575	2	11:30:00	11:45:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
576	2	11:45:00	12:00:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
577	2	12:00:00	12:15:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
578	2	12:15:00	12:30:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
579	2	12:30:00	12:45:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
580	2	12:45:00	13:00:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
581	2	13:00:00	13:15:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
582	2	13:15:00	13:30:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
583	2	13:30:00	13:45:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
584	2	13:45:00	14:00:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
585	2	14:00:00	14:15:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
586	2	14:15:00	14:30:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
587	2	14:30:00	14:45:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
588	2	14:45:00	15:00:00	2025-09-20	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
589	1	15:00:00	15:15:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
590	1	15:15:00	15:30:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
591	1	15:30:00	15:45:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
592	1	15:45:00	16:00:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
593	1	16:00:00	16:15:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
594	1	16:15:00	16:30:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
595	1	16:30:00	16:45:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
596	1	16:45:00	17:00:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
597	1	17:00:00	17:15:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
598	1	17:15:00	17:30:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
599	1	17:30:00	17:45:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
600	1	17:45:00	18:00:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
601	1	18:00:00	18:15:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
602	1	18:15:00	18:30:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
603	1	18:30:00	18:45:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
604	1	18:45:00	19:00:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
605	1	19:00:00	19:15:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
606	1	19:15:00	19:30:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
607	1	19:30:00	19:45:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
608	1	19:45:00	20:00:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
609	1	20:00:00	20:15:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
610	1	20:15:00	20:30:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
611	1	20:30:00	20:45:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
612	1	20:45:00	21:00:00	2025-09-21	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
613	2	09:00:00	09:15:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
614	2	09:15:00	09:30:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
615	2	09:30:00	09:45:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
616	2	09:45:00	10:00:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
617	2	10:00:00	10:15:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
618	2	10:15:00	10:30:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
619	2	10:30:00	10:45:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
620	2	10:45:00	11:00:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
621	2	11:00:00	11:15:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
622	2	11:15:00	11:30:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
623	2	11:30:00	11:45:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
624	2	11:45:00	12:00:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
625	2	12:00:00	12:15:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
626	2	12:15:00	12:30:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
627	2	12:30:00	12:45:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
628	2	12:45:00	13:00:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
629	2	13:00:00	13:15:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
630	2	13:15:00	13:30:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
631	2	13:30:00	13:45:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
632	2	13:45:00	14:00:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
633	2	14:00:00	14:15:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
634	2	14:15:00	14:30:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
635	2	14:30:00	14:45:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
636	2	14:45:00	15:00:00	2025-09-27	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
637	1	15:00:00	15:15:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
638	1	15:15:00	15:30:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
639	1	15:30:00	15:45:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
640	1	15:45:00	16:00:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
641	1	16:00:00	16:15:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
642	1	16:15:00	16:30:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
643	1	16:30:00	16:45:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
644	1	16:45:00	17:00:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
645	1	17:00:00	17:15:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
646	1	17:15:00	17:30:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
647	1	17:30:00	17:45:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
648	1	17:45:00	18:00:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
649	1	18:00:00	18:15:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
650	1	18:15:00	18:30:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
651	1	18:30:00	18:45:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
652	1	18:45:00	19:00:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
653	1	19:00:00	19:15:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
654	1	19:15:00	19:30:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
655	1	19:30:00	19:45:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
656	1	19:45:00	20:00:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
657	1	20:00:00	20:15:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
658	1	20:15:00	20:30:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
659	1	20:30:00	20:45:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
660	1	20:45:00	21:00:00	2025-09-28	f	2025-08-31 22:54:58.347+01	2025-08-31 22:54:58.347+01
661	1	15:00:00	15:15:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
662	1	15:15:00	15:30:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
663	1	15:30:00	15:45:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
664	1	15:45:00	16:00:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
665	1	16:00:00	16:15:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
666	1	16:15:00	16:30:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
667	1	16:30:00	16:45:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
668	1	16:45:00	17:00:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
669	1	17:00:00	17:15:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
670	1	17:15:00	17:30:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
671	1	17:30:00	17:45:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
672	1	17:45:00	18:00:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
673	1	18:00:00	18:15:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
674	1	18:15:00	18:30:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
675	1	18:30:00	18:45:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
676	1	18:45:00	19:00:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
677	1	19:00:00	19:15:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
678	1	19:15:00	19:30:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
679	1	19:30:00	19:45:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
680	1	19:45:00	20:00:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
681	1	20:00:00	20:15:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
682	1	20:15:00	20:30:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
683	1	20:30:00	20:45:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
684	1	20:45:00	21:00:00	2025-08-31	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
685	2	09:00:00	09:15:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
686	2	09:15:00	09:30:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
687	2	09:30:00	09:45:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
688	2	09:45:00	10:00:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
689	2	10:00:00	10:15:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
690	2	10:15:00	10:30:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
691	2	10:30:00	10:45:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
692	2	10:45:00	11:00:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
693	2	11:00:00	11:15:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
694	2	11:15:00	11:30:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
695	2	11:30:00	11:45:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
696	2	11:45:00	12:00:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
697	2	12:00:00	12:15:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
698	2	12:15:00	12:30:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
699	2	12:30:00	12:45:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
700	2	12:45:00	13:00:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
701	2	13:00:00	13:15:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
702	2	13:15:00	13:30:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
703	2	13:30:00	13:45:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
704	2	13:45:00	14:00:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
705	2	14:00:00	14:15:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
706	2	14:15:00	14:30:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
707	2	14:30:00	14:45:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
708	2	14:45:00	15:00:00	2025-09-06	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
709	1	15:00:00	15:15:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
710	1	15:15:00	15:30:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
711	1	15:30:00	15:45:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
712	1	15:45:00	16:00:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
713	1	16:00:00	16:15:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
714	1	16:15:00	16:30:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
715	1	16:30:00	16:45:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
716	1	16:45:00	17:00:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
717	1	17:00:00	17:15:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
718	1	17:15:00	17:30:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
719	1	17:30:00	17:45:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
720	1	17:45:00	18:00:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
721	1	18:00:00	18:15:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
722	1	18:15:00	18:30:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
723	1	18:30:00	18:45:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
724	1	18:45:00	19:00:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
725	1	19:00:00	19:15:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
726	1	19:15:00	19:30:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
727	1	19:30:00	19:45:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
728	1	19:45:00	20:00:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
729	1	20:00:00	20:15:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
730	1	20:15:00	20:30:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
731	1	20:30:00	20:45:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
732	1	20:45:00	21:00:00	2025-09-07	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
733	2	09:00:00	09:15:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
734	2	09:15:00	09:30:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
735	2	09:30:00	09:45:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
736	2	09:45:00	10:00:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
737	2	10:00:00	10:15:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
738	2	10:15:00	10:30:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
739	2	10:30:00	10:45:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
740	2	10:45:00	11:00:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
741	2	11:00:00	11:15:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
742	2	11:15:00	11:30:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
743	2	11:30:00	11:45:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
744	2	11:45:00	12:00:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
745	2	12:00:00	12:15:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
746	2	12:15:00	12:30:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
747	2	12:30:00	12:45:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
748	2	12:45:00	13:00:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
749	2	13:00:00	13:15:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
750	2	13:15:00	13:30:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
751	2	13:30:00	13:45:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
752	2	13:45:00	14:00:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
753	2	14:00:00	14:15:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
754	2	14:15:00	14:30:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
755	2	14:30:00	14:45:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
756	2	14:45:00	15:00:00	2025-09-13	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
757	1	15:00:00	15:15:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
758	1	15:15:00	15:30:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
759	1	15:30:00	15:45:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
760	1	15:45:00	16:00:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
761	1	16:00:00	16:15:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
762	1	16:15:00	16:30:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
763	1	16:30:00	16:45:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
764	1	16:45:00	17:00:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
765	1	17:00:00	17:15:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
766	1	17:15:00	17:30:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
767	1	17:30:00	17:45:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
768	1	17:45:00	18:00:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
769	1	18:00:00	18:15:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
770	1	18:15:00	18:30:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
771	1	18:30:00	18:45:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
772	1	18:45:00	19:00:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
773	1	19:00:00	19:15:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
774	1	19:15:00	19:30:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
775	1	19:30:00	19:45:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
776	1	19:45:00	20:00:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
777	1	20:00:00	20:15:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
778	1	20:15:00	20:30:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
779	1	20:30:00	20:45:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
780	1	20:45:00	21:00:00	2025-09-14	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
781	2	09:00:00	09:15:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
782	2	09:15:00	09:30:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
783	2	09:30:00	09:45:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
784	2	09:45:00	10:00:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
785	2	10:00:00	10:15:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
786	2	10:15:00	10:30:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
787	2	10:30:00	10:45:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
788	2	10:45:00	11:00:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
789	2	11:00:00	11:15:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
790	2	11:15:00	11:30:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
791	2	11:30:00	11:45:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
792	2	11:45:00	12:00:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
793	2	12:00:00	12:15:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
794	2	12:15:00	12:30:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
795	2	12:30:00	12:45:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
796	2	12:45:00	13:00:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
797	2	13:00:00	13:15:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
798	2	13:15:00	13:30:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
799	2	13:30:00	13:45:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
800	2	13:45:00	14:00:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
801	2	14:00:00	14:15:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
802	2	14:15:00	14:30:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
803	2	14:30:00	14:45:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
804	2	14:45:00	15:00:00	2025-09-20	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
805	1	15:00:00	15:15:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
806	1	15:15:00	15:30:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
807	1	15:30:00	15:45:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
808	1	15:45:00	16:00:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
809	1	16:00:00	16:15:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
810	1	16:15:00	16:30:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
811	1	16:30:00	16:45:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
812	1	16:45:00	17:00:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
813	1	17:00:00	17:15:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
814	1	17:15:00	17:30:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
815	1	17:30:00	17:45:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
816	1	17:45:00	18:00:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
817	1	18:00:00	18:15:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
818	1	18:15:00	18:30:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
819	1	18:30:00	18:45:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
820	1	18:45:00	19:00:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
821	1	19:00:00	19:15:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
822	1	19:15:00	19:30:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
823	1	19:30:00	19:45:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
824	1	19:45:00	20:00:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
825	1	20:00:00	20:15:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
826	1	20:15:00	20:30:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
827	1	20:30:00	20:45:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
828	1	20:45:00	21:00:00	2025-09-21	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
829	2	09:00:00	09:15:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
830	2	09:15:00	09:30:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
831	2	09:30:00	09:45:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
832	2	09:45:00	10:00:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
833	2	10:00:00	10:15:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
834	2	10:15:00	10:30:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
835	2	10:30:00	10:45:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
836	2	10:45:00	11:00:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
837	2	11:00:00	11:15:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
838	2	11:15:00	11:30:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
839	2	11:30:00	11:45:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
840	2	11:45:00	12:00:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
841	2	12:00:00	12:15:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
842	2	12:15:00	12:30:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
843	2	12:30:00	12:45:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
844	2	12:45:00	13:00:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
845	2	13:00:00	13:15:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
846	2	13:15:00	13:30:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
847	2	13:30:00	13:45:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
848	2	13:45:00	14:00:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
849	2	14:00:00	14:15:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
850	2	14:15:00	14:30:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
851	2	14:30:00	14:45:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
852	2	14:45:00	15:00:00	2025-09-27	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
853	1	15:00:00	15:15:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
854	1	15:15:00	15:30:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
855	1	15:30:00	15:45:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
856	1	15:45:00	16:00:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
857	1	16:00:00	16:15:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
858	1	16:15:00	16:30:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
859	1	16:30:00	16:45:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
860	1	16:45:00	17:00:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
861	1	17:00:00	17:15:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
862	1	17:15:00	17:30:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
863	1	17:30:00	17:45:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
864	1	17:45:00	18:00:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
865	1	18:00:00	18:15:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
866	1	18:15:00	18:30:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
867	1	18:30:00	18:45:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
868	1	18:45:00	19:00:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
869	1	19:00:00	19:15:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
870	1	19:15:00	19:30:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
871	1	19:30:00	19:45:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
872	1	19:45:00	20:00:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
873	1	20:00:00	20:15:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
874	1	20:15:00	20:30:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
875	1	20:30:00	20:45:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
876	1	20:45:00	21:00:00	2025-09-28	f	2025-08-31 23:20:03.916+01	2025-08-31 23:20:03.916+01
877	1	15:00:00	15:15:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
878	1	15:15:00	15:30:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
879	1	15:30:00	15:45:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
880	1	15:45:00	16:00:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
881	1	16:00:00	16:15:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
882	1	16:15:00	16:30:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
883	1	16:30:00	16:45:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
884	1	16:45:00	17:00:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
885	1	17:00:00	17:15:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
886	1	17:15:00	17:30:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
887	1	17:30:00	17:45:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
888	1	17:45:00	18:00:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
889	1	18:00:00	18:15:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
890	1	18:15:00	18:30:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
891	1	18:30:00	18:45:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
892	1	18:45:00	19:00:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
893	1	19:00:00	19:15:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
894	1	19:15:00	19:30:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
895	1	19:30:00	19:45:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
896	1	19:45:00	20:00:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
897	1	20:00:00	20:15:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
898	1	20:15:00	20:30:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
899	1	20:30:00	20:45:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
900	1	20:45:00	21:00:00	2025-08-31	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
902	11	01:30:00	02:30:00	2025-09-01	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
903	11	02:30:00	03:30:00	2025-09-01	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
904	11	03:30:00	04:30:00	2025-09-01	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
905	11	04:30:00	05:30:00	2025-09-01	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
906	11	05:30:00	06:30:00	2025-09-01	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
907	11	06:30:00	07:30:00	2025-09-01	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
908	2	09:00:00	09:15:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
909	2	09:15:00	09:30:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
910	2	09:30:00	09:45:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
911	2	09:45:00	10:00:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
912	2	10:00:00	10:15:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
913	2	10:15:00	10:30:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
914	2	10:30:00	10:45:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
915	2	10:45:00	11:00:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
916	2	11:00:00	11:15:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
917	2	11:15:00	11:30:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
918	2	11:30:00	11:45:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
919	2	11:45:00	12:00:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
920	2	12:00:00	12:15:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
921	2	12:15:00	12:30:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
922	2	12:30:00	12:45:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
923	2	12:45:00	13:00:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
924	2	13:00:00	13:15:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
925	2	13:15:00	13:30:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
926	2	13:30:00	13:45:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
927	2	13:45:00	14:00:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
928	2	14:00:00	14:15:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
929	2	14:15:00	14:30:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
930	2	14:30:00	14:45:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
931	2	14:45:00	15:00:00	2025-09-06	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
932	1	15:00:00	15:15:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
933	1	15:15:00	15:30:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
934	1	15:30:00	15:45:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
935	1	15:45:00	16:00:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
936	1	16:00:00	16:15:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
937	1	16:15:00	16:30:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
938	1	16:30:00	16:45:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
939	1	16:45:00	17:00:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
940	1	17:00:00	17:15:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
941	1	17:15:00	17:30:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
942	1	17:30:00	17:45:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
943	1	17:45:00	18:00:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
944	1	18:00:00	18:15:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
945	1	18:15:00	18:30:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
946	1	18:30:00	18:45:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
947	1	18:45:00	19:00:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
948	1	19:00:00	19:15:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
949	1	19:15:00	19:30:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
950	1	19:30:00	19:45:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
951	1	19:45:00	20:00:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
952	1	20:00:00	20:15:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
953	1	20:15:00	20:30:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
954	1	20:30:00	20:45:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
955	1	20:45:00	21:00:00	2025-09-07	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
956	11	00:30:00	01:30:00	2025-09-08	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
957	11	01:30:00	02:30:00	2025-09-08	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
958	11	02:30:00	03:30:00	2025-09-08	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
959	11	03:30:00	04:30:00	2025-09-08	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
960	11	04:30:00	05:30:00	2025-09-08	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
961	11	05:30:00	06:30:00	2025-09-08	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
962	11	06:30:00	07:30:00	2025-09-08	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
963	2	09:00:00	09:15:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
964	2	09:15:00	09:30:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
965	2	09:30:00	09:45:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
966	2	09:45:00	10:00:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
967	2	10:00:00	10:15:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
968	2	10:15:00	10:30:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
969	2	10:30:00	10:45:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
970	2	10:45:00	11:00:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
971	2	11:00:00	11:15:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
972	2	11:15:00	11:30:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
973	2	11:30:00	11:45:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
974	2	11:45:00	12:00:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
975	2	12:00:00	12:15:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
976	2	12:15:00	12:30:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
977	2	12:30:00	12:45:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
978	2	12:45:00	13:00:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
979	2	13:00:00	13:15:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
980	2	13:15:00	13:30:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
981	2	13:30:00	13:45:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
982	2	13:45:00	14:00:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
983	2	14:00:00	14:15:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
984	2	14:15:00	14:30:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
985	2	14:30:00	14:45:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
986	2	14:45:00	15:00:00	2025-09-13	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
987	1	15:00:00	15:15:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
988	1	15:15:00	15:30:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
989	1	15:30:00	15:45:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
990	1	15:45:00	16:00:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
991	1	16:00:00	16:15:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
992	1	16:15:00	16:30:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
993	1	16:30:00	16:45:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
994	1	16:45:00	17:00:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
995	1	17:00:00	17:15:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
996	1	17:15:00	17:30:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
997	1	17:30:00	17:45:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
998	1	17:45:00	18:00:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
999	1	18:00:00	18:15:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1000	1	18:15:00	18:30:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1001	1	18:30:00	18:45:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1002	1	18:45:00	19:00:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1003	1	19:00:00	19:15:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1004	1	19:15:00	19:30:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1005	1	19:30:00	19:45:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1006	1	19:45:00	20:00:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1007	1	20:00:00	20:15:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1008	1	20:15:00	20:30:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1009	1	20:30:00	20:45:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1010	1	20:45:00	21:00:00	2025-09-14	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1011	11	00:30:00	01:30:00	2025-09-15	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1012	11	01:30:00	02:30:00	2025-09-15	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1013	11	02:30:00	03:30:00	2025-09-15	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1014	11	03:30:00	04:30:00	2025-09-15	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1015	11	04:30:00	05:30:00	2025-09-15	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1016	11	05:30:00	06:30:00	2025-09-15	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1017	11	06:30:00	07:30:00	2025-09-15	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1018	2	09:00:00	09:15:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1019	2	09:15:00	09:30:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1020	2	09:30:00	09:45:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1021	2	09:45:00	10:00:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1022	2	10:00:00	10:15:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1023	2	10:15:00	10:30:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1024	2	10:30:00	10:45:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1025	2	10:45:00	11:00:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1026	2	11:00:00	11:15:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1027	2	11:15:00	11:30:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1028	2	11:30:00	11:45:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1029	2	11:45:00	12:00:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1030	2	12:00:00	12:15:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1031	2	12:15:00	12:30:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1032	2	12:30:00	12:45:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1033	2	12:45:00	13:00:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1034	2	13:00:00	13:15:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1035	2	13:15:00	13:30:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1036	2	13:30:00	13:45:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1037	2	13:45:00	14:00:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1038	2	14:00:00	14:15:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1039	2	14:15:00	14:30:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1040	2	14:30:00	14:45:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1041	2	14:45:00	15:00:00	2025-09-20	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1042	1	15:00:00	15:15:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1043	1	15:15:00	15:30:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1044	1	15:30:00	15:45:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1045	1	15:45:00	16:00:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1046	1	16:00:00	16:15:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1047	1	16:15:00	16:30:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1048	1	16:30:00	16:45:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1049	1	16:45:00	17:00:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1050	1	17:00:00	17:15:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1051	1	17:15:00	17:30:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1052	1	17:30:00	17:45:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1053	1	17:45:00	18:00:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1054	1	18:00:00	18:15:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1055	1	18:15:00	18:30:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1056	1	18:30:00	18:45:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1057	1	18:45:00	19:00:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1058	1	19:00:00	19:15:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1059	1	19:15:00	19:30:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1060	1	19:30:00	19:45:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1061	1	19:45:00	20:00:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1062	1	20:00:00	20:15:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1063	1	20:15:00	20:30:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1064	1	20:30:00	20:45:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1065	1	20:45:00	21:00:00	2025-09-21	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1066	11	00:30:00	01:30:00	2025-09-22	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1067	11	01:30:00	02:30:00	2025-09-22	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1068	11	02:30:00	03:30:00	2025-09-22	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1069	11	03:30:00	04:30:00	2025-09-22	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1070	11	04:30:00	05:30:00	2025-09-22	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1071	11	05:30:00	06:30:00	2025-09-22	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1072	11	06:30:00	07:30:00	2025-09-22	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1073	2	09:00:00	09:15:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1074	2	09:15:00	09:30:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1075	2	09:30:00	09:45:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1076	2	09:45:00	10:00:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1077	2	10:00:00	10:15:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1078	2	10:15:00	10:30:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1079	2	10:30:00	10:45:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1080	2	10:45:00	11:00:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1081	2	11:00:00	11:15:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1082	2	11:15:00	11:30:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1083	2	11:30:00	11:45:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1084	2	11:45:00	12:00:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1085	2	12:00:00	12:15:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1086	2	12:15:00	12:30:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1087	2	12:30:00	12:45:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1088	2	12:45:00	13:00:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1089	2	13:00:00	13:15:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1090	2	13:15:00	13:30:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1091	2	13:30:00	13:45:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1092	2	13:45:00	14:00:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1093	2	14:00:00	14:15:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1094	2	14:15:00	14:30:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1095	2	14:30:00	14:45:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1096	2	14:45:00	15:00:00	2025-09-27	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1097	1	15:00:00	15:15:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1098	1	15:15:00	15:30:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1099	1	15:30:00	15:45:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1100	1	15:45:00	16:00:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1101	1	16:00:00	16:15:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1102	1	16:15:00	16:30:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1103	1	16:30:00	16:45:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1104	1	16:45:00	17:00:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1105	1	17:00:00	17:15:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1106	1	17:15:00	17:30:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1107	1	17:30:00	17:45:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1108	1	17:45:00	18:00:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1109	1	18:00:00	18:15:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1110	1	18:15:00	18:30:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1111	1	18:30:00	18:45:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1112	1	18:45:00	19:00:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1113	1	19:00:00	19:15:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1114	1	19:15:00	19:30:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1115	1	19:30:00	19:45:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1116	1	19:45:00	20:00:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1117	1	20:00:00	20:15:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1118	1	20:15:00	20:30:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1119	1	20:30:00	20:45:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
1120	1	20:45:00	21:00:00	2025-09-28	f	2025-08-31 23:23:41.809+01	2025-08-31 23:23:41.809+01
901	11	00:30:00	01:30:00	2025-09-01	t	2025-08-31 23:23:41.809+01	2025-08-31 23:42:12.83+01
1121	13	19:00:00	19:45:00	2025-09-01	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1122	13	19:45:00	20:30:00	2025-09-01	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1123	13	20:30:00	21:15:00	2025-09-01	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1124	13	21:15:00	22:00:00	2025-09-01	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1125	13	22:00:00	22:45:00	2025-09-01	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1126	13	19:00:00	19:45:00	2025-09-08	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1127	13	19:45:00	20:30:00	2025-09-08	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1128	13	20:30:00	21:15:00	2025-09-08	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1129	13	21:15:00	22:00:00	2025-09-08	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1130	13	22:00:00	22:45:00	2025-09-08	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1131	13	19:00:00	19:45:00	2025-09-15	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1132	13	19:45:00	20:30:00	2025-09-15	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1133	13	20:30:00	21:15:00	2025-09-15	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1134	13	21:15:00	22:00:00	2025-09-15	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1135	13	22:00:00	22:45:00	2025-09-15	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1136	13	19:00:00	19:45:00	2025-09-22	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1137	13	19:45:00	20:30:00	2025-09-22	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1138	13	20:30:00	21:15:00	2025-09-22	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1139	13	21:15:00	22:00:00	2025-09-22	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1140	13	22:00:00	22:45:00	2025-09-22	f	2025-08-31 23:48:36.139+01	2025-08-31 23:48:36.139+01
1141	12	10:00:00	10:45:00	2025-09-01	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1142	12	10:45:00	11:30:00	2025-09-01	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1143	12	11:30:00	12:15:00	2025-09-01	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1144	12	12:15:00	13:00:00	2025-09-01	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1145	12	13:00:00	13:45:00	2025-09-01	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1146	12	13:45:00	14:30:00	2025-09-01	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1147	12	10:00:00	10:45:00	2025-09-08	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1148	12	10:45:00	11:30:00	2025-09-08	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1149	12	11:30:00	12:15:00	2025-09-08	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1150	12	12:15:00	13:00:00	2025-09-08	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1151	12	13:00:00	13:45:00	2025-09-08	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1152	12	13:45:00	14:30:00	2025-09-08	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1153	12	10:00:00	10:45:00	2025-09-15	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1154	12	10:45:00	11:30:00	2025-09-15	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1155	12	11:30:00	12:15:00	2025-09-15	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1156	12	12:15:00	13:00:00	2025-09-15	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1157	12	13:00:00	13:45:00	2025-09-15	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1158	12	13:45:00	14:30:00	2025-09-15	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1159	12	10:00:00	10:45:00	2025-09-22	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1160	12	10:45:00	11:30:00	2025-09-22	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1161	12	11:30:00	12:15:00	2025-09-22	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1162	12	12:15:00	13:00:00	2025-09-22	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1163	12	13:00:00	13:45:00	2025-09-22	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1164	12	13:45:00	14:30:00	2025-09-22	f	2025-08-31 23:49:05.375+01	2025-08-31 23:49:05.375+01
1166	14	03:10:00	04:40:00	2025-09-01	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1167	14	04:40:00	06:10:00	2025-09-01	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1168	14	06:10:00	07:40:00	2025-09-01	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1169	14	07:40:00	09:10:00	2025-09-01	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1170	14	01:40:00	03:10:00	2025-09-08	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1171	14	03:10:00	04:40:00	2025-09-08	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1172	14	04:40:00	06:10:00	2025-09-08	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1173	14	06:10:00	07:40:00	2025-09-08	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1174	14	07:40:00	09:10:00	2025-09-08	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1175	14	01:40:00	03:10:00	2025-09-15	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1176	14	03:10:00	04:40:00	2025-09-15	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1177	14	04:40:00	06:10:00	2025-09-15	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1178	14	06:10:00	07:40:00	2025-09-15	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1179	14	07:40:00	09:10:00	2025-09-15	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1180	14	01:40:00	03:10:00	2025-09-22	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1181	14	03:10:00	04:40:00	2025-09-22	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1182	14	04:40:00	06:10:00	2025-09-22	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1183	14	06:10:00	07:40:00	2025-09-22	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1184	14	07:40:00	09:10:00	2025-09-22	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1185	14	01:40:00	03:10:00	2025-09-29	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1186	14	03:10:00	04:40:00	2025-09-29	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1187	14	04:40:00	06:10:00	2025-09-29	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1188	14	06:10:00	07:40:00	2025-09-29	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1189	14	07:40:00	09:10:00	2025-09-29	f	2025-09-01 01:36:06.166+01	2025-09-01 01:36:06.166+01
1165	14	01:40:00	03:10:00	2025-09-01	t	2025-09-01 01:36:06.166+01	2025-09-01 01:38:11.396+01
\.


--
-- TOC entry 5523 (class 0 OID 16943)
-- Dependencies: 264
-- Data for Name: UserApplications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserApplications" (id, "userId", "applicationType", "typeId", status, "applicationVersion", "adminReview", "adminNotes", "submittedAt", "reviewedAt", "approvedAt", "rejectedAt", "suspendedAt", "rejectionReason", "suspensionReason", "createdAt", "updatedAt") FROM stdin;
1	2	doctor	1	approved	1	{"remarks": "I hope you make the most out of this man.", "reviewedAt": "2025-08-26T18:52:07.338Z", "reviewedBy": 1}	\N	2025-08-26 19:50:45.33+01	2025-08-26 19:52:07.338+01	2025-08-26 19:52:11.283+01	\N	\N	\N	\N	2025-08-26 19:50:45.33+01	2025-08-26 19:52:11.282+01
2	4	doctor	2	approved	1	{"remarks": "This is nice ", "reviewedAt": "2025-08-28T04:02:50.548Z", "reviewedBy": 1}	\N	2025-08-28 04:48:42.49+01	2025-08-28 05:02:50.548+01	2025-08-28 05:02:54.994+01	\N	\N	\N	\N	2025-08-28 04:48:42.49+01	2025-08-28 05:02:54.994+01
3	5	doctor	3	approved	1	{"remarks": "I want more doctors, reason why i'm accepting this.", "reviewedAt": "2025-08-28T04:03:50.895Z", "reviewedBy": 1}	\N	2025-08-28 05:00:48.991+01	2025-08-28 05:03:50.895+01	2025-08-28 05:03:55.178+01	\N	\N	\N	\N	2025-08-28 05:00:48.991+01	2025-08-28 05:03:55.177+01
\.


--
-- TOC entry 5525 (class 0 OID 16954)
-- Dependencies: 266
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, name, email, gender, "phoneNumber", password, role, dob, address, avatar, "authProvider", "isActive", "emailVerified", "emailVerificationCode", "emailVerificationExpires", "hasPaidApplicationFee", "createdAt", "updatedAt") FROM stdin;
1	Prince Caleb	afanyuys@gmail.com	prefer_not_to_say	\N	\N	admin	\N	\N	https://lh3.googleusercontent.com/a/ACg8ocLpMZGAiE4UNJlnng0gcUK62EJTJ-Y6lpqRBDAVLD3TzaZOXmI=s96-c	google	t	t	\N	\N	f	2025-08-26 19:40:28.938+01	2025-08-26 19:40:28.938+01
2	Keyz Tester	keyztester@gmail.com	prefer_not_to_say	\N	\N	doctor	\N	\N	https://lh3.googleusercontent.com/a/ACg8ocLGwf5-Gq8Yx4c44R8MtBcA5iOsC-mRB-1rws9w9iplzN4kWA=s96-c	google	t	t	\N	\N	f	2025-08-26 19:48:16.485+01	2025-08-26 19:53:02.079+01
4	Keyz Global	keyzglobal0313@gmail.com	prefer_not_to_say	\N	\N	doctor	\N	\N	https://lh3.googleusercontent.com/a/ACg8ocKSZzb6QpJtS3QRfR346CVT9jPq7Jw76qw7uUJWKd5Eak8tQsrN=s96-c	google	t	t	\N	\N	f	2025-08-28 04:43:29.492+01	2025-08-28 05:04:16.459+01
5	Omni Creative	omnicreative46@gmail.com	female	+237670084835	$2b$10$D0nKjnHGiuQm4m7clllXOuhyOOukgo64glAPoDajf.oI3B3z48dLO	doctor	2012-02-12 01:00:00+01	{"city": "Buea", "state": "Southwest", "street": "Buea", "country": "Cameroon", "postalCode": "00000", "coordinates": {"lat": 4.1567895, "lng": 9.2315915}, "fullAddress": "Buea, Fako, Southwest, Cameroon"}	/uploads/avatars/c75c4c70-a7b1-4899-96b5-f4b1501b701a.jpg	local	t	t	\N	\N	f	2025-08-28 04:57:03.346+01	2025-08-28 07:19:29.876+01
7	Omniapp	omniapp0313@gmail.com	male	+237670231453	$2b$10$LAgI9NwOsGJ7kr71EOp5iO0ajsU2DFqxfnwMHyM9UIo39NeV83yLm	patient	1997-12-02 01:00:00+01	{"city": "Yaoundé", "state": "Centre", "street": "Rue 1.007", "country": "Cameroon", "postalCode": "00000", "coordinates": {"lat": 3.8661687, "lng": 11.51534}, "fullAddress": "Rue 1.007, Centre Commercial, Yaoundé I, Yaoundé, Mfoundi, Centre, Cameroon"}	/uploads/avatars/13685eb9-5ac5-4587-ad1a-2025ecfe3b28.jpg	local	t	t	\N	\N	f	2025-08-29 13:38:20.347+01	2025-08-29 14:55:07.871+01
8	OmniBuzz	omnibuzz0313@gmail.com	male	+237672460011	$2b$10$ZgX9fvqo3ZcLr7lG.WyUn..U5DbTxXuY7xtsBar2wcVlj4.jXw8oa	patient	1970-05-12 01:00:00+01	{"city": "Garoua", "state": "North", "street": "Garoua", "country": "Cameroon", "postalCode": "00000", "coordinates": {"lat": 9.3070698, "lng": 13.3934527}, "fullAddress": "Garoua, Garoua I, Communauté urbaine de Garoua, Bénoué, North, Cameroon"}	/uploads/avatars/93fb00c1-aca9-4ad0-8a24-4a733eda3d2f.jpg	local	t	t	\N	\N	f	2025-08-29 17:32:56.973+01	2025-08-29 18:09:48.824+01
3	Konfor Cynthia	konforcynthia44@gmail.com	female	+237676177173	$2b$10$OcnXoqw6ihj3yUv435WadetspMXeAfxGu7ppJWwX6zcqzTF89CySi	patient	2002-01-12 01:00:00+01	{"city": "Douala IV", "state": "Littoral", "street": "Douala IV", "country": "Cameroon", "postalCode": "00000", "coordinates": {"lat": 4.0822098, "lng": 9.6649718}, "fullAddress": "Bonaberi, Douala IV, Communauté urbaine de Douala, Wouri, Littoral, Cameroon"}	/uploads/avatars/a53c61f9-b7a2-49d9-a982-66799a603fd0.jpg	local	t	t	\N	\N	f	2025-08-27 12:52:31.763+01	2025-08-30 11:57:46.145+01
6	Test drive	testdrive1096@gmail.com	female	+237670098734	$2b$10$F/GzVaoVmJyxS6GSclxlqOjlO0iAf6U5rgiyzuFlaTsMl.Wsx5QGm	patient	2001-12-31 01:00:00+01	{"city": "Yaoundé", "state": "Centre", "street": "Rue 1.007", "country": "Cameroon", "postalCode": "00000", "coordinates": {"lat": 3.8661687, "lng": 11.51534}, "fullAddress": "Rue 1.007, Centre Commercial, Yaoundé I, Yaoundé, Mfoundi, Centre, Cameroon"}	/uploads/avatars/6119b62a-c975-4b30-9f3d-5cdbabf0415b.jpg	local	t	t	\N	\N	f	2025-08-28 07:34:31.969+01	2025-08-31 20:39:21.859+01
\.


--
-- TOC entry 5598 (class 0 OID 0)
-- Dependencies: 218
-- Name: ActivityLogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ActivityLogs_id_seq"', 1, false);


--
-- TOC entry 5599 (class 0 OID 0)
-- Dependencies: 220
-- Name: ApplicationDocuments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ApplicationDocuments_id_seq"', 6, true);


--
-- TOC entry 5600 (class 0 OID 0)
-- Dependencies: 222
-- Name: Appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Appointments_id_seq"', 30, true);


--
-- TOC entry 5601 (class 0 OID 0)
-- Dependencies: 224
-- Name: ConsultationMessages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ConsultationMessages_id_seq"', 1, false);


--
-- TOC entry 5602 (class 0 OID 0)
-- Dependencies: 226
-- Name: Consultations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Consultations_id_seq"', 19, true);


--
-- TOC entry 5603 (class 0 OID 0)
-- Dependencies: 228
-- Name: ContactInformations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ContactInformations_id_seq"', 10, true);


--
-- TOC entry 5604 (class 0 OID 0)
-- Dependencies: 230
-- Name: DoctorAvailabilities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DoctorAvailabilities_id_seq"', 14, true);


--
-- TOC entry 5605 (class 0 OID 0)
-- Dependencies: 232
-- Name: DoctorSpecialties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DoctorSpecialties_id_seq"', 11, true);


--
-- TOC entry 5606 (class 0 OID 0)
-- Dependencies: 234
-- Name: Doctors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Doctors_id_seq"', 3, true);


--
-- TOC entry 5607 (class 0 OID 0)
-- Dependencies: 236
-- Name: DrugOrders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DrugOrders_id_seq"', 1, false);


--
-- TOC entry 5608 (class 0 OID 0)
-- Dependencies: 238
-- Name: Notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Notifications_id_seq"', 211, true);


--
-- TOC entry 5609 (class 0 OID 0)
-- Dependencies: 240
-- Name: PatientDocuments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PatientDocuments_id_seq"', 17, true);


--
-- TOC entry 5610 (class 0 OID 0)
-- Dependencies: 242
-- Name: Patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Patients_id_seq"', 4, true);


--
-- TOC entry 5611 (class 0 OID 0)
-- Dependencies: 244
-- Name: Payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Payments_id_seq"', 30, true);


--
-- TOC entry 5612 (class 0 OID 0)
-- Dependencies: 246
-- Name: Pharmacies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Pharmacies_id_seq"', 1, false);


--
-- TOC entry 5613 (class 0 OID 0)
-- Dependencies: 248
-- Name: PharmacyDrugs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PharmacyDrugs_id_seq"', 1, false);


--
-- TOC entry 5614 (class 0 OID 0)
-- Dependencies: 250
-- Name: Prescriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Prescriptions_id_seq"', 1, false);


--
-- TOC entry 5615 (class 0 OID 0)
-- Dependencies: 252
-- Name: QAndAs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."QAndAs_id_seq"', 10, true);


--
-- TOC entry 5616 (class 0 OID 0)
-- Dependencies: 255
-- Name: Specialties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Specialties_id_seq"', 15, true);


--
-- TOC entry 5617 (class 0 OID 0)
-- Dependencies: 257
-- Name: Symptoms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Symptoms_id_seq"', 9, true);


--
-- TOC entry 5618 (class 0 OID 0)
-- Dependencies: 259
-- Name: SystemNotifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SystemNotifications_id_seq"', 1, false);


--
-- TOC entry 5619 (class 0 OID 0)
-- Dependencies: 261
-- Name: Testimonials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Testimonials_id_seq"', 1, false);


--
-- TOC entry 5620 (class 0 OID 0)
-- Dependencies: 263
-- Name: TimeSlots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TimeSlots_id_seq"', 1189, true);


--
-- TOC entry 5621 (class 0 OID 0)
-- Dependencies: 265
-- Name: UserApplications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserApplications_id_seq"', 3, true);


--
-- TOC entry 5622 (class 0 OID 0)
-- Dependencies: 267
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 8, true);


--
-- TOC entry 5092 (class 2606 OID 16994)
-- Name: ActivityLogs ActivityLogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLogs"
    ADD CONSTRAINT "ActivityLogs_pkey" PRIMARY KEY (id);


--
-- TOC entry 5100 (class 2606 OID 16996)
-- Name: ApplicationDocuments ApplicationDocuments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ApplicationDocuments"
    ADD CONSTRAINT "ApplicationDocuments_pkey" PRIMARY KEY (id);


--
-- TOC entry 5105 (class 2606 OID 16998)
-- Name: Appointments Appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointments"
    ADD CONSTRAINT "Appointments_pkey" PRIMARY KEY (id);


--
-- TOC entry 5116 (class 2606 OID 17000)
-- Name: ConsultationMessages ConsultationMessages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConsultationMessages"
    ADD CONSTRAINT "ConsultationMessages_pkey" PRIMARY KEY (id);


--
-- TOC entry 5125 (class 2606 OID 17002)
-- Name: Consultations Consultations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Consultations"
    ADD CONSTRAINT "Consultations_pkey" PRIMARY KEY (id);


--
-- TOC entry 5127 (class 2606 OID 17004)
-- Name: Consultations Consultations_roomId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Consultations"
    ADD CONSTRAINT "Consultations_roomId_key" UNIQUE ("roomId");


--
-- TOC entry 5135 (class 2606 OID 17006)
-- Name: ContactInformations ContactInformations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactInformations"
    ADD CONSTRAINT "ContactInformations_pkey" PRIMARY KEY (id);


--
-- TOC entry 5140 (class 2606 OID 17008)
-- Name: DoctorAvailabilities DoctorAvailabilities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DoctorAvailabilities"
    ADD CONSTRAINT "DoctorAvailabilities_pkey" PRIMARY KEY (id);


--
-- TOC entry 5148 (class 2606 OID 17010)
-- Name: DoctorSpecialties DoctorSpecialties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DoctorSpecialties"
    ADD CONSTRAINT "DoctorSpecialties_pkey" PRIMARY KEY (id);


--
-- TOC entry 5153 (class 2606 OID 17012)
-- Name: Doctors Doctors_licenseNumber_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Doctors"
    ADD CONSTRAINT "Doctors_licenseNumber_key" UNIQUE ("licenseNumber");


--
-- TOC entry 5155 (class 2606 OID 17014)
-- Name: Doctors Doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Doctors"
    ADD CONSTRAINT "Doctors_pkey" PRIMARY KEY (id);


--
-- TOC entry 5157 (class 2606 OID 17016)
-- Name: Doctors Doctors_userId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Doctors"
    ADD CONSTRAINT "Doctors_userId_key" UNIQUE ("userId");


--
-- TOC entry 5164 (class 2606 OID 17018)
-- Name: DrugOrders DrugOrders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DrugOrders"
    ADD CONSTRAINT "DrugOrders_pkey" PRIMARY KEY (id);


--
-- TOC entry 5174 (class 2606 OID 17020)
-- Name: Notifications Notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY (id);


--
-- TOC entry 5183 (class 2606 OID 17022)
-- Name: PatientDocuments PatientDocuments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PatientDocuments"
    ADD CONSTRAINT "PatientDocuments_pkey" PRIMARY KEY (id);


--
-- TOC entry 5188 (class 2606 OID 17024)
-- Name: Patients Patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patients"
    ADD CONSTRAINT "Patients_pkey" PRIMARY KEY (id);


--
-- TOC entry 5190 (class 2606 OID 17026)
-- Name: Patients Patients_userId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patients"
    ADD CONSTRAINT "Patients_userId_key" UNIQUE ("userId");


--
-- TOC entry 5195 (class 2606 OID 17028)
-- Name: Payments Payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_pkey" PRIMARY KEY (id);


--
-- TOC entry 5197 (class 2606 OID 17030)
-- Name: Payments Payments_transactionId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_transactionId_key" UNIQUE ("transactionId");


--
-- TOC entry 5207 (class 2606 OID 17032)
-- Name: Pharmacies Pharmacies_licenseNumber_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pharmacies"
    ADD CONSTRAINT "Pharmacies_licenseNumber_key" UNIQUE ("licenseNumber");


--
-- TOC entry 5209 (class 2606 OID 17034)
-- Name: Pharmacies Pharmacies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pharmacies"
    ADD CONSTRAINT "Pharmacies_pkey" PRIMARY KEY (id);


--
-- TOC entry 5211 (class 2606 OID 17036)
-- Name: Pharmacies Pharmacies_userId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pharmacies"
    ADD CONSTRAINT "Pharmacies_userId_key" UNIQUE ("userId");


--
-- TOC entry 5222 (class 2606 OID 17038)
-- Name: PharmacyDrugs PharmacyDrugs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PharmacyDrugs"
    ADD CONSTRAINT "PharmacyDrugs_pkey" PRIMARY KEY (id);


--
-- TOC entry 5233 (class 2606 OID 17040)
-- Name: Prescriptions Prescriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Prescriptions"
    ADD CONSTRAINT "Prescriptions_pkey" PRIMARY KEY (id);


--
-- TOC entry 5240 (class 2606 OID 17042)
-- Name: QAndAs QAndAs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QAndAs"
    ADD CONSTRAINT "QAndAs_pkey" PRIMARY KEY (id);


--
-- TOC entry 5244 (class 2606 OID 17044)
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- TOC entry 5246 (class 2606 OID 17046)
-- Name: Specialties Specialties_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Specialties"
    ADD CONSTRAINT "Specialties_name_key" UNIQUE (name);


--
-- TOC entry 5248 (class 2606 OID 17048)
-- Name: Specialties Specialties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Specialties"
    ADD CONSTRAINT "Specialties_pkey" PRIMARY KEY (id);


--
-- TOC entry 5252 (class 2606 OID 17050)
-- Name: Symptoms Symptoms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Symptoms"
    ADD CONSTRAINT "Symptoms_pkey" PRIMARY KEY (id);


--
-- TOC entry 5256 (class 2606 OID 17052)
-- Name: SystemNotifications SystemNotifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemNotifications"
    ADD CONSTRAINT "SystemNotifications_pkey" PRIMARY KEY (id);


--
-- TOC entry 5265 (class 2606 OID 17054)
-- Name: Testimonials Testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Testimonials"
    ADD CONSTRAINT "Testimonials_pkey" PRIMARY KEY (id);


--
-- TOC entry 5274 (class 2606 OID 17056)
-- Name: TimeSlots TimeSlots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TimeSlots"
    ADD CONSTRAINT "TimeSlots_pkey" PRIMARY KEY (id);


--
-- TOC entry 5282 (class 2606 OID 17058)
-- Name: UserApplications UserApplications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserApplications"
    ADD CONSTRAINT "UserApplications_pkey" PRIMARY KEY (id);


--
-- TOC entry 5288 (class 2606 OID 17060)
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- TOC entry 5290 (class 2606 OID 17062)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- TOC entry 5093 (class 1259 OID 17063)
-- Name: activity_logs_action; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX activity_logs_action ON public."ActivityLogs" USING btree (action);


--
-- TOC entry 5094 (class 1259 OID 17064)
-- Name: activity_logs_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX activity_logs_created_at ON public."ActivityLogs" USING btree ("createdAt");


--
-- TOC entry 5095 (class 1259 OID 17065)
-- Name: activity_logs_ip_address; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX activity_logs_ip_address ON public."ActivityLogs" USING btree ("ipAddress");


--
-- TOC entry 5096 (class 1259 OID 17066)
-- Name: activity_logs_resource; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX activity_logs_resource ON public."ActivityLogs" USING btree (resource);


--
-- TOC entry 5097 (class 1259 OID 17067)
-- Name: activity_logs_resource_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX activity_logs_resource_id ON public."ActivityLogs" USING btree ("resourceId");


--
-- TOC entry 5098 (class 1259 OID 17068)
-- Name: activity_logs_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX activity_logs_user_id ON public."ActivityLogs" USING btree (user_id);


--
-- TOC entry 5101 (class 1259 OID 17069)
-- Name: application_documents_application_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX application_documents_application_id ON public."ApplicationDocuments" USING btree ("applicationId");


--
-- TOC entry 5102 (class 1259 OID 17070)
-- Name: application_documents_document_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX application_documents_document_type ON public."ApplicationDocuments" USING btree ("documentType");


--
-- TOC entry 5103 (class 1259 OID 17071)
-- Name: application_documents_uploaded_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX application_documents_uploaded_at ON public."ApplicationDocuments" USING btree ("uploadedAt");


--
-- TOC entry 5106 (class 1259 OID 17072)
-- Name: appointments_campay_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX appointments_campay_transaction_id ON public."Appointments" USING btree ("campayTransactionId");


--
-- TOC entry 5107 (class 1259 OID 17073)
-- Name: appointments_cancelled_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX appointments_cancelled_at ON public."Appointments" USING btree ("cancelledAt");


--
-- TOC entry 5108 (class 1259 OID 17074)
-- Name: appointments_consultation_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX appointments_consultation_type ON public."Appointments" USING btree ("consultationType");


--
-- TOC entry 5109 (class 1259 OID 17075)
-- Name: appointments_doctor_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX appointments_doctor_id ON public."Appointments" USING btree ("doctorId");


--
-- TOC entry 5110 (class 1259 OID 17076)
-- Name: appointments_patient_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX appointments_patient_id ON public."Appointments" USING btree ("patientId");


--
-- TOC entry 5111 (class 1259 OID 17077)
-- Name: appointments_patient_id_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX appointments_patient_id_status ON public."Appointments" USING btree ("patientId", status);


--
-- TOC entry 5112 (class 1259 OID 17078)
-- Name: appointments_payment_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX appointments_payment_status ON public."Appointments" USING btree ("paymentStatus");


--
-- TOC entry 5113 (class 1259 OID 17079)
-- Name: appointments_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX appointments_status ON public."Appointments" USING btree (status);


--
-- TOC entry 5114 (class 1259 OID 17080)
-- Name: appointments_time_slot_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX appointments_time_slot_id ON public."Appointments" USING btree ("timeSlotId");


--
-- TOC entry 5117 (class 1259 OID 17081)
-- Name: consultation_messages_consultation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX consultation_messages_consultation_id ON public."ConsultationMessages" USING btree ("consultationId");


--
-- TOC entry 5118 (class 1259 OID 17082)
-- Name: consultation_messages_consultation_id_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX consultation_messages_consultation_id_created_at ON public."ConsultationMessages" USING btree ("consultationId", "createdAt");


--
-- TOC entry 5119 (class 1259 OID 17083)
-- Name: consultation_messages_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX consultation_messages_created_at ON public."ConsultationMessages" USING btree ("createdAt");


--
-- TOC entry 5120 (class 1259 OID 17084)
-- Name: consultation_messages_is_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX consultation_messages_is_read ON public."ConsultationMessages" USING btree ("isRead");


--
-- TOC entry 5121 (class 1259 OID 17085)
-- Name: consultation_messages_sender_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX consultation_messages_sender_id ON public."ConsultationMessages" USING btree ("senderId");


--
-- TOC entry 5122 (class 1259 OID 17086)
-- Name: consultation_messages_sender_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX consultation_messages_sender_type ON public."ConsultationMessages" USING btree ("senderType");


--
-- TOC entry 5123 (class 1259 OID 17087)
-- Name: consultation_messages_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX consultation_messages_type ON public."ConsultationMessages" USING btree (type);


--
-- TOC entry 5128 (class 1259 OID 17088)
-- Name: consultations_appointment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX consultations_appointment_id ON public."Consultations" USING btree ("appointmentId");


--
-- TOC entry 5129 (class 1259 OID 17089)
-- Name: consultations_ended_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX consultations_ended_at ON public."Consultations" USING btree ("endedAt");


--
-- TOC entry 5130 (class 1259 OID 17090)
-- Name: consultations_follow_up_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX consultations_follow_up_date ON public."Consultations" USING btree ("followUpDate");


--
-- TOC entry 5131 (class 1259 OID 17091)
-- Name: consultations_started_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX consultations_started_at ON public."Consultations" USING btree ("startedAt");


--
-- TOC entry 5132 (class 1259 OID 17092)
-- Name: consultations_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX consultations_status ON public."Consultations" USING btree (status);


--
-- TOC entry 5133 (class 1259 OID 17093)
-- Name: consultations_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX consultations_type ON public."Consultations" USING btree (type);


--
-- TOC entry 5136 (class 1259 OID 17094)
-- Name: contact_informations_display_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contact_informations_display_order ON public."ContactInformations" USING btree ("displayOrder");


--
-- TOC entry 5137 (class 1259 OID 17095)
-- Name: contact_informations_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contact_informations_is_active ON public."ContactInformations" USING btree ("isActive");


--
-- TOC entry 5138 (class 1259 OID 17096)
-- Name: contact_informations_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contact_informations_name ON public."ContactInformations" USING btree (name);


--
-- TOC entry 5141 (class 1259 OID 17097)
-- Name: doctor_availabilities_day_of_week; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX doctor_availabilities_day_of_week ON public."DoctorAvailabilities" USING btree ("dayOfWeek");


--
-- TOC entry 5142 (class 1259 OID 17098)
-- Name: doctor_availabilities_doctor_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX doctor_availabilities_doctor_id ON public."DoctorAvailabilities" USING btree ("doctorId");


--
-- TOC entry 5143 (class 1259 OID 17099)
-- Name: doctor_availabilities_doctor_id_day_of_week; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX doctor_availabilities_doctor_id_day_of_week ON public."DoctorAvailabilities" USING btree ("doctorId", "dayOfWeek");


--
-- TOC entry 5144 (class 1259 OID 17100)
-- Name: doctor_availabilities_doctor_id_is_available_is_invalidated; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX doctor_availabilities_doctor_id_is_available_is_invalidated ON public."DoctorAvailabilities" USING btree ("doctorId", "isAvailable", "isInvalidated");


--
-- TOC entry 5145 (class 1259 OID 17101)
-- Name: doctor_availabilities_is_available; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX doctor_availabilities_is_available ON public."DoctorAvailabilities" USING btree ("isAvailable");


--
-- TOC entry 5146 (class 1259 OID 17102)
-- Name: doctor_availabilities_is_invalidated; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX doctor_availabilities_is_invalidated ON public."DoctorAvailabilities" USING btree ("isInvalidated");


--
-- TOC entry 5149 (class 1259 OID 17103)
-- Name: doctor_specialties_doctor_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX doctor_specialties_doctor_id ON public."DoctorSpecialties" USING btree ("doctorId");


--
-- TOC entry 5150 (class 1259 OID 17104)
-- Name: doctor_specialties_doctor_id_specialty_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX doctor_specialties_doctor_id_specialty_id ON public."DoctorSpecialties" USING btree ("doctorId", "specialtyId");


--
-- TOC entry 5151 (class 1259 OID 17105)
-- Name: doctor_specialties_specialty_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX doctor_specialties_specialty_id ON public."DoctorSpecialties" USING btree ("specialtyId");


--
-- TOC entry 5158 (class 1259 OID 17106)
-- Name: doctors_average_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX doctors_average_rating ON public."Doctors" USING btree ("averageRating");


--
-- TOC entry 5159 (class 1259 OID 17107)
-- Name: doctors_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX doctors_is_active ON public."Doctors" USING btree ("isActive");


--
-- TOC entry 5160 (class 1259 OID 17108)
-- Name: doctors_is_verified; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX doctors_is_verified ON public."Doctors" USING btree ("isVerified");


--
-- TOC entry 5161 (class 1259 OID 17109)
-- Name: doctors_license_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX doctors_license_number ON public."Doctors" USING btree ("licenseNumber");


--
-- TOC entry 5162 (class 1259 OID 17110)
-- Name: doctors_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX doctors_user_id ON public."Doctors" USING btree ("userId");


--
-- TOC entry 5165 (class 1259 OID 17111)
-- Name: drug_orders_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX drug_orders_created_at ON public."DrugOrders" USING btree ("createdAt");


--
-- TOC entry 5166 (class 1259 OID 17112)
-- Name: drug_orders_patient_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX drug_orders_patient_id ON public."DrugOrders" USING btree ("patientId");


--
-- TOC entry 5167 (class 1259 OID 17113)
-- Name: drug_orders_payment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX drug_orders_payment_id ON public."DrugOrders" USING btree ("paymentId");


--
-- TOC entry 5168 (class 1259 OID 17114)
-- Name: drug_orders_payment_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX drug_orders_payment_status ON public."DrugOrders" USING btree ("paymentStatus");


--
-- TOC entry 5169 (class 1259 OID 17115)
-- Name: drug_orders_pharmacy_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX drug_orders_pharmacy_id ON public."DrugOrders" USING btree ("pharmacyId");


--
-- TOC entry 5170 (class 1259 OID 17116)
-- Name: drug_orders_prescription_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX drug_orders_prescription_id ON public."DrugOrders" USING btree ("prescriptionId");


--
-- TOC entry 5171 (class 1259 OID 17117)
-- Name: drug_orders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX drug_orders_status ON public."DrugOrders" USING btree (status);


--
-- TOC entry 5172 (class 1259 OID 17118)
-- Name: drug_orders_tracking_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX drug_orders_tracking_number ON public."DrugOrders" USING btree ("trackingNumber");


--
-- TOC entry 5175 (class 1259 OID 17119)
-- Name: idx_notifications_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_type ON public."Notifications" USING btree (type);


--
-- TOC entry 5176 (class 1259 OID 17120)
-- Name: notifications_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_created_at ON public."Notifications" USING btree ("createdAt");


--
-- TOC entry 5177 (class 1259 OID 17121)
-- Name: notifications_expires_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_expires_at ON public."Notifications" USING btree ("expiresAt");


--
-- TOC entry 5178 (class 1259 OID 17122)
-- Name: notifications_is_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_is_read ON public."Notifications" USING btree ("isRead");


--
-- TOC entry 5179 (class 1259 OID 17123)
-- Name: notifications_priority; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_priority ON public."Notifications" USING btree (priority);


--
-- TOC entry 5180 (class 1259 OID 17124)
-- Name: notifications_scheduled_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_scheduled_at ON public."Notifications" USING btree ("scheduledAt");


--
-- TOC entry 5181 (class 1259 OID 17125)
-- Name: notifications_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_user_id ON public."Notifications" USING btree (user_id);


--
-- TOC entry 5184 (class 1259 OID 17126)
-- Name: patient_documents_document_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX patient_documents_document_type ON public."PatientDocuments" USING btree ("documentType");


--
-- TOC entry 5185 (class 1259 OID 17127)
-- Name: patient_documents_patient_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX patient_documents_patient_id ON public."PatientDocuments" USING btree ("patientId");


--
-- TOC entry 5186 (class 1259 OID 17128)
-- Name: patient_documents_uploaded_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX patient_documents_uploaded_at ON public."PatientDocuments" USING btree ("uploadedAt");


--
-- TOC entry 5191 (class 1259 OID 17129)
-- Name: patients_allergies; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX patients_allergies ON public."Patients" USING gin (allergies);


--
-- TOC entry 5192 (class 1259 OID 17130)
-- Name: patients_blood_group; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX patients_blood_group ON public."Patients" USING btree ("bloodGroup");


--
-- TOC entry 5193 (class 1259 OID 17131)
-- Name: patients_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX patients_user_id ON public."Patients" USING btree ("userId");


--
-- TOC entry 5198 (class 1259 OID 17132)
-- Name: payments_application_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_application_id ON public."Payments" USING btree ("applicationId");


--
-- TOC entry 5199 (class 1259 OID 17133)
-- Name: payments_appointment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_appointment_id ON public."Payments" USING btree ("appointmentId");


--
-- TOC entry 5200 (class 1259 OID 17134)
-- Name: payments_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_created_at ON public."Payments" USING btree ("createdAt");


--
-- TOC entry 5201 (class 1259 OID 17135)
-- Name: payments_prescription_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_prescription_id ON public."Payments" USING btree ("prescriptionId");


--
-- TOC entry 5202 (class 1259 OID 17136)
-- Name: payments_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_status ON public."Payments" USING btree (status);


--
-- TOC entry 5203 (class 1259 OID 17137)
-- Name: payments_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX payments_transaction_id ON public."Payments" USING btree ("transactionId");


--
-- TOC entry 5204 (class 1259 OID 17138)
-- Name: payments_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_type ON public."Payments" USING btree (type);


--
-- TOC entry 5205 (class 1259 OID 17139)
-- Name: payments_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_user_id ON public."Payments" USING btree ("userId");


--
-- TOC entry 5212 (class 1259 OID 17140)
-- Name: pharmacies_average_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pharmacies_average_rating ON public."Pharmacies" USING btree ("averageRating");


--
-- TOC entry 5213 (class 1259 OID 17141)
-- Name: pharmacies_documents; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pharmacies_documents ON public."Pharmacies" USING gin (documents);


--
-- TOC entry 5214 (class 1259 OID 17142)
-- Name: pharmacies_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pharmacies_is_active ON public."Pharmacies" USING btree ("isActive");


--
-- TOC entry 5215 (class 1259 OID 17143)
-- Name: pharmacies_is_verified; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pharmacies_is_verified ON public."Pharmacies" USING btree ("isVerified");


--
-- TOC entry 5216 (class 1259 OID 17144)
-- Name: pharmacies_languages; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pharmacies_languages ON public."Pharmacies" USING gin (languages);


--
-- TOC entry 5217 (class 1259 OID 17145)
-- Name: pharmacies_license_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX pharmacies_license_number ON public."Pharmacies" USING btree ("licenseNumber");


--
-- TOC entry 5218 (class 1259 OID 17146)
-- Name: pharmacies_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pharmacies_name ON public."Pharmacies" USING btree (name);


--
-- TOC entry 5219 (class 1259 OID 17147)
-- Name: pharmacies_payment_methods; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pharmacies_payment_methods ON public."Pharmacies" USING gin ("paymentMethods");


--
-- TOC entry 5220 (class 1259 OID 17148)
-- Name: pharmacies_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX pharmacies_user_id ON public."Pharmacies" USING btree ("userId");


--
-- TOC entry 5223 (class 1259 OID 17149)
-- Name: pharmacy_drugs_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pharmacy_drugs_category ON public."PharmacyDrugs" USING btree (category);


--
-- TOC entry 5224 (class 1259 OID 17150)
-- Name: pharmacy_drugs_expiry_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pharmacy_drugs_expiry_date ON public."PharmacyDrugs" USING btree ("expiryDate");


--
-- TOC entry 5225 (class 1259 OID 17151)
-- Name: pharmacy_drugs_generic_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pharmacy_drugs_generic_name ON public."PharmacyDrugs" USING btree ("genericName");


--
-- TOC entry 5226 (class 1259 OID 17152)
-- Name: pharmacy_drugs_is_available; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pharmacy_drugs_is_available ON public."PharmacyDrugs" USING btree ("isAvailable");


--
-- TOC entry 5227 (class 1259 OID 17153)
-- Name: pharmacy_drugs_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pharmacy_drugs_name ON public."PharmacyDrugs" USING btree (name);


--
-- TOC entry 5228 (class 1259 OID 17154)
-- Name: pharmacy_drugs_pharmacy_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pharmacy_drugs_pharmacy_id ON public."PharmacyDrugs" USING btree ("pharmacyId");


--
-- TOC entry 5229 (class 1259 OID 17155)
-- Name: pharmacy_drugs_pharmacy_id_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pharmacy_drugs_pharmacy_id_name ON public."PharmacyDrugs" USING btree ("pharmacyId", name);


--
-- TOC entry 5230 (class 1259 OID 17156)
-- Name: pharmacy_drugs_requires_prescription; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pharmacy_drugs_requires_prescription ON public."PharmacyDrugs" USING btree ("requiresPrescription");


--
-- TOC entry 5231 (class 1259 OID 17157)
-- Name: pharmacy_drugs_stock_quantity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pharmacy_drugs_stock_quantity ON public."PharmacyDrugs" USING btree ("stockQuantity");


--
-- TOC entry 5234 (class 1259 OID 17158)
-- Name: prescriptions_consultation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX prescriptions_consultation_id ON public."Prescriptions" USING btree ("consultationId");


--
-- TOC entry 5235 (class 1259 OID 17159)
-- Name: prescriptions_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX prescriptions_created_at ON public."Prescriptions" USING btree ("createdAt");


--
-- TOC entry 5236 (class 1259 OID 17160)
-- Name: prescriptions_end_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX prescriptions_end_date ON public."Prescriptions" USING btree ("endDate");


--
-- TOC entry 5237 (class 1259 OID 17161)
-- Name: prescriptions_start_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX prescriptions_start_date ON public."Prescriptions" USING btree ("startDate");


--
-- TOC entry 5238 (class 1259 OID 17162)
-- Name: prescriptions_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX prescriptions_status ON public."Prescriptions" USING btree (status);


--
-- TOC entry 5241 (class 1259 OID 17163)
-- Name: q_and_as_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX q_and_as_category ON public."QAndAs" USING btree (category);


--
-- TOC entry 5242 (class 1259 OID 17164)
-- Name: q_and_as_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX q_and_as_is_active ON public."QAndAs" USING btree ("isActive");


--
-- TOC entry 5249 (class 1259 OID 17165)
-- Name: specialties_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX specialties_is_active ON public."Specialties" USING btree ("isActive");


--
-- TOC entry 5250 (class 1259 OID 17166)
-- Name: specialties_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX specialties_name ON public."Specialties" USING btree (name);


--
-- TOC entry 5253 (class 1259 OID 17167)
-- Name: symptoms_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX symptoms_name ON public."Symptoms" USING btree (name);


--
-- TOC entry 5254 (class 1259 OID 17168)
-- Name: symptoms_specialty_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX symptoms_specialty_id ON public."Symptoms" USING btree ("specialtyId");


--
-- TOC entry 5257 (class 1259 OID 17169)
-- Name: system_notifications_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX system_notifications_created_at ON public."SystemNotifications" USING btree ("createdAt");


--
-- TOC entry 5258 (class 1259 OID 17170)
-- Name: system_notifications_created_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX system_notifications_created_by ON public."SystemNotifications" USING btree ("createdBy");


--
-- TOC entry 5259 (class 1259 OID 17171)
-- Name: system_notifications_end_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX system_notifications_end_date ON public."SystemNotifications" USING btree ("endDate");


--
-- TOC entry 5260 (class 1259 OID 17172)
-- Name: system_notifications_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX system_notifications_is_active ON public."SystemNotifications" USING btree ("isActive");


--
-- TOC entry 5261 (class 1259 OID 17173)
-- Name: system_notifications_priority; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX system_notifications_priority ON public."SystemNotifications" USING btree (priority);


--
-- TOC entry 5262 (class 1259 OID 17174)
-- Name: system_notifications_start_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX system_notifications_start_date ON public."SystemNotifications" USING btree ("startDate");


--
-- TOC entry 5263 (class 1259 OID 17175)
-- Name: system_notifications_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX system_notifications_type ON public."SystemNotifications" USING btree (type);


--
-- TOC entry 5266 (class 1259 OID 17176)
-- Name: testimonials_doctor_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX testimonials_doctor_id ON public."Testimonials" USING btree ("doctorId");


--
-- TOC entry 5267 (class 1259 OID 17177)
-- Name: testimonials_is_anonymous; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX testimonials_is_anonymous ON public."Testimonials" USING btree ("isAnonymous");


--
-- TOC entry 5268 (class 1259 OID 17178)
-- Name: testimonials_is_approved; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX testimonials_is_approved ON public."Testimonials" USING btree ("isApproved");


--
-- TOC entry 5269 (class 1259 OID 17179)
-- Name: testimonials_patient_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX testimonials_patient_id ON public."Testimonials" USING btree ("patientId");


--
-- TOC entry 5270 (class 1259 OID 17180)
-- Name: testimonials_pharmacy_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX testimonials_pharmacy_id ON public."Testimonials" USING btree ("pharmacyId");


--
-- TOC entry 5271 (class 1259 OID 17181)
-- Name: testimonials_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX testimonials_rating ON public."Testimonials" USING btree (rating);


--
-- TOC entry 5272 (class 1259 OID 17182)
-- Name: testimonials_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX testimonials_user_id ON public."Testimonials" USING btree ("userId");


--
-- TOC entry 5275 (class 1259 OID 17183)
-- Name: time_slots_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX time_slots_date ON public."TimeSlots" USING btree (date);


--
-- TOC entry 5276 (class 1259 OID 17184)
-- Name: time_slots_date_start_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX time_slots_date_start_time ON public."TimeSlots" USING btree (date, "startTime");


--
-- TOC entry 5277 (class 1259 OID 17185)
-- Name: time_slots_doctor_availability_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX time_slots_doctor_availability_id ON public."TimeSlots" USING btree ("doctorAvailabilityId");


--
-- TOC entry 5278 (class 1259 OID 17186)
-- Name: time_slots_doctor_availability_id_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX time_slots_doctor_availability_id_date ON public."TimeSlots" USING btree ("doctorAvailabilityId", date);


--
-- TOC entry 5279 (class 1259 OID 17187)
-- Name: time_slots_is_booked; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX time_slots_is_booked ON public."TimeSlots" USING btree ("isBooked");


--
-- TOC entry 5280 (class 1259 OID 17188)
-- Name: time_slots_start_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX time_slots_start_time ON public."TimeSlots" USING btree ("startTime");


--
-- TOC entry 5283 (class 1259 OID 17189)
-- Name: user_applications_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_applications_status ON public."UserApplications" USING btree (status);


--
-- TOC entry 5284 (class 1259 OID 17190)
-- Name: user_applications_submitted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_applications_submitted_at ON public."UserApplications" USING btree ("submittedAt");


--
-- TOC entry 5285 (class 1259 OID 17191)
-- Name: user_applications_type_id_application_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_applications_type_id_application_type ON public."UserApplications" USING btree ("typeId", "applicationType");


--
-- TOC entry 5286 (class 1259 OID 17192)
-- Name: user_applications_user_id_application_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_applications_user_id_application_type ON public."UserApplications" USING btree ("userId", "applicationType");


--
-- TOC entry 5291 (class 1259 OID 17193)
-- Name: users_auth_provider; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_auth_provider ON public."Users" USING btree ("authProvider");


--
-- TOC entry 5292 (class 1259 OID 17194)
-- Name: users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email ON public."Users" USING btree (email);


--
-- TOC entry 5293 (class 1259 OID 17195)
-- Name: users_email_verified; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_email_verified ON public."Users" USING btree ("emailVerified");


--
-- TOC entry 5294 (class 1259 OID 17196)
-- Name: users_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_is_active ON public."Users" USING btree ("isActive");


--
-- TOC entry 5295 (class 1259 OID 17197)
-- Name: users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_role ON public."Users" USING btree (role);


--
-- TOC entry 5296 (class 2606 OID 17198)
-- Name: ActivityLogs ActivityLogs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLogs"
    ADD CONSTRAINT "ActivityLogs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5297 (class 2606 OID 17203)
-- Name: ApplicationDocuments ApplicationDocuments_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ApplicationDocuments"
    ADD CONSTRAINT "ApplicationDocuments_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public."UserApplications"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5298 (class 2606 OID 17208)
-- Name: Appointments Appointments_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointments"
    ADD CONSTRAINT "Appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public."Doctors"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5299 (class 2606 OID 17213)
-- Name: Appointments Appointments_doctorId_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointments"
    ADD CONSTRAINT "Appointments_doctorId_fkey1" FOREIGN KEY ("doctorId") REFERENCES public."Doctors"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5300 (class 2606 OID 17218)
-- Name: Appointments Appointments_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointments"
    ADD CONSTRAINT "Appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."Patients"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5301 (class 2606 OID 17223)
-- Name: Appointments Appointments_timeSlotId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointments"
    ADD CONSTRAINT "Appointments_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES public."TimeSlots"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5302 (class 2606 OID 17228)
-- Name: ConsultationMessages ConsultationMessages_consultationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConsultationMessages"
    ADD CONSTRAINT "ConsultationMessages_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES public."Consultations"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5303 (class 2606 OID 17233)
-- Name: ConsultationMessages ConsultationMessages_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConsultationMessages"
    ADD CONSTRAINT "ConsultationMessages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5304 (class 2606 OID 17238)
-- Name: Consultations Consultations_appointmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Consultations"
    ADD CONSTRAINT "Consultations_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES public."Appointments"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5305 (class 2606 OID 17243)
-- Name: DoctorAvailabilities DoctorAvailabilities_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DoctorAvailabilities"
    ADD CONSTRAINT "DoctorAvailabilities_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public."Doctors"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5306 (class 2606 OID 17248)
-- Name: DoctorSpecialties DoctorSpecialties_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DoctorSpecialties"
    ADD CONSTRAINT "DoctorSpecialties_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public."Doctors"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5307 (class 2606 OID 17253)
-- Name: DoctorSpecialties DoctorSpecialties_specialtyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DoctorSpecialties"
    ADD CONSTRAINT "DoctorSpecialties_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES public."Specialties"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5308 (class 2606 OID 17258)
-- Name: Doctors Doctors_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Doctors"
    ADD CONSTRAINT "Doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5309 (class 2606 OID 17263)
-- Name: DrugOrders DrugOrders_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DrugOrders"
    ADD CONSTRAINT "DrugOrders_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."Patients"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5310 (class 2606 OID 17268)
-- Name: DrugOrders DrugOrders_paymentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DrugOrders"
    ADD CONSTRAINT "DrugOrders_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES public."Payments"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5311 (class 2606 OID 17273)
-- Name: DrugOrders DrugOrders_pharmacyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DrugOrders"
    ADD CONSTRAINT "DrugOrders_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES public."Pharmacies"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5312 (class 2606 OID 17278)
-- Name: DrugOrders DrugOrders_prescriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DrugOrders"
    ADD CONSTRAINT "DrugOrders_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES public."Prescriptions"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5313 (class 2606 OID 17283)
-- Name: Notifications Notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5314 (class 2606 OID 17288)
-- Name: PatientDocuments PatientDocuments_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PatientDocuments"
    ADD CONSTRAINT "PatientDocuments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."Patients"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5315 (class 2606 OID 17293)
-- Name: Patients Patients_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patients"
    ADD CONSTRAINT "Patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5316 (class 2606 OID 17298)
-- Name: Payments Payments_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public."UserApplications"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5317 (class 2606 OID 17303)
-- Name: Payments Payments_appointmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES public."Appointments"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5318 (class 2606 OID 17308)
-- Name: Payments Payments_prescriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES public."Prescriptions"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5319 (class 2606 OID 17313)
-- Name: Payments Payments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5320 (class 2606 OID 17318)
-- Name: Pharmacies Pharmacies_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pharmacies"
    ADD CONSTRAINT "Pharmacies_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5321 (class 2606 OID 17323)
-- Name: PharmacyDrugs PharmacyDrugs_pharmacyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PharmacyDrugs"
    ADD CONSTRAINT "PharmacyDrugs_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES public."Pharmacies"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5322 (class 2606 OID 17328)
-- Name: Prescriptions Prescriptions_consultationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Prescriptions"
    ADD CONSTRAINT "Prescriptions_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES public."Consultations"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5323 (class 2606 OID 17333)
-- Name: Symptoms Symptoms_specialtyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Symptoms"
    ADD CONSTRAINT "Symptoms_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES public."Specialties"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5324 (class 2606 OID 17338)
-- Name: SystemNotifications SystemNotifications_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemNotifications"
    ADD CONSTRAINT "SystemNotifications_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5325 (class 2606 OID 17343)
-- Name: Testimonials Testimonials_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Testimonials"
    ADD CONSTRAINT "Testimonials_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public."Doctors"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5326 (class 2606 OID 17348)
-- Name: Testimonials Testimonials_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Testimonials"
    ADD CONSTRAINT "Testimonials_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."Patients"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5327 (class 2606 OID 17353)
-- Name: Testimonials Testimonials_pharmacyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Testimonials"
    ADD CONSTRAINT "Testimonials_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES public."Pharmacies"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5328 (class 2606 OID 17358)
-- Name: Testimonials Testimonials_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Testimonials"
    ADD CONSTRAINT "Testimonials_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5329 (class 2606 OID 17363)
-- Name: TimeSlots TimeSlots_doctorAvailabilityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TimeSlots"
    ADD CONSTRAINT "TimeSlots_doctorAvailabilityId_fkey" FOREIGN KEY ("doctorAvailabilityId") REFERENCES public."DoctorAvailabilities"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5330 (class 2606 OID 17368)
-- Name: UserApplications UserApplications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserApplications"
    ADD CONSTRAINT "UserApplications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2025-09-01 02:29:43

--
-- PostgreSQL database dump complete
--

\unrestrict jUoM0Vhh1Jxih0glm1IaEhlc1EN9XQ4FJ74HrejxZ5Ny13elBgrHm3ZHHGzH1a2

