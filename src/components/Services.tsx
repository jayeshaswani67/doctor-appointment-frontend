import {
  FaNotesMedical,
  FaClipboardCheck,
  FaUserDoctor,
  FaKitMedical,
  FaHouseMedical,
} from "react-icons/fa6";

const services = [
  {
    title: "Preventive Health Checkups",
    icon: <FaNotesMedical />,
    description:
      "Routine health screenings, early disease detection, and wellness guidance for better long-term health.",
  },
  {
    title: "Follow-up Consultation",
    icon: <FaClipboardCheck />,
    description:
      "Review your recovery, adjust medications, and monitor treatment progress through regular follow-ups.",
  },
  {
    title: "Personalized Treatment",
    icon: <FaUserDoctor />,
    description:
      "Treatment plans tailored to your symptoms, medical history, and lifestyle for the best outcomes.",
  },
  {
    title: "Vaccination & Preventive Care",
    icon: <FaKitMedical />,
    description:
      "Seasonal vaccinations, preventive healthcare, and family wellness guidance.",
  },
  {
    title: "Clinic Consultation",
    icon: <FaHouseMedical />,
    description:
      "Comfortable in-clinic consultations with compassionate, patient-focused healthcare.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="bg-linear-to-b from-slate-50 to-white py-25"
    >
      <div className="mx-auto max-w-7xl px-5">

        {/* Heading */}

        <div className="text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
            Our Services
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            Comprehensive Healthcare Services
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-500">
            We provide personalized medical care with accurate diagnosis,
            preventive healthcare, chronic disease management, and
            compassionate treatment for every patient.
          </p>

        </div>

        {/* Services */}

        <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">

          {services.map((service) => (

            <div
              key={service.title}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-500 hover:-translate-y-3 hover:border-blue-200 hover:shadow-2xl"
            >

              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blue-50 transition duration-500 group-hover:scale-150"></div>

              <div className="relative z-10">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl text-blue-600 transition-all duration-300 group-hover:rotate-6 group-hover:bg-blue-600 group-hover:text-white">
                  {service.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-500">
                  {service.description}
                </p>

                <div className="mt-8 flex items-center justify-between">

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    ✓ Available
                  </span>

                  <button className="font-semibold text-blue-600 transition-all duration-300 group-hover:translate-x-2">
                    Learn More →
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* Why Choose */}

        <div className="mt-26 overflow-y-auto rounded-3xl bg-linear-to-r from-blue-600 to-cyan-500 p-10 text-white">

          <div className="text-center">

            <h3 className="text-3xl font-bold">
              Why Choose Our Clinic?
            </h3>

            <p className="mx-auto mt-4 max-w-2xl text-blue-100">
              We are committed to delivering trusted medical care with
              personalized attention, modern treatment, and a seamless
              appointment experience.
            </p>

          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            <div>
              <h4 className="font-semibold text-lg">
                ✓ Experienced Care
              </h4>

              <p className="mt-2 text-blue-100">
                Accurate diagnosis with evidence-based medical treatment.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg">
                ✓ Personalized Attention
              </h4>

              <p className="mt-2 text-blue-100">
                Every patient receives an individual treatment plan.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg">
                ✓ Easy Appointment
              </h4>

              <p className="mt-2 text-blue-100">
                Book your consultation online within a few simple steps.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg">
                ✓ Continuous Follow-up
              </h4>

              <p className="mt-2 text-blue-100">
                Regular follow-up consultations to support your recovery.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}