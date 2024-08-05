import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Breadcrumbs2 extends Component {
    render() {
        return (
            <div className="hm-sub-header-customer-service">
                <div className="container">
                    <div className="hm-sub-header-nav">
                        <h1>{this.props.breadcrumb.pagename}</h1>
                        <Link to="/">Trang chủ <span className="hm-text-primary"><i className="fas fa-arrow-circle-right" /></span></Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Breadcrumbs2;