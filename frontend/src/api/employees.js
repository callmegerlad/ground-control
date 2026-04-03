import { http } from "./http";

export async function fetchEmployees(cafeId) {
  const params = cafeId ? { cafe_id: cafeId } : {};
  const { data } = await http.get("/employees", { params });
  return data;
}

export async function deleteEmployee(employeeId) {
  await http.delete(`/employees/${employeeId}`);
}

export async function createEmployee(payload) {
  const { data } = await http.post('/employees', payload)
  return data
}

export async function updateEmployee(employeeId, payload) {
  const { data } = await http.put(`/employees/${employeeId}`, payload)
  return data
}
