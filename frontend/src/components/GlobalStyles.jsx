import React from 'react';

const GlobalStyles = () => {
  return (
    <style jsx global>{`
      /* Reset and hide all default scrollbars */
      * {
        scrollbar-width: none !important; /* Firefox */
        -ms-overflow-style: none !important; /* IE and Edge */
      }
      
      /* Hide scrollbar for Chrome, Safari and Opera */
      *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
      
      /* For the main scrollable areas, add custom thin scrollbar */
      .custom-scrollbar {
        scrollbar-width: thin !important;
        scrollbar-color: rgba(255, 255, 255, 0.1) transparent !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
      }
      
      .custom-scrollbar::-webkit-scrollbar {
        display: block !important;
        width: 6px !important;
        height: 0 !important;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent !important;
        border-radius: 3px !important;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1) !important;
        border-radius: 3px !important;
        opacity: 0 !important;
        transition: opacity 0.3s ease !important;
      }
      
      .custom-scrollbar:hover::-webkit-scrollbar-thumb {
        opacity: 1 !important;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2) !important;
      }
      
      /* Ensure no horizontal overflow anywhere */
      html, body {
        overflow-x: hidden !important;
        max-width: 100vw !important;
      }
      
      /* Prevent any element from causing horizontal scroll */
      * {
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      
      /* Remove any default margins that might cause overflow */
      body {
        margin: 0 !important;
        padding: 0 !important;
      }
      
      /* Prevent layout shift during transitions */
      .animate-stepFade {
        will-change: opacity, transform;
        backface-visibility: hidden;
        -webkit-font-smoothing: antialiased;
      }
    `}</style>
  );
};

export default GlobalStyles;