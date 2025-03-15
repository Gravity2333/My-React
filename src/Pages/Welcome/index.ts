import { createElement } from "../../../lib/react";

export default function WelcomePage() {
  return createElement(
    "div",
    { style: pageStyle },
    createElement(
      "div",
      { style: leftPanelStyle },
      createElement("h1", { style: titleStyle }, "Welcome to My-React!"),
      createElement("p", { style: subtitleStyle }, "A lightweight React clone with core features like createElement, useState, useEffect, and more."),
      createElement(
        "div",
        { style: sectionStyle },
        createElement("h2", { style: sectionTitleStyle }, "What is My-React?"),
        createElement("p", { style: sectionTextStyle }, "My-React is a lightweight clone of React. It includes essential features like virtual DOM creation, state management with hooks, and task scheduling. The main goal is to understand the core principles behind React and its rendering lifecycle.")
      ),
    ),
    createElement(
      "div",
      { style: rightPanelStyle },
      createElement("h2", { style: sectionTitleStyle }, "Features"),
      createElement("ul", { style: featureListStyle },
        createElement("li", null, "Virtual DOM creation with createElement"),
        createElement("li", null, "Support for hooks like useState, useEffect, useTransition"),
        createElement("li", null, "Component management for functional and class components"),
        createElement("li", null, "Task scheduling with the scheduler for better performance"),
      ),
      createElement(
        "div",
        { style: footerStyle },
        createElement("h3", { style: footerTitleStyle }, "Get Started"),
        createElement(
          "p",
          { style: footerTextStyle },
          "To get started, follow the setup instructions below:"
        ),
        createElement("pre", { style: codeBlockStyle },
          "1. Install dependencies:\n" +
          "   npm install\n\n" +
          "2. Start the project:\n" +
          "   npm start\n"
        )
      ),
    )
  );
}

const pageStyle = {
  display: "flex",
  flexDirection: "row", // 横向布局
  width: "100%",
  backgroundColor: "#f4f6f8",
  justifyContent: "space-between",
  padding: "40px",
  boxSizing: "border-box",
};

const leftPanelStyle = {
  flex: 1, // 左侧占据 50%
  padding: "40px",
  backgroundColor: "#61dafb",
  borderRadius: "8px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  color: "#fff",
};

const rightPanelStyle = {
  flex: 1, // 右侧占据 50%
  padding: "40px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
};

const titleStyle = {
  fontSize: "36px",
  fontWeight: "700",
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
  fontWeight: "600",
  marginBottom: "15px",
};

const sectionTextStyle = {
  fontSize: "16px",
  lineHeight: "1.6",
};

const footerStyle = {
  marginTop: "40px",
  backgroundColor: "#4CAF50", // Green background for footer
  padding: "20px",
  borderRadius: "8px",
  color: "#fff",
};

const footerTitleStyle = {
  fontSize: "24px",
  fontWeight: "600",
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
