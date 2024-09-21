import React from "react";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";

const postData = [
    {
        dpImg:"D:\referral project\referraWala\RefferalWala\frontend\src\Assets\empty_cart.jpg",
        userName : "User1",
        companyName : "Company1",
        jobRole : "Role1",
        location : "Location1"
    },
    {
        dpImg:"D:\referral project\referraWala\RefferalWala\frontend\public\logo192.png",
        userName : "User2",
        companyName : "Company2",
        jobRole : "Role2",
        location : "Location2"
    },
    {
        dpImg:"D:\referral project\referraWala\RefferalWala\frontend\public\logo192.png",
        userName : "User1",
        companyName : "Company1",
        jobRole : "Role1",
        location : "Location1"
    },
    {
        dpImg:"D:\referral project\referraWala\RefferalWala\frontend\public\logo192.png",
        userName : "User2",
        companyName : "Company2",
        jobRole : "Role2",
        location : "Location2"
    },
    {
        dpImg:"D:\referral project\referraWala\RefferalWala\frontend\public\logo192.png",
        userName : "User1",
        companyName : "Company1",
        jobRole : "Role1",
        location : "Location1"
    },
    {
        dpImg:"D:\referral project\referraWala\RefferalWala\frontend\public\logo192.png",
        userName : "User2",
        companyName : "Company2",
        jobRole : "Role2",
        location : "Location2"
    },
    {
        dpImg:"D:\referral project\referraWala\RefferalWala\frontend\public\logo192.png",
        userName : "User1",
        companyName : "Company1",
        jobRole : "Role1",
        location : "Location1"
    },
    {
        dpImg:"D:\referral project\referraWala\RefferalWala\frontend\public\logo192.png",
        userName : "User2",
        companyName : "Company2",
        jobRole : "Role2",
        location : "Location2"
    }
];



function HomePage() {
    console.log(postData[0]);
    const [postCard, setPostCard] = useState([]);

    useEffect(()=>{
        setPostCard(postData)
    },[]);
    return (
        <div>
            <Navbar/>
            <div style={{justifySelf:'center', justifyContent:'center'}}>
                {
                    postCard.map(post => (
                        <PostCard postCardData={post}/>
                    ))
                }
            </div>
        </div>
    );
}

export default HomePage;