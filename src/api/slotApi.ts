import API from "./axios";

export interface Slot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "Available" | "Booked" | "Blocked";
  createdAt?: string;
  updatedAt?: string;
}

export interface SlotPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetSlotResponse {
  success: boolean;
  message: string;
  data: Slot[];
  pagination: SlotPagination;
}


// GET SLOTS


export const getSlot = async (
  page: number = 1,
  limit: number = 10
): Promise<GetSlotResponse> => {

  const response = await API.get("/slot", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};


// GET SINGLE SLOT


export const getSlotById = async (
  id: string
) => {

  const response =
    await API.get(`/slot/${id}`);

  return response.data;
};


// CREATE SLOT


export const createSlot = async (data: {
  date: string;
  startTime: string;
  endTime: string;
}) => {

  const response =
    await API.post("/slot", data);

  return response.data;
};


// UPDATE SLOT


export const updateSlot = async (
  id: string,
  data: {
    date?: string;
    startTime?: string;
    endTime?: string;
    status?: string;
  }
) => {

  const response =
    await API.put(
      `/slot/${id}`,
      data
    );

  return response.data;
};


// DELETE SLOT


export const deleteSlot = async (
  id: string
) => {

  const response =
    await API.delete(
      `/slot/${id}`
    );

  return response.data;
};