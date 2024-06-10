import React, { useState, useEffect } from "react";

import axios from "axios";
import Step1 from "./Step1";
import swal from "sweetalert";

import validator from "validator";
import { Link } from "react-router-dom";
import OtpVerification from "./OtpVerification";

function Register() {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    password: "",
    confirm_password: "",
    notifications: "",
    otp: "",
    step: "",
  });

  const [isTncChecked, setTncChecked] = useState(false);

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setFormData((prevValidFields) => ({
      ...prevValidFields,
      otp: "",
    }));
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleOtpVerificationComplete = () => {
    setCurrentStep(3); // Move to the next step after OTP verification
  };

  return (
    <div>
      {currentStep === 1 && (
        <Step1
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          currentStep={currentStep}
          isTncChecked={isTncChecked}
          setTncChecked={setTncChecked}
        />
      )}

      {currentStep === 2 && (
        <OtpVerification
          onComplete={handleOtpVerificationComplete}
          formData={formData}
          setFormData={setFormData}
          prevStep={prevStep}
          currentStep={currentStep}
          isTncChecked={isTncChecked}
          setTncChecked={setTncChecked}
        />
      )}
    </div>
  );
}

export default Register;
