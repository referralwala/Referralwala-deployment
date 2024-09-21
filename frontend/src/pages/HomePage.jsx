import React from "react";
import Navbar from "../components/Navbar";
import Home from "../components/Home";

function HomePage() {

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <Home />
        </div>
    );
}

export default HomePage;
