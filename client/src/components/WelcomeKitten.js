import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const WelcomeKitten = () => {
  const kittenRef = useRef(null);
  const navigate = useNavigate();
  const [showHello, setShowHello] = useState(false);

  useEffect(() => {
    if (kittenRef.current) {
      kittenRef.current.classList.add("kitten-pop-up");
    }
    // Show hello after kitten animation (0.9s)
    const timer = setTimeout(() => setShowHello(true), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showHello) {
      const redirectTimer = setTimeout(() => {
        navigate("/dashboard");
      }, 3500); // 3.5 seconds
      return () => clearTimeout(redirectTimer);
    }
  }, [showHello, navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      background: "#e3f6fd"
    }}>
      {/* Clouds */}
      <div className="cloud cloud1" />
      <div className="cloud cloud2" />
      <div className="cloud cloud3" />
      <div className="cloud cloud4" />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
        <img
          ref={kittenRef}
          src={`${process.env.PUBLIC_URL}/cat.png`}
          
          alt="Mochi Cat"
          style={{
            width: '220px',
            height: 'auto',
            marginTop: '0',
            opacity: 0,
            transform: 'translateY(80px) scale(0.9)',
            transition: 'opacity 0.7s, transform 0.7s',
          }}
          className="kitten-img"
        />
        {showHello && (
          <div
            style={{
              marginTop: '1.5rem',
              fontSize: '2.5rem',
              color: '#ff90b3',
              fontWeight: 700,
              fontFamily: 'Comic Sans MS, Comic Sans, Chalkboard, cursive',
              letterSpacing: '0.05em',
              textShadow: '0 2px 12px #ffd6e6, 0 1px 0 #fff',
              borderRadius: '18px',
              padding: '0.2em 1.2em',
              background: 'none',
              boxShadow: 'none',
              textAlign: 'center',
              animation: 'hello-fade-in 0.7s',
            }}
          >
            Hello!
          </div>
        )}
      </div>
      <style>{`
        .cloud {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          opacity: 0.7;
          z-index: 0;
          box-shadow: 0 8px 32px 0 rgba(0,0,0,0.04);
          animation: cloudFloat 18s linear infinite;
        }
        .cloud1 {
          width: 110px; height: 60px; top: 12%; left: 8%; animation-delay: 0s;
        }
        .cloud2 {
          width: 80px; height: 40px; top: 22%; right: 12%; animation-delay: 4s;
        }
        .cloud3 {
          width: 130px; height: 70px; bottom: 18%; left: 16%; animation-delay: 8s;
        }
        .cloud4 {
          width: 90px; height: 50px; bottom: 10%; right: 10%; animation-delay: 12s;
        }
        @keyframes cloudFloat {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.04); }
          100% { transform: translateY(0px) scale(1); }
        }
        .kitten-pop-up {
          opacity: 1 !important;
          transform: translateY(0) scale(1) !important;
          transition: opacity 0.7s, transform 0.7s cubic-bezier(.68,-0.55,.27,1.55);
        }
        @keyframes hello-fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default WelcomeKitten;