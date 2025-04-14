import React from "react";

export default function Xray() {
  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6 p-4">
      <h1 className="text-2xl font-bold mb-4">X-ray Result</h1>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-lg font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          className="w-full border border-gray-300 rounded-lg p-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write the x-ray description here..."
        />
      </div>

      {/* Impression */}
      <div>
        <label htmlFor="impression" className="block text-lg font-medium mb-2">
          Impression
        </label>
        <textarea
          id="impression"
          className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write the x-ray impression here..."
        />
      </div>
    </div>
  );
}
