import { APIClient } from "./api_helper";

import * as url from "./url_helper";

const api = new APIClient();

// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

// //is user is logged in
export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Register Method
export const postFakeRegister = data => api.create(url.POST_FAKE_REGISTER, data);

// Login Method
export const postFakeLogin = data => api.create(url.POST_FAKE_LOGIN, data);

// postForgetPwd
export const postFakeForgetPwd = data => api.create(url.POST_FAKE_PASSWORD_FORGET, data);
export const postFakeForgetPwdReset = data => api.patch(url.POST_FAKE_PASSWORD_RESET+"/"+data.token, data);

// Edit profile
export const postJwtProfile = data => api.create(url.POST_EDIT_JWT_PROFILE, data);

export const postFakeProfile = (data) => api.patch(url.POST_EDIT_PROFILE + '/' + data.idx, data);

// Register Method
export const postJwtRegister = (url, data) => {
  return api.create(url, data)
    .catch(err => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message = "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
export const postJwtLogin = data => api.create(url.POST_FAKE_JWT_LOGIN, data);
export const getJwtLogout = () => api.get(url.GET_FAKE_LOGOUT);

// postForgetPwd
export const postJwtForgetPwd = data => api.create(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

// postSocialLogin
export const postSocialLogin = data => api.create(url.SOCIAL_LOGIN, data);

// Calendar
// get Events
export const getEvents = () => api.get(url.GET_EVENTS);

export const getCategories = () => api.get(url.GET_CATEGORIES);
export const addNewCategory = category => api.create(url.ADD_NEW_CATEGORY, category);
export const deleteCategory = category => api.delete(url.DELETE_CATEGORY + '/' + category);
// update Categories
export const updateCategory = category => api.patch(url.UPDATE_CATEGORY + '/' + category._id, category);
//brand
export const getBrands = () => api.get(url.GET_BRANDS);
export const addNewBrand = brand => api.create(url.ADD_NEW_BRAND, brand);
export const deleteBrand = brand => api.delete(url.DELETE_BRAND + '/' + brand);
export const updateBrand = brand => api.patch(url.UPDATE_BRAND + '/' + brand._id, brand);


// Upcomming Events
export const getUpCommingEvent = () => api.get(url.GET_UPCOMMINGEVENT);
export const addNewEvent = event => api.create(url.ADD_NEW_EVENT, event);
export const updateEvent = event => api.put(url.UPDATE_EVENT, event);
export const deleteEvent = event => api.delete(url.DELETE_EVENT, { headers: { event } });

// Chat
export const getDirectContact = () => api.get(url.GET_DIRECT_CONTACT);
export const getMessages = roomId => api.get(`${url.GET_MESSAGES}/${roomId}`, { params: { roomId } });
export const addMessage = message => api.create(url.ADD_MESSAGE, message);
export const deleteMessage = message => api.delete(url.DELETE_MESSAGE, { headers: { message } });
export const getChannels = () => api.get(url.GET_CHANNELS);

// MailBox
export const getMailDetails = () => api.get(url.GET_MAIL_DETAILS);
export const deleteMail = forId => api.delete(url.DELETE_MAIL, { headers: { forId } });

// Ecommerce

export const getNotifications = () => api.get(url.GET_NOTIFICATIONS);
export const updateNotification = notification => api.patch(url.UPDATE_NOTIFICATION + '/' + notification._id, notification);
export const getProducts = () => api.get(url.GET_PRODUCTS);
export const getProductById = productId => api.getById(url.GET_PRODUCT_BY_ID + '/' + productId);
export const deleteProducts = product => api.delete(url.DELETE_PRODUCT + '/' + product);
export const addNewProduct = product => api.createFormData(url.ADD_NEW_PRODUCT, product);
export const updateProduct = product => api.patchFormData(url.UPDATE_PRODUCT + '/' + product.get("id"), product);
export const getReviewsByProductId = productId => api.getById(url.GET_REVIEW_BY_PRODUCTID+'/'+ productId);
export const addNewReview = review => api.createFormData(url.ADD_NEW_REVIEW, review);
export const addNewReplyReviewByReviewId = reviewReply => api.create(url.ADD_NEW_REPLY_REVIEW+'/'+ reviewReply._id,reviewReply);
export const getPromotions = () => api.get(url.GET_PROMOTIONS);
export const getPromotionById = promotionId => api.getById(url.GET_PROMOTION_BY_ID + '/' + promotionId);
export const deletePromotion = promotion => api.delete(url.DELETE_PROMOTION + '/' + promotion._id);
export const addNewPromotion = promotion => api.createFormData(url.ADD_NEW_PROMOTION, promotion);
export const updatePromotion = promotion => api.patchFormData(url.UPDATE_PROMOTION + '/' + promotion.get("id"), promotion);
export const getRanks = () => api.get(url.GET_RANKS);
export const getRankById = rankId => api.getById(url.GET_RANK_BY_ID + '/' + rankId);
export const deleteRank = rank => api.delete(url.DELETE_RANK + '/' + rank._id);
export const addNewRank = rank => api.createFormData(url.ADD_NEW_RANK, rank);
export const updateRank = rank => api.patchFormData(url.UPDATE_RANK + '/' + rank.get("id"), rank);
export const getVouchers = () => api.get(url.GET_VOUCHERS);
export const getVoucherById = voucherId => api.get(url.GET_VOUCHER_BY_ID + '/' + voucherId);
export const deleteVoucher = voucher => api.delete(url.DELETE_VOUCHER + '/' + voucher._id);
export const addNewVoucher = voucher => api.createFormData(url.ADD_NEW_VOUCHER, voucher);
export const updateVoucher = voucher => api.patchFormData(url.UPDATE_VOUCHER + '/' + voucher.get("id"), voucher);


export const getOrders = () => api.get(url.GET_ORDERS);
export const getOrderById = orderId => api.getById(url.GET_ORDER_BY_ID + '/' + orderId);
export const addNewOrder = order => api.create(url.ADD_NEW_ORDER, order);
export const updateOrder = order => api.patch(url.UPDATE_ORDER + '/' + order._id, order);
export const deleteOrder = order => api.delete(url.DELETE_ORDER + '/' + order);
export const getCustomers = () => api.get(url.GET_CUSTOMERS);
export const addNewCustomer = customer => api.create(url.ADD_NEW_CUSTOMERS, customer);
export const updateCustomer = customer => api.patch(url.UPDATE_CUSTOMERS + '/' + customer._id, customer);
export const deleteCustomer = customer => api.delete(url.DELETE_CUSTOMERS + '/' + customer);
export const getSellers = () => api.get(url.GET_SELLERS);

// Project
export const getProjectList = () => api.get(url.GET_PROJECT_LIST);

// Tasks
export const getTaskList = () => api.get(url.GET_TASK_LIST);
export const addNewTask = task => api.create(url.ADD_NEW_TASK, task);
export const updateTask = task => api.patch(url.UPDATE_TASK + '/' + task._id, task);
export const deleteTask = task => api.delete(url.DELETE_TASK + '/' + task);

// CRM
export const getContacts = () => api.get(url.GET_CONTACTS);
export const addNewContact = contact => api.create(url.ADD_NEW_CONTACT, contact);
export const updateContact = contact => api.patch(url.UPDATE_CONTACT + '/' + contact._id, contact);
export const deleteContact = contact => api.delete(url.DELETE_CONTACT + '/' + contact);
export const getCompanies = () => api.get(url.GET_COMPANIES);
export const addNewCompanies = company => api.create(url.ADD_NEW_COMPANIES, company);
export const updateCompanies = company => api.patch(url.UPDATE_COMPANIES + '/' + company._id, company);
export const deleteCompanies = company => api.delete(url.DELETE_COMPANIES + '/' + company);
export const getDeals = () => api.get(url.GET_DEALS);
export const getLeads = () => api.get(url.GET_LEADS);
export const addNewLead = lead => api.create(url.ADD_NEW_LEAD, lead);
export const updateLead = lead => api.patch(url.UPDATE_LEAD + '/' + lead._id, lead);
export const deleteLead = lead => api.delete(url.DELETE_LEAD + '/' + lead);

// Crypto
export const getTransationList = () => api.get(url.GET_TRANSACTION_LIST);
export const getOrderList = () => api.get(url.GET_ORDRER_LIST);

// Invoice
export const getInvoices = () => api.get(url.GET_INVOICES);
export const addNewInvoice = invoice => api.create(url.ADD_NEW_INVOICE, invoice);
export const updateInvoice = invoice => api.patch(url.UPDATE_INVOICE + '/' + invoice._id, invoice);
export const deleteInvoice = invoice => api.delete(url.DELETE_INVOICE + '/' + invoice);

// Support Tickets 
export const getTicketsList = () => api.get(url.GET_TICKETS_LIST);
export const addNewTicket = ticket => api.create(url.ADD_NEW_TICKET, ticket);
export const updateTicket = ticket => api.patch(url.UPDATE_TICKET + '/' + ticket._id, ticket);
export const deleteTicket = ticket => api.delete(url.DELETE_TICKET + '/' + ticket);


// Dashboard Analytics

// Sessions by Countries
export const getAllData = () => api.get(url.GET_ALL_DATA);
export const getHalfYearlyData = () => api.get(url.GET_HALFYEARLY_DATA);
export const getMonthlyData = () => api.get(url.GET_MONTHLY_DATA);

// Audiences Metrics
export const getAllAudiencesMetricsData = () => api.get(url.GET_ALLAUDIENCESMETRICS_DATA);
export const getMonthlyAudiencesMetricsData = () => api.get(url.GET_MONTHLYAUDIENCESMETRICS_DATA);
export const getHalfYearlyAudiencesMetricsData = () => api.get(url.GET_HALFYEARLYAUDIENCESMETRICS_DATA);
export const getYearlyAudiencesMetricsData = () => api.get(url.GET_YEARLYAUDIENCESMETRICS_DATA);

// Users by Device
export const getTodayDeviceData = () => api.get(url.GET_TODAYDEVICE_DATA);
export const getLastWeekDeviceData = () => api.get(url.GET_LASTWEEKDEVICE_DATA);
export const getLastMonthDeviceData = () => api.get(url.GET_LASTMONTHDEVICE_DATA);
export const getCurrentYearDeviceData = () => api.get(url.GET_CURRENTYEARDEVICE_DATA);

// Audiences Sessions by Country
export const getTodaySessionData = () => api.get(url.GET_TODAYSESSION_DATA);
export const getLastWeekSessionData = () => api.get(url.GET_LASTWEEKSESSION_DATA);
export const getLastMonthSessionData = () => api.get(url.GET_LASTMONTHSESSION_DATA);
export const getCurrentYearSessionData = () => api.get(url.GET_CURRENTYEARSESSION_DATA);

// Dashboard CRM

// Balance Overview
export const getTodayBalanceData = () => api.get(url.GET_TODAYBALANCE_DATA);
export const getLastWeekBalanceData = () => api.get(url.GET_LASTWEEKBALANCE_DATA);
export const getLastMonthBalanceData = () => api.get(url.GET_LASTMONTHBALANCE_DATA);
export const getCurrentYearBalanceData = () => api.get(url.GET_CURRENTYEARBALANCE_DATA);

// Dial Type
export const getTodayDealData = () => api.get(url.GET_TODAYDEAL_DATA);
export const getWeeklyDealData = () => api.get(url.GET_WEEKLYDEAL_DATA);
export const getMonthlyDealData = () => api.get(url.GET_MONTHLYDEAL_DATA);
export const getYearlyDealData = () => api.get(url.GET_YEARLYDEAL_DATA);

// Sales Forecast
export const getOctSalesData = () => api.get(url.GET_OCTSALES_DATA);
export const getNovSalesData = () => api.get(url.GET_NOVSALES_DATA);
export const getDecSalesData = () => api.get(url.GET_DECSALES_DATA);
export const getJanSalesData = () => api.get(url.GET_JANSALES_DATA);

// Dashboard Ecommerce
// Revenue
export const getAllRevenueData = (data) => api.create(url.GET_ALLREVENUE_DATA,data);
export const getMonthRevenueData = () => api.get(url.GET_MONTHREVENUE_DATA);
export const getHalfYearRevenueData = () => api.get(url.GET_HALFYEARREVENUE_DATA);
export const getYearRevenueData = () => api.get(url.GET_YEARREVENUE_DATA);


// Dashboard Crypto
// Portfolio
export const getBtcPortfolioData = () => api.get(url.GET_BTCPORTFOLIO_DATA);
export const getUsdPortfolioData = () => api.get(url.GET_USDPORTFOLIO_DATA);
export const getEuroPortfolioData = () => api.get(url.GET_EUROPORTFOLIO_DATA);

// Market Graph
export const getAllMarketData = () => api.get(url.GET_ALLMARKETDATA_DATA);
export const getYearMarketData = () => api.get(url.GET_YEARMARKET_DATA);
export const getMonthMarketData = () => api.get(url.GET_MONTHMARKET_DATA);
export const getWeekMarketData = () => api.get(url.GET_WEEKMARKET_DATA);
export const getHourMarketData = () => api.get(url.GET_HOURMARKET_DATA);

// Dashboard Project
// Project Overview
export const getAllProjectData = () => api.get(url.GET_ALLPROJECT_DATA);
export const getMonthProjectData = () => api.get(url.GET_MONTHPROJECT_DATA);
export const gethalfYearProjectData = () => api.get(url.GET_HALFYEARPROJECT_DATA);
export const getYearProjectData = () => api.get(url.GET_YEARPROJECT_DATA);

// Project Status
export const getAllProjectStatusData = () => api.get(url.GET_ALLPROJECTSTATUS_DATA);
export const getWeekProjectStatusData = () => api.get(url.GET_WEEKPROJECTSTATUS_DATA);
export const getMonthProjectStatusData = () => api.get(url.GET_MONTHPROJECTSTATUS_DATA);
export const getQuarterProjectStatusData = () => api.get(url.GET_QUARTERPROJECTSTATUS_DATA);

// Dashboard NFT
// Marketplace
export const getAllMarketplaceData = () => api.get(url.GET_ALLMARKETPLACE_DATA);
export const getMonthMarketplaceData = () => api.get(url.GET_MONTHMARKETPLACE_DATA);
export const gethalfYearMarketplaceData = () => api.get(url.GET_HALFYEARMARKETPLACE_DATA);
export const getYearMarketplaceData = () => api.get(url.GET_YEARMARKETPLACE_DATA);

// Project
export const addProjectList = (project) => api.create(url.ADD_NEW_PROJECT, project);
export const updateProjectList = (project) => api.put(url.UPDATE_PROJECT, project);
export const deleteProjectList = (project) => api.delete(url.DELETE_PROJECT, { headers: { project } });

// Pages > Team
export const getTeamData = (team) => api.get(url.GET_TEAMDATA, team);
export const deleteTeamData = (team) => api.delete(url.DELETE_TEAMDATA, { headers: { team } });
export const addTeamData = (team) => api.create(url.ADD_NEW_TEAMDATA, team);
export const updateTeamData = (team) => api.put(url.UPDATE_TEAMDATA, team);

// File Manager

// Folder
export const getFolders = (folder) => api.get(url.GET_FOLDERS, folder);
export const deleteFolder = (folder) => api.delete(url.DELETE_FOLDER, { headers: { folder } });
export const addNewFolder = (folder) => api.create(url.ADD_NEW_FOLDER, folder);
export const updateFolder = (folder) => api.put(url.UPDATE_FOLDER, folder);

// File
export const getFiles = (file) => api.get(url.GET_FILES, file);
export const deleteFile = (file) => api.delete(url.DELETE_FILE, { headers: { file } });
export const addNewFile = (file) => api.create(url.ADD_NEW_FILE, file);
export const updateFile = (file) => api.put(url.UPDATE_FILE, file);

// To Do
export const getTodos = (todo) => api.get(url.GET_TODOS, todo);
export const deleteTodo = (todo) => api.delete(url.DELETE_TODO, { headers: { todo } });
export const addNewTodo = (todo) => api.create(url.ADD_NEW_TODO, todo);
export const updateTodo = (todo) => api.put(url.UPDATE_TODO, todo);

// To do Project
export const getProjects = (project) => api.get(url.GET_PROJECTS, project);
export const addNewProject = (project) => api.create(url.ADD_NEW_TODO_PROJECT, project);

//Job Application
export const getJobApplicationList = () => api.get(url.GET_APPLICATION_LIST);

//API Key
export const getAPIKey = () => api.get(url.GET_API_KEY);
// Kanban Board
export const getTasks = () => api.get(url.GET_TASKS);
export const addNewTasks = (card) => api.create(url.ADD_TASKS, card)
export const updateTasks = (card) => api.put(url.UPDATE_TASKS, card)
export const deleteTasks = (card) => api.delete(url.DELETE_TASKS, { headers: { card } })