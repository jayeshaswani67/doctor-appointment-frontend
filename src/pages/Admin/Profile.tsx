import {
  Card,
  Avatar,
  Typography,
  Row,
  Col,
  Descriptions,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  message,
  Upload,
} from "antd";

import {
  UserOutlined,
  EditOutlined,
  UploadOutlined,
  CameraOutlined,
} from "@ant-design/icons";

import { useEffect, useState } from "react";

import {
  getProfile,
  updateProfile,
  uploadDoctorImage,
} from "../../api/profileApi.ts";

const { Title, Text } = Typography;

interface Doctor {
  _id?: string;

  name: string;

  specialization: string;

  email?: string;

  mobile?: string;

  experience?: string;

  qualification?: string;

  clinic?: string;

  address?: string;

  workingTime?: string;

  image?: {
    url?: string;

    altText?: string;
  };
}

export default function Profile() {
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [imageLoading, setImageLoading] =
    useState(false);

  const [imagePreview, setImagePreview] =
    useState<string>("");

  const [doctor, setDoctor] =
    useState<Doctor>({
      name: "Dr. Rajpurohit",
      specialization: "General Physician",
      email: "doctor@gmail.com",
      mobile: "9876543210",
      experience: "10 Years",
      qualification: "MBBS, MD",
      clinic: "City Care Clinic",
      address: "Ahmedabad, Gujarat",
      workingTime:
        "Monday - Saturday | 9:00 AM - 6:00 PM",
      image: {
        url: "",
        altText: "Doctor",
      },
    });

  const [form] = Form.useForm();

//  api 

  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

// get profile

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await getProfile();

      console.log(
        "PROFILE RESPONSE:",
        res.data
      );

      let data = res.data;

      // Handle:
      // { data: {...} }

      if (data?.data) {
        data = data.data;
      }



      if (data?.data) {
        data = data.data;
      }

      setDoctor(data);

    } catch (error: any) {
      console.error(
        "GET PROFILE ERROR:",
        error
      );

      message.error(
        error.response?.data?.message ||
        "Failed to load profile"
      );

    } finally {
      setLoading(false);
    }
  };

// load profile 

  useEffect(() => {
    fetchProfile();
  }, []);

