import React from "react";

function PostCard({postCardData}) 
{
    return(
        <div className="postCard">
            <div className="postCard-header">
                <img
                className="postCard-profile-img"
                src={postCardData.dpImg}
                alt="Profile"
                />
                <div className="postCard-name-section">
                <h3 className="postCard-name">{postCardData.userName}</h3>
                <p className="postCard-company">{postCardData.companyName}</p>
                <p className="postCard-role">{postCardData.roleRole}</p>
                <p className="postCard-location">{postCardData.location}</p>
                </div>
            </div>
            <button className="postCard-apply-btn">Apply</button>
        </div>
    );
}

export default PostCard;