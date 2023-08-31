import axios from "axios";

const API_BASE_URL = process.env.REACT_NATIVE_API_BASE_URL; // Make sure to define this in your environment variables

export const getUserProfile = async (userId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
