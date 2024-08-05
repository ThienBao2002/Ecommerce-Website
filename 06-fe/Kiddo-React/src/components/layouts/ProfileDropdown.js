import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import '../../assets/css/style.css';
import { logoutUser,endSession} from "../../slices/thunks";


//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";

const ProfileDropdown = () => {
    const dispatch = useDispatch();
    const handleLogoutClick = () => {
      // Xử lý logic đăng xuất ở đây
      // Ví dụ: Đặt trạng thái đăng nhập về false hoặc thực hiện các hoạt động đăng xuất khác
      dispatch(logoutUser());
      dispatch(endSession());
    };

    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };
    /**=============get user by token */
    const token = useSelector((state) => state.Session.decodedToken);
    useEffect(()=>{
      console.log(token);

    },[token])

    const navigate = useNavigate();

    const handleDropdownItemClick = (url) => {
    // Thực hiện chuyển hướng khi nhấp vào DropdownItem
    navigate(url);
    };
    return (
      <React.Fragment>
        <Dropdown
          isOpen={isProfileDropdown}
          toggle={toggleProfileDropdown}
          className=""
        >
          <DropdownToggle tag="button" type="button" className="btn">
            <span className="d-flex align-items-center">
              <img
                className="rounded-circle header-profile-user"
                src={avatar1}
                alt="Header Avatar"
              />
              <span className="text-start ms-xl-2">
                <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                  {token.name}
                </span>
                <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                  {token.role}
                </span>
              </span>
            </span>
          </DropdownToggle>
          <DropdownMenu
            className="dropdown-menu-end "
            style={{ width: "250px" }}
          >
            <h6 className="dropdown-header">Xin chào {token.name}!</h6>
            <DropdownItem className="dropdown-item p-0" onClick={() => handleDropdownItemClick('/profile')} >
              <Link to={"/profile"}>
                <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>{" "}
                <span className="align-middle">Thông tin cá nhân</span>
              </Link>
            </DropdownItem>
            <DropdownItem className="p-0 dropdown-item">
              <Link
                to={"/"}
                onClick={handleLogoutClick}
              >
                <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
                <span className="align-middle" data-key="t-logout">
                  Đăng xuất
                </span>
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
    );
};

export default ProfileDropdown;