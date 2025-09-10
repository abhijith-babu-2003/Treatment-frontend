import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../api/authapi.js";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem("user", JSON.stringify(response));
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed";
      const fieldErrors = error.response?.data?.errors || {};

      return rejectWithValue({
        message: errorMessage,
        fieldErrors: fieldErrors,
        status: error.response?.status,
      });
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await authApi.register({ name, email, password });
      localStorage.setItem("user", JSON.stringify(response));
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed";

      const fieldErrors = error.response?.data?.errors || {};

      return rejectWithValue({
        message: errorMessage,
        fieldErrors: fieldErrors,
        status: error.response?.status,
      });
    }
  }
);

const getUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    localStorage.removeItem("user");
    return null;
  }
};

const initialState = {
  user: getUserFromLocalStorage(),
  status: "idle",
  error: null,
  fieldErrors: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("user");
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.fieldErrors = {};
    },
    clearError: (state) => {
      state.error = null;
      state.fieldErrors = {};
    },
    clearFieldError: (state, action) => {
      if (state.fieldErrors[action.payload]) {
        delete state.fieldErrors[action.payload];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || action.payload;
        state.fieldErrors = action.payload?.fieldErrors || {};
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || action.payload;
        state.fieldErrors = action.payload?.fieldErrors || {};
      });
  },
});

export const { logout, clearError, clearFieldError } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectFieldErrors = (state) => state.auth.fieldErrors;

export default authSlice.reducer;
