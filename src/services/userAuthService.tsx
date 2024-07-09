import { baseApi } from "./baseApi";

export const userAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/account/login/",
        method: "POST",
        body: { ...credentials },
        credentials: "omit",
      }),
    }),
    registerUser: builder.mutation({
      query: (user) => {
        return {
          url: "/account/register/",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
          credentials: "omit",
        };
      },
    }),
    getLoggedUser: builder.query({
      query: (access_token) => {
        return {
          url: "/account/me",
          method: "GET",
          headers: {
            "x-account-token": `${access_token}`,
          },
        };
      },
    }),
    googleLogin: builder.query({
      query: () => {
        return {
          url: "/account/google",
          method: "GET",
        };
      },
    }),
    sendEmail: builder.query({
      query: ({ access_token }) => {
        return {
          url: "/account/invoke_verify_email",
          method: "GET",
          headers: {
            "x-account-token": `${access_token}`,
          },
        };
      },
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useGetLoggedUserQuery, useGoogleLoginQuery, useLazySendEmailQuery } = userAuthApi;
