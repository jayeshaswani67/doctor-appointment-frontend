import doctor from "../assets/doctor.jpg";

export default function Hero() {
  return (
    <section
      id="home"
      className="bg-white pt-24 pb-16 lg:pt-32 lg:pb-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* Left Content */}

          <div className="text-center lg:text-left">

            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              Trusted Healthcare Clinic
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Quality Healthcare
              <br />
              For You & Your Family
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600 lg:mx-0">
              Receive professional medical consultations, accurate diagnosis,
              personalized treatment, and compassionate care from an experienced
              physician in a comfortable clinic environment.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">

              <a
                href="#appointment"
                className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >
                Book Appointment
              </a>

              <a
                href="#services"
                className="rounded-xl border border-blue-600 px-8 py-4 font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                View Services
              </a>

            </div>

            {/* Statistics */}

            <div className="mt-14 grid grid-cols-3 gap-6 border-t border-slate-200 pt-8 text-center lg:text-left">

              <div>
                <h3 className="text-3xl font-bold text-blue-600">
                  15+
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Years Experience
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-blue-600">
                  10K+
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Patients Treated
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-blue-600">
                  98%
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Satisfaction
                </p>
              </div>

            </div>

          </div>

          {/* Doctor Image */}

          <div className="flex justify-center">

            <img
              src={doctor}
              alt="Doctor"
              className="w-full max-w-sm rounded-3xl object-cover shadow-xl sm:max-w-md lg:max-w-lg"
            />

          </div>

        </div>

      </div>
    </section>
  );
}