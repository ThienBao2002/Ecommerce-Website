import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import blogpost from '../../../data/blog/blog.json';
import { getDateInitial } from '../../../helper/blogHelper';
import Sidebar from '../../layouts/Blogsidebar';
import Pagination from "react-js-pagination";

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: blogpost,
            activePage: 1,
            itemPerpage: 12
        }
    }
    handlePageChange(pageNumber) {
        this.setState({ activePage: pageNumber });
    }
    render() {
        const paginationData = this.state.data.slice((this.state.activePage - 1) * this.state.itemPerpage, this.state.activePage * this.state.itemPerpage).map((item, i) => {
            return <div key={i} className="col-lg-4 col-md-6">
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
        });
        return (
            <div className="hm-section hm-posts">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-9 col-lg-9">
                            <div className="row">
                                {/* Data */}
                                {paginationData}
                                {/* Data */}
                            </div>
                            {/* Pagination */}
                            <div className="hm-pagination">
                                <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={this.state.itemPerpage}
                                    totalItemsCount={this.state.data.length}
                                    pageRangeDisplayed={this.state.data.length}
                                    onChange={this.handlePageChange.bind(this)}
                                    innerClass="pagination justify-content-center mb-0"
                                    activeClass="active"
                                    itemClass="page-item"
                                    linkClass="page-link"
                                />
                            </div>
                            {/* Pagination */}
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