import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';



function BlogSidebar({ category, getRecentPost, getAuthor, tags }) {
  const history = useNavigate();
  const [searchText, setSearchText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchText === "") {
      return;
    } else {
      history.push("/blog/search/" + searchText);
    }
  }

  const onChange = (event) => {
    setSearchText(event.target.value);
  }

  return (
    <>
      <div className="hm-widget hm-widget-search">
        <div className="hm-widget-title">
          <h3>Tìm kiếm</h3>
        </div>
        <div className="hm-sidebar-content">
          <form onSubmit={handleSubmit} method="Get">
            <div>
              <input type="search" className="form-control" placeholder="Search" name="searchText" value={searchText} onChange={onChange} required />
              <button type="submit"> <i className="fas fa-search" /> </button>
            </div>
          </form>
        </div>
      </div>
      <div className="hm-widget hm-widget-categories">
        <div className="hm-widget-title">
          <h3>Tất cả doanh mục</h3>
        </div>
        <div className="hm-sidebar-content">
          <ul className="hm-sidebar-list">
            {/* Data */}
            {category.map((item, i) => (
              <li key={i}>
                <Link to={"/blog/cat/" + item.id}>{item.title} <span>({item.count})</span></Link>
              </li>
            ))}
            {/* Data */}
          </ul>
        </div>
      </div>
      <div className="hm-widget hm-widget-posts">
        <div className="hm-widget-title">
          <h3>Bài viết gần đây</h3>
        </div>
        <div className="hm-sidebar-content">
          <ul>
            {/* Data */}
            {getRecentPost().map((item, i) => (
              <li key={i}>
                <Link to={"/blog-details/" + item.id}>
                  <img src={process.env.PUBLIC_URL + "/" + item.image} alt={item.title} />
                </Link>
                <div className="hm-widget-post-container">
                  <p><Link to={"/blog-details/" + item.id}>{item.title.slice(0, 20)}</Link></p>
                  {getAuthor(item.author).map((author, i) => (
                    <p className="hm-widget-post-author" key={i}><i className="fas fa-user" />
                      <span>{author.name}</span>
                    </p>
                  ))}
                </div>
              </li>
            ))}
            {/* Data */}
          </ul>
        </div>
      </div>
      <div className="hm-widget hm-widget-tags">
        <div className="hm-widget-title">
          <h3>Tag phổ biến</h3>
        </div>
        <div className="hm-sidebar-content">
          <ul className="list-inline mb-0">
            {/* Data */}
            {tags.map((item, i) => (
              <li className="list-inline-item" key={i}>
                <Link to={"/blog/tag/" + item.id}><span className="badge hm-tag">{item.title}</span></Link>
              </li>
            ))}
            {/* Data */}
          </ul>
        </div>
      </div>
    </>
  );
}

export default BlogSidebar;
