import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const baseUrl = isLocalhost
  ? "http://localhost:5000"
  : "https://dtemplarsarsh.pythonanywhere.com";

const baseQuery = fetchBaseQuery({
  baseUrl,
  //credentials: "include",
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  endpoints: (builder) => ({
    healthCheck: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }),
    }),
  }),
});

export const { useHealthCheckQuery } = baseApi;
