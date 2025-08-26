import React from "react";
import './MoodCalendar.css';

// Helper to get days in month
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Helper to get weekday of first day
function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

// Helper to get YYYY-MM-DD in local time
function toLocalDateString(date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Mood emoji map
const moodEmojis = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  calm: "😌"
};

// Mood color map (for calendar dots)
const moodColors = {
  happy: "#ffe082",
  sad: "#81d4fa",
  angry: "#ff8a80",
  calm: "#a5d6a7"
};

const MoodCalendar = ({ entries, year, month }) => {
  // entries: array of { date, mood, intensity }
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfWeek(year, month);
  const today = new Date();
  
  // Map entries by local date string (YYYY-MM-DD)
  const entryMap = {};
  entries.forEach(entry => {
    const d = new Date(entry.date);
    const key = toLocalDateString(d);
    entryMap[key] = entry;
  });

  // Build calendar grid
  const weeks = [];
  let week = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    week.push(null); // empty days before 1st
  }
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return (
    <div className="mood-calendar">
      <div className="calendar-header">
        <span>{today.toLocaleString('default', { month: 'long' })} {year}</span>
      </div>
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="calendar-day-label">{d}</div>
        ))}
        {weeks.map((week, i) => (
          week.map((day, j) => {
            if (!day) return <div key={i + '-' + j} className="calendar-day empty"></div>;
            const dateObj = new Date(year, month, day);
            const key = toLocalDateString(dateObj);
            const entry = entryMap[key];
            const isToday = toLocalDateString(dateObj) === toLocalDateString(today);
            return (
              <div
                key={i + '-' + j}
                className={`calendar-day${isToday ? ' today' : ''}${entry ? ' has-entry' : ''}`}
                style={entry ? { background: moodColors[entry.mood] + '22' } : {}}
                title={entry ? `${entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)} (${entry.intensity}/10)` : ''}
              >
                <span className="calendar-day-number">{day}</span>
                {entry && (
                  <span className="calendar-mood-emoji" style={{ fontSize: '1.3rem' }}>
                    {moodEmojis[entry.mood] || '📝'}
                  </span>
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default MoodCalendar; 