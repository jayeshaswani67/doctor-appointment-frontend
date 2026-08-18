import { useEffect, useState, useCallback } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import API from "../api/axios";
import { createAppointment } from "../api/appointment.Api";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Slot {
  slotId: string;
  startTime: string;
  endTime: string;
}

interface DaySlots {
  date: string;
  availableSlots: Slot[];
  bookedSlots: Slot[];
}

interface LandingData {
  doctorInfo: {
    id: string;
    name: string;
    title?: string;
    specialization?: string;
  };
  appointments: {
    today: DaySlots;
    tomorrow: DaySlots;
    nextDay: DaySlots;
  };
}

type DayKey = "today" | "tomorrow" | "nextDay";

interface PatientForm {
  name: string;
  age: string;
  mobile: string;
}

export default function AppointmentModal({
  isOpen,
  onClose,
}: AppointmentModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [landing, setLanding] = useState<LandingData | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayKey>("today");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [confirmedToken, setConfirmedToken] =
    useState<number | null>(null);


  const [form, setForm] = useState<PatientForm>({
    name: "",
    age: "",
    mobile: "",
  });

  // Fetch Landing Data with Signal Guard
  const getLandingPage = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const response = await API.get("/public/landing", { signal });
      const responseData = response.data;

      let data = responseData?.data ?? responseData;

      if (data?.data && !data?.appointments) {
        data = data.data;
      }

      if (!data?.appointments?.today || !data?.appointments?.tomorrow || !data?.appointments?.nextDay) {
        toast.error("Appointment slots are currently unavailable.");
        return;
      }

      setLanding(data);
    } catch (error: any) {
      if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") return;

      console.error("LANDING API ERROR:", error);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load appointment slots."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();
    getLandingPage(controller.signal);

    return () => {
      controller.abort();
    };
  }, [isOpen, getLandingPage]);

  // Safe Data Extraction
  const dayData = landing?.appointments?.[selectedDay];
  const availableSlots = Array.isArray(dayData?.availableSlots) ? dayData.availableSlots : [];

  const formatDate = (date: string) => {
    if (!date) return "";
    const parts = date.split("-");
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : date;
  };

  const getDayName = (day: DayKey) => {
    if (day === "today") return "Today";
    if (day === "tomorrow") return "Tomorrow";
    return "Next Day";
  };

  const selectDay = (day: DayKey) => {
    setSelectedDay(day);
    setSelectedSlot(null);
  };

  const selectSlot = (slot: Slot) => {
    setSelectedSlot(slot);
  };
  const getTokenForSlot = (slot: Slot): number => {
  if (!dayData) return 0;

  // Combine available + booked slots
  const allSlots = [
    ...(dayData.availableSlots || []),
    ...(dayData.bookedSlots || []),
  ];

  // Sort slots by actual time
  const sortedSlots = [...allSlots].sort((a, b) => {
    const getMinutes = (time: string) => {
      const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

      if (!match) return 0;

      let hour = Number(match[1]);
      const minute = Number(match[2]);
      const period = match[3].toUpperCase();

      if (period === "PM" && hour !== 12) {
        hour += 12;
      }

      if (period === "AM" && hour === 12) {
        hour = 0;
      }

      return hour * 60 + minute;
    };

    return getMinutes(a.startTime) - getMinutes(b.startTime);
  });

  const index = sortedSlots.findIndex(
    (item) =>
      item.startTime === slot.startTime &&
      item.endTime === slot.endTime
  );

  return index >= 0 ? index + 1 : 0;
};

  const nextStep = () => {
    if (!selectedSlot) {
      toast.error("Please select an available time slot.");
      return;
    }
    setStep(2);
  };

  const previousStep = () => {
    setStep(1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookAppointment = async () => {
    if (!form.name.trim()) {
      return toast.error(
        "Please enter patient name."
      );
    }

    if (!form.age.trim()) {
      return toast.error(
        "Please enter patient age."
      );
    }

    if (!form.mobile.trim()) {
      return toast.error(
        "Please enter mobile number."
      );
    }

    if (!selectedSlot) {
      return toast.error(
        "Please select an appointment slot."
      );
    }

    if (!dayData?.date) {
      return toast.error(
        "Appointment date is missing."
      );
    }

    try {
      setBooking(true);

      const appointmentData = {
        patientName: form.name.trim(),
        age: Number(form.age),
        mobileNumber: form.mobile.trim(),
        appointmentDate: dayData.date,
        time: selectedSlot.startTime,
      };

      const response =
        await createAppointment(
          appointmentData
        );

      console.log(
        "APPOINTMENT POST RESPONSE:",
        response
      );

      if (response?.success) {

  // Generate token based on slot position
  const slotToken = getTokenForSlot(selectedSlot);

  console.log("SELECTED SLOT:", selectedSlot);
  console.log("GENERATED SLOT TOKEN:", slotToken);

  setConfirmedToken(slotToken);

  // Move to STEP 3
  setStep(3);

  toast.success("Appointment booked successfully!");
} else {

        toast.error(
          response?.message ||
          "Failed to book appointment."
        );
      }

    } catch (error: any) {

      console.error(
        "Appointment POST Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        "Failed to book appointment."
      );

    } finally {
      setBooking(false);
    }
  };

  const handleClose = () => {
    if (booking) return;

    setStep(1);
    setSelectedDay("today");
    setSelectedSlot(null);
    setForm({ name: "", age: "", mobile: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-bold">Book Appointment</h2>
            {landing?.doctorInfo?.name && (
              <p className="mt-1 text-sm text-gray-500">
                {landing.doctorInfo.name}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* BODY */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Select Date & Time
              </h3>

              {/* DAY SELECTOR */}
              <div className="grid grid-cols-3 gap-3">
                {(["today", "tomorrow", "nextDay"] as DayKey[]).map((day) => {
                  const data = landing?.appointments?.[day];

                  const isSelectedDay = selectedDay === day;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => selectDay(day)}
                      className={`rounded-xl border p-3 text-left transition-all duration-200 ${isSelectedDay
                        ? "border-blue-600 bg-blue-600 text-white shadow-md ring-2 ring-blue-200"
                        : "border-gray-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                    >
                      <p className="font-semibold">
                        {getDayName(day)}
                      </p>

                      <p
                        className={`mt-1 text-xs ${isSelectedDay
                          ? "text-blue-100"
                          : "text-gray-500"
                          }`}
                      >
                        {data?.date
                          ? formatDate(data.date)
                          : "--"}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* SLOTS */}
              <div className="mt-6">

                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">
                    Available Time Slots
                  </h4>

                  {dayData?.date && (
                    <span className="text-xs font-medium text-gray-500">
                      {formatDate(dayData.date)}
                    </span>
                  )}
                </div>

                {loading ? (
                  <div className="flex justify-center py-10">
                    <Loader2
                      size={28}
                      className="animate-spin text-blue-600"
                    />
                  </div>

                ) : availableSlots.length === 0 ? (

                  <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                    <p className="font-medium text-gray-700">
                      No available slots
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Please select another day.
                    </p>
                  </div>

                ) : (

                  <div className="grid grid-cols-3 gap-3">

                    {availableSlots.map((slot, index) => {


                      const isSelected =
                        selectedSlot?.startTime ===
                        slot.startTime;

                      return (
                        <button
                          key={`${slot.startTime}-${index}`}
                          type="button"
                          onClick={() => selectSlot(slot)}
                          className={`relative rounded-xl border px-3 py-3 text-sm font-semibold transition-all duration-200 ${isSelected
                            ? "border-blue-700 bg-blue-600 text-white shadow-lg ring-2 ring-blue-200"
                            : "border-gray-200 bg-white text-slate-800 hover:border-blue-500 hover:bg-blue-50"
                            }`}
                        >

                          {/* SELECTED CHECK */}
                          {isSelected && (
                            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-600">
                              ✓
                            </span>
                          )}

                          <span
                            className={
                              isSelected
                                ? "block pr-5"
                                : "block"
                            }
                          >
                            {slot.startTime}
                          </span>

                          {/* Optional end time */}
                          <span
                            className={`mt-1 block text-xs ${isSelected
                              ? "text-blue-100"
                              : "text-gray-400"
                              }`}
                          >
                            Until {slot.endTime}
                          </span>

                        </button>
                      );
                    })}

                  </div>
                )}

                {/* SELECTED SLOT SUMMARY */}
                {selectedSlot && (
                  <div className="mt-5 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">

                    <div>
                      <p className="text-xs font-medium text-blue-600">
                        SELECTED TIME
                      </p>

                      <p className="mt-1 font-bold text-blue-900">
                        {selectedSlot.startTime}
                        {" - "}
                        {selectedSlot.endTime}
                      </p>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      ✓
                    </div>

                  </div>
                )}

              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="mb-5 text-lg font-semibold">Patient Details</h3>

              <div className="mb-5 rounded-xl bg-blue-50 p-4">
                <p className="text-sm text-blue-600">Appointment</p>
                <p className="font-semibold text-blue-900">
                  {getDayName(selectedDay)}
                </p>
                <p className="text-sm text-blue-800">
                  {dayData?.date ? formatDate(dayData.date) : ""} •{" "}
                  {selectedSlot?.startTime}
                </p>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">
                  Patient Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter patient name"
                  className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  min="1"
                  max="120"
                  className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
                />
              </div>
            </>
          )}
          {/* STEP 3 - APPOINTMENT CONFIRMATION */}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center px-6 py-10 text-center">

              {/* Success Icon */}

              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Heading */}

              <h2 className="text-2xl font-bold text-slate-900">
                Appointment Confirmed!
              </h2>

              {/* Message */}

              <p className="mt-3 max-w-md text-slate-500">
                Appointment booked successfully!
                Your appointment has been confirmed.
                Please arrive on time and keep your
                token number with you.
              </p>

              {/* TOKEN */}

              <div className="mt-6 w-full max-w-sm rounded-2xl border border-blue-100 bg-blue-50 p-6">

                <p className="text-sm font-medium text-slate-500">
                  Your Token Number
                </p>

                <p className="mt-2 text-5xl font-bold text-blue-600">
                  #{confirmedToken}
                </p>

              </div>

              {/* APPOINTMENT DETAILS */}

              <div className="mt-6 w-full max-w-sm rounded-xl bg-slate-50 p-4 text-left">

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Date
                  </span>

                  <span className="font-semibold">
                    {dayData?.date}
                  </span>
                </div>

                <div className="mt-3 flex justify-between">
                  <span className="text-slate-500">
                    Time
                  </span>

                  <span className="font-semibold">
                    {selectedSlot?.startTime}
                  </span>
                </div>

                <div className="mt-3 flex justify-between">
                  <span className="text-slate-500">
                    Patient
                  </span>

                  <span className="font-semibold">
                    {form.name}
                  </span>
                </div>

              </div>

              {/* DONE BUTTON */}

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setConfirmedToken(null);

                  setForm({
                    name: "",
                    age: "",
                    mobile: "",
                  });

                  setSelectedSlot(null);

                  onClose();
                }}
                className="mt-8 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Done
              </button>

            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-between border-t p-5">
          {step === 2 ? (
            <button
              type="button"
              onClick={previousStep}
              disabled={booking}
              className="rounded-xl border px-5 py-2.5"
            >
              Previous
            </button>
          ) : (
            <div />
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={loading || !selectedSlot}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-white disabled:opacity-50"
            >
              Next
            </button>

          ) : (

            <button
              type="button"
              onClick={handleBookAppointment}
              disabled={booking}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-white disabled:opacity-50"
            >
              {booking && (
                <Loader2 size={18} className="animate-spin" />
              )}
              {booking ? "Booking..." : "Book Appointment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}