import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import {
  getContacts,
  type Contact as ContactType,
} from "../../api/contactApi";

export default function Contact() {
  const [messages, setMessages] = useState<ContactType[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContactType | null>(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Fetch contacts with pagination
  const fetchContacts = async () => {
    try {
      setLoading(true);
      
      console.log(`Fetching contacts - Page: ${page}, Limit: ${limit}`);
      
      const response = await getContacts(page, limit);
      
      console.log("Full API Response:", response);
      
      // Handle different response structures
      if (response && response.success) {
        let contacts = [];
        let paginationData = null;
        
        // Case 1: response.data is an array
        if (Array.isArray(response.data)) {
          contacts = response.data;
          paginationData = response.pagination;
        }
        // Case 2: response.data has nested contacts/items
        else if (response.data && typeof response.data === 'object') {
          if (Array.isArray(response.data.contacts)) {
            contacts = response.data.contacts;
            paginationData = response.data.pagination || response.pagination;
          } else if (Array.isArray(response.data.items)) {
            contacts = response.data.items;
            paginationData = response.data.pagination || response.pagination;
          } else if (Array.isArray(response.data.results)) {
            contacts = response.data.results;
            paginationData = response.data.pagination || response.pagination;
          } else if (Array.isArray(response.data.data)) {
            contacts = response.data.data;
            paginationData = response.data.pagination || response.pagination;
          }
        }
        // Case 3: response itself has contacts array
        else if (Array.isArray(response.contacts)) {
          contacts = response.contacts;
          paginationData = response.pagination;
        }
        // Case 4: response itself has data array
        else if (Array.isArray(response.data)) {
          contacts = response.data;
          paginationData = response.pagination;
        }
        
        console.log("Extracted Contacts:", contacts);
        console.log("Pagination Data:", paginationData);
        
        // Set messages
        if (contacts && contacts.length > 0) {
          setMessages(contacts);
        } else {
          setMessages([]);
          showToast("No contacts found");
        }
        
        // Update pagination
        if (paginationData) {
          setPagination({
            page: paginationData.page || page,
            limit: paginationData.limit || limit,
            total: paginationData.total || 0,
            totalPages: paginationData.totalPages || Math.ceil((paginationData.total || 0) / limit),
          });
        } else {
          // If no pagination from API, calculate from contacts length
          setPagination(prev => ({
            ...prev,
            total: contacts.length,
            totalPages: Math.ceil(contacts.length / limit),
          }));
        }
        
      } else {
        // If response.success is false or missing
        console.warn("API returned unsuccessful response:", response);
        showToast(response?.message || "Failed to fetch contacts");
        setMessages([]);
      }
      
    } catch (error: any) {
      console.error("Fetch Contacts Error:", error);
      console.error("Error Details:", error.response?.data || error.message);
      
      // Show error toast
      showToast(
        error.response?.data?.message || 
        error.message || 
        "Unable to load contact messages"
      );
      
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch contacts when page changes
  useEffect(() => {
    fetchContacts();
  }, [page]);

  // Toast notification
  function showToast(message: string) {
    setToast(message);
    setTimeout(() => {
      setToast("");
    }, 3000);
  }

  // Filter messages based on search
  const filtered = messages.filter((item) => {
    const searchText = search.toLowerCase().trim();
    if (!searchText) return true;
    
    return (
      item.fullName?.toLowerCase().includes(searchText) ||
      item.mobileNumber?.toLowerCase().includes(searchText) ||
      item.email?.toLowerCase().includes(searchText) ||
      item.subject?.toLowerCase().includes(searchText)
    );
  });

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && !loading) {
      setPage(newPage);
      // Scroll to top of table when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculate displayed range
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, pagination.total);
  const totalItems = pagination.total || messages.length;

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed right-6 top-6 z-50 rounded-xl bg-green-600 px-6 py-4 text-white shadow-xl transition-all duration-300">
          {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <p className="mt-2 text-slate-500">
          Manage enquiries received from patients.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center rounded-xl border bg-white px-4 shadow-sm">
        <Search size={18} className="text-slate-400" />
        <input
          className="w-full p-4 outline-none"
          placeholder="Search by name, mobile, email, or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="p-2 text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-center">S.No</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Mobile</th>
                <th className="p-4 text-left">Subject</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <div className="flex items-center justify-center gap-3 text-slate-500">
                      <Loader2 size={20} className="animate-spin" />
                      Loading contact messages...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500">
                    {search ? "No contacts match your search." : "No contact messages found."}
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => (
                  <tr key={item._id || index} className="border-t hover:bg-slate-50">
                    <td className="p-4 text-center">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="p-4 font-medium">{item.fullName || "N/A"}</td>
                    <td className="p-4">{item.mobileNumber || "N/A"}</td>
                    <td className="p-4">{item.subject || "N/A"}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                          item.status === "Unread"
                            ? "bg-yellow-200 text-yellow-700"
                            : item.status === "Read"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status || "Unread"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => setSelected(item)}
                          className="rounded-lg bg-blue-100 p-2 text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
{!loading && messages.length > 0 && (
  <div className="flex flex-col gap-4 rounded-2xl bg-white px-6 py-4 shadow sm:flex-row sm:items-center sm:justify-between">
    <p className="text-sm text-slate-500">
      Showing {startIndex} to {endIndex} of {totalItems} messages
    </p>

    <div className="flex items-center gap-2">
      <button
        disabled={page === 1 || loading}
        onClick={() => handlePageChange(page - 1)}
        className="rounded-lg border p-2 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {(() => {
          const totalPages = pagination.totalPages || 1;
          const pages = [];
          const maxVisible = 5;
          
          let startPage = 1;
          let endPage = totalPages;
          
          if (totalPages <= maxVisible) {
            // Show all pages
            startPage = 1;
            endPage = totalPages;
          } else {
            // Calculate visible range
            const halfVisible = Math.floor(maxVisible / 2);
            if (page <= halfVisible + 1) {
              startPage = 1;
              endPage = maxVisible;
            } else if (page >= totalPages - halfVisible) {
              startPage = totalPages - maxVisible + 1;
              endPage = totalPages;
            } else {
              startPage = page - halfVisible;
              endPage = page + halfVisible;
            }
          }
          
          // Add first page if not included
          if (startPage > 1) {
            pages.push(
              <button
                key={1}
                onClick={() => handlePageChange(1)}
                className="min-w-[36px] rounded-lg px-3 py-1 text-sm transition-colors hover:bg-slate-100"
              >
                1
              </button>
            );
            if (startPage > 2) {
              pages.push(
                <span key="ellipsis1" className="px-2 text-slate-400">
                  …
                </span>
              );
            }
          }
          
          // Add visible pages
          for (let i = startPage; i <= endPage; i++) {
            pages.push(
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`min-w-[36px] rounded-lg px-3 py-1 text-sm transition-colors ${
                  page === i
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-100"
                }`}
              >
                {i}
              </button>
            );
          }
          
          // Add last page if not included
          if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
              pages.push(
                <span key="ellipsis2" className="px-2 text-slate-400">
                  …
                </span>
              );
            }
            pages.push(
              <button
                key={totalPages}
                onClick={() => handlePageChange(totalPages)}
                className="min-w-[36px] rounded-lg px-3 py-1 text-sm transition-colors hover:bg-slate-100"
              >
                {totalPages}
              </button>
            );
          }
          
          return pages;
        })()}
      </div>

      <button
        disabled={page >= pagination.totalPages || loading}
        onClick={() => handlePageChange(page + 1)}
        className="rounded-lg border p-2 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  </div>
)}

      {/* View Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Contact Details</h2>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 transition-colors hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Contact Information */}
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="font-semibold">{selected.fullName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Mobile</p>
                  <p className="font-semibold">{selected.mobileNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-semibold break-all">{selected.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Subject</p>
                  <p className="font-semibold">{selected.subject || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                      selected.status === "Unread"
                        ? "bg-yellow-200 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {selected.status || "Unread"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Date</p>
                  <p className="font-semibold">
                    {selected.createdAt
                      ? new Date(selected.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-slate-500">Message</p>
                <div className="max-h-60 overflow-y-auto rounded-xl bg-slate-100 p-5 leading-7">
                  {selected.message || "No message provided"}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setSelected(null)}
                className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
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