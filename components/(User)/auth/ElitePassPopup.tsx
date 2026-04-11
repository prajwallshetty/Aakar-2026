"use client";

import React, { useState, useEffect } from "react";
import { ElitePassCard } from "./ElitePassCard";
import { ANIME_COLORS } from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

export const ElitePassPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible && !isCollapsed) {
        return null; // Don't render anything until the first 3 seconds have passed
    }

    return (
        <div style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            pointerEvents: "none", // Let clicks pass through empty space
        }}>
            {/* The Expanded Card */}
            <div style={{
                pointerEvents: "auto",
                transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                transform: isVisible && !isCollapsed ? "translateY(0) scale(1)" : "translateY(50px) scale(0)",
                opacity: isVisible && !isCollapsed ? 1 : 0,
                transformOrigin: "bottom right",
                visibility: isVisible && !isCollapsed ? "visible" : "hidden",
                maxWidth: "340px",
                width: "calc(100vw - 48px)",
                marginBottom: "16px",
            }}>
                {/* Close Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsCollapsed(true);
                    }}
                    style={{
                        position: "absolute",
                        top: "-12px",
                        right: "-12px",
                        background: ANIME_COLORS.purple,
                        color: "#fff",
                        border: `1px solid ${ANIME_COLORS.secondary}`,
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        zIndex: 10,
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
                        transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                    ✕
                </button>
                
                <div style={{
                    background: `${ANIME_COLORS.background}95`,
                    borderRadius: "12px",
                    border: `1px solid ${ANIME_COLORS.primary}`,
                    boxShadow: `0 10px 40px ${ANIME_COLORS.background}, 0 0 20px ${ANIME_COLORS.primary}40`,
                    overflow: "hidden",
                    backdropFilter: "blur(10px)",
                }}>
                    <div style={{ 
                        padding: "8px", 
                        background: `linear-gradient(90deg, ${ANIME_COLORS.primary}40, ${ANIME_COLORS.secondary}40)`,
                        textAlign: "center", 
                        fontFamily: "'Cinzel', serif", 
                        fontSize: "12px", 
                        fontWeight: "bold",
                        letterSpacing: "2px", 
                        color: ANIME_COLORS.text 
                    }}>
                        ⚡ SPECIAL OFFER ⚡
                    </div>
                    <ElitePassCard />
                </div>
            </div>

            {/* Pulse Animation Styles */}
            <style>
                {`
                @keyframes elite-pulse {
                    0% { box-shadow: 0 0 0 0 ${ANIME_COLORS.primary}80; }
                    70% { box-shadow: 0 0 0 15px ${ANIME_COLORS.primary}00; }
                    100% { box-shadow: 0 0 0 0 ${ANIME_COLORS.primary}00; }
                }
                @keyframes elite-glint {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .elite-offer-btn {
                    animation: elite-pulse 2s infinite;
                    background: linear-gradient(135deg, ${ANIME_COLORS.background} 0%, #1a0b2e 100%);
                    border: 1px solid ${ANIME_COLORS.primary};
                    background-size: 200% auto;
                    position: relative;
                    overflow: hidden;
                }
                .elite-offer-btn::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    background-size: 200% auto;
                    animation: elite-glint 3s linear infinite;
                    z-index: 1;
                }
                .elite-offer-btn:hover {
                    border-color: ${ANIME_COLORS.secondary};
                    box-shadow: 0 0 20px ${ANIME_COLORS.secondary}80 !important;
                    transform: scale(1.05) translateY(0) !important;
                }
                `}
            </style>
            {/* Collapsed Widget Button */}
            <button
                className="elite-offer-btn"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsCollapsed(false);
                }}
                style={{
                    pointerEvents: "auto",
                    color: ANIME_COLORS.text,
                    fontFamily: "'Share Tech Mono', monospace",
                    fontWeight: 700,
                    letterSpacing: "2px",
                    padding: "14px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    transform: isVisible && isCollapsed ? "translateY(0) scale(1)" : "translateY(50px) scale(0)",
                    opacity: isVisible && isCollapsed ? 1 : 0,
                    visibility: isVisible && isCollapsed ? "visible" : "hidden",
                    position: isVisible && isCollapsed ? "relative" : "absolute", // Keep it out of flow when hidden
                    zIndex: 2,
                }}
            >
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: ANIME_COLORS.primary,
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    boxShadow: `0 0 10px ${ANIME_COLORS.primary}`,
                    zIndex: 2,
                }}>
                    <span style={{ fontSize: "14px", filter: "drop-shadow(0 0 2px #fff)", transform: "translateY(-1px)" }}>⚡</span>
                </div>
                <span style={{ 
                    position: "relative", 
                    zIndex: 2,
                    textShadow: `0 0 8px ${ANIME_COLORS.primary}80`,
                    fontSize: "14px",
                }}>
                    UPGRADE TO ELITE
                </span>
            </button>
        </div>
    );
};
