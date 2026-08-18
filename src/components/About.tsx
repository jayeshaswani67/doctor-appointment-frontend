import { useEffect, useState } from "react";
import API from "../api/axios";


interface WorkingHour {
  day: string;
  enabled: boolean;
  morningStart?: string;
  morningEnd?: string;
  eveningStart?: string;
  eveningEnd?: string;
}

interface DoctorInfo {
  id: string;
  name: string;
  title?: string;
  specialization?: string;
  qualifications?: string;
  yearsOfExperience?: number;
  bio?: string;

  consultationFees?: {
    amount: number;
    currency?: string;
    formatted?: string;
  };

  image?: {
    url?: string;
    altText?: string;
  };

  workingHours?: WorkingHour[];
}

export default function About() {
  const [doctor, setDoctor] =
    useState<DoctorInfo | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

// get public api

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);

        const response = await API.get(
          "/public/landing"
        );

        console.log(
          "LANDING API RESPONSE:",
          response.data
        );



        const doctorInfo =
          response.data?.data?.doctorInfo;

        if (!doctorInfo) {
          throw new Error(
            "Doctor information not found."
          );
        }

        setDoctor(doctorInfo);

      } catch (err: any) {
        console.error(
          "About Doctor API Error:",
          err
        );

        console.error(
          "Backend Response:",
          err?.response?.data
        );

        setError(
          err?.response?.data?.message ||
          "Failed to load doctor information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, []);

// loading

  if (loading) {
    return (
      <section
        id="about"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div className="h-[450px] animate-pulse rounded-3xl bg-gray-200" />

            <div>
              <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />

              <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-gray-200" />

              <div className="mt-4 h-6 w-1/2 animate-pulse rounded bg-gray-200" />

              <div className="mt-8 h-24 animate-pulse rounded bg-gray-200" />
            </div>

          </div>

        </div>
      </section>
    );
  }

// error

  if (error || !doctor) {
    return (
      <section
        id="about"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6">

          <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
            {error || "Doctor information unavailable."}
          </div>

        </div>
      </section>
    );
  }

  // working hours 

  const workingHours =
    doctor.workingHours?.filter(
      (hour) => hour.enabled
    ) || [];

//  consolution fees

  const consultationFee =
    doctor.consultationFees?.formatted ||
    `₹${doctor.consultationFees?.amount || 0}`;

 

  return (
    <section
      id="about"
      className="bg-white py-20"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* doctor image */}

          <div>

            {doctor.image?.url ? (
              <img
                src={doctor.image.url}
                alt={
                  doctor.image.altText ||
                  doctor.name
                }
                className="w-full rounded-3xl object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-[450px] items-center justify-center rounded-3xl bg-gray-100">
                <p className="text-gray-500">
                  Doctor image not available
                </p>
              </div>
            )}

          </div>

        {/* doctor information */}

          <div>

            <span className="font-semibold text-blue-600">
              ABOUT DOCTOR
            </span>

            {/* NAME */}

            <h2 className="mt-3 text-4xl font-bold">
              {doctor.name}
            </h2>

            {/* SPECIALIZATION */}

            <p className="mt-2 text-gray-500">
              {doctor.specialization ||
                doctor.title ||
                ""}
            </p>

            {/* QUALIFICATION */}

            {doctor.qualifications && (
              <p className="mt-2 text-sm font-medium text-gray-500">
                {doctor.qualifications}
              </p>
            )}

            {/* BIO */}

            <p className="mt-6 leading-8 text-gray-600">
              {doctor.bio ||
                "Doctor information is currently unavailable."}
            </p>

          

            <div className="mt-10 grid grid-cols-2 gap-6">

              {/* EXPERIENCE */}

              <div className="rounded-xl bg-blue-50 p-5">

                <h3 className="text-lg font-semibold">
                  Experience
                </h3>

                <p className="mt-2 text-gray-600">
                  {doctor.yearsOfExperience || 0}+
                  {" "}
                  Years
                </p>

              </div>

              {/* CONSULTATION */}

              <div className="rounded-xl bg-blue-50 p-5">

                <h3 className="text-lg font-semibold">
                  Consultation
                </h3>

                <p className="mt-2 text-gray-600">
                  {consultationFee}
                </p>

              </div>

              {/* QUALIFICATION */}

              <div className="rounded-xl bg-blue-50 p-5">

                <h3 className="text-lg font-semibold">
                  Qualification
                </h3>

                <p className="mt-2 text-gray-600">
                  {doctor.qualifications ||
                    "Not available"}
                </p>

              </div>

              {/* WORKING HOURS */}

              <div className="rounded-xl bg-blue-50 p-5">

                <h3 className="text-lg font-semibold">
                  Working Hours
                </h3>

                {workingHours.length > 0 ? (
                  <div className="mt-2 space-y-1 text-sm text-gray-600">

                    {workingHours.map(
                      (hour) => (
                        <p key={hour.day}>

                          <span className="font-medium">
                            {hour.day}:
                          </span>

                          {" "}

                          {hour.morningStart &&
                          hour.morningEnd
                            ? `${hour.morningStart} - ${hour.morningEnd}`
                            : ""}

                          {hour.eveningStart &&
                          hour.eveningEnd
                            ? ` & ${hour.eveningStart} - ${hour.eveningEnd}`
                            : ""}

                        </p>
                      )
                    )}

                  </div>
                ) : (
                  <p className="mt-2 text-gray-600">
                    Not available
                  </p>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}