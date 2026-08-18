import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex">

      {/* Sidebar */}

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

    </div>
  );
}