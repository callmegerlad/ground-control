import { http } from "./http";

export async function fetchCafes(location) {
  const params = location ? { location } : {};
  const { data } = await http.get("/cafes", { params });
  return data;
}

export async function deleteCafe(cafeId) {
  await http.delete(`/cafes/${cafeId}`);
}

export async function createCafe(payload) {
  const { data } = await http.post('/cafes', payload)
  return data
}

export async function updateCafe(cafeId, payload) {
  const { data } = await http.put(`/cafes/${cafeId}`, payload)
  return data
}
