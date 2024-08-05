import { combineReducers } from "redux";

// Authentication
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import ProfileReducer from "./auth/profile/reducer";

//Ecommerce
import EcommerceReducer from "./ecommerce/reducer";
// Dashboard Ecommerce
import DashboardEcommerceReducer from "./dashboardEcommerce/reducer";

// API Key
import APIKeyReducer from "./apiKey/reducer";
//Session
import SessionReducer from "./auth/session/reducer"

const rootReducer = combineReducers({
    Login: LoginReducer,
    Account: AccountReducer,
    ForgetPassword: ForgetPasswordReducer,
    Profile: ProfileReducer,
    Ecommerce: EcommerceReducer,
    DashboardEcommerce: DashboardEcommerceReducer,
    APIKey: APIKeyReducer,
    Session: SessionReducer
});

export default rootReducer;