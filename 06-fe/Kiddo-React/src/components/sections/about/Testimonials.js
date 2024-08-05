import React, { Component } from 'react';
import { Carousel } from "react-bootstrap";
import testimonials from "../../../data/testimonials.json";
import { getAuthor, Rating } from "../../../helper/helper";

class Testimonials extends Component {
    render() {
        return (
            <div className="hm-section hm-testimonials pt-0">
                <div className="container">
                    <div className="hm-section-title">
                        <h2>Trusted by 3000+ Users</h2>
                        <p>Nunc mauris enim, pretium quis orci eget</p>
                    </div>
                    <Carousel controls={false} indicators={false}>
                        {testimonials.map((item, i) => (
                            <Carousel.Item key={i}>
                                <div className="row">
                                    <div className="col-md-5">
                                        {getAuthor(item.author).map((author, i) => (
                                            <div className="hm-testimonial-user text-center" key={i}>
                                                <h4>{author.name}</h4>
                                                <p className="mb-2">{author.post}</p>
                                                <div className="hm-testimonial-meta">
                                                    <span className="badge badge-primary mr-1">{item.rating}.0</span>
                                                    <ul className="hm-product-rating">
                                                        {Rating(item.rating)}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-md-7">
                                        <div className="hm-testimonial">
                                            <i className="flaticon-right-quote" />
                                            <p>{item.comment.slice(0, 250)}</p>
                                        </div>
                                    </div>
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                    <div className="row">
                        <div className="col-md-5">
                            <ul className="hm-testimonial-clients carousel-indicators">
                                {testimonials.map((item, i) => (
                                    <li key={i}>
                                        {getAuthor(item.author).map((author, i) => (
                                            <img src={process.env.PUBLIC_URL + "/" + author.image} alt={author.name} key={i} />
                                        ))}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Testimonials;