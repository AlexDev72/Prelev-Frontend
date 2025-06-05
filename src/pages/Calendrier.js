import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const CalendrierMultiMois = () => {
  const [selected, setSelected] = useState(null);

  const nombreMois = 6;
  const startDate = new Date(2024, 1); // Février 2024

  const moisArray = Array.from({ length: nombreMois }, (_, i) => {
    return new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#cdf7cd"
      }}
    >
      {moisArray.map((mois, index) => (
        <DayPicker
          key={index}
          mode="single"
          selected={selected}
          onSelect={setSelected}
          month={mois}
          pagedNavigation={false}
          style={{
            border: "1px solid black", // bordure noire
            borderRadius: "8px",
            padding: "10px",
            backgroundColor: "white", // fond blanc à l’intérieur
          }}
        />
      ))}
    </div>
  );
};

export default CalendrierMultiMois;
