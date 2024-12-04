import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Tạo async thunk cho đăng nhập
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/api/employees/login",
        credentials
      );
      return response.data; // Dữ liệu trả về từ API bao gồm thông tin user và token
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message // Trả về thông báo lỗi từ API
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        // Log response to verify structure
        console.log("Login Response:", action.payload);

        state.user = action.payload.user; // Lưu thông tin user nếu đăng nhập thành công
        state.token = action.payload.token; // Lưu token
        localStorage.setItem("token", action.payload.token); // Store token in localStorage for session persistence
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload || action.error.message; // Lưu thông báo lỗi nếu đăng nhập thất bại
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
