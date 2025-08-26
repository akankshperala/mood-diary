import React, { useState, useEffect } from "react";
import api from "../utils/api";
import "./Dashboard.css";
import MoodCalendar from "./MoodCalendar";
import MoodAnalytics from "./MoodAnalytics";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const moods = [
  { 
    label: "Happy 😊", 
    color: "#fce38a", 
    bg: "linear-gradient(135deg, #fce38a 0%, #fff176 100%)",
    intensityGradients: [
      "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)",
      "linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)",
      "linear-gradient(135deg, #fdcb6e 0%, #d63031 100%)",
      "linear-gradient(135deg, #fdcb6e 0%, #e84393 100%)",
      "linear-gradient(135deg, #fdcb6e 0%, #6c5ce7 100%)",
      "linear-gradient(135deg, #fdcb6e 0%, #00b894 100%)",
      "linear-gradient(135deg, #fdcb6e 0%, #00cec9 100%)",
      "linear-gradient(135deg, #fdcb6e 0%, #74b9ff 100%)",
      "linear-gradient(135deg, #fdcb6e 0%, #a29bfe 100%)",
      "linear-gradient(135deg, #fdcb6e 0%, #fd79a8 100%)"
    ]
  },
  { 
    label: "Sad 😢", 
    color: "#95e1d3", 
    bg: "linear-gradient(135deg, #95e1d3 0%, #b2f7ef 100%)",
    intensityGradients: [
      "linear-gradient(135deg, #dfe6e9 0%, #b2bec3 100%)",
      "linear-gradient(135deg, #b2bec3 0%, #74b9ff 100%)",
      "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
      "linear-gradient(135deg, #0984e3 0%, #6c5ce7 100%)",
      "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)",
      "linear-gradient(135deg, #a29bfe 0%, #fd79a8 100%)",
      "linear-gradient(135deg, #fd79a8 0%, #e84393 100%)",
      "linear-gradient(135deg, #e84393 0%, #d63031 100%)",
      "linear-gradient(135deg, #d63031 0%, #e17055 100%)",
      "linear-gradient(135deg, #e17055 0%, #fdcb6e 100%)"
    ]
  },
  { 
    label: "Angry 😠", 
    color: "#f38181", 
    bg: "linear-gradient(135deg, #f38181 0%, #fce38a 100%)",
    intensityGradients: [
      "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)",
      "linear-gradient(135deg, #fab1a0 0%, #e17055 100%)",
      "linear-gradient(135deg, #e17055 0%, #d63031 100%)",
      "linear-gradient(135deg, #d63031 0%, #e84393 100%)",
      "linear-gradient(135deg, #e84393 0%, #6c5ce7 100%)",
      "linear-gradient(135deg, #6c5ce7 0%, #00b894 100%)",
      "linear-gradient(135deg, #00b894 0%, #00cec9 100%)",
      "linear-gradient(135deg, #00cec9 0%, #74b9ff 100%)",
      "linear-gradient(135deg, #74b9ff 0%, #a29bfe 100%)",
      "linear-gradient(135deg, #a29bfe 0%, #fd79a8 100%)"
    ]
  },
  { 
    label: "Calm 😌", 
    color: "#a8e6cf", 
    bg: "linear-gradient(135deg, #a8e6cf 0%, #dcedc8 100%)",
    intensityGradients: [
      "linear-gradient(135deg, #dfe6e9 0%, #b2bec3 100%)",
      "linear-gradient(135deg, #b2bec3 0%, #74b9ff 100%)",
      "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
      "linear-gradient(135deg, #0984e3 0%, #6c5ce7 100%)",
      "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)",
      "linear-gradient(135deg, #a29bfe 0%, #fd79a8 100%)",
      "linear-gradient(135deg, #fd79a8 0%, #e84393 100%)",
      "linear-gradient(135deg, #e84393 0%, #d63031 100%)",
      "linear-gradient(135deg, #d63031 0%, #e17055 100%)",
      "linear-gradient(135deg, #e17055 0%, #fdcb6e 100%)"
    ]
  },
];

