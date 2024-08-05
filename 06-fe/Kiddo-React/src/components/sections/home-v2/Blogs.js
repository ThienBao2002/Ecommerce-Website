import React, { Component } from 'react';
import { getRecentPost, getDateInitial } from "../../../helper/blogHelper";
import { Link } from 'react-router-dom';

class Blogs extends Component {
    render() {
        return (
            <div className="hm-section hm-posts">
                <div className="container">
                    <div className="hm-section-title">
                        <h2>Our Latest Blog</h2>
                        <p>Nunc mauris enim, pretium quis orci eget.</p>
                    </div>
                    <div className="row">
                        {/* Data */}
                        {getRecentPost().map((item, i) => (
                            <div className="col-lg-3 col-md-6" key={i}>
                                <article className="hm-post">
                                    <div className="hm-post-date-container">
                                        <Link to={"/blog-details/" + item.id}>
                                            <p className="hm-post-date" dangerouslySetInnerHTML={{ __html: getDateInitial(item.postdate) }} />
                                        </Link>
                                    </div>
                                    <h3 className="hm-post-title"><Link to={"/blog-details/" + item.id}>{item.title}</Link></h3>
                                    <Link to={"/blog-details/" + item.id} className="btn-link">Read more</Link>
                                </article>
                            </div>
                        ))}
                        {/* Data */}
                    </div>
                </div>
            </div>
        );
    }
}

export default Blogs;