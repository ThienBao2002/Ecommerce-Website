import { createSlice } from "@reduxjs/toolkit";
import {
  getNotifications,
  updateNotification,
  getProducts,
  getProductById,
  addNewProduct,
  updateProduct,
  deleteProducts,
  getReviewsByProductId,
  addNewReview,
  addNewReplyReviewByReviewId,
  getOrders,
  getOrderById,
  addNewOrder,
  updateOrder,
  deleteOrder,
  getCustomers,
  addNewCustomer,
  updateCustomer,
  deleteCustomer,
  getSellers,
  getCategories,
  addNewCategory,
  updateCategory,
  deleteCategory,
  getBrands,
  addNewBrand,
  updateBrand,
  deleteBrand,

  getPromotions,
  addNewPromotion,
  updatePromotion,
  deletePromotion,

  getRanks,
  addNewRank,
  updateRank,
  deleteRank,

  getVouchers,
  addNewVoucher,
  updateVoucher,
  deleteVoucher,

} from "./thunk";
export const initialState = {
  products: [],
  productDetails: [],
  orders: [],
  orderDetails: [],
  sellers: [],
  customers: [],
  categories: [],
  brands: [],
  reviews: [],
  promotions: [],
  notifications: [],
  ranks: [],
  vouchers: [],
  error: null,
};

