import React, { Fragment } from 'react';
import NavHelper from "../../helper/NavHelper";
import { Link } from 'react-router-dom';
import navigation from '../../data/navigation.json';

class Mobilemenu extends NavHelper {
    render() {
        return (
            <Fragment>
                <form className="hm-drawer-search">
                    <input type="search" placeholder="Search Products" name="drawer_search" required />
                    <i className="fas fa-search" />
                </form>
                <ul className="hm-nav" id="hm-drawer-nav">
                    {navigation.length > 0 ? navigation.map((item, i) => (
                        <li key={i} className={`hm-nav-item d-block ${item.child ? '' : ''} `} onClick={this.triggerChild}>
                            {item.child ? <Link className="nav-link" data-toggle="collapse" onClick={e => e.preventDefault()} to="/"> {item.linkText} </Link> : <Link className="nav-link" to={item.link}> {item.linkText} </Link>}
                            {item.child ?
                                <ul className="collapse" role="menu">
                                    {item.submenu.map((sub_item, i) => (
                                        <li key={i} className={`${sub_item.child ? '' : ''} `}>
                                            {sub_item.child ? <Link className="nav-link" data-toggle="collapse" onClick={e => e.preventDefault()} to="/"> {sub_item.linkText} </Link> : <Link className="nav-link" to={sub_item.link}> {sub_item.linkText} </Link>}
                                            {sub_item.submenu ?
                                                <ul className="collapse">
                                                    {sub_item.submenu.map((third_item, i) => (
                                                        <li key={i}><Link className="nav-link"
                                                            to={third_item.link}>{third_item.linkText}</Link>
                                                        </li>
                                                    ))}
                                                </ul> : null}
                                        </li>
                                    ))}
                                </ul>
                                : null
                            }
                        </li>
                    )) : null}
                </ul>
            </Fragment>
        );
    }
}

export default Mobilemenu;