import React, { Component } from 'react';
import block from "../../../data/block.json";
import { Link } from 'react-router-dom';

class Block extends Component {
    render() {
        return (
            <div className="hm-section hm-product-categories hm-product-categories-style2">
                <div className="container">
                    <div className="row">
                        {/* Data */}
                        {block.slice(0, 3).map((item, i) => (
                            <div className="col-md-4" key={i}>
                                <Link to="/shop">
                                    <div className="hm-product-category">
                                        <img src={process.env.PUBLIC_URL + "/" + item.image} alt={item.title} />
                                        <div className="hm-category-overlay">
                                            <h2>{item.title}</h2>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                        {/* Data */}
                    </div>
                </div>
            </div>
        );
    }
}

export default Block;