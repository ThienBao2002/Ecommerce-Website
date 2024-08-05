import React, { Component } from 'react';
import brands from "../../../data/brands.json";

class Brands extends Component {
    render() {
        return (
            <div className="hm-section pt-0">
                <div className="container">
                    <div className="row">
                        {/* Data */}
                        {brands.slice(0, 6).map((item, i) => (
                            <div className="col-md-2 col-sm-6" key={i}>
                                <div className="hm-client">
                                    <img src={process.env.PUBLIC_URL + "/" + item.image} alt="client" />
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

export default Brands;