"use client";
import React from "react";

const Avatar = (props) => (
  <svg width="120" height="120" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="50" fill="#2196F3" opacity="0.2" />
    <circle cx="60" cy="60" r="40" fill="#2196F3" opacity="0.4" />
    <circle cx="60" cy="60" r="30" fill="#2196F3" />
    <path d="M70 45L50 60L70 75" stroke="white" strokeWidth="4" fill="none" />
  </svg>
);
export default Avatar;
