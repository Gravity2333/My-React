import React from "../../../lib/react";

const WelcomePage = () => {
  return (
    <div style={pageStyle}>
      <div style={leftPanelStyle}>
        <h1 style={titleStyle}>Welcome to My-React!</h1>
        <p style={subtitleStyle}>
          A lightweight React clone with core features like createElement, useState, useEffect, and more.
        </p>
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>What is My-React?</h2>
          <p style={sectionTextStyle}>
            My-React is a lightweight clone of React. It includes essential features like virtual DOM creation, state
            management with hooks, and task scheduling. The main goal is to understand the core principles behind React
            and its rendering lifecycle.
          </p>
        </div>
      </div>
      <div style={rightPanelStyle}>
        <h2 style={sectionTitleStyle}>Features</h2>
        <ul style={featureListStyle}>
          <li>Virtual DOM creation with createElement</li>
          <li>Support for hooks like useState, useEffect, useTransition</li>
          <li>Component management for functional and class components</li>
          <li>Task scheduling with the scheduler for better performance</li>
        </ul>
        <div style={footerStyle}>
          <h3 style={footerTitleStyle}>Get Started</h3>
          <p style={footerTextStyle}>To get started, follow the setup instructions below:</p>
          <pre style={codeBlockStyle}>
            {`1. Install dependencies:
   npm install

2. Start the project:
   npm start`}
          </pre>
        </div>
      </div>
    </div>
  );
};

const pageStyle = {
  display: "flex",
  flexDirection: "row",
  width: "100%",
  backgroundColor: "#f4f6f8",
  justifyContent: "space-between",
  padding: "40px",
  boxSizing: "border-box",
};

const leftPanelStyle = {
  flex: 1,
  padding: "40px",
  backgroundColor: "#61dafb",
  borderRadius: "8px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  color: "#fff",
};

const rightPanelStyle = {
  flex: 1,
  padding: "40px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
};

const titleStyle = {
  fontSize: "36px",
  fontWeight: 700,
};

const subtitleStyle = {
  fontSize: "20px",
  marginTop: "10px",
};

const sectionStyle = {
  marginTop: "40px",
};

const sectionTitleStyle = {
  fontSize: "28px",
  fontWeight: 600,
  marginBottom: "15px",
};

const sectionTextStyle = {
  fontSize: "16px",
  lineHeight: "1.6",
};

const footerStyle = {
  marginTop: "40px",
  backgroundColor: "#4CAF50",
  padding: "20px",
  borderRadius: "8px",
  color: "#fff",
};

const footerTitleStyle = {
  fontSize: "24px",
  fontWeight: 600,
};

const footerTextStyle = {
  fontSize: "18px",
};

const codeBlockStyle = {
  backgroundColor: "#2d2d2d",
  color: "#f7f7f7",
  padding: "20px",
  borderRadius: "8px",
  fontFamily: "monospace",
  fontSize: "16px",
  textAlign: "left",
  overflowX: "auto",
};

const featureListStyle = {
  listStyleType: "none",
  paddingLeft: "0",
  fontSize: "16px",
  color: "#444",
};

export default WelcomePage;