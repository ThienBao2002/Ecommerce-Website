import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";
import {
  //getOrderById as onGetOrderByID,
  addNewReplyReviewByReviewId as onAddNewReplyReviewByReviewId,
  getNotifications as onGetNotifications
  //startSession,
} from "../../../slices/thunks";
const ProductReview = ({ review }) => {
  const token = useSelector((state) => state.Session.decodedToken);
  const dispatch = useDispatch();
  const [showTextarea, setShowTextarea] = useState(false);
  const [textareaValue, setTextareaValue] = useState('');
  

  const handleButtonClick = () => {
    setShowTextarea(!showTextarea);
    
  };
  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value);
  };

  const handleAddReplyReview = async() => {
    // Xử lý logic khi nhấn nút Gửi ở đây
    // Sử dụng giá trị của textareaValue để lấy nội dung của textarea
    console.log(textareaValue);
    
    try {
      const reviewData = {
        _id:review._id,
        userId: token.userId,
        reply: textareaValue
      };
      // Dispatch the addNewReview action and wait for it to finish.
      const actionResult = await dispatch(onAddNewReplyReviewByReviewId(reviewData));
      dispatch(onGetNotifications());

      
      // You can check the action result to see if it was fulfilled or rejected
      if (onAddNewReplyReviewByReviewId.fulfilled.match(actionResult)) {
          // The dispatch was successful
          console.log(actionResult.payload);
          handleButtonClick();

      } else if (onAddNewReplyReviewByReviewId.rejected.match(actionResult)) {
          // The dispatch was failed
          console.error(actionResult.error);
      }
  } catch (error) {
      console.error('Dispatch failed:', error);
  }
  };
  return (
    <React.Fragment>
      {console.log(review)}
      <li className="py-2">
        <div className="border border-dashed rounded p-3">
          <div className="d-flex align-items-start mb-3">
            <div className="hstack gap-3">
              <div className="badge rounded-pill bg-success mb-0">
                <i className="mdi mdi-star"></i> {review.rating}
              </div>
              <div className="vr"></div>
              <div className="flex-grow-1">
                <h5 className="fs-14 mb-0">{review.user.name}</h5>
                
              </div>
            </div>
          </div>
            <React.Fragment>
            {review.product.variantClassCount === 2 && (
              <div className="d-flex flex-grow-1 gap-2 mb-3">
                <h6 className="fs-14 mb-0">{review?.variant1?.name}</h6>
                <h6 className="fs-14 mb-0">{review?.variant2?.name}</h6>
              </div>
            )}
            {review.product.variantClassCount === 1 && (
              <div className="d-flex flex-grow-1 gap-2 mb-3">
                <h6 className="fs-14 mb-0">{review?.variant1?.name}</h6>
              </div>
            )}
              <div className="d-flex flex-grow-1 gap-2 mb-3">
                {review.imagesReview.map((subItem, key) => (
                  <React.Fragment key={key}>
                    <Link to="#" className="d-block">
                      <img
                        src={subItem.url}
                        alt=""
                        className="avatar-sm rounded object-fit-cover"
                      />
                    </Link>
                  </React.Fragment>
                ))}
              </div>
            </React.Fragment>

          <div className="d-flex align-items-end">
            <div className="flex-grow-1">
              <p className=" mb-0">{review.reviewContent}</p>
              
            </div>

            <div className="flex-shrink-0">
              <p className="text-muted fs-13 mb-0">{review.createDate}</p>
            </div>


          </div>
          
          <div style={{backgroundColor:"#f0f0f0",padding:"15px", borderRadius: "5px" }}>

            {review.reviewComments && review.reviewComments.length > 0 && (
              <h5 className="fs-14 mb-0">Phản hồi của người bán</h5>
            )}
            <span>{review.reviewComments[0]?.reviewCommentContent}</span>

            {review.reviewComments.length===0 && (
              <>
              {console.log(review.reviewComments)}
            <Button onClick={handleButtonClick} color='review'>Phản hồi</Button>
            </>
            )}
          </div>
          {showTextarea && (
            <div style={{backgroundColor:"#f0f0f0"}}>
              <textarea
                rows="2"
                cols="40"
                style={{ marginLeft: "20px"}}
                value={textareaValue}
                onChange={handleTextareaChange}
              />
              <Button
                color='review'
                style={{ marginBottom: "5px" }}
                onClick={handleAddReplyReview}
              >
                Gửi
              </Button>
            </div>
          )}
        </div>
      </li>
    </React.Fragment>
  );
};

export default ProductReview;
