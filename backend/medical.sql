--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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
-- Name: enum_Users_gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_gender" AS ENUM (
    'male',
    'female'
);


ALTER TYPE public."enum_Users_gender" OWNER TO postgres;

--
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'admin',
    'doctor',
    'patient'
);


ALTER TYPE public."enum_Users_role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ContactInformations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContactInformations" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "iconUrl" character varying(255) DEFAULT 'defaultIcon.png'::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ContactInformations" OWNER TO postgres;

--
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
-- Name: ContactInformations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ContactInformations_id_seq" OWNED BY public."ContactInformations".id;


--
-- Name: Patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Patients" (
    id integer NOT NULL,
    "userId" integer,
    document character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Patients" OWNER TO postgres;

--
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
-- Name: Patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Patients_id_seq" OWNED BY public."Patients".id;


--
-- Name: Q_and_As; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Q_and_As" (
    id integer NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Q_and_As" OWNER TO postgres;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: Specialties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Specialties" (
    id integer NOT NULL,
    name character varying(255),
    noun character varying(255),
    "iconUrl" character varying(255),
    description text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Specialties" OWNER TO postgres;

--
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
-- Name: Specialties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Specialties_id_seq" OWNED BY public."Specialties".id;


--
-- Name: Symptoms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Symptoms" (
    id integer NOT NULL,
    name character varying(255),
    "iconUrl" character varying(255),
    "specialtyId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Symptoms" OWNER TO postgres;

--
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
-- Name: Symptoms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Symptoms_id_seq" OWNED BY public."Symptoms".id;


--
-- Name: Testimonials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Testimonials" (
    id integer NOT NULL,
    "userId" integer,
    rating integer,
    message text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Testimonials" OWNER TO postgres;

--
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
-- Name: Testimonials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Testimonials_id_seq" OWNED BY public."Testimonials".id;


--
-- Name: UserContacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserContacts" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "contactInformationId" integer NOT NULL,
    value character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."UserContacts" OWNER TO postgres;

--
-- Name: UserContacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserContacts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserContacts_id_seq" OWNER TO postgres;

--
-- Name: UserContacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserContacts_id_seq" OWNED BY public."UserContacts".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    name character varying(255),
    gender public."enum_Users_gender" NOT NULL,
    age integer NOT NULL,
    password character varying(255) NOT NULL,
    dob timestamp with time zone NOT NULL,
    country character varying(255) DEFAULT 'Cameroon'::character varying NOT NULL,
    city character varying(255) NOT NULL,
    role public."enum_Users_role",
    "profileImage" character varying(255) DEFAULT 'defaultPic.png'::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
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
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: q_and_as_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.q_and_as_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.q_and_as_id_seq OWNER TO postgres;

--
-- Name: q_and_as_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.q_and_as_id_seq OWNED BY public."Q_and_As".id;


--
-- Name: ContactInformations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactInformations" ALTER COLUMN id SET DEFAULT nextval('public."ContactInformations_id_seq"'::regclass);


--
-- Name: Patients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patients" ALTER COLUMN id SET DEFAULT nextval('public."Patients_id_seq"'::regclass);


--
-- Name: Q_and_As id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Q_and_As" ALTER COLUMN id SET DEFAULT nextval('public.q_and_as_id_seq'::regclass);


--
-- Name: Specialties id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Specialties" ALTER COLUMN id SET DEFAULT nextval('public."Specialties_id_seq"'::regclass);


--
-- Name: Symptoms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Symptoms" ALTER COLUMN id SET DEFAULT nextval('public."Symptoms_id_seq"'::regclass);


--
-- Name: Testimonials id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Testimonials" ALTER COLUMN id SET DEFAULT nextval('public."Testimonials_id_seq"'::regclass);


--
-- Name: UserContacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserContacts" ALTER COLUMN id SET DEFAULT nextval('public."UserContacts_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: ContactInformations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContactInformations" (id, name, "iconUrl", "createdAt", "updatedAt") FROM stdin;
1	phone	<i class=\\fas fa-phone\\></i>	2025-01-25 10:12:55+01	2025-01-25 10:12:55+01
2	telegram	<i class=\\fa-brands fa-telegram\\></i>	2025-01-25 10:22:33+01	2025-01-25 10:22:33+01
3	email	<i class=\\far fa-envelope\\></i>	2025-01-25 10:22:33+01	2025-01-25 10:22:33+01
4	whatsapp	<i class=\\fa-brands fa-whatsapp\\></i>	2025-01-25 10:22:33+01	2025-01-25 10:22:33+01
5	facebook	<i class=\\fa-brands fa-facebook-f\\></i>	2025-01-25 10:22:33+01	2025-01-25 10:22:33+01
6	messenger	<i class=\\fa-brands fa-facebook-messenger\\></i>	2025-01-25 10:22:33+01	2025-01-25 10:22:33+01
7	x-twitter	<i class=\\fa-brands fa-x-twitter\\></i>	2025-01-25 10:22:33+01	2025-01-25 10:22:33+01
8	linkedin	<i class=\\fa-brands fa-linkedin\\></i>	2025-01-25 10:22:33+01	2025-01-25 10:22:33+01
9	instagram	<i class=\\fa-brands fa-instagram\\></i>	2025-01-25 10:22:33+01	2025-01-25 10:22:33+01
\.


--
-- Data for Name: Patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Patients" (id, "userId", document, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Q_and_As; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Q_and_As" (id, question, answer, "createdAt", "updatedAt") FROM stdin;
1	How can I schedule a consultation via the website?	You can schedule a consultation by visiting our website, selecting a healthcare provider, and choosing an available time slot.	2025-01-28 13:37:58+01	2025-01-28 14:17:21+01
2	What should I expect during my first online consultation?	During your first online consultation, you?Ã‡Ã–ll discuss your medical history and current symptoms. The provider will assess your situation and recommend a treatment plan.	2025-01-28 14:18:38+01	2025-01-28 14:18:38+01
3	What lifestyle changes can help manage my hypertension?	Manage hypertension by following a healthy diet, exercising regularly, reducing salt intake, limiting alcohol, and managing stress.	2025-01-28 14:19:20+01	2025-01-28 14:19:20+01
4	How do I know if I need to see a doctor for my headaches?	See a doctor if your headaches are frequent, severe, or accompanied by symptoms like vision changes or nausea.	2025-01-28 14:20:33+01	2025-01-28 14:20:33+01
5	What are the signs of dehydration?	Signs of dehydration include thirst, dry mouth, dark urine, fatigue, and dizziness.	2025-01-28 14:21:16+01	2025-01-28 14:21:16+01
6	Can I get prescriptions during an online consultation?	Yes, if deemed appropriate, your healthcare provider can prescribe medications during your online consultation.	2025-01-28 14:21:49+01	2025-01-28 14:21:49+01
7	How do I prepare for my online consultation?	Prepare by gathering your medical history, a list of current medications, and any questions you want to ask your provider.	2025-01-28 14:22:24+01	2025-01-28 14:22:24+01
8	What should I do if I experience side effects from a medication?	If you experience side effects, contact your healthcare provider immediately to discuss your symptoms and potential alternatives.	2025-01-28 14:22:49+01	2025-01-28 14:22:49+01
9	How can I manage anxiety using online resources?	You can manage anxiety by accessing online therapy sessions, mindfulness resources, and self-help materials available on our site.	2025-01-28 14:23:14+01	2025-01-28 14:23:14+01
10	Is my personal information safe during an online consultation?	Yes, we prioritize your privacy and use secure platforms to protect your personal information during online consultations.	2025-01-28 14:23:52+01	2025-01-28 14:23:52+01
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20250319102159-create-q-and-a.js
20250320081844-create-user.js
20250320082545-create-specialty.js
20250320082938-create-symptom.js
20250320083114-create-patient.js
20250320083309-create-testimonials.js
20250322190324-create-contact-information.js
20250322190932-create-user-contact.js
\.


--
-- Data for Name: Specialties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Specialties" (id, name, noun, "iconUrl", description, "createdAt", "updatedAt") FROM stdin;
16	Cardiology	Cardiologist	cardiology52cb3661-c6bd-4852-acfb-439ac2e74b96.svg	The medical specialty focused on diagnosing and treating heart and vascular diseases.	2025-03-22 18:39:55.44+01	2025-03-22 18:39:55.44+01
\.


--
-- Data for Name: Symptoms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Symptoms" (id, name, "iconUrl", "specialtyId", "createdAt", "updatedAt") FROM stdin;
6	Chest Pain	https://res.cloudinary.com/dgzzdltn0/image/upload/v1742665335/online_consultation/symptoms/ougcuclgerm76cefeqi2.png	16	2025-03-22 18:42:16.128+01	2025-03-22 18:42:16.128+01
\.


--
-- Data for Name: Testimonials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Testimonials" (id, "userId", rating, message, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: UserContacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserContacts" (id, "userId", "contactInformationId", value, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, name, gender, age, password, dob, country, city, role, "profileImage", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: ContactInformations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ContactInformations_id_seq"', 1, false);


--
-- Name: Patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Patients_id_seq"', 1, false);


--
-- Name: Specialties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Specialties_id_seq"', 16, true);


--
-- Name: Symptoms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Symptoms_id_seq"', 6, true);


--
-- Name: Testimonials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Testimonials_id_seq"', 1, false);


--
-- Name: UserContacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserContacts_id_seq"', 1, false);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 1, false);


--
-- Name: q_and_as_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.q_and_as_id_seq', 1, true);


--
-- Name: ContactInformations ContactInformations_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactInformations"
    ADD CONSTRAINT "ContactInformations_name_key" UNIQUE (name);


--
-- Name: ContactInformations ContactInformations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactInformations"
    ADD CONSTRAINT "ContactInformations_pkey" PRIMARY KEY (id);


--
-- Name: Patients Patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patients"
    ADD CONSTRAINT "Patients_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: Specialties Specialties_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Specialties"
    ADD CONSTRAINT "Specialties_name_key" UNIQUE (name);


--
-- Name: Specialties Specialties_noun_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Specialties"
    ADD CONSTRAINT "Specialties_noun_key" UNIQUE (noun);


--
-- Name: Specialties Specialties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Specialties"
    ADD CONSTRAINT "Specialties_pkey" PRIMARY KEY (id);


--
-- Name: Symptoms Symptoms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Symptoms"
    ADD CONSTRAINT "Symptoms_pkey" PRIMARY KEY (id);


--
-- Name: Testimonials Testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Testimonials"
    ADD CONSTRAINT "Testimonials_pkey" PRIMARY KEY (id);


--
-- Name: UserContacts UserContacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserContacts"
    ADD CONSTRAINT "UserContacts_pkey" PRIMARY KEY (id, "contactInformationId", value);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Q_and_As q_and_as_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Q_and_As"
    ADD CONSTRAINT q_and_as_pkey PRIMARY KEY (id);


--
-- Name: Patients Patients_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patients"
    ADD CONSTRAINT "Patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Symptoms Symptoms_specialtyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Symptoms"
    ADD CONSTRAINT "Symptoms_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES public."Specialties"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Testimonials Testimonials_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Testimonials"
    ADD CONSTRAINT "Testimonials_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserContacts UserContacts_contactInformationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserContacts"
    ADD CONSTRAINT "UserContacts_contactInformationId_fkey" FOREIGN KEY ("contactInformationId") REFERENCES public."ContactInformations"(id);


--
-- Name: UserContacts UserContacts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserContacts"
    ADD CONSTRAINT "UserContacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id);


--
-- PostgreSQL database dump complete
--

