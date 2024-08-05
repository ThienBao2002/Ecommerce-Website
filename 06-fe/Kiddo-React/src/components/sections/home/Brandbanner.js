import React, { Component } from 'react';
import brandbanner from "../../../data/brandbanner.json";
import { Link } from "react-router-dom";

class Brandbanner extends Component {
    render() {
        return (
            <div className="hm-section hm-product-categories-style3 hm-product-categories">
                <div className="container">
                    <div className="row">
                        {/* Data */}
                        {brandbanner.slice(0, 1).map((item, i) => (
                            <div className="col-md-6" key={i}>
                                <div className="hm-product-category">
                                    <img src={process.env.PUBLIC_URL + "/" + item.image} alt={item.title} />
                                    <div className="hm-product-category-inner">
                                        <p dangerouslySetInnerHTML={{ __html: item.title }} />
                                        <Link to="/shop-grid-left" className="btn btn-secondary btn-md">Đến mục sản phẩm</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {brandbanner.slice(1, 2).map((item, i) => (
                            <div className="col-md-6" key={i}>
                                <div className="hm-product-category">
                                    <img src={process.env.PUBLIC_URL + "/" + item.image} alt={item.title} />
                                    <div className="hm-product-category-inner">
                                        <p dangerouslySetInnerHTML={{ __html: item.title }} />
                                        <Link to="/blog" className="btn btn-secondary btn-md">Đến bản tin</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Data */}
                    </div>
                </div>
            </div>
        );
    }
}

export default Brandbanner;