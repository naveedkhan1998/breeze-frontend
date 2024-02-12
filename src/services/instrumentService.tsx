import { baseApi } from "./baseApi";

export const instrumentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscribedInstruments: builder.query({
      query: () => {
        return {
          url: "core/subscribed_instruments/",
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    getCandles: builder.query({
      query: ({id}) => {
        return {
          url: `core/get_candles/?id=${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
  }),
});

export const { useGetSubscribedInstrumentsQuery, useGetCandlesQuery } =
  instrumentApi;
