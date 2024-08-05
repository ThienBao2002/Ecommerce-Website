import React, { Fragment } from 'react';
import NavHelper from "../../helper/NavHelper";
import Offermodal from "./Offermodal";
import Offerstrip from "./Offerstrip";
import Mobilemenu from "./Mobilemenu";
import Topcart from "./Topcart";
import Topwishlist from "./Topwishlist";
import navigation from "../../data/navigation.json";
import { Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";

const cartlength = 5;
const wishlistlength = 5;

const blogBanner = [
    {
        image: "assets/img/other/mega-menu-wide.png"
    },
    {
        image: "assets/img/other/mega-menu-wide-1.png"
    },
    {
        image: "assets/img/other/mega-menu-wide-3.png"
    }
]

class Headerthree extends NavHelper {
    render() {
        const stickyHeader = this.state.stickyheader ? ' sticky' : '';
        return (
            <Fragment>
                <Offermodal />
                <Offerstrip />
                {/* Header */}
                <header className={"hm-header hm-header-dark hm-header-absolute can-sticky hm-header-fw" + stickyHeader}>
                    <nav className="hm-navbar">
                        <Link to="/" className="hm-navbar-brand"> <img src={process.env.PUBLIC_URL + "/assets/img/logo-white.png"} alt="logo" /> </Link>
                        <button className="hm-nav-toggler" type="button" onClick={this.toggleNav}>
                            <span />
                            <span />
                            <span />
                        </button>
                        {/* Desktop Menu */}
                        <div className="d-none d-lg-block">
                            <ul className="hm-nav">
                                {/* /Mega Menu Home */}
                                {navigation.slice(0, 3).map((item, i) => (
                                    <li key={i} className={item.child === true ? 'hm-nav-item hm-nav-item-has-children' : 'hm-nav-item'}>
                                        {item.child === true ?
                                            <Link to="#" className="nav-link" >{item.linkText}</Link>
                                            :
                                            <Link to={item.link} className="nav-link">{item.linkText}</Link>
                                        }
                                        {item.child === true ?
                                            <ul className="sub-menu">
                                                {item.submenu.map((item, i) => (
                                                    <li key={i} className={item.child === true ? 'hm-nav-item hm-nav-item-has-children' : 'hm-nav-item'}>
                                                        {item.child === true ?
                                                            <Link to="#" className="nav-link" >{item.linkText}</Link>
                                                            :
                                                            <Link to={item.link} className="nav-link">{item.linkText}</Link>
                                                        }
                                                        {item.child === true ?
                                                            <ul className="sub-menu">
                                                                {item.submenu.map((item, i) => (
                                                                    <li className="hm-nav-item" key={i}>
                                                                        <Link to={item.link} className="nav-link">{item.linkText}</Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            : ''}
                                                    </li>
                                                ))}
                                            </ul>
                                            : ''}
                                    </li>
                                ))}
                                {/* Mega Menu Blog */}
                                {navigation.slice(3, 4).map((item, i) => (
                                    <li className="hm-nav-item hm-nav-item-has-children has-mega-menu hm-mega-menu--3-col" key={i}>
                                        <Link to="#" className="nav-link">{item.linkText}</Link>
                                        <ul className="sub-menu">
                                            <li className="hm-mega-menu-wrapper clearfix">
                                                {item.submenu.map((item, i) => (
                                                    <ul className="hm-mega-menu" key={i}>
                                                        <li className="hm-nav-item hm-mega-menu-title"> {item.linkText} </li>
                                                        {item.submenu.map((item, i) => (
                                                            <li className="hm-nav-item" key={i}>
                                                                <Link to={item.link} className="nav-link">{item.linkText}</Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ))}
                                                <ul className="hm-mega-menu hm-mega-menu-row mt-4">
                                                    <Carousel>
                                                        {blogBanner.map((item, i) => (
                                                            <Carousel.Item key={i}>
                                                                <div className="picsum-img-wrapper">
                                                                    <img src={process.env.PUBLIC_URL + "/" + item.image} alt="img" />
                                                                </div>
                                                            </Carousel.Item>
                                                        ))}
                                                    </Carousel>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                ))}
                                {/* /Mega Menu Blog */}
                                {/* Mega Menu Shop */}
                                {navigation.slice(4, 5).map((item, i) => (
                                    <li className="hm-nav-item hm-nav-item-has-children has-mega-menu hm-mega-menu--3-col" key={i}>
                                        <Link to="#" className="nav-link">{item.linkText}</Link>
                                        <ul className="sub-menu">
                                            <li className="hm-mega-menu-wrapper clearfix">
                                                {/* Data */}
                                                {item.submenu.map((item, i) => (
                                                    <ul className="hm-mega-menu" key={i}>
                                                        <li className="hm-nav-item hm-mega-menu-title"> {item.linkText} </li>
                                                        {item.submenu.map((item, i) => (
                                                            <li className="hm-nav-item" key={i}>
                                                                <Link to={item.link} className="nav-link">{item.linkText}</Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ))}
                                                {/* Data */}
                                            </li>
                                        </ul>
                                    </li>
                                ))}
                                {/* /Mega Menu Shop */}
                                {/* /Mega Menu Contact */}
                                {navigation.slice(5, 8).map((item, i) => (
                                    <li key={i} className={item.child === true ? 'hm-nav-item hm-nav-item-has-children' : 'hm-nav-item'}>
                                        {item.child === true ?
                                            <Link to="#" className="nav-link" >{item.linkText}</Link>
                                            :
                                            <Link to={item.link} className="nav-link">{item.linkText}</Link>
                                        }
                                        {item.child === true ?
                                            <ul className="sub-menu">
                                                {item.submenu.map((item, i) => (
                                                    <li key={i} className={item.child === true ? 'hm-nav-item hm-nav-item-has-children' : 'hm-nav-item'}>
                                                        {item.child === true ?
                                                            <Link to="#" className="nav-link" >{item.linkText}</Link>
                                                            :
                                                            <Link to={item.link} className="nav-link">{item.linkText}</Link>
                                                        }
                                                        {item.child === true ?
                                                            <ul className="sub-menu">
                                                                {item.submenu.map((item, i) => (
                                                                    <li className="hm-nav-item" key={i}>
                                                                        <Link to={item.link} className="nav-link">{item.linkText}</Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            : ''}
                                                    </li>
                                                ))}
                                            </ul>
                                            : ''}
                                    </li>
                                ))}
                                {/* /Mega Menu Contact */}
                            </ul>
                        </div>
                        {/* /Desktop Menu */}
                        {/* Mobile Menu */}
                        <aside className="hm-drawer">
                            <Mobilemenu />
                        </aside>
                        {/* /Mobile Menu */}
                        <ul className="hm-nav-controls">
                            <li>
                                <form className="hm-drawer-search">
                                    <input type="search" placeholder="Search Products" name="drawer_search" required />
                                    <i className="flaticon-search hm-trigger-search" onClick={this.toggleSearch} />
                                </form>
                            </li>
                            <li className="hm-trigger-favorite hm-nav-item-has-children">
                                <i className="flaticon-like hm-has-notification"> <span className="hm-bg-primary">{wishlistlength}</span> </i>
                                <ul className="sub-menu sub-menu-right py-2">
                                    <Topwishlist />
                                </ul>
                            </li>
                            <li className="hm-trigger-cart hm-nav-item-has-children">
                                <i className="flaticon-shopping-cart hm-has-notification"> <span className="hm-bg-primary">{cartlength}</span></i>
                                <ul className="sub-menu sub-menu-right py-2">
                                    <Topcart />
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </header>

            </Fragment>
        );
    }
}

export default Headerthree;