const Dashboard = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodIntensity, setMoodIntensity] = useState(5); // Default intensity
  const [diaryText, setDiaryText] = useState("");
  const [lastSaved, setLastSaved] = useState(null);
  const [saveMsg, setSaveMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedEntries, setSavedEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [view, setView] = useState("mood-select"); // "mood-select", "diary", "saved", "edit"
  const [editingEntry, setEditingEntry] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const navigate = useNavigate();

  const background = selectedMood
    ? selectedMood.bg
    : "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)";

  // Fetch saved entries on component mount
  useEffect(() => {
    fetchSavedEntries();
  }, []);

  const fetchSavedEntries = async () => {
    setLoadingEntries(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/entries", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedEntries(response.data);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
    } finally {
      setLoadingEntries(false);
    }
  };

  const handleBack = () => {
    setSelectedMood(null);
    setDiaryText("");
    setLastSaved(null);
    setSaveMsg("");
    setView("mood-select");
    setEditingEntry(null);
    setShowCalendar(false);
    setShowAnalytics(false);
  };

  const handleSave = async () => {
    if (!diaryText.trim()) {
      setSaveMsg("Please write something before saving.");
      return;
    }
    setSaving(true);
    setSaveMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/entries",
        {
          mood: selectedMood.label.split(" ")[0].toLowerCase(),
          text: diaryText,
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setLastSaved(res.data.updatedAt || res.data.date || new Date().toISOString());
      setSaveMsg("Diary saved!");
      // Refresh saved entries after saving
      await fetchSavedEntries();
    } catch (err) {
      setSaveMsg("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!diaryText.trim()) {
      setSaveMsg("Please write something before saving.");
      return;
    }
    setSaving(true);
    setSaveMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.put(
        `/entries/${editingEntry._id}`,
        {
          mood: selectedMood.label.split(" ")[0].toLowerCase(),
          text: diaryText,
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setLastSaved(res.data.updatedAt || res.data.date || new Date().toISOString());
      setSaveMsg("Entry updated!");
      // Refresh saved entries after updating
      await fetchSavedEntries();
    } catch (err) {
      setSaveMsg("Failed to update. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleViewSaved = () => {
    setView("saved");
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setSelectedMood(moods.find(mood => mood.label.split(" ")[0].toLowerCase() === entry.mood));
    setDiaryText(entry.text);
    setLastSaved(entry.date);
    setView("edit");
  };

  const handleDeleteEntry = async (entryId) => {
    if (window.confirm("Are you sure you want to delete this entry? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        await api.delete(`/entries/${entryId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Refresh saved entries after deleting
        await fetchSavedEntries();
      } catch (err) {
        console.error("Failed to delete entry:", err);
        alert("Failed to delete entry. Please try again.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      happy: "😊",
      sad: "😢", 
      angry: "😠",
      calm: "😌"
    };
    return moodMap[mood] || "📝";
  };

  // Get current year/month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  // Filter entries for current month
  const monthEntries = savedEntries.filter(entry => {
    const d = new Date(entry.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  return (
    <div
      className="dashboard-centered"
      style={{
        minHeight: "100vh",
        width: "100vw",
        background,
        transition: "background 0.7s cubic-bezier(.68,-0.55,.27,1.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}
    >
      {/* Log Out Button */}
      <button
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          background: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 48,
          height: 48,
          fontSize: '1.5rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          zIndex: 20
        }}
        title="Log Out"
      >
        🚪
      </button>
      {showCalendar ? (
        <div style={{ width: '100%', maxWidth: 600 }}>
          <MoodCalendar entries={monthEntries} year={year} month={month} />
          <button className="back-btn" style={{ marginTop: 16 }} onClick={() => setShowCalendar(false)}>
            ← Back to Mood Selection
          </button>
        </div>
      ) : showAnalytics ? (
        <div style={{ width: '100%', maxWidth: 800 }}>
          <MoodAnalytics entries={savedEntries} />
          <button className="back-btn" style={{ marginTop: 16 }} onClick={() => setShowAnalytics(false)}>
            ← Back to Mood Selection
          </button>
        </div>
      ) : (
        <>
          {/* Analytics toggle button */}
          <button
            onClick={() => setShowAnalytics(true)}
            style={{
              position: 'absolute',
              top: 24,
              right: 80,
              background: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 48,
              height: 48,
              fontSize: '1.5rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              zIndex: 10
            }}
            title="Show Mood Analytics"
          >
            📊
          </button>
          {/* Calendar toggle button */}
          <button
            onClick={() => setShowCalendar(true)}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              background: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 48,
              height: 48,
              fontSize: '1.5rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              zIndex: 10
            }}
            title="Show Mood Calendar"
          >
            🗓️
          </button>
          {view === "mood-select" && (
            <div className="dashboard-content mood-box">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", width: "100%" }}>
                <h1 style={{ margin: 0 }}>Choose your mood</h1>
                <button
                  onClick={handleViewSaved}
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "none",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  title="View Saved Entries"
                >
                  💾
                </button>
              </div>
              <div className="mood-options">
                {moods.map((mood) => (
                  <button
                    key={mood.label}
                    style={{
                      background: mood.bg,
                      border: "none",
                      padding: "1.2rem 2.5rem",
                      borderRadius: "16px",
                      margin: "0.5rem",
                      fontSize: "1.3rem",
                      cursor: "pointer",
                      color: "#333",
                      fontWeight: 600,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      transition: "transform 0.3s, box-shadow 0.3s",
                    }}
                    onClick={() => {
                      setSelectedMood(mood);
                      setView("diary");
                    }}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>
          )}



          {view === "diary" && (
  <div className="diary-box">
    <h2 style={{ marginBottom: "1.5rem" }}>
      {selectedMood.label}
    </h2>
    <textarea
      className="diary-entry"
      placeholder={`Write about why you feel ${selectedMood.label.split(" ")[0]}...`}
      value={diaryText}
      onChange={e => setDiaryText(e.target.value)}
      style={{
        width: "100%",
        minHeight: "180px",
        padding: "1.2rem",
        borderRadius: "16px",
        border: "1px solid #ccc",
        fontSize: "1.1rem",
        resize: "vertical",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        marginBottom: "1.5rem",
      }}
    />
    <button className="save-btn" onClick={handleSave} disabled={saving} style={{marginBottom: '1rem'}}>
      {saving ? "Saving..." : "💾 Save"}
    </button>
    {lastSaved && (
      <div className="last-saved">Last modified: {new Date(lastSaved).toLocaleString()}</div>
    )}
    {saveMsg && <div className="save-msg">{saveMsg}</div>}
    <button className="back-btn" onClick={handleBack}>
      ← Back
    </button>
  </div>
)}

                {view === "edit" && (
        <div className="diary-box">
          <h2 style={{ marginBottom: "1.5rem" }}>
            Edit Entry - {selectedMood.label}
          </h2>
              <textarea
                className="diary-entry"
                placeholder={`Write about why you feel ${selectedMood.label.split(" ")[0]}...`}
                value={diaryText}
                onChange={e => setDiaryText(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "180px",
                  padding: "1.2rem",
                  borderRadius: "16px",
                  border: "1px solid #ccc",
                  fontSize: "1.1rem",
                  resize: "vertical",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  marginBottom: "1.5rem",
                }}
              />
              <button className="save-btn" onClick={handleUpdate} disabled={saving} style={{marginBottom: '1rem'}}>
                {saving ? "Updating..." : "💾 Update"}
              </button>
              {lastSaved && (
                <div className="last-saved">Last modified: {new Date(lastSaved).toLocaleString()}</div>
              )}
              {saveMsg && <div className="save-msg">{saveMsg}</div>}
              <button className="back-btn" onClick={() => setView("saved")}>
                ← Back to Entries
              </button>
            </div>
          )}

          {view === "saved" && (
            <div className="saved-entries-box">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h2 style={{ margin: 0 }}>Saved Entries</h2>
                <button
                  onClick={() => setView("mood-select")}
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "none",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  ✕
                </button>
              </div>
              
              {loadingEntries ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>Loading entries...</div>
              ) : savedEntries.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
                  No saved entries yet. Start by choosing your mood!
                </div>
              ) : (
                                <div className="entries-list">
                  {savedEntries.map((entry) => (
                    <div 
                      key={entry._id} 
                      className="entry-card"
                      style={{ position: "relative" }}
                    >
                      <div>
                        <div className="entry-header">
                          <span className="entry-mood">
                            {getMoodEmoji(entry.mood)} {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                          </span>
                          <span className="entry-date">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="entry-text">{entry.text}</div>
                      </div>
                      <div style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        display: "flex",
                        gap: "0.5rem"
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEntry(entry);
                          }}
                          style={{
                            background: "rgba(0, 123, 255, 0.1)",
                            border: "none",
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            cursor: "pointer",
                            fontSize: "1rem",
                            color: "#007bff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s ease",
                            opacity: 0.7
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = "rgba(0, 123, 255, 0.2)";
                            e.target.style.opacity = "1";
                            e.target.style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "rgba(0, 123, 255, 0.1)";
                            e.target.style.opacity = "0.7";
                            e.target.style.transform = "scale(1)";
                          }}
                          title="Edit Entry"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEntry(entry._id);
                          }}
                          style={{
                            background: "rgba(255, 0, 0, 0.1)",
                            border: "none",
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            cursor: "pointer",
                            fontSize: "1rem",
                            color: "#d32f2f",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s ease",
                            opacity: 0.7
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = "rgba(255, 0, 0, 0.2)";
                            e.target.style.opacity = "1";
                            e.target.style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "rgba(255, 0, 0, 0.1)";
                            e.target.style.opacity = "0.7";
                            e.target.style.transform = "scale(1)";
                          }}
                          title="Delete Entry"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
