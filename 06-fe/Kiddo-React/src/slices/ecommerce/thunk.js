import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Include Both Helper File with needed methods
import {
  getProducts as getProductsApi,
  getProductById as getProductByIdApi,
  deleteProducts as deleteProductsApi,
  getOrders as getOrdersApi,
  getOrderById as getOrderByIdApi,
  getSellers as getSellersApi,
  getCustomers as getCustomersApi,
  getCustomerById as getCustomerByIdApi,
  updateOrder as updateOrderApi,
  deleteOrder as deleteOrderApi,
  addNewOrder as addNewOrderApi,
  addNewCustomer as addNewCustomerApi,
  updateCustomer as updateCustomerApi,
  deleteCustomer as deleteCustomerApi,
  addNewProduct as addNewProductApi,
  updateProduct as updateProductApi,
  getBrands as getBrandsApi, 
  getCategories as getCategoriesApi,
  addNewCategory as addNewCategoryApi,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi,
  addNewBrand as addNewBrandApi,
  updateBrand as updateBrandApi,
  deleteBrand as deleteBrandApi,
  addNewCart as addNewCartApi,
  updateCart as updateCartApi,
  deleteCart as deleteCartApi,
  addCheckVoucher as addCheckVoucherApi,
  addToCartVoucher as addToCartVoucherApi,
  addNewReview as addNewReviewApi,
  addNewReplyReviewByReviewId as addNewReplyReviewByReviewIdApi,
  updateReplyReviewByReviewId as updateReplyReviewByReviewIdApi,
  deleteReplyReviewByReviewId as deleteReplyReviewByReviewIdApi,
  getReviewsByProductId as getReviewsByProductIdApi,
  getPromotions as getPromotionsApi,
  addNewPromotion as addNewPromotionApi,
  deletePromotion as deletePromotionApi,
  updatePromotion as updatePromotionApi,
  getPromotionById as getPromotionByIdApi,

  getAddressesByUserId as getAddressesByUserIdApi ,
  addNewAddress as addNewAddressApi,
  deleteAddress as deleteAddressApi,
  updateAddress as updateAddressApi,

  getVouchers as getVouchersApi,

  
} from "../../helper/fakebackend_helper";

export const getProducts = createAsyncThunk("ecommerce/getProducts", async () => {
  try {
    const response = await getProductsApi();
    return response;
  } catch (error) {
    throw error;
  }
});
// Định nghĩa một thunk để lấy sản phẩm dựa trên ID
export const getProductById = createAsyncThunk("ecommerce/getProductById", async (productId) => {
  try {
    // Gọi hàm API để lấy sản phẩm dựa trên productId (giả sử bạn có một hàm API tương tự getOrderByIdApi)
    const response = await getProductByIdApi(productId);
    return response;
  } catch (error) {
    throw error;
  }
});

export const getOrders = createAsyncThunk("ecommerce/getOrders", async () => {
  try {
    const response = await getOrdersApi();
    return response;
  } catch (error) {
    throw error;
  }
});
// Định nghĩa một thunk để lấy đơn hàng dựa trên id
export const getOrderById = createAsyncThunk("ecommerce/getOrderById", async (orderId) => {
  try {
    // Gọi hàm API để lấy đơn hàng dựa trên orderId
    const response = await getOrderByIdApi(orderId);
    return response;
  } catch (error) {
    throw error;
  }
});

export const getSellers = createAsyncThunk("ecommerce/getSellers", async () => {
  try {
    const response = await getSellersApi();
    return response;
  } catch (error) {
    throw error;
  }
});

export const getCustomers = createAsyncThunk("ecommerce/getCustomers", async () => {
  try {
    const response = await getCustomersApi();
    return response;
  } catch (error) {
    throw error;
  }
});
export const getCustomerById = createAsyncThunk("ecommerce/getCustomerById", async (customer) => {
  try {
    const response = await getCustomerByIdApi(customer);
    return response;
  } catch (error) {
    throw error;
  }
});
export const getReviewsByProductId = createAsyncThunk("ecommerce/getReviewsByProductId", async (productId) => {
  try {
    const response = await getReviewsByProductIdApi(productId);
    return response;
  } catch (error) {
    throw error;
  }
});

