import {
    userForgetPasswordSuccess, userForgetPasswordError,
    userForgetPasswordSuccessReset, userForgetPasswordErrorReset,
} from "./reducer"
//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helper/firebase_helper";

import {
    postFakeForgetPwdReset,
    postFakeForgetPwd,
    postJwtForgetPwd,
} from "../../../helper/fakebackend_helper";

const fireBaseBackend = getFirebaseBackend();

export const userForgetPassword = (user, history) => async (dispatch) => {
    try {
        let response;
        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
  
            response = fireBaseBackend.forgetPassword(
                user.email
            )
  
        } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
            response = postJwtForgetPwd(
                user
            )
        } else {
            response = postFakeForgetPwd(
                user.email
            )
        }
  
        const data = await response;
        console.log(data);
  
        if (data) {
            dispatch(userForgetPasswordSuccess(
                "Chúng tôi đã gửi đường dẫn khôi phục mật khẩu, vui lòng kiểm tra email"
            ))
        }
    } catch (forgetError) {
        dispatch(userForgetPasswordError(forgetError))
    }
  }
export const userForgetPasswordReset = (user, history) => async (dispatch) => {
    try {
        let response;
        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
  
            response = fireBaseBackend.forgetPassword(
                user.email
            )
  
        } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
          console.log(user);
            response = postFakeForgetPwdReset(
                user
            )
        } else {
            response = postFakeForgetPwd(
                user.email
            )
        }
  
        const data = await response;
        console.log(data);
        if (data) {
            dispatch(userForgetPasswordSuccessReset(
                "Hoàn tất"
            ))
        }
    } catch (forgetError) {
        dispatch(userForgetPasswordErrorReset(forgetError))
    }
  }