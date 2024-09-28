import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AboutUs from "./pages/AboutUs";
import SignupPage from "./pages/SignupPage";
import TermsConditionsPage from "./pages/TermsConditionsPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/user-login" element={<LoginPage />} />
        <Route path="/user-signup" element={<SignupPage />} />

        <Route path="/terms-conditions" element={<TermsConditionsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </>

  );
}

export default App;
