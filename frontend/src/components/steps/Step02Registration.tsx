import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import {
  setCurrentStep,
  updateAadhaarData,
} from "../../redux/features/journeySlice";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const Step02Registration: React.FC = () => {
  const dispatch = useDispatch();
  const aadhaarData = useSelector(
    (state: RootState) => state.journey.aadhaarData,
  );

  const [formData, setFormData] = useState({
    fullName: aadhaarData.fullName,
    dob: aadhaarData.dob,
    gender: aadhaarData.gender,
    aadhaarNumber: aadhaarData.aadhaarNumber,
    mobileNumber: aadhaarData.mobileNumber,
    address: aadhaarData.address,
  });

  const [frontPhoto, setFrontPhoto] = useState<string | null>(
    aadhaarData.frontPhotoUrl
  );
  const [backPhoto, setBackPhoto] = useState<string | null>(
    aadhaarData.backPhotoUrl
  );

  const [previewModalImg, setPreviewModalImg] = useState<{ src: string; title: string } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAadhaarMasking = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "").slice(0, 12);
    let formatted = "";
    for (let i = 0; i < digitsOnly.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += "-";
      formatted += digitsOnly[i];
    }
    handleInputChange("aadhaarNumber", formatted);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "front" | "back",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (target === "front") {
        setFrontPhoto(result);
        dispatch(updateAadhaarData({ frontPhotoUrl: result }));
      } else {
        setBackPhoto(result);
        dispatch(updateAadhaarData({ backPhotoUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFront = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFrontPhoto(null);
    dispatch(updateAadhaarData({ frontPhotoUrl: null }));
  };

  const handleRemoveBack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBackPhoto(null);
    dispatch(updateAadhaarData({ backPhotoUrl: null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateAadhaarData(formData));
    dispatch(setCurrentStep(4)); // Proceed to OTP Verification (Step 4)
  };

  const isFormValid =
    formData.fullName.trim() !== "" &&
    formData.dob.trim() !== "" &&
    formData.aadhaarNumber.length === 14 &&
    formData.mobileNumber.length === 10 &&
    formData.address.trim() !== "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm sm:max-w-md mx-auto"
    >
      <div className="bg-[#0B132B] border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl p-4 sm:p-5">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => dispatch(setCurrentStep(2))}
              className="p-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white"
            >
              <Icon icon="ph:arrow-left-bold" className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-white">
              Aadhaar Registration
            </h2>
          </div>

          <div className="text-xs font-bold text-slate-300">
            Manual Aadhaar Verification
          </div>
          <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
            For high accessibility and security, please upload or enter your
            Aadhaar details manually.
          </div>
        </div>

        {/* WHITE CONTAINER CARD SHEET */}
        <div className="bg-white text-slate-900 rounded-[28px] p-5 sm:p-6 shadow-2xl text-left space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Full Name (As in Aadhaar){" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="Enter your fullname"
                  className="w-full bg-slate-50 border border-slate-300 rounded-md py-2.5 px-3.5 text-slate-900 text-xs font-medium focus:outline-none transition placeholder:font-medium"
                />

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-slate-400 absolute right-3 top-2.5 font-bold"
                  viewBox="0 0 24 30"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <g fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="6" r="4" />
                    <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full bg-slate-50 border border-slate-300 rounded-md py-2.5 px-3.5 text-slate-900 text-xs font-medium focus:outline-none transition placeholder:font-medium"
                />

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-slate-400 absolute right-4 top-2.5 font-bold"
                  viewBox="0 0 20 20"
                >
                  <path d="M0 0h20v20H0z" fill="none" />
                  <path
                    fill="currentColor"
                    d="M5.673 0a.7.7 0 0 1 .7.7v1.309h7.517v-1.3a.7.7 0 0 1 1.4 0v1.3H18a2 2 0 0 1 2 1.999v13.993A2 2 0 0 1 18 20H2a2 2 0 0 1-2-1.999V4.008a2 2 0 0 1 2-1.999h2.973V.699a.7.7 0 0 1 .7-.699M1.4 7.742v10.259a.6.6 0 0 0 .6.6h16a.6.6 0 0 0 .6-.6V7.756zm5.267 6.877v1.666H5v-1.666zm4.166 0v1.666H9.167v-1.666zm4.167 0v1.666h-1.667v-1.666zm-8.333-3.977v1.666H5v-1.666zm4.166 0v1.666H9.167v-1.666zm4.167 0v1.666h-1.667v-1.666zM4.973 3.408H2a.6.6 0 0 0-.6.6v2.335l17.2.014V4.008a.6.6 0 0 0-.6-.6h-2.71v.929a.7.7 0 0 1-1.4 0v-.929H6.373v.92a.7.7 0 0 1-1.4 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Gender Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Male", "Female", "Other"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleInputChange("gender", g)}
                    className={`py-2 rounded-md border text-xs font-bold transition ${
                      formData.gender === g
                        ? "bg-[#E6F4F1] text-teal-800 border-[#0D9488]"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Aadhaar Number with Warning Alert */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Aadhaar Number (12 Digit){" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.aadhaarNumber}
                  onChange={(e) => handleAadhaarMasking(e.target.value)}
                  placeholder="XXXX-XXXX-1234"
                  className="w-full bg-red-50/40 border border-red-300 rounded-md py-2.5 px-3.5 text-slate-900 text-xs font-extrabold tracking-widest focus:outline-none transition placeholder:font-medium"
                />
                <Icon
                  icon="ph:check-circle-bold"
                  className="w-4 h-4 text-red-500 absolute right-3 top-3"
                />
              </div>

              {/* Red Alert Banner */}
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-red-600">
                <Icon icon="ph:warning-bold" className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Aadhaar system temporarily slow. Please verify input.
                </span>
              </div>
            </div>

            {/* Mobile Number Linked */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-medium text-slate-500">
                  +91
                </span>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) =>
                    handleInputChange(
                      "mobileNumber",
                      e.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  placeholder="Enter your mobile number"
                  className="w-full bg-slate-50 border border-slate-300 rounded-md py-2.5 pl-11 pr-3.5 text-slate-900 text-xs font-bold focus:outline-none transition placeholder:font-medium"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your aadhaar address"
                  className="w-full bg-slate-50 border border-slate-300 rounded-md py-2.5 px-3.5 text-slate-900 text-xs font-bold focus:outline-none transition placeholder:font-medium"
                />
                <Icon
                  icon="ph:map-pin-bold"
                  className="w-4 h-4 text-slate-400 absolute right-3 top-3"
                />
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Aadhaar Document Upload
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Front Side Upload / Preview Card */}
                {frontPhoto ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-teal-500 bg-slate-900 shadow-md group h-[110px] flex items-center justify-center">
                    <img
                      src={frontPhoto}
                      alt="Aadhaar Front Preview"
                      className="w-full h-full object-cover cursor-pointer transition group-hover:scale-105"
                      onClick={() => setPreviewModalImg({ src: frontPhoto, title: "Aadhaar Front Side" })}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/40 pointer-events-none" />

                    {/* Cancel (X) Button Top-Right Corner */}
                    <button
                      type="button"
                      onClick={handleRemoveFront}
                      title="Remove front side photo"
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition active:scale-95 z-10"
                    >
                      <Icon icon="ph:x-bold" className="w-3.5 h-3.5" />
                    </button>

                    {/* Verification & Zoom Badge */}
                    <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between pointer-events-none text-[10px] font-bold text-white">
                      <span className="flex items-center gap-1 bg-teal-950/90 text-teal-300 px-2 py-0.5 rounded-md border border-teal-500/40">
                        <Icon icon="ph:check-circle-fill" className="w-3 h-3 text-teal-400" />
                        Front Side
                      </span>
                      <span className="text-[9px] text-slate-300 opacity-80 flex items-center gap-0.5">
                        <Icon icon="ph:eye-bold" className="w-3 h-3" /> View
                      </span>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-teal-500/70 bg-[#E6F4F1]/60 hover:bg-[#E6F4F1] rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer text-center h-[110px] transition group">
                    <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-700 flex items-center justify-center mb-1 group-hover:scale-110 transition">
                      <Icon icon="ph:cloud-arrow-up-bold" className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-extrabold text-teal-900">
                      Front Side
                    </span>
                    <span className="text-[9px] font-semibold text-teal-700 mt-0.5">
                      Upload JPG/PNG • Max 5MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "front")}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Back Side Upload / Preview Card */}
                {backPhoto ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-teal-500 bg-slate-900 shadow-md group h-[110px] flex items-center justify-center">
                    <img
                      src={backPhoto}
                      alt="Aadhaar Back Preview"
                      className="w-full h-full object-cover cursor-pointer transition group-hover:scale-105"
                      onClick={() => setPreviewModalImg({ src: backPhoto, title: "Aadhaar Back Side" })}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/40 pointer-events-none" />

                    {/* Cancel (X) Button Top-Right Corner */}
                    <button
                      type="button"
                      onClick={handleRemoveBack}
                      title="Remove back side photo"
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition active:scale-95 z-10"
                    >
                      <Icon icon="ph:x-bold" className="w-3.5 h-3.5" />
                    </button>

                    {/* Verification & Zoom Badge */}
                    <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between pointer-events-none text-[10px] font-bold text-white">
                      <span className="flex items-center gap-1 bg-teal-950/90 text-teal-300 px-2 py-0.5 rounded-md border border-teal-500/40">
                        <Icon icon="ph:check-circle-fill" className="w-3 h-3 text-teal-400" />
                        Back Side
                      </span>
                      <span className="text-[9px] text-slate-300 opacity-80 flex items-center gap-0.5">
                        <Icon icon="ph:eye-bold" className="w-3 h-3" /> View
                      </span>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer text-center h-[110px] transition group">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mb-1 group-hover:scale-110 transition">
                      <Icon icon="ph:cloud-arrow-up-bold" className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-extrabold text-slate-700">
                      Back Side
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 mt-0.5">
                      Upload JPG/PNG • Max 5MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "back")}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Solid Teal Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3.5 px-6 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition active:scale-[0.99] mt-4 ${
                isFormValid
                  ? "bg-[#0D9488] hover:bg-teal-700 text-white shadow-lg shadow-teal-700/20"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <span>Verify & Continue to OTP</span>
              <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Image Preview Lightbox Modal */}
      {previewModalImg && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-slate-800 rounded-3xl p-4 max-w-sm w-full space-y-3 relative shadow-2xl">
            <div className="flex items-center justify-between text-white font-extrabold text-sm">
              <span>{previewModalImg.title}</span>
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <Icon icon="ph:x-bold" className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
              <img src={previewModalImg.src} alt="Zoom Preview" className="w-full h-auto max-h-[60vh] object-contain" />
            </div>
            <button
              type="button"
              onClick={() => setPreviewModalImg(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

