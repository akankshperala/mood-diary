import React, { useState, useEffect } from "react";
import "./MoodAnalytics.css";

const MoodAnalytics = ({ entries }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("week"); // week, month
  const [chartData, setChartData] = useState(null);

  // Mood color mapping
  const moodColors = {
    happy: "#FFD93D",
    sad: "#6BCF7F", 
    angry: "#FF6B6B",
    calm: "#4ECDC4"
  };

  const moodEmojis = {
    happy: "😊",
    sad: "😢",
    angry: "😠", 
    calm: "😌"
  };

  useEffect(() => {
    if (entries.length > 0) {
      generateChartData();
    }
  }, [entries, selectedPeriod]);

  const generateChartData = () => {
    const now = new Date();
    const daysToShow = selectedPeriod === "week" ? 7 : 30;
    const startDate = new Date(now.getTime() - (daysToShow - 1) * 24 * 60 * 60 * 1000);

    // Filter entries for selected period
    const periodEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= now;
    });

    // Group entries by date
    const entriesByDate = {};
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().slice(0, 10);
      entriesByDate[dateKey] = [];
    }

    periodEntries.forEach(entry => {
      const dateKey = new Date(entry.date).toISOString().slice(0, 10);
      if (entriesByDate[dateKey]) {
        entriesByDate[dateKey].push(entry);
      }
    });

    // Calculate mood distribution
    const moodCounts = { happy: 0, sad: 0, angry: 0, calm: 0 };
    periodEntries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    // Generate trend data
    const trendData = Object.keys(entriesByDate).map(dateKey => {
      const entries = entriesByDate[dateKey];
      const date = new Date(dateKey);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        entries: entries.length,
        moods: entries.map(e => e.mood)
      };
    });

    // Find the most common mood (handle ties properly)
    const maxCount = Math.max(...Object.values(moodCounts));
    const mostCommonMoods = Object.keys(moodCounts).filter(mood => moodCounts[mood] === maxCount);
    const mostCommonMood = mostCommonMoods.length > 0 ? mostCommonMoods[0] : 'happy';

    setChartData({
      trendData,
      moodCounts,
      totalEntries: periodEntries.length,
      mostCommonMood: mostCommonMood,
      hasTies: mostCommonMoods.length > 1
    });
  };

  const getMoodPercentage = (mood) => {
    if (!chartData || chartData.totalEntries === 0) return 0;
    return Math.round((chartData.moodCounts[mood] / chartData.totalEntries) * 100);
  };

  if (!chartData) {
    return (
      <div className="analytics-container">
        <div className="analytics-loading">
          <div className="loading-spinner"></div>
          <p>Loading your mood insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Your Mood Insights</h2>
        <div className="period-selector">
          <button 
            className={selectedPeriod === "week" ? "active" : ""}
            onClick={() => setSelectedPeriod("week")}
          >
            This Week
          </button>
          <button 
            className={selectedPeriod === "month" ? "active" : ""}
            onClick={() => setSelectedPeriod("month")}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>{chartData.totalEntries}</h3>
            <p>Total Entries</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">{moodEmojis[chartData.mostCommonMood]}</div>
          <div className="card-content">
            <h3>{chartData.mostCommonMood.charAt(0).toUpperCase() + chartData.mostCommonMood.slice(1)}</h3>
            <p>Most Common Mood</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <h3>{Math.round(chartData.totalEntries / (selectedPeriod === "week" ? 7 : 30) * 10) / 10}</h3>
            <p>Avg. Entries/Day</p>
          </div>
        </div>
      </div>

      {/* Mood Distribution Chart */}
      <div className="chart-section">
        <h3>Mood Distribution</h3>
        <div className="mood-distribution">
          {Object.keys(moodColors).map(mood => (
            <div key={mood} className="mood-bar">
              <div className="mood-label">
                <span className="mood-emoji">{moodEmojis[mood]}</span>
                <span className="mood-name">{mood.charAt(0).toUpperCase() + mood.slice(1)}</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${getMoodPercentage(mood)}%`,
                    backgroundColor: moodColors[mood]
                  }}
                ></div>
                <span className="bar-percentage">{getMoodPercentage(mood)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Chart */}
      <div className="chart-section">
        <h3>Daily Activity</h3>
        <div className="trend-chart">
          {chartData.trendData.map((day, index) => (
            <div key={index} className="trend-day">
              <div className="trend-bar">
                <div 
                  className="trend-fill"
                  style={{ 
                    height: `${Math.max(day.entries * 20, 4)}px`,
                    backgroundColor: day.entries > 0 ? moodColors[day.moods[0]] : "#e0e0e0"
                  }}
                ></div>
              </div>
              <span className="trend-label">{day.date}</span>
              {day.entries > 0 && (
                <span className="trend-count">{day.entries}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="insights-section">
        <h3>💡 Insights</h3>
        <div className="insights">
          {chartData.totalEntries === 0 ? (
            <p>Start journaling to see your mood patterns!</p>
          ) : (
            <>
              <p>
                {chartData.hasTies ? (
                  <>You've been feeling multiple moods equally often this {selectedPeriod}.</>
                ) : (
                  <>You've been feeling <strong>{chartData.mostCommonMood}</strong> most often this {selectedPeriod}.</>
                )}
              </p>
              {chartData.totalEntries >= 3 && (
                <p>Great job keeping up with your mood journal! 📝</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodAnalytics; 

