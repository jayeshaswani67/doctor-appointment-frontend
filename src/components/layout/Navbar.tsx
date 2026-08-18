import { useEffect, useState } from "react";
import { Menu, X, Phone, Stethoscope } from "lucide-react";
import AppointmentModal from "../AppointmentModel";
import API from "../../api/axios.ts";

interface DoctorInfo {
  name: string;
  title?: string;
  specialization?: string;

  contactInfo?: {
    phone?: string;
  };

  call?: {
    phone?: string;
  };
}

interface LandingResponse {
  doctorInfo: DoctorInfo;
}

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Appointment", href: "#appointment" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [doctor, setDoctor] =
    useState<DoctorInfo | null>(null);

  const [loading, setLoading] =
    useState(true);

  // get landing data

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        setLoading(true);

        const response =
          await API.get("/public/landing");

        console.log(
          "NAVBAR LANDING API:",
          response.data
        );



        let data = response.data;

        // First data level
        if (data?.data) {
          data = data.data;
        }


        if (data?.data) {
          data = data.data;
        }

        if (data?.doctorInfo) {
          setDoctor(data.doctorInfo);
        }

      } catch (error: any) {
        console.error(
          "Navbar Landing API Error:",
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

    fetchLandingData();
  }, []);


  // SCROLL


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);


  // NAVIGATION


  const handleScroll = (href: string) => {
    setIsOpen(false);

    const element =
      document.querySelector(href);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };


  // OPEN APPOINTMENT


  const handleOpenModal = () => {
    setIsOpen(false);
    setIsModalOpen(true);
  };


  // CLOSE APPOINTMENT


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  // DOCTOR DATA


  const doctorName =
    doctor?.name || "Doctor";

  const doctorSpecialization =
    doctor?.specialization ||
    doctor?.title ||
    "General Physician";

  const doctorPhone =
    doctor?.call?.phone ||
    doctor?.contactInfo?.phone ||
    "";
  const dialPhone = doctorPhone
    ? String(doctorPhone).replace(/[^\d+]/g, "")
    : "";

  return (
    <>
      {/* navbar */}

      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${scrolled
          ? "py-3"
          : "py-5"
          }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-6 transition-all duration-500 ${scrolled
            ? "h-16 border border-white/40 bg-white/80 shadow-xl backdrop-blur-xl"
            : "h-20 bg-transparent"
            }`}
        >

          {/* ==================================
              LOGO
          ================================== */}

          <button
            type="button"
            onClick={() =>
              handleScroll("#home")
            }
            className="flex items-center gap-3"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
              <Stethoscope
                className="text-white"
                size={22}
              />
            </div>

            <div className="text-left">

              <h1 className="text-lg font-bold text-slate-900">
                {loading
                  ? "Loading..."
                  : doctorName}
              </h1>

              <p className="text-xs text-slate-500">
                {loading
                  ? "Loading..."
                  : doctorSpecialization}
              </p>

            </div>

          </button>

          {/* ==================================
              DESKTOP MENU
          ================================== */}

          <nav className="hidden items-center gap-2 lg:flex">

            {navLinks.map((link) => (

              <button
                key={link.label}
                type="button"
                onClick={() =>
                  handleScroll(link.href)
                }
                className="rounded-full px-5 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
              >
                {link.label}
              </button>

            ))}

          </nav>

          {/* ==================================
              DESKTOP CTA
          ================================== */}

          <div className="hidden items-center gap-4 lg:flex">


            {/* PHONE */}

            {dialPhone && (
              <a
                href={`tel:${dialPhone}`}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-slate-700 transition hover:bg-slate-100"
              >
                <Phone size={18} />

                <span className="font-medium">
                  Call
                </span>
              </a>
            )}

            {/* APPOINTMENT */}

            <button
              type="button"
              onClick={handleOpenModal}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
            >
              Book Appointment
            </button>

          </div>

          {/* ==================================
              MOBILE TOGGLE
          ================================== */}

          <button
            type="button"
            onClick={() =>
              setIsOpen(!isOpen)
            }
            className="rounded-xl p-2 lg:hidden"
          >
            {isOpen ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>

        </div>

        {/* ==================================
            MOBILE MENU
        ================================== */}

        {isOpen && (
          <div className="mx-auto mt-4 max-w-7xl rounded-2xl border border-white/40 bg-white/90 p-5 shadow-2xl backdrop-blur-xl lg:hidden">

            <nav className="flex flex-col gap-2">

              {navLinks.map((link) => (

                <button
                  key={link.label}
                  type="button"
                  onClick={() =>
                    handleScroll(link.href)
                  }
                  className="rounded-xl px-4 py-3 text-left font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  {link.label}
                </button>

              ))}

              {/* MOBILE PHONE */}

              {dialPhone && (
                <a
                  href={`tel:${dialPhone}`}
                  className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Phone size={18} />

                  <span>
                    {doctorPhone}
                  </span>
                </a>
              )}

              {/* MOBILE APPOINTMENT */}

              <button
                type="button"
                onClick={handleOpenModal}
                className="mt-4 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Book Appointment
              </button>

            </nav>

          </div>
        )}

      </header>

      {/* appointment model */}

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}