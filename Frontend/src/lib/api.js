const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const markNotificationAsRead = async (id) => {
  return apiRequest(`/notifications/${id}/read`, {
    method: "PATCH",
  });
};
