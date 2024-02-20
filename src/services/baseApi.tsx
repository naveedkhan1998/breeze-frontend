import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  //baseUrl: "https://bookstore-backend-ahmed-begreatorco.vercel.app",
  baseUrl: "http://localhost:5000",
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
