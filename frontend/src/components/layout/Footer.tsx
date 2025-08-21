import React from "react";
import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  MessageCircle,
} from "lucide-react";
import { Logo } from "../ui";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-50 dark:bg-accent2 text-gray-800 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <section className="flex flex-col lg:flex-row gap-8">
          {/* Branding and Tagline */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center gap-2 mb-12 sm:mb-0">
            <div className="mb-4">
              <Logo size={120} />
            </div>
            <p className="text-sm text-center text-gray-600 dark:text-gray-300 leading-relaxed">
              Book appointments at super-human speed and get consulted at the
              comfort of your home.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Services */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-2">
                SERVICES
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/appointments"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Book appointments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/consultation"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Consultation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/schedule"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Schedule a visit
                  </Link>
                </li>
              </ul>
            </div>

            {/* Pages */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-2">
                PAGES
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/specialties"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Specialties
                  </Link>
                </li>
                <li>
                  <Link
                    href="/doctors"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Doctors
                  </Link>
                </li>
              </ul>
            </div>

            {/* More */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-2">
                MORE
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/faqs"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    SignUp
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-2">
                CONTACT
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <MapPin
                    size={16}
                    className="text-green-600 mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-600 text-sm">
                    P.O BOX 2715, Yaounde, Cameroon
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail size={16} className="text-red-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">
                    keyzglobal0313@gmail.com
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone
                    size={16}
                    className="text-green-600 mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-600 text-sm">
                    (+237) Admin Number
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bottom section */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              © {currentYear} My Website. All rights reserved.
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Facebook size={20} className="dark:text-white" />
              </Link>
              <Link
                href="#"
                className="text-pink-600 hover:text-pink-700 transition-colors"
              >
                <Instagram size={20} className="dark:text-white" />
              </Link>
              <Link
                href="#"
                className="text-blue-700 hover:text-blue-800 transition-colors"
              >
                <Linkedin size={20} className="dark:text-white" />
              </Link>
              <Link
                href="#"
                className="text-gray-800 hover:text-gray-900 transition-colors"
              >
                <Twitter size={20} className="dark:text-white" />
              </Link>
              <Link
                href="#"
                className="text-green-600 hover:text-green-700 transition-colors"
              >
                <MessageCircle size={20} className="dark:text-white" />
              </Link>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300">
              Powered by Google
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
