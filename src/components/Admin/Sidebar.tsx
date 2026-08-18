import {
  LayoutDashboard,
  CalendarDays,
  Users,
  MessageSquare,
  UserCircle,
  Stethoscope,
  Clock3,
   Settings
} from "lucide-react";
import { NavLink } from "react-router-dom";


const menus = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Appointments",
    path: "/admin/appointment",
    icon: CalendarDays,
  },
  {
    name: "Patients",
    path: "/admin/patients",
    icon: Users,
  },
  {
    name: "Contact",
    path: "/admin/contact",
    icon: MessageSquare,
  },
  {
    name: "Slots",
    path: "/admin/slots",
    icon: Clock3,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white">

      {/* Logo */}
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
            <Stethoscope className="text-white" />
          </div>

          <div>
            <h2 className="text-lg font-bold">
              Doctor Panel
            </h2>
            <p className="text-sm text-slate-500">
              Clinic Dashboard
            </p>
          </div>

        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 p-4">

        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin/dashboard"}
              className={({ isActive }) =>
                `mb-2 flex items-center gap-4 rounded-xl px-4 py-4 font-medium transition-all ${isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

      </div>

      {/* Doctor Profile */}
      <div className="border-t border-slate-200 p-4">

        <NavLink
          to="/admin/profile"
          className="flex items-center gap-3 rounded-2xl bg-slate-100 p-4 transition hover:bg-slate-200"
        >
          <UserCircle
            size={48}
            className="text-blue-600"
          />

          <div>
            <h4 className="font-semibold">
              Dr. Rajpurohit
            </h4>

            <p className="text-sm text-slate-500">
              General Physician
            </p>
          </div>

        </NavLink>



      </div>

    </aside>
  );
}