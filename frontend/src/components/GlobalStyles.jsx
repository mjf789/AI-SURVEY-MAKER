import React from 'react';

const GlobalStyles = () => {
  return (
    <style jsx global>{`
      /* Base scrollbar styling - always visible but subtle */
      * {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
      }
      
      /* Webkit scrollbars - always visible but subtle */
      *::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      *::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.02);
        border-radius: 4px;
      }
      
      *::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        transition: background 0.2s ease;
      }
      
      *::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      /* Force dark scrollbars on all textareas and inputs */
      textarea::-webkit-scrollbar,
      input::-webkit-scrollbar,
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px !important;
        height: 8px !important;
      }
      
      textarea::-webkit-scrollbar-track,
      input::-webkit-scrollbar-track,
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.02) !important;
        border-radius: 4px !important;
      }
      
      textarea::-webkit-scrollbar-thumb,
      input::-webkit-scrollbar-thumb,
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1) !important;
        border-radius: 4px !important;
      }
      
      textarea::-webkit-scrollbar-thumb:hover,
      input::-webkit-scrollbar-thumb:hover,
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2) !important;
      }
      
      /* Firefox textarea scrollbar */
      textarea,
      input {
        scrollbar-width: thin !important;
        scrollbar-color: rgba(255, 255, 255, 0.1) transparent !important;
      }
      
      /* Custom scrollbar class for main content areas */
      .custom-scrollbar {
        overflow-y: auto; /* Only show scrollbar when needed */
        overflow-x: hidden;
        /* Use a fixed right padding to reserve space for scrollbar */
        padding-right: 8px;
        /* Smooth scrollbar appearance */
        scroll-behavior: smooth;
      }
      
      /* Ensure custom scrollbar has dark theme */
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px !important;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent !important;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1) !important;
        border-radius: 4px !important;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.15) !important;
      }
      
      /* Hide scrollbar during transitions to prevent flashing */
      .transitioning .custom-scrollbar {
        overflow-y: hidden !important;
      }
      
      /* After transition, restore scrollbar */
      .custom-scrollbar {
        transition: padding 0.3s ease;
      }
      
      /* Ensure smooth layout transitions */
      html, body {
        overflow: hidden; /* Prevent any scrolling on body */
        height: 100vh; /* Full viewport height */
        max-width: 100vw;
        margin: 0;
        padding: 0;
      }
      
      /* Optimize animations */
      .animate-stepFade,
      [class*="transition-"] {
        will-change: transform, opacity;
        backface-visibility: hidden;
        -webkit-font-smoothing: antialiased;
        transform: translateZ(0); /* Enable hardware acceleration */
      }
      
      /* Prevent text selection during transitions */
      .transitioning * {
        user-select: none;
      }
      
      /* Stable layout for flex containers */
      .flex {
        flex-shrink: 0;
      }
      
      /* Prevent FOUC (Flash of Unstyled Content) */
      .opacity-0 {
        opacity: 0 !important;
      }
      
      .opacity-100 {
        opacity: 1 !important;
      }
      
      /* AGGRESSIVE OVERRIDE - Force dark scrollbars everywhere */
      :global(::-webkit-scrollbar) {
        width: 8px !important;
        height: 8px !important;
      }
      
      :global(::-webkit-scrollbar-track) {
        background: transparent !important;
        box-shadow: none !important;
        border: none !important;
      }
      
      :global(::-webkit-scrollbar-thumb) {
        background: rgba(255, 255, 255, 0.1) !important;
        border-radius: 4px !important;
        box-shadow: none !important;
        border: none !important;
      }
      
      :global(::-webkit-scrollbar-thumb:hover) {
        background: rgba(255, 255, 255, 0.2) !important;
      }
      
      /* Color scheme override for inputs/textareas */
      input,
      textarea,
      select {
        color-scheme: dark;
      }
    `}</style>
  );
};

export default GlobalStyles;