export const deleteProducts = createAsyncThunk("ecommerce/deleteProducts", async (product) => {
  try {
    const response = await deleteProductsApi(product);
    toast.success("Xóa sản phẩm thành công", { autoClose: 3000 });
    return { product, ...response };
  } catch (error) {
    const errorMessage = "Xóa sản phẩm thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const updateOrder = createAsyncThunk("ecommerce/updateOrder", async (order) => {
  try {
    const response = updateOrderApi(order);
    const data = await response;
    toast.success("Cập nhật đơn hàng thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Cập nhật đơn hàng thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const addNewProduct = createAsyncThunk("ecommerce/addNewProduct", async (product) => {
  try {
    const response = addNewProductApi(product);
    const data = await response;
    toast.success("Thêm sản phẩm thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Thêm sản phẩm thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const updateProduct = createAsyncThunk("ecommerce/updateProduct", async (product) => {
  try {
    const response = updateProductApi(product);
    const data = await response;
    toast.success("Cập nhật sản phẩm thành công", { autoClose: 3000 });
    throw data;
  }
  catch (error) {
    const errorMessage = "Cập nhật sản phẩm thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const deleteOrder = createAsyncThunk("ecommerce/deleteOrder", async (order) => {
  try {
    const response = await deleteOrderApi(order);
    toast.success("Xóa đơn hàng thành công", { autoClose: 3000 });
    return { order, ...response };
  } catch (error) {
    const errorMessage = "Xóa đơn hàng thất bại thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const addNewOrder = createAsyncThunk("ecommerce/addNewOrder", async (order) => {
  try {
    const response = addNewOrderApi(order);
    const data = await response;
    toast.success("Thêm đơn hàng thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    console.log(error)
    const errorMessage = "Thêm đơn hàng thất bại: Đã xảy ra lỗi "+error.message;
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const updateCustomer = createAsyncThunk("ecommerce/updateCustomer", async (customer) => {
  try {
    const response = updateCustomerApi(customer);
    const data = await response;
    toast.success("Cập nhật khách hàng thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Cập nhật khách hàng thất bại: Đã xảy ra lỗi ";//  + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const deleteCustomer = createAsyncThunk("ecommerce/deleteCustomer", async (customer) => {
  try {
    const response = await deleteCustomerApi(customer);
    toast.success("Xóa khách hàng thành công", { autoClose: 3000 });
    return { customer, ...response }
  } catch (error) {
    const errorMessage = "Xóa khách hàng thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const addNewCustomer = createAsyncThunk("ecommerce/addNewCustomer", async (customer) => {
  try {
    const response = addNewCustomerApi(customer);
    const data = await response;
    toast.success("Thêm khách hàng thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Thêm khách hàng thất bại thất bại: Đã xảy ra lỗi";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});
export const getCategories = createAsyncThunk("ecommerce/getCategories", async () => {
  try {
    const response = await getCategoriesApi(); // Gọi API để lấy danh sách danh mục
    return response;
  } catch (error) {
    throw error;
  }
});

export const updateCategory = createAsyncThunk("ecommerce/updateCategory", async (category) => {
  try {
    const response = updateCategoryApi(category); // Gọi API cập nhật thông tin danh mục
    const data = await response;
    toast.success("Cập nhật danh mục thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Cập nhật danh mục thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const deleteCategory = createAsyncThunk("ecommerce/deleteCategory", async (category) => {
  try {
    const response = await deleteCategoryApi(category); // Gọi API xóa danh mục
    toast.success("Xóa danh mục thành công", { autoClose: 3000 });
    return { category, ...response };
  } catch (error) {
    const errorMessage = "Xóa danh mục thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const addNewCategory = createAsyncThunk("ecommerce/addNewCategory", async (category) => {
  try {
    const response = addNewCategoryApi(category); // Gọi API thêm danh mục mới
    const data = await response;
    toast.success("Thêm danh mục thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Thêm danh mục thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const getBrands = createAsyncThunk("ecommerce/getBrands", async () => {
  try {
    const response = await getBrandsApi(); // Gọi API để lấy danh sách thương hiệu
    return response;
  } catch (error) {
    throw error;
  }
});

export const updateBrand = createAsyncThunk("ecommerce/updateBrand", async (brand) => {
  try {
    const response = updateBrandApi(brand); // Gọi API cập nhật thông tin thương hiệu
    const data = await response;
    toast.success("Cập nhật thương hiệu thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Cập nhật thương hiệu thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const deleteBrand = createAsyncThunk("ecommerce/deleteBrand", async (brand) => {
  try {
    const response = await deleteBrandApi(brand); // Gọi API xóa thương hiệu
    toast.success("Xóa thương hiệu thàng công", { autoClose: 3000 });
    return { brand, ...response };
  } catch (error) {
    const errorMessage = "Xóa thương hiệu thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const addNewBrand = createAsyncThunk("ecommerce/addNewBrand", async (brand) => {
  try {
    const response = addNewBrandApi(brand); // Gọi API thêm thương hiệu mới
    const data = await response;
    toast.success("Thêm thương hiệu thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Thêm thương hiệu thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const addNewCart = createAsyncThunk("ecommerce/addNewCart", async (cart) => {
  try {
    const response = addNewCartApi(cart); // Gọi API thêm giỏ hàng mới
    const data = await response; // Chú ý: Phải parse response thành JSON nếu cần
    toast.success("Thêm vào giỏ hàng thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Vui lòng chọn biến thể sản phẩm"; //+ (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});
export const updateCart = createAsyncThunk("ecommerce/updateCart", async (cartItem) => {
  try {
    const response = updateCartApi(cartItem); // Gọi API cập nhật giỏ hàng
    const data = await response; // Chú ý: Phải parse response thành JSON nếu cần
    //toast.success("Cập nhật giỏ hàng thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Cập nhật giỏ hàng thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});
export const deleteCart = createAsyncThunk("ecommerce/deleteCart", async (cartItem) => {
  try {
    const response = deleteCartApi(cartItem); // Gọi API cập nhật giỏ hàng
    const data = await response; // Chú ý: Phải parse response thành JSON nếu cần
    toast.success("Xóa giỏ hàng thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Xóa giỏ hàng thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});
export const addCheckVoucher = createAsyncThunk("ecommerce/checkVoucher", async (voucher, { rejectWithValue }) => {
  try {
    const response = await addCheckVoucherApi(voucher);
    const data = await response;
    toast.success("Áp dụng mã thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Áp dụng mã thất bại ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});
export const addToCartVoucher = createAsyncThunk("ecommerce/addToCartVoucher", async (voucher, { rejectWithValue }) => {
  try {
    const response = await addToCartVoucherApi(voucher);
    const data = await response;
    toast.success("Thêm vào giỏ voucher thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Thêm thất bại, bạn đã thêm";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});
export const addNewReview = createAsyncThunk("ecommerce/addNewReview", async (review) => {
  try {
    const response = addNewReviewApi(review);
    const data = await response;
    toast.success("Thêm đánh giá thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Thêm đánh giá thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});
export const addNewReplyReviewByReviewId = createAsyncThunk("ecommerce/addNewReplyReviewByReviewId", async (reviewReply) => {
  try {
    const response = addNewReplyReviewByReviewIdApi(reviewReply);
    const data = await response;
    toast.success("Thêm phản hồi đánh giá thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Thêm phản hồi đánh giá thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});
export const updateReplyReviewByReviewId = createAsyncThunk("ecommerce/updateReplyReviewByReviewId", async (reviewReply) => {
  try {
    const response = updateReplyReviewByReviewIdApi(reviewReply);
    const data = await response;
    toast.success("Sửa phản hồi đánh giá thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Sửa phản hồi đánh giá thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});
export const deleteReplyReviewByReviewId = createAsyncThunk("ecommerce/deleteReplyReviewByReviewId", async (reviewReply) => {
  try {
    const response = deleteReplyReviewByReviewIdApi(reviewReply);
    const data = await response;
    toast.success("Xóa phản hồi đánh giá thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Xóa phản hồi đánh giá thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

// Promotions
export const getPromotions = createAsyncThunk("ecommerce/getPromotions", async () => {
  try {
    const response = await getPromotionsApi();
    return response;
  } catch (error) {
    throw error;
  }
});

export const getPromotionById = createAsyncThunk("ecommerce/getPromotionById", async (promotionId) => {
  try {
    const response = await getPromotionByIdApi(promotionId);
    return response;
  } catch (error) {
    throw error;
  }
});

export const deletePromotion = createAsyncThunk("ecommerce/deletePromotion", async (promotion) => {
  try {
    const response = await deletePromotionApi(promotion);
    toast.success("Xóa khuyến mãi thành công", { autoClose: 3000 });
    return { promotion, ...response };
  } catch (error) {
    const errorMessage = "Xóa khuyến mãi thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const addNewPromotion = createAsyncThunk("ecommerce/addNewPromotion", async (promotion) => {
  try {
    const response = addNewPromotionApi(promotion);
    const data = await response;
    toast.success("Thêm khuyến mãi thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Thêm khuyến mãi thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const updatePromotion = createAsyncThunk("ecommerce/updatePromotion", async (promotion) => {
  try {
    const response = updatePromotionApi(promotion);
    const data = await response;
    toast.success("Cập nhật khuyến mãi thành công", { autoClose: 3000 });
    return data;
  } catch (error) {
    const errorMessage = "Cập nhật khuyến mãi thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

// Addresses
export const getAddressesByUserId = createAsyncThunk("ecommerce/getAddressesByUserId", async (userId) => {
  try {
    const response = await getAddressesByUserIdApi(userId);
    return response;
  } catch (error) {
    throw error;
  }
});

export const addNewAddress = createAsyncThunk("ecommerce/addNewAddress", async (address) => {
  try {
    const response = await addNewAddressApi(address);
    toast.success("Thêm địa chỉ thành công", { autoClose: 3000 });
    return response;
  } catch (error) {
    const errorMessage = "Thêm địa chỉ thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const deleteAddress = createAsyncThunk("ecommerce/deleteAddress", async (address) => {
  try {
    const response = await deleteAddressApi(address);
    toast.success("Xóa địa chỉ thành công", { autoClose: 3000 });
    return response;
  } catch (error) {
    const errorMessage = "Xóa địa chỉ thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

export const updateAddress = createAsyncThunk("ecommerce/updateAddress", async (address) => {
  try {
    const response = await updateAddressApi(address);
    toast.success("Cập nhật địa chỉ thành công", { autoClose: 3000 });
    return response;
  } catch (error) {
    const errorMessage = "Cập nhật địa chỉ thất bại: Đã xảy ra lỗi ";// + (error.response?.data?.message || error || "Lỗi không xác định");
    toast.error(errorMessage, { autoClose: 3000 });
    throw error;
  }
});

// Vouchers
export const getVouchers = createAsyncThunk("ecommerce/getVouchers", async () => {
  try {
    const response = await getVouchersApi();
    return response;
  } catch (error) {
    throw error;
  }
});

