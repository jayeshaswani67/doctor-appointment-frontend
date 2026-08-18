import { Layout, Typography, Button, Space } from "antd";
import {
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove login session
    localStorage.removeItem("token");
    localStorage.removeItem("doctor");


    // Redirect to login page
    navigate("/login");
  };

  return (
    <AntHeader
      style={{
        background: "#fff",
        height: 80,
        padding: "0 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      {/* Left */}

      <div>
        <Title
          level={3}
          style={{ margin: 0 }}
        >
          Doctor Dashboard
        </Title>

        <Text type="secondary">
          Welcome Back, Doctor
        </Text>
      </div>

      {/* Right */}

      <Space size="middle">

        <Button
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Space>
    </AntHeader>
  );
}