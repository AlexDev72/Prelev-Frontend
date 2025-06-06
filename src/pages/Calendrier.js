import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const CalendrierMultiMois = () => {
  const [selected, setSelected] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;

    const observer = new MutationObserver(() => {
      setIsDarkMode(htmlElement.classList.contains("dark"));
    });

    observer.observe(htmlElement, { attributes: true, attributeFilter: ["class"] });

    // Initial check
    setIsDarkMode(htmlElement.classList.contains("dark"));

    return () => observer.disconnect();
  }, []);

  const nombreMois = 12;
  const startDate = new Date(2024, 1); // Février 2024

  const moisArray = Array.from({ length: nombreMois }, (_, i) => {
    return new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
  });

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center gap-6 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-[#cdf7cd] text-black"
      }`}
    >
      {moisArray.map((mois, index) => (
        <div
          key={index}
          className={`p-4 rounded border ${
            isDarkMode ? "bg-gray-700 border-gray-700" : "bg-white border-black"
          }`}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
            month={mois}
            pagedNavigation={false}
            showNavigation={false}
            className="[&_.rdp-nav]:hidden"
          />
        </div>
      ))}
    </div>
  );
};

export default CalendrierMultiMois;
