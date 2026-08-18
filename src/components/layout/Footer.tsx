import { useEffect, useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Loader2,
} from "lucide-react";

import API from "../../api/axios";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Appointment", href: "#appointment" },
  { label: "Contact", href: "#contact" },
];

interface WorkingHour {
  days: string[];
  enabled: boolean;
  morningTime?: string;
  eveningTime?: string;
}

interface LandingData {
  doctorInfo: {
    id: string;
    name: string;
    title?: string;
    specialization?: string;

    contactInfo?: {
      phone?: string;
      email?: string;
      clinicAddress?: string;
    };

    workingHours?: WorkingHour[];
  };
}

export default function Footer() {
  const [landing, setLanding] =
    useState<LandingData | null>(null);

  const [loading, setLoading] =
    useState(true);

  // get api

  useEffect(() => {
    const getLandingPage = async () => {
      try {
        setLoading(true);

        const response =
          await API.get(
            "/public/landing"
          );

        console.log(
          "FOOTER LANDING API:",
          response.data
        );

        let data = response.data;

  

        if (data?.data) {
          data = data.data;
        }

      

        if (data?.data) {
          data = data.data;
        }

        if (!data?.doctorInfo) {
          throw new Error(
            "Doctor information not found."
          );
        }

        setLanding(data);
      } catch (error: any) {
        console.error(
          "Footer Landing API Error:",
          error
        );

        console.error(
          "Backend response:",
          error?.response?.data
        );
      } finally {
        setLoading(false);
      }
    };

    getLandingPage();
  }, []);

// data

  const doctor =
    landing?.doctorInfo;

  const contact =
    doctor?.contactInfo;

  const workingHours =
    doctor?.workingHours || [];

//  scroll

  const handleScroll = (
    href: string
  ) => {
    const element =
      document.querySelector(
        href
      );

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

// loader

  if (loading) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="flex min-h-75 items-center justify-center">
          <Loader2
            size={30}
            className="animate-spin text-blue-400"
          />
        </div>
      </footer>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <footer className="bg-gray-900 text-white">

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        {/* ================================= */}
        {/* MAIN GRID */}
        {/* ================================= */}

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* ================================= */}
          {/* CLINIC INFO */}
          {/* ================================= */}

          <div>

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">

                <span className="text-xl font-bold">
                  DR
                </span>

              </div>

              <div>

                <h3 className="text-xl font-bold">
                  {doctor?.name ||
                    "Doctor"}
                </h3>

                <p className="text-gray-400">
                  {doctor?.specialization ||
                    "Medical Clinic"}
                </p>

              </div>

            </div>

            <p className="mb-6 leading-relaxed text-gray-300">
              {doctor?.title ||
                "Providing quality healthcare with compassionate and personalized treatment."}
            </p>

            <div className="space-y-3">

              {/* ADDRESS */}

              <div className="flex items-start gap-3">

                <MapPin
                  className="mt-1 shrink-0 text-blue-400"
                  size={20}
                />

                <span className="text-gray-300">
                  {contact?.clinicAddress ||
                    "Clinic address not available"}
                </span>

              </div>

              {/* PHONE */}

              <div className="flex items-center gap-3">

                <Phone
                  className="text-blue-400"
                  size={20}
                />

                {contact?.phone ? (
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    {contact.phone}
                  </a>
                ) : (
                  <span className="text-gray-400">
                    Phone not available
                  </span>
                )}

              </div>

              {/* EMAIL */}

              <div className="flex items-center gap-3">

                <Mail
                  className="text-blue-400"
                  size={20}
                />

                {contact?.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    {contact.email}
                  </a>
                ) : (
                  <span className="text-gray-400">
                    Email not available
                  </span>
                )}

              </div>

            </div>

          </div>

          {/* ================================= */}
          {/* QUICK LINKS */}
          {/* ================================= */}

          <div>

            <h3 className="mb-5 text-lg font-bold">
              Quick Links
            </h3>

            <ul className="space-y-3">

              {quickLinks.map(
                (link) => (
                  <li
                    key={
                      link.label
                    }
                  >

                    <button
                      type="button"
                      onClick={() =>
                        handleScroll(
                          link.href
                        )
                      }
                      className="text-gray-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </button>

                  </li>
                )
              )}

            </ul>

          </div>

          {/* ================================= */}
          {/* SERVICES */}
          {/* ================================= */}

          <div>

            <h3 className="mb-5 text-lg font-bold">
              Services
            </h3>

            <ul className="space-y-3 text-gray-300">

              <li>
                Preventive Health Checkups
              </li>

              <li>
                Follow-up Consultation
              </li>

              <li>
                Personalized Treatment
              </li>

              <li>
                Vaccination & Preventive Care
              </li>

              <li>
                Clinic Consultation
              </li>

            </ul>

          </div>

          {/* ================================= */}
          {/* WORKING HOURS */}
          {/* ================================= */}

          <div>

            <h3 className="mb-5 text-lg font-bold">
              Working Hours
            </h3>

            <div className="flex items-start gap-3">

              <Clock
                className="mt-1 shrink-0 text-blue-400"
                size={20}
              />

              <div className="space-y-5 text-gray-300">

                {workingHours.length ===
                0 ? (
                  <p className="text-gray-400">
                    Working hours not available.
                  </p>
                ) : (
                  workingHours.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={index}
                      >

                        {/* DAYS */}

                        <p className="font-semibold text-white">
                          {item.days.join(
                            " - "
                          )}
                        </p>

                        {/* CLOSED */}

                        {!item.enabled ? (
                          <p className="text-red-400">
                            Closed
                          </p>
                        ) : (
                          <div className="mt-1 space-y-1">

                            {item.morningTime && (
                              <p>
                                {
                                  item.morningTime
                                }
                              </p>
                            )}

                            {item.eveningTime && (
                              <p>
                                {
                                  item.eveningTime
                                }
                              </p>
                            )}

                          </div>
                        )}

                      </div>
                    )
                  )
                )}

              </div>

            </div>

            {/* EMERGENCY */}

            <div className="mt-5 rounded-xl border border-blue-500/30 bg-blue-600/20 p-4">

              <p className="mb-1 font-semibold text-white">
                Emergency Consultation
              </p>

              <p className="text-blue-300">
                Call before visiting
              </p>

              {contact?.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="mt-2 inline-block font-semibold text-white hover:underline"
                >
                  {contact.phone}
                </a>
              )}

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* BOTTOM BAR */}
        {/* ================================= */}

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row">

          <p className="text-center text-gray-400 md:text-left">

            ©{" "}
            {new Date().getFullYear()}{" "}

            {doctor?.name ||
              "Doctor"}{" "}

            Clinic. All rights reserved.

          </p>

          <div className="flex items-center gap-6 text-sm text-gray-400">

            <button
              type="button"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </button>

            <button
              type="button"
              className="transition-colors hover:text-white"
            >
              Terms of Service
            </button>

          </div>

        </div>

      </div>

    </footer>
  );
}