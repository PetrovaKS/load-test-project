import axios from "axios";

const API_BASE_URL = "/api";

export const loadTestApi = {
  async getAllItems(signal?: AbortSignal): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/items`, {
      signal,
    });
    return response.data;
  },

  async getItemsPage(
    limit: number,
    offset: number,
    signal?: AbortSignal
  ): Promise<any> {
    const response = await axios.get(
      `${API_BASE_URL}/items?limit=${limit}&offset=${offset}`,
      {
        signal,
      }
    );
    return response.data;
  },

  async getCachedAllItems(signal?: AbortSignal): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/items/cached`, {
      signal,
    });
    return await response.json();
  },

  async getCachedItemsPage(
    limit: number,
    offset: number,
    signal?: AbortSignal
  ): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/items/cached?limit=${limit}&offset=${offset}`,
      {
        signal,
      }
    );
    return await response.json();
  },
};
