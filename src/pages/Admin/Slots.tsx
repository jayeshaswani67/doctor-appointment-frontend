import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  getSlot,
  createSlot,
  updateSlot,
  deleteSlot,
  type Slot,
} from "../../api/slotApi";

export default function Slot() {

  // state
  const [slot, setSlot] =
    useState<Slot[]>([]);
  const [loading, setLoading] =
    useState(false);
  const [saving, setSaving] =
    useState(false);
  const [deleting, setDeleting] =
    useState(false);
  const [page, setPage] =
    useState(1);
  const [limit] =
    useState(10);
  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    });
  const [showModal, setShowModal] =
    useState(false);
  const [editingSlot, setEditingSlot] =
    useState<Slot | null>(null);
  const [selectedSlot, setSelectedSlot] =
    useState<Slot | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({
      type,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // FETCH SLOTS
  const fetchSlots = async () => {

    try {
      setLoading(true);
      setError("");

      const response =
        await getSlot(
          page,
          limit
        );
      console.log(
        "SLOT GET RESPONSE:",
        response
      );

      if (response.success) {
        setSlot(
          Array.isArray(response.data)
            ? response.data
            : []
        );
        if (response.pagination) {

          setPagination(
            response.pagination
          );
        }

      } else {
        setError(
          response.message ||
          "Failed to fetch slots."
        );
      }

    } catch (err: any) {
      console.error(
        "GET SLOTS ERROR:",
        err
      );
      setError(
        err?.response?.data?.message ||
        "Unable to load slots."
      );
    } finally {
      setLoading(false);
    }
  };

  // LOAD ON PAGE CHANGE
  useEffect(() => {
    fetchSlots();
  }, [page]);

  // FORM CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove validation error when user enters value
    setFieldErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  
  // OPEN CREATE MODAL
  const handleCreate = () => {
    setEditingSlot(null);

    setForm({
      date: "",
      startTime: "",
      endTime: "",
    });

    setFieldErrors({
      date: "",
      startTime: "",
      endTime: "",
    });

    setShowModal(true);
  };

  
  // OPEN EDIT MODAL
  

  const handleEdit = (slot: Slot) => {
    setEditingSlot(slot);

    setForm({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });

    setFieldErrors({
      date: "",
      startTime: "",
      endTime: "",
    });

    setShowModal(true);
  };
  
  // CREATE / UPDATE
  

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const errors = {
      date: "",
      startTime: "",
      endTime: "",
    };

    let hasError = false;

    if (!form.date.trim()) {
      errors.date = "Date is required.";
      hasError = true;
    }

    if (!form.startTime.trim()) {
      errors.startTime = "Start time is required.";
      hasError = true;
    }

    if (!form.endTime.trim()) {
      errors.endTime = "End time is required.";
      hasError = true;
    }

    setFieldErrors(errors);

    if (hasError) {
      return;
    }

    // Validate time
    if (form.startTime >= form.endTime) {
      setFieldErrors((previous) => ({
        ...previous,
        endTime: "End time must be after start time.",
      }));

      return;
    }

    try {
      setSaving(true);

      let response;

      if (editingSlot) {
        response = await updateSlot(
          editingSlot._id,
          {
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime,
          }
        );
      } else {
        response = await createSlot({
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
        });
      }

      console.log(
        "SLOT POST/PUT RESPONSE:",
        response
      );

      if (!response.success) {
        showToast(
          response.message ||
          "Slot operation failed.",
          "error"
        );

        return;
      }

      showToast(
        editingSlot
          ? "Slot updated successfully!"
          : "Slot created successfully!",
        "success"
      );

      setShowModal(false);
      setEditingSlot(null);

      setForm({
        date: "",
        startTime: "",
        endTime: "",
      });

      setFieldErrors({
        date: "",
        startTime: "",
        endTime: "",
      });

      await fetchSlots();

    } catch (err: any) {
      console.error(
        "SLOT SAVE ERROR:",
        err
      );

      showToast(
        err?.response?.data?.message ||
        "Unable to save slot.",
        "error"
      );

    } finally {
      setSaving(false);
    }
  };

  
  // DELETE SLOT
  

  const handleDelete = async () => {

    if (!selectedSlot) {
      return;
    }

    try {

      setDeleting(true);

      setError("");

      const response =
        await deleteSlot(
          selectedSlot._id
        );

      console.log(
        "SLOT DELETE RESPONSE:",
        response
      );

      if (!response.success) {

        setError(
          response.message ||
          "Failed to delete slot."
        );

        return;
      }

      setMessage(
        response.message ||
        "Slot deleted successfully."
      );

      setSelectedSlot(null);

      // If deleting last item
      // on current page
      if (
        slot.length === 1 &&
        page > 1
      ) {

        setPage(
          (previous) =>
            previous - 1
        );

      } else {

        await fetchSlots();

      }

    } catch (err: any) {

      console.error(
        "DELETE SLOT ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Unable to delete slot."
      );

    } finally {

      setDeleting(false);

    }
  };


  
  // STATUS CLASS
  

  const getStatusClass = (
    status: string
  ) => {

    if (status === "Booked") {

      return "bg-blue-100 text-blue-700";

    }

    if (status === "Blocked") {

      return "bg-red-100 text-red-700";

    }

    return "bg-green-100 text-green-700";
  };


  return (
    <div className="space-y-8">

      {/* 
          HEADER
       */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Appointment Slots
          </h1>

          <p className="mt-2 text-slate-500">
            Create, update and manage appointment slots.
          </p>

        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >

          <Plus size={18} />

          Add Slot

        </button>

      </div>


      {/* 
          SUCCESS
       */}

      {message && (

        <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">

          {message}

        </div>

      )}


      {/* 
          ERROR
       */}

      {error && (

        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">

          {error}

        </div>

      )}


      {/* 
          TABLE
       */}

      <div className="overflow-hidden rounded-2xl bg-white shadow">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">
                S.No
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Start Time
              </th>

              <th className="p-4 text-left">
                End Time
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-center">
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan={6}
                  className="p-12 text-center"
                >

                  <Loader2
                    size={30}
                    className="mx-auto animate-spin text-blue-600"
                  />

                  <p className="mt-3 text-slate-500">
                    Loading slots...
                  </p>

                </td>

              </tr>

            ) : slot.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="p-12 text-center text-slate-500"
                >

                  No appointment slots found.

                </td>

              </tr>

            ) : (

              slot.map(
                (slot, index) => (

                  <tr
                    key={slot._id}
                    className="border-t transition hover:bg-slate-50"
                  >

                    <td className="p-4">
                      {(page - 1) *
                        limit +
                        index +
                        1}
                    </td>

                    <td className="p-4 font-medium">
                      {slot.date}
                    </td>

                    <td className="p-4">
                      {slot.startTime}
                    </td>

                    <td className="p-4">
                      {slot.endTime}
                    </td>

                    <td className="p-4">

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(
                          slot.status
                        )}`}
                      >

                        {slot.status}

                      </span>

                    </td>

                    <td className="p-4">

                      <div className="flex justify-center gap-2">

                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(slot)
                          }
                          className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                        >

                          <Pencil size={17} />

                        </button>


                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedSlot(slot)
                          }
                          className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-600 hover:text-white"
                        >

                          <Trash2 size={17} />

                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>


      {/* 
          PAGINATION
       */}

      <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow">

        <p className="text-sm text-slate-500">

          Showing page{" "}

          <span className="font-semibold text-slate-900">
            {pagination.page}
          </span>

          {" "}of{" "}

          <span className="font-semibold text-slate-900">
            {pagination.totalPages}
          </span>

          {" "}•{" "}

          {pagination.total} slots

        </p>


        <div className="flex items-center gap-2">

          <button
            type="button"
            disabled={page <= 1}
            onClick={() =>
              setPage(
                (previous) =>
                  previous - 1
              )
            }
            className="rounded-lg border p-2 disabled:cursor-not-allowed disabled:opacity-40"
          >

            <ChevronLeft size={18} />

          </button>


          <span className="min-w-10 text-center font-medium">
            {page}
          </span>


          <button
            type="button"
            disabled={
              page >=
              pagination.totalPages
            }
            onClick={() =>
              setPage(
                (previous) =>
                  previous + 1
              )
            }
            className="rounded-lg border p-2 disabled:cursor-not-allowed disabled:opacity-40"
          >

            <ChevronRight size={18} />

          </button>

        </div>

      </div>


      {/* 
          CREATE / EDIT MODAL
       */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-slate-900">

                  {editingSlot
                    ? "Edit Appointment Slot"
                    : "Create Appointment Slot"}

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  {editingSlot
                    ? "Update this appointment slot."
                    : "Create a new appointment slot."}

                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="rounded-lg p-2 hover:bg-slate-100"
              >

                <X size={20} />

              </button>

            </div>


            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* DATE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className={`w-full rounded-xl border p-3 outline-none transition focus:ring-2 ${fieldErrors.date
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                />

                {fieldErrors.date && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {fieldErrors.date}
                  </p>
                )}
              </div>


              {/* START TIME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Start Time
                </label>

                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className={`w-full rounded-xl border p-3 outline-none transition focus:ring-2 ${fieldErrors.startTime
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                />

                {fieldErrors.startTime && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {fieldErrors.startTime}
                  </p>
                )}
              </div>


              {/* END TIME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  End Time
                </label>

                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  className={`w-full rounded-xl border p-3 outline-none transition focus:ring-2 ${fieldErrors.endTime
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                />

                {fieldErrors.endTime && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {fieldErrors.endTime}
                  </p>
                )}
              </div>


              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving && (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                )}

                {saving
                  ? "Saving..."
                  : editingSlot
                    ? "Update Slot"
                    : "Create Slot"}

              </button>

            </form>

          </div>

        </div>

      )}


      {/* 
          DELETE MODAL
       */}

      {selectedSlot && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

            <h2 className="text-xl font-bold text-slate-900">
              Delete Slot?
            </h2>

            <p className="mt-3 text-slate-500">
              Are you sure you want to delete this slot?
            </p>


            <div className="mt-5 rounded-xl bg-slate-50 p-4">

              <p className="font-semibold">
                {selectedSlot.date}
              </p>

              <p className="mt-1 text-slate-500">

                {selectedSlot.startTime}
                {" - "}
                {selectedSlot.endTime}

              </p>

            </div>


            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  setSelectedSlot(null)
                }
                className="rounded-xl border px-5 py-3 font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >

                {deleting && (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                )}

                {deleting
                  ? "Deleting..."
                  : "Delete"}

              </button>

            </div>

          </div>

        </div>

      )}
    </div>
  );
}