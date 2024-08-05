import React, {useState, useRef } from 'react';
import { Button } from 'reactstrap';
import {
    updateReplyReviewByReviewId as onUpdateReplyReviewByReviewId,
    deleteReplyReviewByReviewId as onDeleteReplyReviewByReviewId,
} from "../../../slices/thunks";
import { useDispatch, useSelector } from 'react-redux';
import DeleteModal from '../profile/DeleteModal';

const ShopOwnerReplyCard = ({ comment, reviewId, index }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [textareaValue, setTextareaValue] = useState(comment.reviewCommentContent);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Thêm trạng thái cho modal xóa
    const optionsContainerRef = useRef(null);
    const buttonTimeoutId = useRef(null);

    const token = useSelector((state) => state.Session.decodedToken);
    const dispatch = useDispatch();

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const handleEdit = () => {
        setEditMode(true);
        setShowOptions(false);
    };

    const handleTextareaChange = (event) => {
        setTextareaValue(event.target.value);
    };

    const handleUpdateReplyReview = async () => {
        console.log(textareaValue);
        console.log(reviewId);

        try {
            const replyData = {
                userId: token.userId,
                replyContent: textareaValue,
                replyId: comment._id,
                reviewId: reviewId,
            };
            const actionResult = await dispatch(onUpdateReplyReviewByReviewId(replyData));
            if (onUpdateReplyReviewByReviewId.fulfilled.match(actionResult)) {
                console.log(actionResult.payload);
                setEditMode(false);
            } else if (onUpdateReplyReviewByReviewId.rejected.match(actionResult)) {
                console.error(actionResult.error);
            }
        } catch (error) {
            console.error('Dispatch failed:', error);
        }
    };

    const handleDeleteReplyReview = async () => {
        try {
            const replyData = {
                userId: token.userId,
                replyContent: textareaValue,
                replyId: comment._id,
                reviewId: reviewId,
            };
            const actionResult = await dispatch(onDeleteReplyReviewByReviewId(replyData));
            if (onDeleteReplyReviewByReviewId.fulfilled.match(actionResult)) {
                console.log(actionResult.payload);
                setEditMode(false);
            } else if (onDeleteReplyReviewByReviewId.rejected.match(actionResult)) {
                console.error(actionResult.error);
            }
        } catch (error) {
            console.error('Dispatch failed:', error);
        }
        setShowDeleteModal(false); // Đóng modal sau khi xóa thành công
    };

    const handleBlur = (event) => {
        buttonTimeoutId.current = setTimeout(() => {
            if (optionsContainerRef.current && !optionsContainerRef.current.contains(event.relatedTarget)) {
                setShowOptions(false);
            }
        }, 10);
    };

    const handleFocus = () => {
        clearTimeout(buttonTimeoutId.current);
    };

    return (
        <div key={index} style={{
            marginTop: index > 0 ? "10px" : "0",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <div>
                <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
                    <strong>Phản hồi của người bán:</strong> {comment.shopOwner.name} - <small>{comment.createDate}</small>
                </p>

                {!editMode ? (
                    <p style={{ marginBottom: 0 }}>{comment.reviewCommentContent}</p>
                ) : (
                    <div style={{ backgroundColor: "#f0f0f0" }}>
                        <textarea
                            rows="2"
                            cols="70"
                            style={{ marginLeft: "20px" }}
                            value={textareaValue}
                            onChange={handleTextareaChange}
                        />
                        <Button
                            color='review'
                            style={{ marginBottom: "5px" }}
                            onClick={handleUpdateReplyReview}
                        >
                            Lưu
                        </Button>
                        <Button
                            color='review'
                            style={{ marginBottom: "5px" }}
                            onClick={() => setEditMode(false)}
                        >
                            Hủy
                        </Button>
                    </div>
                )}
            </div>
            {!editMode && (
                <div ref={optionsContainerRef} onBlur={handleBlur} onFocus={handleFocus}>
                    <Button className="btn-icon" onClick={toggleOptions} style={{ border: 'none', background: 'none' }}>
                        <i className="mdi mdi-dots-vertical" style={{ fontSize: '1.2rem', color: '#6c757d' }}></i>
                    </Button>
                    {showOptions && (
                        <div style={{
                            position: 'absolute',
                            right: '0',
                            top: '30px',
                            background: '#fff',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                            zIndex: 100,
                            borderRadius: '5px',
                            overflow: 'hidden'
                        }}>
                            <Button color="primary" onClick={handleEdit} style={{ display: 'block', width: '100%', textAlign: 'left' }}>Chỉnh sửa</Button>
                            <Button color="danger" onClick={() => setShowDeleteModal(true)} style={{ display: 'block', width: '100%', textAlign: 'left' }}>Xóa</Button>
                        </div>
                    )}
                </div>
            )}
            <DeleteModal
                show={showDeleteModal}
                onDeleteClick={handleDeleteReplyReview}
                onCloseClick={() => setShowDeleteModal(false)}
            />
        </div>
    );
};

export default ShopOwnerReplyCard;
