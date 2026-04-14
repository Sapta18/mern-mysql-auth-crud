import API from "./axios";

export const getItems = () => API.get("/items");
export const getStats = () => API.get("/items/stats");
export const createItem = (data) => API.post("/items", data);
export const updateItem = (id, data) => API.put(`/items/${id}`, data);
export const deleteItem = (id) => API.delete(`/items/${id}`);