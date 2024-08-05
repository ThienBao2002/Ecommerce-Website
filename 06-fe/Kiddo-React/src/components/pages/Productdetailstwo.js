import { Fragment, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Để lấy giá trị từ params
import {Helmet} from "react-helmet";
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Content from '../sections/product-details-v2/Content';
//import Relatedproducts from '../sections/product-details/Relatedproducts';


function Productdetailstwo() {
  const { id } = useParams(); // Lấy giá trị id từ params

  useEffect(() => {
    // Đoạn mã bạn muốn thực hiện trong vòng đời của component
    // Ví dụ: Gọi API hoặc thực hiện các tác vụ khác
  }, [id]); // [id] chỉ định rằng useEffect sẽ được gọi lại khi giá trị id thay đổi

  const pagelocation = "Chi tiết sản phẩm"; // Đặt tên trang tùy ý

  return (
    <Fragment>
      <Helmet>
        <title>{`Kiddo - Thời trang trẻ em | ${pagelocation}`}</title>
        <meta name="description" content="#" />
      </Helmet>
      <Header />
      <div className="container">
        <div className="hm-section">
          <Content detailId={id} />
          {/* <Relatedproducts detailId={id} /> */}
        </div>
      </div>
      <Footer />
    </Fragment>
  );
}

export default Productdetailstwo;