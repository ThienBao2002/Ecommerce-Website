import { createAsyncThunk } from "@reduxjs/toolkit";
//Include Both Helper File with needed methods
import {
  getAllRevenueData as getAllRevenueDataApi,
  getMonthRevenueData as getMonthRevenueDataApi,
  getHalfYearRevenueData as getHalfYearRevenueDataApi,
  getYearRevenueData as getYearRevenueDataApi
} from "../../helpers/fakebackend_helper";

export const getRevenueChartsData = createAsyncThunk("dashboardEcommerce/getRevenueChartsData", async (data) => {
  try {
    var response;
    if (data.typeGet === "all") {
      response = getAllRevenueDataApi(data);
    }
    if (data.typeGet === "month") {
      response = getMonthRevenueDataApi(data);
    }
    if (data.typeGet === "halfyear") {
      response = getHalfYearRevenueDataApi(data);
    }
    if (data.typeGet === "year") {
      response = getYearRevenueDataApi(data);
    }
    return response;
  } catch (error) {
    return error;
  }
});