import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  X,
  Phone,
  Loader2,
} from "lucide-react";

import { getPatients } from "../../api/patientApi";
import type { Patient } from "../../api/patientApi";

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);

  const [search, setSearch] = useState("");

  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // get patients

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPatients(page, 10);

        console.log(
          "Patients API Response:",
          response
        );

        setPatients(response.data);

        setPagination(response.pagination);

      } catch (error: any) {
        console.error(
          "Failed to fetch patients:",
          error
        );

        setError(
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load patients."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [page]);

  // search

  const filteredPatients = patients.filter(
    (patient) =>
      patient.patientName
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // status color

  const statusColor = (status: string) => {
    if (status === "Completed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // page

  return (
    <div className="space-y-6">

      {/* header */}

      <div>
        <h1 className="text-3xl font-bold">
          Patients
        </h1>

        <p className="mt-2 text-slate-500">
          Manage all registered patients.
        </p>
      </div>

      {/* search */}

      <div className="relative">

        <Search
          className="absolute left-4 top-4 text-gray-400"
          size={18}
        />

        <input
          type="text"
          placeholder="Search patient..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

      </div>

      {/* error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      {/* table */}

      <div className="overflow-hidden rounded-2xl bg-white shadow">

        {loading ? (

          <div className="flex min-h-[300px] items-center justify-center">

            <div className="flex items-center gap-3 text-gray-500">

              <Loader2
                size={22}
                className="animate-spin"
              />

              <span>
                Loading patients...
              </span>

            </div>

          </div>

        ) : filteredPatients.length === 0 ? (

          <div className="flex min-h-[300px] items-center justify-center text-gray-500">
            No patients found.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              {/* table header */}

              <thead className="bg-slate-100">

                <tr>

                  <th className="p-4 text-left">
                    S.No
                  </th>

                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th className="p-4 text-left">
                    Age
                  </th>

                  <th className="p-4 text-left">
                    Gender
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-center">
                    Action
                  </th>

                </tr>

              </thead>

              {/* table body */}

              <tbody>

                {filteredPatients.map(
                  (patient, index) => (

                    <tr
                      key={patient._id}
                      className="border-t transition hover:bg-slate-50"
                    >

                      {/* S.NO */}

                      <td className="p-4">
                        {(page - 1) * 10 +
                          index +
                          1}
                      </td>

                      {/* NAME */}

                      <td className="p-4 font-medium">
                        {patient.patientName}
                      </td>

                      {/* AGE */}

                      <td className="p-4">
                        {patient.age}
                      </td>

                      {/* GENDER */}

                      <td className="p-4">
                        {patient.gender}
                      </td>

                      {/* STATUS */}

                      <td className="p-4">

                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${statusColor(
                            patient.status
                          )}`}
                        >
                          {patient.status}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="p-4 text-center">

                        <button
                          onClick={() =>
                            setSelectedPatient(
                              patient
                            )
                          }
                          className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                          title="View Patient"
                        >
                          <Eye size={18} />
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* pagination */}

      {!loading &&
        pagination.totalPages > 1 && (

          <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow">

            <p className="text-sm text-gray-500">
              Page {pagination.page} of{" "}
              {pagination.totalPages}
            </p>

            <div className="flex gap-2">

              <button
                disabled={page === 1}
                onClick={() =>
                  setPage(
                    (previousPage) =>
                      Math.max(
                        previousPage - 1,
                        1
                      )
                  )
                }
                className="rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                disabled={
                  page >=
                  pagination.totalPages
                }
                onClick={() =>
                  setPage(
                    (previousPage) =>
                      Math.min(
                        previousPage + 1,
                        pagination.totalPages
                      )
                  )
                }
                className="rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>

            </div>

          </div>

        )}

      {/* patients details model */}

      {selectedPatient && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            {/* MODAL HEADER */}

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                Patient Details
              </h2>

              <button
                onClick={() =>
                  setSelectedPatient(null)
                }
                className="rounded-lg p-2 transition hover:bg-gray-100"
              >
                <X size={22} />
              </button>

            </div>

            {/* PATIENT DETAILS */}

            <div className="space-y-4">

              <div>
                <p className="text-sm text-gray-500">
                  Name
                </p>

                <p className="font-medium">
                  {selectedPatient.patientName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Age
                </p>

                <p className="font-medium">
                  {selectedPatient.age}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Gender
                </p>

                <p className="font-medium">
                  {selectedPatient.gender}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Mobile
                </p>

                <p className="font-medium">
                  {selectedPatient.mobileNumber}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Status
                </p>

                <span
                  className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusColor(
                    selectedPatient.status
                  )}`}
                >
                  {selectedPatient.status}
                </span>
              </div>

            </div>

            {/* MODAL ACTIONS */}

            <div className="mt-6 flex gap-3">

              <a
                href={`tel:${selectedPatient.mobileNumber}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-white transition hover:bg-green-700"
              >
                <Phone size={18} />
                Call
              </a>

              <button
                onClick={() =>
                  setSelectedPatient(null)
                }
                className="flex-1 rounded-xl border py-3 transition hover:bg-gray-50"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

