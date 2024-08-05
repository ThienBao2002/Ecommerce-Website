import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Cta extends Component {
    render() {
        return (
            <div className="hm-section hm-explore cta-alice">
                <div className="container text-center">
                    <h3>Explore the Beauty in you</h3>
                    <Link to="/shop" className="btn btn-secondary btn-xl">Shop now</Link>
                </div>
            </div>
        );
    }
}

export default Cta;