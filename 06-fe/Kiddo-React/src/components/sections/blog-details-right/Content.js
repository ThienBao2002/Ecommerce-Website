import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getBlog } from "../../../helper/blogHelper";
import { getAuthor, socialShare } from '../../../helper/helper';
import Sidebar from '../../layouts/Blogsidebar';

class Content extends Component {
    constructor(props) {
        super(props);
        this.openSocialPopup = this.openSocialPopup.bind(this);
    }
    // Open window
    openSocialPopup(social) {
        window.open(social.link, "MsgWindow", "width=600,height=600")
        // alert(social.title)
    }
    render() {
        const detailId = this.props.detailId;
        const item = getBlog(detailId);
        return (
            <div className="container">
                <div className="hm-section">
                    <div className="row">
                        <div className="col-xl-9 col-lg-9">
                            <article className="hm-post hm-post-inner">
                                <div className="hm-post-img-wrapper">
                                    <img src={process.env.PUBLIC_URL + "/" + item.image} alt={item.title} />
                                </div>
                                <h3 className="hm-post-title">{item.title}</h3>
                                <div className="hm-post-content" dangerouslySetInnerHTML={{ __html: item.htmltext }} />
                                <ul className="hm-post-share">
                                    <li>Share: </li>
                                    {/* Data */}
                                    {socialShare(item.title).map((social, i) => (
                                        <li className="hm-sm-share" key={i}>
                                            <Link to="#" onClick={(e) => this.openSocialPopup(social, i)}>
                                                <i className={social.iconClass} />
                                            </Link>
                                        </li>
                                    ))}
                                    {/* Data */}
                                </ul>
                                <div className="hm-post-comments">
                                    <h3> <u>Comments({item.reviews.length})</u> </h3>
                                    {/* Data */}
                                    {item.reviews.map((review, i) => (
                                        <ul className="hm-comments" key={i}>
                                            {/* Data */}
                                            {getAuthor(review.user).map((user, i) => (
                                                <li key={i} className="hm-comment-container">
                                                    <div className="hm-comment-img">
                                                        <img src={process.env.PUBLIC_URL + "/" + user.image} alt={user.name} />
                                                    </div>
                                                    <div className="hm-comment-inner">
                                                        <p className="hm-comment-author">{user.name}</p>
                                                        <p>{review.comment}</p>
                                                        <div className="hm-comment-meta">
                                                            <Link to="#" className="btn-link">Reply</Link>
                                                            <span> <i className="fas fa-clock" /> {review.timebeforecomment} </span>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                            {/* Data */}
                                            {review.replies.map((review, i) => (
                                                <li className="hm-comment-container is-reply" key={i}>
                                                    {getAuthor(review.user).map((user, i) => (
                                                        <div className="hm-comment-img" key={i}>
                                                            <img src={process.env.PUBLIC_URL + "/" + user.image} alt={user.name} />
                                                        </div>
                                                    ))}
                                                    {getAuthor(review.user).map((user, i) => (
                                                        <div className="hm-comment-inner" key={i}>
                                                            <p className="hm-comment-author">{user.name}</p>
                                                            <p>{review.comment}</p>
                                                            <div className="hm-comment-meta">
                                                                <Link to="#" className="btn-link">Reply</Link>
                                                                <span> <i className="fas fa-clock" /> {review.timebeforecomment} </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </li>
                                            ))}
                                            {/* Data */}
                                        </ul>
                                    ))}
                                    {/* Data */}
                                </div>
                                <h3> <u>Leave a Reply</u> </h3>
                                <form className="hm-comment-form">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="full_name">Full Name</label>
                                                <input type="text" id="full_name" className="form-control" name="full_name" placeholder="Full Name" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="email">Email Address</label>
                                                <input type="email" className="form-control" id="email" name="email" placeholder="Email Address" required />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="message">Message</label>
                                                <textarea name="name" className="form-control" id="message" rows={5} placeholder="Message" required />
                                            </div>
                                        </div>
                                    </div>
                                    <input type="submit" name="submit" className="btn btn-primary btn-md" defaultValue="Submit" />
                                </form>
                            </article>
                        </div>
                        <div className="col-xl-3 col-lg-3">
                            <Sidebar />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;