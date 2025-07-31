import React from "react";
import { motion } from "framer-motion";

export default function TimelineLine({ height }) {
  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 z-0">
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${height}px` }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="w-1 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-300 rounded-full shadow-sm"
      />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg border-4 border-white" />
      </div>
      
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 shadow-md border-2 border-white" />
      </div>
    </div>
  );
}