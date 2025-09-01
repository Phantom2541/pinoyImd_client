import React from "react";
import Header from "./header";
import Body from "./body";

export default function RequestForm() {
  return (
    <div className="p-6 max-w-6xl mx-auto bg-white border-2 border-black shadow-lg">

      {/* Patient Info Section */}
      <Header />

      {/* Tests Section */}
      <Body />
    </div>
  );
}
