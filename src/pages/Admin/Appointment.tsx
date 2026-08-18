import { useEffect, useMemo, useState } from "react";
import { FiEye } from "react-icons/fi";
import {
  getAppointments,
  updateAppointmentStatus,
  type AppointmentStatus,
} from "../../api/appointment.Api";

type Appointment = {
  _id: string;
  patientName: string;
  mobileNumber: string;
  email?: string;
  appointmentDate: string;
  time: string;
  status: "Booked" | "Completed" | "Cancelled";
};

export default function AppointmentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState<"all" | "today" | "tomorrow">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [open, setOpen] = useState(false);

  const handleView = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setOpen(true);
  };

  const limit = 10;

  useEffect(() => {
    fetchAppointments();
  }, [page]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getAppointments(page, limit);
      console.log("API Response:", res);
      console.log("First Appointment:", res.data[0]);
      setAppointments(res.data || []);
      setTotalPages(res.pagination?.totalPages ?? 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Get today's date and tomorrow's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      // Search filter (name, mobile, email)
      const patientName = item.patientName ?? "";
      const mobileNumber = item.mobileNumber ?? "";
      const email = item.email ?? "";

      const searchMatch =
        patientName.toLowerCase().includes(search.toLowerCase()) ||
        mobileNumber.includes(search) ||
        email.toLowerCase().includes(search.toLowerCase());

      // Date filter
      let dateMatch = true;
      if (filterDate === "today") {
        dateMatch = item.appointmentDate === today;
      } else if (filterDate === "tomorrow") {
        dateMatch = item.appointmentDate === tomorrow;
      }

      return searchMatch && dateMatch;
    });
  }, [appointments, search, filterDate, today, tomorrow]);
  const handleStatusChange = async (
    id: string,
    status: "Booked" | "Completed" | "Cancelled"
  ) => {
    try {
      const response = await updateAppointmentStatus(
        id,
        status
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to update status"
        );
      }

      // Update modal immediately
      setSelectedAppointment((previous) =>
        previous
          ? {
            ...previous,
            status,
          }
          : null
      );

      // Update table immediately
      setAppointments((previous) =>
        previous.map((appointment) =>
          appointment._id === id
            ? {
              ...appointment,
              status,
            }
            : appointment
        )
      );

      // Optional: reload from backend
      await fetchAppointments();

    } catch (error: any) {
      console.error(
        "STATUS UPDATE ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update appointment status"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Appointments
        </h2>

        <div className="flex gap-3 items-center">
          {/* Search Input */}
          <input
            placeholder="Search by name, email, or mobile..."
            className="border rounded-lg px-4 py-2 w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Date Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterDate("all")}
              className={`px-4 py-2 rounded-lg border ${filterDate === "all"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterDate("today")}
              className={`px-4 py-2 rounded-lg border ${filterDate === "today"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilterDate("tomorrow")}
              className={`px-4 py-2 rounded-lg border ${filterDate === "tomorrow"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
            >
              Tomorrow
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-center">S.No</th>
              <th className="px-4 py-3 text-center">Token</th>
              <th className="px-4 py-3 text-center">Time</th>
              <th className="px-4 py-3 text-center">Name</th>
              <th className="px-4 py-3 text-center">Mobile</th>
              <th className="px-4 py-3 text-center">Email</th>
              <th className="px-4 py-3 text-center">Date</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  No appointments found
                </td>
              </tr>
            ) : (
              filteredAppointments.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-4 text-center">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-4 py-4 text-center">
                    #{item.token || "-"}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {item.time || "-"}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {item.patientName || "-"}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {item.mobileNumber || "-"}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {item.email || "-"}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {item.appointmentDate || "-"}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${item.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleView(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEye size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {open && selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[450px] p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold">
                Appointment Details
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-xl hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p>
                <strong>Patient :</strong>{" "}
                {selectedAppointment.patientName || "-"}
              </p>
              <p>
                <strong>Mobile :</strong>{" "}
                {selectedAppointment.mobileNumber || "-"}
              </p>
              {selectedAppointment.email && (
                <p>
                  <strong>Email :</strong> {selectedAppointment.email}
                </p>
              )}
              <p>
                <strong>Date :</strong>{" "}
                {selectedAppointment.appointmentDate || "-"}
              </p>
              <p>
                <strong>Time :</strong>{" "}
                {selectedAppointment.time || "-"}
              </p>
              <div className="flex items-center gap-3">
                <strong>Status :</strong>

                <select
                  value={selectedAppointment.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedAppointment._id,
                      e.target.value
                    )
                  }
                  className={`rounded-full border px-3 py-1 text-sm font-medium outline-none ${selectedAppointment.status === "Completed"
                    ? "border-green-200 bg-green-100 text-green-700"
                    : selectedAppointment.status === "Cancelled"
                      ? "border-red-200 bg-red-100 text-red-700"
                      : "border-yellow-200 bg-yellow-100 text-yellow-700"
                    }`}
                >
                  <option value="Booked">
                    Booked
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-5 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>

        <span className="px-4 py-2">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}