//  get the image url

  const getImageUrl = (
    imageUrl?: string
  ) => {
    if (!imageUrl) {
      return "";
    }

    // Cloudinary / external URL

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    // Local backend image

    return `${API_BASE_URL}${imageUrl}`;
  };

  
  // IMAGE UPLOAD
  

  const handleImageUpload = async (
    file: File
  ) => {

    
    // Validate file type
    

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      message.error(
        "Only JPG, PNG and WEBP images are allowed."
      );

      return false;
    }

    
    // Validate file size
    

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      message.error(
        "Image must be smaller than 5 MB."
      );

      return false;
    }

    
    // Show preview immediately
    

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);

    try {
      setImageLoading(true);

      console.log(
        "Uploading image:",
        file.name
      );

      
      // POST IMAGE
      

      const response =
        await uploadDoctorImage(file);

      console.log(
        "IMAGE UPLOAD RESPONSE:",
        response.data
      );

      message.success(
        "Doctor image updated successfully!"
      );

      
      // IMPORTANT
      // Get latest profile from backend
      

      await fetchProfile();

      
      // Clear temporary preview
      

      setImagePreview("");

    } catch (error: any) {

      console.error(
        "IMAGE UPLOAD ERROR:",
        error
      );

      console.error(
        "BACKEND ERROR:",
        error?.response?.data
      );

      message.error(
        error?.response?.data?.message ||
        "Failed to upload doctor image."
      );

      // Remove preview if upload failed

      setImagePreview("");

    } finally {
      setImageLoading(false);
    }

    return false;
  };

  
  // UPDATE PROFILE
  

  const handleUpdate = async (
    values: any
  ) => {
    try {
      setLoading(true);

      const res =
        await updateProfile(values);

      console.log(
        "UPDATE PROFILE:",
        res.data
      );

      let data = res.data;

      if (data?.data) {
        data = data.data;
      }

      if (data?.data) {
        data = data.data;
      }

      setDoctor(data);

      message.success(
        "Profile Updated Successfully"
      );

      setIsModalOpen(false);

    } catch (error: any) {

      console.error(
        "UPDATE PROFILE ERROR:",
        error
      );

      message.error(
        error.response?.data?.message ||
        "Failed to update profile"
      );

    } finally {
      setLoading(false);
    }
  };

  
  // CURRENT IMAGE
  

  const currentImage =
    getImageUrl(
      doctor.image?.url
    );

  
  // FINAL IMAGE
  

  const displayedImage =
    imagePreview ||
    currentImage;

  return (
    <div
      style={{
        padding: 24,
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >

      <Title level={2}>
        Doctor Profile
      </Title>

      <Text type="secondary">
        Manage your personal information and
        doctor image.
      </Text>

      <Row
        gutter={24}
        style={{
          marginTop: 25,
        }}
      >

        {/* ================================= */}
        {/* LEFT CARD */}
        {/* ================================= */}

        <Col xs={24} lg={8}>

          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              textAlign: "center",
            }}
          >

            {/* DOCTOR IMAGE */}

            {displayedImage ? (
              <Avatar
                size={150}
                src={displayedImage}
              />
            ) : (
              <Avatar
                size={150}
                icon={<UserOutlined />}
              />
            )}

            <Title
              level={3}
              style={{
                marginTop: 20,
              }}
            >
              {doctor.name}
            </Title>

            <Tag color="blue">
              {doctor.specialization}
            </Tag>

            {/* ================================= */}
            {/* UPLOAD IMAGE */}
            {/* ================================= */}

            <div
              style={{
                marginTop: 25,
              }}
            >

              <Upload
                accept="image/jpeg,image/png,image/webp"
                showUploadList={false}
                beforeUpload={
                  handleImageUpload
                }
              >

                <Button
                  icon={
                    <CameraOutlined />
                  }
                  loading={
                    imageLoading
                  }
                >
                  {imageLoading
                    ? "Uploading..."
                    : "Change Doctor Image"}
                </Button>

              </Upload>

              <Text
                type="secondary"
                style={{
                  display: "block",
                  marginTop: 8,
                  fontSize: 12,
                }}
              >
                JPG, PNG or WEBP · Max 5 MB
              </Text>

            </div>

            <br />

            {/* EDIT PROFILE */}

            <Button
              type="primary"
              icon={
                <EditOutlined />
              }
              loading={loading}
              style={{
                marginTop: 15,
              }}
              onClick={() => {

                form.setFieldsValue(
                  doctor
                );

                setIsModalOpen(true);
              }}
            >
              Edit Profile
            </Button>

          </Card>

        </Col>

        {/* ================================= */}
        {/* RIGHT CARD */}
        {/* ================================= */}

        <Col xs={24} lg={16}>

          <Card
            title="Personal Information"
            bordered={false}
            style={{
              borderRadius: 16,
            }}
          >

            <Descriptions
              bordered
              column={1}
            >

              <Descriptions.Item
                label="Doctor Name"
              >
                {doctor.name}
              </Descriptions.Item>

              <Descriptions.Item
                label="Email"
              >
                {doctor.email}
              </Descriptions.Item>

              <Descriptions.Item
                label="Mobile"
              >
                {doctor.mobile}
              </Descriptions.Item>

              <Descriptions.Item
                label="Qualification"
              >
                {doctor.qualification}
              </Descriptions.Item>

              <Descriptions.Item
                label="Specialization"
              >
                {doctor.specialization}
              </Descriptions.Item>

              <Descriptions.Item
                label="Experience"
              >
                {doctor.experience}
              </Descriptions.Item>

              <Descriptions.Item
                label="Clinic"
              >
                {doctor.clinic}
              </Descriptions.Item>

              <Descriptions.Item
                label="Address"
              >
                {doctor.address}
              </Descriptions.Item>

              <Descriptions.Item
                label="Working Time"
              >
                {doctor.workingTime}
              </Descriptions.Item>

            </Descriptions>

          </Card>

        </Col>

      </Row>

      {/* ===================================== */}
      {/* EDIT PROFILE MODAL */}
      {/* ===================================== */}

      <Modal
        title="Edit Doctor Profile"
        open={isModalOpen}
        onCancel={() =>
          setIsModalOpen(false)
        }
        onOk={() =>
          form.submit()
        }
        okText="Save Changes"
        confirmLoading={loading}
      >

        <Form
          form={form}
          layout="vertical"
          onFinish={
            handleUpdate
          }
        >

          <Form.Item
            label="Doctor Name"
            name="name"
            rules={[
              {
                required: true,
                message:
                  "Enter doctor name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Specialization"
            name="specialization"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mobile"
            name="mobile"
          >
            <Input maxLength={10} />
          </Form.Item>

          <Form.Item
            label="Qualification"
            name="qualification"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Experience"
            name="experience"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Clinic"
            name="clinic"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Working Time"
            name="workingTime"
          >
            <Input
              placeholder="Monday - Saturday | 9 AM - 6 PM"
            />
          </Form.Item>

        </Form>

      </Modal>

    </div>
  );
}