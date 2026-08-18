import {
  CalendarDays,
  Users,
  Clock3,
} from "lucide-react";

import {
  Card,
  Row,
  Col,
  Table,
  Avatar,
  Typography,
  Tag,
  Space,
  Spin,
  message,
} from "antd";

import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  updateAppointmentStatus,
} from "../../api/appointment.Api";


const { Title, Text } = Typography;


// TYPES
interface Appointment {
  id: string;
  patientName: string;
  mobileNumber: string;
  appointmentDate: string;
  time: string;
  status: AppointmentStatus;
}

interface DashboardData {
  totalAppointments: number;
  totalPatients: number;
  pendingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  appointments: Appointment[];
}


// COMPONENT


export default function Dashboard() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);


  // GET DASHBOARD API


  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response =
        await API.get("/dashboard");

      console.log(
        "DASHBOARD API RESPONSE:",
        response.data
      );

      let data = response.data;

      // Handle:
      // { success: true, data: {...} }

      if (data?.data) {
        data = data.data;
      }

      setDashboard(data);

    } catch (error: any) {
      console.error(
        "Dashboard API Error:",
        error
      );

      console.error(
        "Backend Response:",
        error?.response?.data
      );

      message.error(
        error?.response?.data?.message ||
        "Failed to load dashboard"
      );

    } finally {
      setLoading(false);
    }
  };


  // LOADING


  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }


  // SAFE DATA


  const stats = [
    {
      title: "Total Appointments",
      value: dashboard?.totalAppointments ?? 0,
      icon: <CalendarDays size={24} />,
      color: "#1677ff",
    },

    {
      title: "Total Patients",
      value: dashboard?.totalPatients ?? 0,
      icon: <Users size={24} />,
      color: "#52c41a",
    },

    {
      title: "Booked",
      value: dashboard?.pendingAppointments ?? 0,
      icon: <Clock3 size={24} />,
      color: "#faad14",
    },

    {
      title: "Completed",
      value: dashboard?.completedAppointments ?? 0,
      icon: <CalendarDays size={24} />,
      color: "#16a34a",
    },

    {
      title: "Cancelled",
      value: dashboard?.cancelledAppointments ?? 0,
      icon: <CalendarDays size={24} />,
      color: "#dc2626",
    },
  ];


  // TABLE DATA


  const appointments =
    (dashboard?.appointments || []).map(
      (appointment) => ({
        key: appointment.id,

        id: appointment.id,

        time: appointment.time,

        patient:
          appointment.patientName,

        mobile:
          appointment.mobileNumber,

        date:
          appointment.appointmentDate,

        status:
          appointment.status,
      })
    );

  // TABLE COLUMNS


  const columns = [
    {
      title: "Time",
      dataIndex: "time",
      width: 150,
    },

    {
      title: "Patient Name",
      dataIndex: "patient",
    },

    {
      title: "Mobile",
      dataIndex: "mobile",
    },

    {
      title: "Date",
      dataIndex: "date",
    },

    {
      title: "Status",
      dataIndex: "status",

      render: (
        status: AppointmentStatus,
        record: {
          key: string;
          status: AppointmentStatus;
        }
      ) => (
        <select
          value={status}
          onChange={(e) =>
            handleStatusChange(
              record.key,
              e.target.value as AppointmentStatus
            )
          }
          className={`rounded-full border px-3 py-1.5 text-sm font-medium outline-none ${status === "Completed"
            ? "border-green-200 bg-green-100 text-green-700"
            : status === "Cancelled"
              ? "border-red-200 bg-red-100 text-red-700"
              : status === "Booked"
                ? "border-blue-200 bg-blue-100 text-blue-700"
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
      ),
    },
  ];
  const handleStatusChange = async (
    id: string,
    status: "Booked" | "Completed" | "Cancelled"
  ) => {
    try {
      const response = await updateAppointmentStatus(
        id,
        status
      );

      console.log(
        "STATUS UPDATE RESPONSE:",
        response
      );

      if (!response.success) {
        message.error(
          response.message ||
          "Failed to update appointment status"
        );

        return;
      }

      message.success(
        "Appointment status updated successfully"
      );

      // Refresh dashboard data
      await fetchDashboard();

    } catch (error: any) {
      console.error(
        "STATUS UPDATE ERROR:",
        error
      );

      message.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update appointment status"
      );
    }
  };


  // UI


  return (
    <div
      style={{
        padding: 24,
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >


      {/* HEADER */}


      <div
        style={{
          marginBottom: 32,
        }}
      >
        <Title
          level={2}
          style={{
            marginBottom: 4,
          }}
        >
          Good Morning, Doctor
        </Title>

        <Text type="secondary">
          Welcome back. Here's today's clinic
          overview.
        </Text>
      </div>

      {/* STATISTICS */}
      <Row gutter={[24, 24]}>

        {stats.map((item) => (

          <Col
            xs={24}
            sm={12}
            lg={8}
            key={item.title}
          >

            <Card
              hoverable
              bordered={false}
              style={{
                borderRadius: 14,
              }}
            >

              <Space
                style={{
                  width: "100%",
                  justifyContent:
                    "space-between",
                }}
              >

                <div>

                  <Text type="secondary">
                    {item.title}
                  </Text>

                  <Title
                    level={2}
                    style={{
                      marginTop: 10,
                    }}
                  >
                    {item.value}
                  </Title>

                </div>

                <Avatar
                  size={58}
                  style={{
                    background:
                      item.color,
                  }}
                  icon={item.icon}
                />

              </Space>

            </Card>

          </Col>

        ))}

      </Row>



      {/* APPOINTMENT TABLE */}


      <Card
        title="Total Appointments"
        style={{
          marginTop: 35,
          borderRadius: 14,
        }}
        bordered={false}
      >

        <Table
          columns={columns}
          dataSource={appointments}
          pagination={false}
          size="middle"
          locale={{
            emptyText:
              "No appointments found",
          }}
        />

      </Card>

    </div>
  );
}