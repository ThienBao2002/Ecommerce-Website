import React, { useState, useEffect } from 'react';
import { Col, Dropdown, DropdownMenu, DropdownToggle, Nav,
     NavItem, NavLink, Row, TabContent, TabPane,Button,Badge } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import classnames from 'classnames';

//import images
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar8 from "../../assets/images/users/avatar-8.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";
import bell from "../../assets/images/svg/bell.svg";

//SimpleBar
import SimpleBar from "simplebar-react";
import SocketListener from "./socketListener"
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
    getNotifications as onGetNotifications,
    updateNotification as onUpdateNotification,
    getOrders as onGetOrders
} from "../../slices/ecommerce/thunk";
//import notificationSoundSrc  from './../../assets/audio/airHornSoundEffect.mp3';
import notificationSoundSrc  from './../../assets/audio/dryPopUpNotification.wav';

const NotificationDropdown = () => {
    //Dropdown Toggle
    const [isNotificationDropdown, setIsNotificationDropdown] = useState(false);
    const toggleNotificationDropdown = () => {
        setIsNotificationDropdown(!isNotificationDropdown);
    };
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [notificationsSocket, setNotificationsSocket] = useState(null);
    const notificationsRedux = useSelector(state => state.Ecommerce.notifications);
    const [notificationsLive, setNotificationsLive] = useState(null);
    // Khởi tạo âm thanh
    const notificationSound = new Audio(notificationSoundSrc);
    useEffect(() => {
        // Trương hợp socket rỗng
        if ((!notificationsRedux || notificationsRedux.length === 0) && !notificationsSocket) {
            dispatch(onGetNotifications());
        }
        setNotificationsLive(notificationsRedux);
        //console.log("notificationsRedux",notificationsRedux);
    }, [notificationsRedux]);

    useEffect(() => {
        //Trường hợp có socket
        if (notificationsSocket?.notificationsList?.length !== 0) {
            setNotificationsLive(notificationsSocket);
            notificationSound.play()
                .catch(error => console.error("Error playing the sound.", error));
        }
       // console.log("notificationsSocket",notificationsSocket);

    }, [notificationsSocket])

    useEffect(() => {
        if (!notificationsLive)
            setNotificationsLive(notificationsRedux);
        //console.log("notificationsLive",notificationsLive);
    }, [notificationsLive])



    //Tab 
    const [activeTab, setActiveTab] = useState('2');
    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };
    function getBadgeClass(statusProcess) {
        switch (statusProcess) {
            case 'no process':
                return 'badge-gradient-secondary'; // Màu xám cho trạng thái chưa xử lý
            case 'processing':
                return 'badge-gradient-info'; // Màu xanh dương cho trạng thái đang xử lý
            case 'processed':
                return 'badge-gradient-success'; // Màu xanh lá cho trạng thái đã xử lý
            default:
                return 'badge-gradient-dark'; // Màu đen cho các trạng thái không xác định hoặc khác
        }
    }
    

    function getStatusText(statusProcess) {
        switch (statusProcess) {
            case 'no process':
                return 'Chưa xử lý';
            case 'processing':
                return 'Đang xử lý';
            case 'processed':
                return 'Đã xử lý';
            default:
                return 'Không rõ';
        }
    }
    function getNotificationTypeAndStyle(notification) {
        switch (notification.type) {
            case 'Order':
                return {
                    text: 'Đơn hàng',
                    styleClass: 'blockquote-primary',
                    detail: `Đơn hàng ${notification.details.orderCode}, tổng ${notification.details.total.toLocaleString()} VND, ${notification.details.paymentMethod}`
                };
            case 'Review':
                return {
                    text: 'Đánh giá',
                    styleClass: 'blockquote-warning',
                    detail: `${notification.details.reviewContent}, ${notification.details.rating} sao.`
                };
            default:
                return { 
                    text: notification.type, 
                    styleClass: 'blockquote-secondary',
                    detail: notification.details.someDetail || "Không có chi tiết"
                };
        }
    }
    const playSound = () => {
        notificationSound.play().catch(error => console.error("Error playing the sound.", error));
    };
    
    const handleNotificationDetails = async(idNotification,notificationType, details) => {
        const notificationStatusUpdate = {
            _id: idNotification,
            statusRead: "read",
        };
        // Gọi dispatch với đối tượng trạng thái đã cập nhật
        dispatch(onUpdateNotification(notificationStatusUpdate));
        if (notificationType === 'Review') {
            navigate(`/apps-ecommerce-product-details/${details.product}?reviewId=${details._id}`);
        } else if (notificationType === 'Order' ) { 
            await dispatch(onGetOrders());
            navigate(`/apps-ecommerce-orders?orderCode=${details.orderCode}`);
        }
    };
    
    return (
        <React.Fragment>
            <SocketListener
                notificationsSocket={notificationsSocket}
                setNotificationsSocket={setNotificationsSocket}>
            </SocketListener>
            <Dropdown isOpen={isNotificationDropdown} toggle={toggleNotificationDropdown} className="topbar-head-dropdown ms-1 header-item">
                <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                    <i className='bx bx-bell fs-22'></i>
                    <span
                        className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">{notificationsLive?.unreadNotifications}<span
                            className="visually-hidden">unread messages</span></span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                    <div className="dropdown-head bg-primary bg-pattern rounded-top">
                        <div className="p-3">
                            <Row className="align-items-center">
                                <Col>
                                    <h6 className="m-0 fs-16 fw-semibold text-white"> Thông báo </h6>
                                </Col>
                                <div className="col-auto dropdown-tabs">
                                    <Button color="danger" className="rounded-pill" onClick={playSound}>
                                        Bóp còi
                                    </Button>
                                </div>
                            </Row>
                        </div>

                        <div className="px-2 pt-2">
                            <Nav className="nav-tabs dropdown-tabs nav-tabs-custom">
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={classnames({ active: activeTab === '1' })}
                                        onClick={() => { toggleTab('1'); }}
                                    >
                                        Tất cả {notificationsLive?.notificationsList?.length}
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={classnames({ active: activeTab === '2' })}
                                        onClick={() => { toggleTab('2'); }}
                                    >
                                        Chưa xử lý {notificationsLive?.unprocessedNotifications}
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={classnames({ active: activeTab === '3' })}
                                        onClick={() => { toggleTab('3'); }}
                                    >
                                        Chưa Đọc {notificationsLive?.unreadNotifications}
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </div>

                    </div>

                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1" className="py-2 ps-2">
                            <SimpleBar style={{ maxHeight: "300px" }} className="pe-2">
                                {notificationsLive?.notificationsList?.map((notification) => {
                                    const { text, styleClass, detail } = getNotificationTypeAndStyle(notification);

                                    return (
                                        <Button onClick={()=>handleNotificationDetails(notification._id,notification.type,notification.details)}
                                         key={notification._id} className={`notification-item d-block dropdown-item position-relative ${notification.statusRead === 'unread' ? 'active' : ''}`}>
                                            <blockquote className={`blockquote custom-blockquote ${styleClass} rounded mb-0`}>
                                                <h6 className="mt-0 mb-1">{text} - <small>{notification.createDate}</small></h6>
                                                <p className="text-body mb-2">{detail}</p>
                                                <footer className="blockquote-footer mt-0">
                                                    <span className={`badge rounded-pill ${getBadgeClass(notification.statusProcess)}`}>
                                                        {getStatusText(notification.statusProcess)}
                                                    </span>
                                                    <Badge color="light" className="text-body" pill> {notification.ago} </Badge>
                                                </footer>
                                            </blockquote>
                                            <span className={`badge rounded-pill ${notification.statusRead === 'unread' ? 'bg-warning-subtle text-warning' : 'bg-secondary-subtle text-secondary'}`}>
                                                {notification.statusRead === 'unread' ? 'Mới' : 'Đã đọc'}
                                            </span>
                                        </Button>
                                    );
                                })}
                                <div className="my-3 text-center">
                                    <button type="button" className="btn btn-soft-success waves-effect waves-light">View All Notifications <i className="ri-arrow-right-line align-middle"></i></button>
                                </div>
                            </SimpleBar>
                        </TabPane>


                        <TabPane tabId="2" className="py-2 ps-2">
                            <SimpleBar style={{ maxHeight: "300px" }} className="pe-2">
                                {notificationsLive?.notificationsList?.filter(notification => notification.statusProcess === 'no process').map((notification) => {
                                    const { text, styleClass, detail } = getNotificationTypeAndStyle(notification);

                                    return (
                                        <Button onClick={()=>handleNotificationDetails(notification._id,notification.type,notification.details)}
                                            key={notification._id} className={`notification-item d-block dropdown-item position-relative ${notification.statusRead === 'unread' ? 'active' : ''}`}>
                                            <blockquote className={`blockquote custom-blockquote ${styleClass} rounded mb-0`}>
                                                <h6 className="mt-0 mb-1">{text} - <small>{notification.createDate}</small></h6>
                                                <p className="text-body mb-2">{detail}</p>
                                                <footer className="blockquote-footer mt-0">
                                                    <span className={`badge rounded-pill ${getBadgeClass(notification.statusProcess)}`}>
                                                        {getStatusText(notification.statusProcess)}
                                                    </span>
                                                    <Badge color="light" className="text-body" pill> {notification.ago} </Badge>
                                                </footer>
                                            </blockquote>
                                            <span className={`badge rounded-pill ${notification.statusRead === 'unread' ? 'bg-warning-subtle text-warning' : 'bg-secondary-subtle text-secondary'}`}>
                                                {notification.statusRead === 'unread' ? 'Mới' : 'Đã đọc'}
                                            </span>
                                        </Button>
                                    );
                                })}
                                <div className="my-3 text-center">
                                    <button type="button" className="btn btn-soft-success waves-effect waves-light">View All Notifications <i className="ri-arrow-right-line align-middle"></i></button>
                                </div>
                            </SimpleBar>
                        </TabPane>

                    
                        <TabPane tabId="3" className="py-2 ps-2">
                            <SimpleBar style={{ maxHeight: "300px" }} className="pe-2">
                                {notificationsLive?.notificationsList?.filter(notification => notification.statusRead === 'unread').map((notification) => {
                                    const { text, styleClass, detail } = getNotificationTypeAndStyle(notification);

                                    return (
                                        <Button onClick={()=>handleNotificationDetails(notification._id,notification.type,notification.details)}
                                            key={notification._id} className={`notification-item d-block dropdown-item position-relative ${notification.statusRead === 'unread' ? 'active' : ''}`}>
                                            <blockquote className={`blockquote custom-blockquote ${styleClass} rounded mb-0`}>
                                                <h6 className="mt-0 mb-1">{text} - <small>{notification.createDate}</small></h6>
                                                <p className="text-body mb-2">{detail}</p>
                                                <footer className="blockquote-footer mt-0">
                                                    <span className={`badge rounded-pill ${getBadgeClass(notification.statusProcess)}`}>
                                                        {getStatusText(notification.statusProcess)}
                                                    </span>
                                                    <Badge color="light" className="text-body" pill> {notification.ago} </Badge>
                                                </footer>
                                            </blockquote>
                                            <span className={`badge rounded-pill ${notification.statusRead === 'unread' ? 'bg-warning-subtle text-warning' : 'bg-secondary-subtle text-secondary'}`}>
                                                {notification.statusRead === 'unread' ? 'Mới' : 'Đã đọc'}
                                            </span>
                                        </Button>
                                    );
                                })}
                                <div className="my-3 text-center">
                                    <button type="button" className="btn btn-soft-success waves-effect waves-light">View All Notifications <i className="ri-arrow-right-line align-middle"></i></button>
                                </div>
                            </SimpleBar>
                        </TabPane>
                    </TabContent>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default NotificationDropdown;