// src/fragments/ResultsDisplay.jsx

import React from 'react';

const ResultsDisplay = ({ results, formData }) => {
  
  const { maintenance, cutting, bulking, targetCalorie } = results;
  const { age, height, weight, gender } = formData;
  
  const GoalColumn = ({ title, macros }) => (
    <div className="goal-column">
      <h3 className="goal-title">{title}</h3>
      <div className="macro-box">
        <p className="macro-value">{macros.protein}g</p>
        <p className="macro-label">protein</p>
      </div>
      <div className="macro-box">
        <p className="macro-value">{macros.fats}g</p>
        <p className="macro-label">fats</p>
      </div>
      <div className="macro-box">
        <p className="macro-value">{macros.carbs}g</p>
        <p className="macro-label">carbs</p>
      </div>
    </div>
  );

  return (
    <div className="results-display-wrapper">
      <div className="results-display-content">
        <h2>YOUR STATS</h2>
        <p className="user-summary">
          You're a **{age} y/o {gender.toLowerCase()}** who is **{height} cm tall** & weighs **{weight} kg**.
        </p>
        
        <p className="calorie-summary">
          Based on your stats, your maintenance calories is **{targetCalorie} calories per day**.
        </p>

        <div className="macros-table">
          {maintenance && <GoalColumn title="Maintenance" macros={maintenance} />}
          {cutting && <GoalColumn title="Cutting" macros={cutting} />}
          {bulking && <GoalColumn title="Bulking" macros={bulking} />}
        </div>
      </div>
    </div>
  );
}

export default ResultsDisplay;