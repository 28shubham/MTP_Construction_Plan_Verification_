import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const getBuildingRules = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/building-rules`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getBuildingRulesByCity = async (cityName) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${API_URL}/building-rules/city/${cityName}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getCitiesAndPincodes = async () => {
  const response = await axios.get(`${API_URL}/building-rules/cities-pincodes`);
  return response.data;
};