const EcommerceSlice = createSlice({
  name: "EcommerceSlice",
  initialState,
  reducer: {},
  extraReducers: (builder) => {

    // Promotions
    builder.addCase(getNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload.data;
      state.error = null;
    });

    builder.addCase(getNotifications.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(updateNotification.fulfilled, (state, action) => {
      state.notifications = action.payload.data;
    });

    builder.addCase(updateNotification.rejected, (state, action) => {
      state.error = action.error;
    });

    // Products
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.products = action.payload.data;
      state.error = null;
    });

    builder.addCase(getProducts.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(getProductById.fulfilled, (state, action) => {
      state.productDetails = action.payload.data;
      state.isProductByIdSuccess = true;
      state.error = null;
    });

    builder.addCase(getProductById.rejected, (state, action) => {
      state.error = action.error;
      state.isProductByIdSuccess = false;
    });

    builder.addCase(addNewProduct.fulfilled, (state, action) => {
      state.products.push(action.payload.data.product);
      state.error = null;
    });

    builder.addCase(addNewProduct.rejected, (state, action) => {
      state.error = action.error ? action.error : null;
    });

    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.products = state.products.map((product) =>
        product._id.toString() === action.payload.data._id.toString()
          ? { ...product, ...action.payload.data.product }
          : product
      );
      state.error = null;
    });

    builder.addCase(updateProduct.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(deleteProducts.fulfilled, (state, action) => {
      state.products = (state.products || []).filter(
        (product) =>
          product._id.toString() !== action.payload.product.toString()
      );
      state.error = null;
    });

    builder.addCase(deleteProducts.rejected, (state, action) => {
      state.error = action.error;
    });
    //reviews
    builder.addCase(addNewReview.fulfilled, (state, action) => {
      state.reviews.push(action.payload);
      state.error = null;
    });

    builder.addCase(addNewReview.rejected, (state, action) => {
      state.error = action.error ? action.error : null;
    });
    builder.addCase(getReviewsByProductId.fulfilled, (state, action) => {
      state.reviews = action.payload.data;
    });

    builder.addCase(getReviewsByProductId.rejected, (state, action) => {
      state.error = action.error || null;
    });
    builder.addCase(addNewReplyReviewByReviewId.fulfilled, (state, action) => {
      state.reviews = state.reviews.map((review) =>
        review._id.toString() === action.payload.data._id.toString()
          ? { ...review, ...action.payload.data }
          : review
      );
    });

    builder.addCase(addNewReplyReviewByReviewId.rejected, (state, action) => {
      state.error = action.error || null;
    });

    // Orders
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.orders = action.payload.data;
      state.isOrderCreated = false;
      state.isOrderSuccess = true;
      state.error = null;
    });

    builder.addCase(getOrders.rejected, (state, action) => {
      state.error = action.error;
      state.isOrderCreated = false;
      state.isOrderSuccess = false;
    });

    builder.addCase(getOrderById.fulfilled, (state, action) => {
      state.orderDetails = action.payload.data;
      state.isOrderByIdSuccess = true;
      state.error = null;
    });

    builder.addCase(getOrderById.rejected, (state, action) => {
      state.error = action.error;
      state.isOrderByIdSuccess = false;
    });

    builder.addCase(addNewOrder.fulfilled, (state, action) => {
      state.orders.push(action.payload.data);
      state.isOrderCreated = true;
      state.error = null;
    });

    builder.addCase(addNewOrder.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(updateOrder.fulfilled, (state, action) => {
      state.orders = state.orders.map((order) =>
        order._id.toString() === action.payload.data._id.toString()
          ? { ...order, ...action.payload.data }
          : order
      );
      state.error = null;
    });

    builder.addCase(updateOrder.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(deleteOrder.fulfilled, (state, action) => {
      state.orders = state.orders.filter(
        (order) => order._id.toString() !== action.payload.order.toString()
      );
      state.error = null;
    });

    builder.addCase(deleteOrder.rejected, (state, action) => {
      state.error = action.error;
    });

    // Customers
    builder.addCase(getCustomers.fulfilled, (state, action) => {
      state.customers = action.payload.data;
      state.isCustomerCreated = false;
      state.isCustomerSuccess = true;
      state.error = null;
    });

    builder.addCase(getCustomers.rejected, (state, action) => {
      state.error = action.error;
      state.isCustomerCreated = false;
      state.isCustomerSuccess = false;
    });

    builder.addCase(addNewCustomer.fulfilled, (state, action) => {
      state.customers.push(action.payload.data);
      state.isCustomerCreated = true;
      state.error = null;
    });

    builder.addCase(addNewCustomer.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      state.customers = state.customers.map((customer) =>
        customer._id.toString() === action.payload.data._id.toString()
          ? { ...customer, ...action.payload.data }
          : customer
      );
      state.error = null;
    });

    builder.addCase(updateCustomer.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      state.customers = state.customers.filter(
        (customer) =>
          customer._id.toString() !== action.payload.customer.toString()
      );
      state.error = null;
    });

    builder.addCase(deleteCustomer.rejected, (state, action) => {
      state.error = action.error;
    });

    // Categories
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.categories = action.payload.data;
      state.error = null;
    });

    builder.addCase(getCategories.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(addNewCategory.fulfilled, (state, action) => {
      state.categories.push(action.payload.data);
      state.isCategoryCreated = true;
      state.error = null;
    });

    builder.addCase(addNewCategory.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.categories = state.categories.map((category) =>
        category._id.toString() === action.payload.data._id.toString()
          ? { ...category, ...action.payload.data }
          : category
      );
      state.error = null;
    });

    builder.addCase(updateCategory.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.categories = state.categories.filter(
        (category) =>
          category._id.toString() !== action.payload.category.toString()
      );
      state.error = null;
    });

    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.error = action.error;
    });

    // Brands
    builder.addCase(getBrands.fulfilled, (state, action) => {
      state.brands = action.payload.data;
      state.error = null;
    });

    builder.addCase(getBrands.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(addNewBrand.fulfilled, (state, action) => {
      state.brands.push(action.payload.data);
      state.isBrandCreated = true;
      state.error = null;
    });

    builder.addCase(addNewBrand.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(updateBrand.fulfilled, (state, action) => {
      state.brands = state.brands.map((brand) =>
        brand._id.toString() === action.payload.data._id.toString()
          ? { ...brand, ...action.payload.data }
          : brand
      );
      state.error = null;
    });

    builder.addCase(updateBrand.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(deleteBrand.fulfilled, (state, action) => {
      state.brands = state.brands.filter(
        (brand) =>
          brand._id.toString() !== action.payload.brand.toString()
      );
      state.error = null;
    });

    builder.addCase(deleteBrand.rejected, (state, action) => {
      state.error = action.error;
    });

    // Promotion
    builder.addCase(getPromotions.fulfilled, (state, action) => {
      state.promotions = action.payload.data;
      state.error = null;
    });

    builder.addCase(getPromotions.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(addNewPromotion.fulfilled, (state, action) => {
      state.promotions.push(action.payload.data);
      state.isPromotionCreated = true;
      state.error = null;
    });

    builder.addCase(addNewPromotion.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(updatePromotion.fulfilled, (state, action) => {
      state.promotions = state.promotions.map((promotion) =>
        promotion._id.toString() === action.payload.data._id.toString()
          ? { ...promotion, ...action.payload.data }
          : promotion
      );
      state.error = null;
    });

    builder.addCase(updatePromotion.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(deletePromotion.fulfilled, (state, action) => {
      state.promotions = state.promotions.filter(
        (promotion) =>
          promotion._id.toString() !== action.payload.promotion.toString()
      );
      state.error = null;
    });

    builder.addCase(deletePromotion.rejected, (state, action) => {
      state.error = action.error;
    });

    // Rank Reducer
    builder.addCase(getRanks.fulfilled, (state, action) => {
      state.ranks = action.payload.data;
      state.isRankSuccess = true;
      state.error = null;
    });

    builder.addCase(getRanks.rejected, (state, action) => {
      state.error = action.error;
      state.isRankSuccess = false;
    });

    builder.addCase(addNewRank.fulfilled, (state, action) => {
      state.ranks.push(action.payload.data);
      state.isRankCreated = true;
      state.error = null;
    });

    builder.addCase(addNewRank.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(updateRank.fulfilled, (state, action) => {
      state.ranks = state.ranks.map((rank) =>
        rank._id.toString() === action.payload.data._id.toString()
          ? { ...rank, ...action.payload.data }
          : rank
      );
      state.error = null;
    });

    builder.addCase(updateRank.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(deleteRank.fulfilled, (state, action) => {
      state.ranks = state.ranks.filter(
        (rank) =>
          rank._id.toString() !== action.payload.rank._id.toString()
      );
      state.error = null;
    });

    builder.addCase(deleteRank.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(getVouchers.fulfilled, (state, action) => {
      state.vouchers = action.payload.data;
      state.isVoucherSuccess = true;
      state.error = null;
    });

    builder.addCase(getVouchers.rejected, (state, action) => {
      state.error = action.error;
      state.isVoucherSuccess = false;
    });

    builder.addCase(addNewVoucher.fulfilled, (state, action) => {
      state.vouchers.push(action.payload.data);
      state.isVoucherCreated = true;
      state.error = null;
    });

    builder.addCase(addNewVoucher.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(updateVoucher.fulfilled, (state, action) => {
      state.vouchers = state.vouchers.map((voucher) =>
        voucher._id.toString() === action.payload.data._id.toString()
          ? { ...voucher, ...action.payload.data }
          : voucher
      );
      state.error = null;
    });

    builder.addCase(updateVoucher.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(deleteVoucher.fulfilled, (state, action) => {
      state.vouchers = state.vouchers.filter(
        (voucher) =>
          voucher._id.toString() !== action.payload.voucher._id.toString()
      );
      state.error = null;
    });

    builder.addCase(deleteVoucher.rejected, (state, action) => {
      state.error = action.error;
    });


  },
});

export default EcommerceSlice.reducer;
