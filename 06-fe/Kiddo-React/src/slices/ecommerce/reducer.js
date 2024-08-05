import { createSlice } from "@reduxjs/toolkit";
import {
  getProducts,
  getProductById,
  addNewProduct,
  updateProduct,
  deleteProducts,
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
  getCustomerById,
  getReviewsByProductId,
  addNewReview,
  addNewReplyReviewByReviewId,
  updateReplyReviewByReviewId,
  deleteReplyReviewByReviewId,
  getPromotions,
  getPromotionById,
  addNewPromotion,
  updatePromotion,
  deletePromotion,
  getAddressesByUserId,
  addNewAddress,
  deleteAddress,
  updateAddress,
  addCheckVoucher,
  getVouchers,
} from "./thunk";
export const initialState = {
  products: [],
  productDetails: [],
  orders: [],
  sellers: [],
  customers: [],
  categories: [],
  brands: [],
  orderDetails: [],
  reviews: [],
  promotions: [],
  promotionDetails: [],
  addresses: [],
  checkVoucher:[],
  vouchers: [],
  error: null,
};

const EcommerceSlice = createSlice({
  name: "EcommerceSlice",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.products = action.payload.data;
    });

    builder.addCase(getProducts.rejected, (state, action) => {
      state.error = action.error || null;
    });
    builder.addCase(getProductById.fulfilled, (state, action) => {
      state.productDetails = action.payload.data; // Thay đổi state tương ứng
      state.isProductByIdSuccess = true; // Thêm trạng thái tương ứng
    });

    builder.addCase(getProductById.rejected, (state, action) => {
      state.error = action.error || null;
      state.isProductByIdSuccess = false; // Thêm trạng thái tương ứng
    });

    builder.addCase(addNewProduct.fulfilled, (state, action) => {
      state.products.push(action.payload);
      state.error = null;
    });

    builder.addCase(addNewProduct.rejected, (state, action) => {
      state.error = action.error ? action.error.message : null;
    });

    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.products = state.products.map((product) =>
        product._id.toString() === action.payload.data._id.toString()
          ? { ...product, ...action.payload.data }
          : product
      );
    });

    builder.addCase(updateProduct.rejected, (state, action) => {
      state.error = action.error || null;
    });

    builder.addCase(deleteProducts.fulfilled, (state, action) => {
      state.products = (state.products || []).filter(
        (product) =>
          product._id.toString() !== action.payload.product.toString()
      );
    });

    builder.addCase(deleteProducts.rejected, (state, action) => {
      state.error = action.error || null;
    });

    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.orders = action.payload.data;
      state.isOrderCreated = false;
      state.isOrderSuccess = true;
    });

    builder.addCase(getOrders.rejected, (state, action) => {
      state.error = action.error || null;
      state.isOrderCreated = false;
      state.isOrderSuccess = false;
    });

    builder.addCase(getOrderById.fulfilled, (state, action) => {
      state.orderDetails = action.payload.data; // Thay đổi state tương ứng
      state.isOrderByIdSuccess = true; // Thêm trạng thái tương ứng
    });

    builder.addCase(getOrderById.rejected, (state, action) => {
      state.error = action.error || null;
      state.isOrderByIdSuccess = false; // Thêm trạng thái tương ứng
    });

    builder.addCase(addNewOrder.fulfilled, (state, action) => {
      state.orders.push(action.payload.data);
      state.isOrderCreated = action.payload.status;
    });

    builder.addCase(addNewOrder.rejected, (state, action) => {
      console.log(action)
      state.error = action.error || null;
    });

    builder.addCase(updateOrder.fulfilled, (state, action) => {
      state.orders = state.orders.map((order) =>
        order._id.toString() === action.payload.data._id.toString()
          ? { ...order, ...action.payload.data }
          : order
      );
    });

    builder.addCase(updateOrder.rejected, (state, action) => {
      state.error = action.error || null;
    });

    builder.addCase(deleteOrder.fulfilled, (state, action) => {
      state.orders = state.orders.filter(
        (order) => order._id.toString() !== action.payload.order.toString()
      );
    });

    builder.addCase(deleteOrder.rejected, (state, action) => {
      state.error = action.error || null;
    });

    builder.addCase(getSellers.fulfilled, (state, action) => {
      state.sellers = action.payload;
    });

    builder.addCase(getSellers.rejected, (state, action) => {
      state.error = action.error || null;
    });

    builder.addCase(getCustomers.fulfilled, (state, action) => {
      state.customers = action.payload.data;
      state.isCustomerCreated = false;
      state.isCustomerSuccess = true;
    });

    builder.addCase(getCustomers.rejected, (state, action) => {
      state.error = action.error || null;
      state.isCustomerCreated = false;
      state.isCustomerSuccess = false;
    });
    builder.addCase(getCustomerById.fulfilled, (state, action) => {
      state.customers = action.payload.data;
      state.isCustomerCreated = false;
      state.isCustomerSuccess = true;
    });

    builder.addCase(getCustomerById.rejected, (state, action) => {
      state.error = action.error || null;
      state.isCustomerCreated = false;
      state.isCustomerSuccess = false;
    });

    builder.addCase(addNewCustomer.fulfilled, (state, action) => {
      state.customers.push(action.payload.data);
      state.isCustomerCreated = true;
    });
    builder.addCase(addNewCustomer.rejected, (state, action) => {
      state.error = action.error || null;
    });

    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      state.customers = state.customers.map((customer) =>
        customer._id.toString() === action.payload.data._id.toString()
          ? { ...customer, ...action.payload.data }
          : customer
      );
    });
    builder.addCase(updateCustomer.rejected, (state, action) => {
      state.error = action.error || null;
    });

    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      state.customers = state.customers.filter(
        (customer) =>
          customer._id.toString() !== action.payload.customer.toString()
      );
    });
    builder.addCase(deleteCustomer.rejected, (state, action) => {
      state.error = action.error || null;
    });

    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.categories = action.payload.data; // Gán danh sách danh mục từ payload vào state
    });

    builder.addCase(getCategories.rejected, (state, action) => {
      state.error = action.error || null; // Xử lý lỗi khi không thể lấy danh sách danh mục
    });
    builder.addCase(addNewCategory.fulfilled, (state, action) => {
      state.categories.push(action.payload.data); // Thêm danh mục mới vào danh sách danh mục
      state.isCategoryCreated = true; // Đặt cờ để cho biết danh mục đã được tạo thành công
    });

    builder.addCase(addNewCategory.rejected, (state, action) => {
      state.error = action.error || null; // Xử lý lỗi khi không thể thêm mới danh mục
    });
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.categories = state.categories.map((category) =>
        category._id.toString() === action.payload.data._id.toString()
          ? { ...category, ...action.payload.data }
          : category
      ); // Cập nhật thông tin danh mục trong danh sách danh mục
    });

    builder.addCase(updateCategory.rejected, (state, action) => {
      state.error = action.error || null; // Xử lý lỗi khi không thể cập nhật danh mục
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.categories = state.categories.filter(
        (category) =>
          category._id.toString() !== action.payload.category.toString()
      ); // Xóa danh mục khỏi danh sách danh mục
    });

    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.error = action.error || null; // Xử lý lỗi khi không thể xóa danh mục
    });

    // Reducers for brand
    builder.addCase(getBrands.fulfilled, (state, action) => {
      state.brands = action.payload.data; // Gán danh sách thương hiệu từ payload vào state
    });

    builder.addCase(getBrands.rejected, (state, action) => {
      state.error = action.error || null; // Xử lý lỗi khi không thể lấy danh sách thương hiệu
    });

    builder.addCase(addNewBrand.fulfilled, (state, action) => {
      state.brands.push(action.payload.data); // Thêm thương hiệu mới vào danh sách thương hiệu
      state.isBrandCreated = true; // Đặt cờ để cho biết thương hiệu đã được tạo thành công
    });

    builder.addCase(addNewBrand.rejected, (state, action) => {
      state.error = action.error || null; // Xử lý lỗi khi không thể thêm mới thương hiệu
    });

    builder.addCase(updateBrand.fulfilled, (state, action) => {
      state.brands = state.brands.map((brand) =>
        brand._id.toString() === action.payload.data._id.toString()
          ? { ...brand, ...action.payload.data }
          : brand
      ); // Cập nhật thông tin thương hiệu trong danh sách thương hiệu
    });

    builder.addCase(updateBrand.rejected, (state, action) => {
      state.error = action.error || null; // Xử lý lỗi khi không thể cập nhật thương hiệu
    });

    builder.addCase(deleteBrand.fulfilled, (state, action) => {
      state.brands = state.brands.filter(
        (brand) =>
          brand._id.toString() !== action.payload.brand.toString()
      ); // Xóa thương hiệu khỏi danh sách thương hiệu
    });

    builder.addCase(deleteBrand.rejected, (state, action) => {
      state.error = action.error || null; // Xử lý lỗi khi không thể xóa thương hiệu
    });

    builder.addCase(addNewReview.fulfilled, (state, action) => {
      state.reviews.push(action.payload);
      state.error = null;
    });

    builder.addCase(addNewReview.rejected, (state, action) => {
      state.error = action.error ? action.error.message : null;
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
    builder.addCase(updateReplyReviewByReviewId.fulfilled, (state, action) => {
      state.reviews = state.reviews.map((review) =>
        review._id.toString() === action.payload.data._id.toString()
          ? { ...review, ...action.payload.data }
          : review
      );
    });

    builder.addCase(updateReplyReviewByReviewId.rejected, (state, action) => {
      state.error = action.error || null;
    });
    builder.addCase(deleteReplyReviewByReviewId.fulfilled, (state, action) => {
      state.reviews = state.reviews.map((review) =>
        review._id.toString() === action.payload.data._id.toString()
          ? { ...review, ...action.payload.data }
          : review
      );
    });

    builder.addCase(deleteReplyReviewByReviewId.rejected, (state, action) => {
      state.error = action.error || null;
    });
    // Promotion
    builder.addCase(getPromotions.fulfilled, (state, action) => {
      state.promotions = action.payload.data;
      state.error = null;
    });

    builder.addCase(getPromotions.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(getPromotionById.fulfilled, (state, action) => {
      state.promotionDetails = action.payload.data; // Thay đổi state tương ứng
      state.error = null;
    });
    
    builder.addCase(getPromotionById.rejected, (state, action) => {
      state.error = action.error || null;
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

    // Address
    builder.addCase(getAddressesByUserId.fulfilled, (state, action) => {
      state.addresses = action.payload.data; // Cập nhật danh sách địa chỉ
      state.error = null;
    });

    builder.addCase(getAddressesByUserId.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(addNewAddress.fulfilled, (state, action) => {
      state.addresses.push(action.payload.data); // Thêm địa chỉ mới vào danh sách
      state.error = null;
    });

    builder.addCase(addNewAddress.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(updateAddress.fulfilled, (state, action) => {
      state.addresses = state.addresses.map((address) =>
        address._id.toString() === action.payload.data._id.toString()
          ? { ...address, ...action.payload.data }
          : address
      );
      state.error = null;
    });

    builder.addCase(updateAddress.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(deleteAddress.fulfilled, (state, action) => {
      state.addresses = state.addresses.filter(
        (address) =>
          address._id.toString() !== action.payload.address.toString()
      );
      state.error = null;
    });

    builder.addCase(deleteAddress.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(addCheckVoucher.fulfilled, (state, action) => {
      state.checkVoucher=action.payload.data; // Thêm địa chỉ mới vào danh sách
      state.error = null;
    });

    builder.addCase(addCheckVoucher.rejected, (state, action) => {
      state.checkVoucher=[];
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


  },
});

export default EcommerceSlice.reducer;
