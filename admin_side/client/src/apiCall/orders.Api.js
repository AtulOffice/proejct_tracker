import apiClient from "../api/axiosClient";

export const fetchOrdersAll = async ({ search = "" }) => {
    try {
        const res = await apiClient.get(`/order/getAll`, {
            params: { search },
        });
        return res.data;
    } catch (err) {
        console.error("Failed to fetch orders:", err);
        throw err;
    }
};

export const fetchOrdersAllNew = async () => {
    try {
        const res = await apiClient.get(`/order/getAllnew`);
        return res.data;
    } catch (err) {
        console.error("Failed to fetch orders:", err);
        throw err;
    }
};

export const fetchOrderById = async (id) => {
    try {
        const response = await apiClient.get(`/order/fetchbyid/${id}`);
        return response.data?.data;
    } catch (e) {
        console.error("Failed to fetch order:", e);
        throw e;
    }
};
