import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './comment.css';
import display_pic from "./display_pic";
const Comment = ({ comment }) => {
    const formattedDate = new Date(comment.Created).toLocaleString();

    return (
        <div className="comment" style={{ marginTop:'10px'}}>
        <div className="d-flex justify-content-between align-items-center">
            {/* Left: Name and Image */}
            <div className="comment-left d-flex align-items-center">
                <img
                    src={display_pic(comment.CreatorImg)}
                    width="35"
                    height="35"
                    className="rounded-circle"
                    alt="Creator"
                />
                <div style={{marginLeft: '10px'}}>
                    <b>{comment.Creator}</b>
                </div>
            </div>

            {/* Right: Date */}
            <div className="comment-right text-muted" style={{fontSize: '0.9em'}}>
                {formattedDate}
            </div>

        </div>
            <div className='comment-text' style={{marginLeft: '45px'}}>
                {comment.Content}
            </div>
        </div>
    );
};

export default Comment;
