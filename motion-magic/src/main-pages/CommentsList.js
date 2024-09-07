import React from 'react';
import Comment from './Comment';

const CommentsList = ({ comments }) => {
    console.log('cl, got:',comments);
    return (
        <div>
            {comments.map((comment, index) => (
                <Comment key={comment.ID || index} comment={comment} />
            ))}
        </div>
    );
};

export default CommentsList;
