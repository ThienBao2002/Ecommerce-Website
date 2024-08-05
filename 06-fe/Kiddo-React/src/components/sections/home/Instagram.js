import React, { Component } from 'react';
import instagram from "../../../data/instagram.json";
import { Link } from "react-router-dom";

class Instagram extends Component {
    render() {
        return (
            <div className="hm-section p-0">
                <div className="hm-section-title">
                    <h2>Instagram</h2>
                    <p>Nunc mauris enim, pretium quis orci eget</p>
                </div>
                <ul className="hm-list hm-instagram">
                    {/* Data */}
                    {instagram.slice(0, 8).map((item, i) => (
                        <li key={i}>
                            <Link to="#">
                                <img src={process.env.PUBLIC_URL + "/" + item.image} alt="instagram" />
                            </Link>
                        </li>
                    ))}
                    {/* Data */}
                </ul>
            </div>
        );
    }
}

export default Instagram;