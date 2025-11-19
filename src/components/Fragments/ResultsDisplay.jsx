// src/fragments/ResultsDisplay.jsx

import React from 'react';

const ResultsDisplay = ({ results, formData }) => {
  
  // ✅ PERBAIKAN: Sesuaikan dengan response API
  // Response API: { message, data: { targetCalories, targetProtein, targetCarbs, targetFat } }
  const { data } = results;
  
  if (!data) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-800">Data hasil tidak ditemukan.</p>
      </div>
    );
  }

  const { targetCalories, targetProtein, targetCarbs, targetFat } = data;
  const { age, height, weight, gender } = formData;

  return (
    <div className="results-display-wrapper mt-6">
      <div className="results-display-content bg-white rounded-lg shadow-lg p-6">
        
        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          YOUR RESULTS
        </h2>
        
        {/* User Stats Summary */}
        <div className="user-summary bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
          <p className="text-gray-700 leading-relaxed">
            You're a <span className="font-bold text-green-700">{age} year old {gender.toLowerCase()}</span> who is{' '}
            <span className="font-bold text-green-700">{height} cm tall</span> and weighs{' '}
            <span className="font-bold text-green-700">{weight} kg</span>.
          </p>
        </div>
        
        {/* Calorie Target */}
        <div className="calorie-summary bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
          <p className="text-lg text-center">
            Your target is{' '}
            <span className="font-bold text-blue-700 text-2xl">
              {Math.round(targetCalories)} calories
            </span>
            {' '}per day
          </p>
        </div>

        {/* Macros Breakdown */}
        <div className="macros-section">
          <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
            Macro Breakdown
          </h3>
          
          <div className="macros-grid grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Protein */}
            <div className="macro-card bg-red-50 p-5 rounded-lg border-2 border-red-200 text-center">
              <div className="macro-icon mb-2 text-4xl">🥩</div>
              <p className="macro-value text-3xl font-bold text-red-600">
                {Math.round(targetProtein)}g
              </p>
              <p className="macro-label text-sm text-gray-600 uppercase tracking-wider mt-1">
                Protein
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((targetProtein * 4 / targetCalories) * 100)}% of calories
              </p>
            </div>

            {/* Fats */}
            <div className="macro-card bg-yellow-50 p-5 rounded-lg border-2 border-yellow-200 text-center">
              <div className="macro-icon mb-2 text-4xl">🥑</div>
              <p className="macro-value text-3xl font-bold text-yellow-600">
                {Math.round(targetFat)}g
              </p>
              <p className="macro-label text-sm text-gray-600 uppercase tracking-wider mt-1">
                Fats
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((targetFat * 9 / targetCalories) * 100)}% of calories
              </p>
            </div>

            {/* Carbs */}
            <div className="macro-card bg-blue-50 p-5 rounded-lg border-2 border-blue-200 text-center">
              <div className="macro-icon mb-2 text-4xl">🍞</div>
              <p className="macro-value text-3xl font-bold text-blue-600">
                {Math.round(targetCarbs)}g
              </p>
              <p className="macro-label text-sm text-gray-600 uppercase tracking-wider mt-1">
                Carbs
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((targetCarbs * 4 / targetCalories) * 100)}% of calories
              </p>
            </div>

          </div>
        </div>

        {/* Tips Section */}
        <div className="tips-section mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">💡 Tips:</h4>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Track your food intake to stay within your calorie target</li>
            <li>Aim to eat protein with every meal</li>
            <li>Don't forget to stay hydrated - drink at least 8 glasses of water daily</li>
            <li>Adjust based on your progress after 2-3 weeks</li>
          </ul>
        </div>

        {/* Goal Info */}
        {formData.goal && (
          <div className="goal-info mt-4 text-center text-sm text-gray-500">
            Goal: <span className="font-semibold capitalize">{formData.goal.replace('_', ' ')}</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResultsDisplay;