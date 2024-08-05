import React, { Suspense, useEffect, useLayoutEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
//import Scss
import "./assets/scss/themes.scss";
import DialogFlowMessenger from "./DialogFlowMessenger";
import { useDispatch, useSelector } from "react-redux";
import { startSession } from "./slices/thunks";
import { getLoggedinUser } from "./helper/api_helper";

// Home
const Home = React.lazy(() => import("./components/pages/Home"));
const Hometwo = React.lazy(() => import("./components/pages/Hometwo"));
// Pages
const Contact = React.lazy(() => import("./components/pages/Contact"));
const About = React.lazy(() => import("./components/pages/About"));
const Faqs = React.lazy(() => import("./components/pages/Faqs"));
const Login = React.lazy(() => import("./components/pages/Login"));
const Register = React.lazy(() => import("./components/pages/Register"));
const ForgetPassword = React.lazy(() => import("./components/pages/ForgetPassword"));
const BasicPasswReset = React.lazy(() => import("./components/pages/BasicPasswReset"));
const Error = React.lazy(() => import("./components/pages/Error"));
const Comingsoon = React.lazy(() => import("./components/pages/Comingsoon"));
const Wishlist = React.lazy(() => import("./components/pages/Wishlist"));
const Cart = React.lazy(() => import("./components/pages/Cart"));
const Checkout = React.lazy(() => import("./components/pages/Checkout"));
const Checkouttwo = React.lazy(() => import("./components/pages/Checkouttwo"));
const Profile = React.lazy(() => import("./components/pages/Profile"));
const Orderdetails = React.lazy(() =>
  import("./components/pages/Orderdetails")
);
const Invoicesdetails = React.lazy(() =>
  import("./components/pages/Invoicesdetails")
);
// Blog
const Blog = React.lazy(() => import("./components/pages/Blog"));
const Blogleft = React.lazy(() => import("./components/pages/Blogleft"));
const Blogright = React.lazy(() => import("./components/pages/Blogright"));
const Bloglist = React.lazy(() => import("./components/pages/Bloglist"));
const Bloglistleft = React.lazy(() =>
  import("./components/pages/Bloglistleft")
);
const Bloglistright = React.lazy(() =>
  import("./components/pages/Bloglistright")
);
const Blogdetails = React.lazy(() => import("./components/pages/Blogdetails"));
const Blogdetailsleft = React.lazy(() =>
  import("./components/pages/Blogdetailsleft")
);
const Blogdetailsright = React.lazy(() =>
  import("./components/pages/Blogdetailsright")
);
// Shop
const Shopgrid = React.lazy(() => import("./components/pages/Shopgrid"));
const Shopgridfull = React.lazy(() =>
  import("./components/pages/Shopgridfull")
);
const Shopgridleft = React.lazy(() =>
  import("./components/pages/Shopgridleft")
);
const Shopgridright = React.lazy(() =>
  import("./components/pages/Shopgridright")
);
const Shoplist = React.lazy(() => import("./components/pages/Shoplist"));
const Shoplistleft = React.lazy(() =>
  import("./components/pages/Shoplistleft")
);
const Shoplistright = React.lazy(() =>
  import("./components/pages/Shoplistright")
);
const Productdetails = React.lazy(() =>
  import("./components/pages/Productdetails")
);
const Productdetailstwo = React.lazy(() =>
  import("./components/pages/Productdetailstwo")
);
const Productdetailsthree = React.lazy(() =>
  import("./components/pages/Productdetailsthree")
);

const ScrollToTop = ({ children }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]); // Sử dụng pathname từ location để trigger effect

  return children || null;
};

function App() {
  const token = useSelector((state) => state.Session.decodedToken);
  const dispatch = useDispatch();
  const [sessionStartAttempts, setSessionStartAttempts] = useState(0);

  useEffect(() => {
    if (!token && sessionStartAttempts < 4) {
      dispatch(startSession());
      setSessionStartAttempts(sessionStartAttempts + 1);
      getLoggedinUser();
    }
    // eslint-disable-next-line 
  }, [token, sessionStartAttempts]);
  return (
    <Suspense fallback={<div></div>}>
      <ScrollToTop>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />
          <Route path="/home-v2" element={<Hometwo />} />
          {/* Home */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password/" element={<ForgetPassword />} />
          <Route path="/auth-pass-change-basic/:id" element={<BasicPasswReset />} />
          <Route path="/error-404" element={<Error />} />
          <Route path="/coming-soon" element={<Comingsoon />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout-v2" element={<Checkouttwo />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/apps-ecommerce-order-details/:_id"
            element={<Orderdetails />}
          />
          <Route
            path="/apps-invoices-details/:_id"
            element={<Invoicesdetails />}
          />
          {/* Home */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog-left" element={<Blogleft />} />
          <Route path="/blog-right" element={<Blogright />} />
          <Route path="/blog-list" element={<Bloglist />} />
          <Route path="/blog-list-left" element={<Bloglistleft />} />
          <Route path="/blog-list-right" element={<Bloglistright />} />
          <Route path="/blog-details/:id" element={<Blogdetails />} />
          <Route path="/blog-details-left/:id" element={<Blogdetailsleft />} />
          <Route
            path="/blog-details-right/:id"
            element={<Blogdetailsright />}
          />
          {/* Home */}
          <Route path="/shop/cat/:catId" element={<Shopgrid />} />
          <Route exact path="/shop/tag/:tagId" component={props => (<Shopgrid {...props} key={window.location.pathname} />)} />
          <Route exact path="/shop/search/:query" component={props => (<Shopgrid {...props} key={window.location.pathname} />)} />
          <Route exact path="/shop/:minPrice/:maxPrice" component={props => (<Shopgrid {...props} key={window.location.pathname} />)} /> 
          <Route path="/shop" element={<Shopgrid />} />
          <Route path="/shop-grid-full" element={<Shopgridfull />} />
          <Route path="/shop-grid-left" element={<Shopgridleft />} />
          <Route path="/shop-grid-left-promotion/:id" element={<Shopgridleft />} />
          <Route path="/shop-grid-left-category/:categoryNameSlug" element={<Shopgridleft />} />
          <Route path="/shop-grid-left-brand/:brandNameSlug" element={<Shopgridleft />} />
          <Route path="/shop-grid-right" element={<Shopgridright />} />
          <Route path="/shop-list" element={<Shoplist />} />
          <Route path="/shop-list-left" element={<Shoplistleft />} />
          <Route path="/shop-list-right" element={<Shoplistright />} />
          <Route path="/product-details/:id" element={<Productdetails />} />
          <Route
            path="/product-details-v2/:id"
            element={<Productdetailstwo />}
          />
          <Route
            path="/product-details-v3/:id"
            element={<Productdetailsthree />}
          />
          {/* Extra */}
          <Route path="*" element={<Error />} />
        </Routes>
        <DialogFlowMessenger></DialogFlowMessenger>
      </ScrollToTop>
    </Suspense>
  );
}

export default App;
