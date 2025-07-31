import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Calendar, Star, Zap, Flag, User } from "lucide-react";

const categoryConfig = {
  milestone: { 
    color: "bg-gradient-to-r from-amber-500 to-orange-500", 
    icon: Flag, 
    bgColor: "bg-amber-50",
    textColor: "text-amber-900"
  },
  achievement: { 
    color: "bg-gradient-to-r from-emerald-500 to-teal-500", 
    icon: Star, 
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-900"
  },
  event: { 
    color: "bg-gradient-to-r from-blue-500 to-indigo-500", 
    icon: Calendar, 
    bgColor: "bg-blue-50",
    textColor: "text-blue-900"
  },
  project: { 
    color: "bg-gradient-to-r from-purple-500 to-pink-500", 
    icon: Zap, 
    bgColor: "bg-purple-50",
    textColor: "text-purple-900"
  },
  personal: { 
    color: "bg-gradient-to-r from-rose-500 to-pink-500", 
    icon: User, 
    bgColor: "bg-rose-50",
    textColor: "text-rose-900"
  }
};

const importanceConfig = {
  low: "opacity-70",
  medium: "opacity-85",
  high: "opacity-100 ring-2 ring-slate-200",
  critical: "opacity-100 ring-2 ring-amber-300 shadow-lg"
};

export default function TimelineEntry({ entry, position, isLeft }) {
  const config = categoryConfig[entry.category] || categoryConfig.event;
  const IconComponent = config.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: position * 0.1,
        type: "spring",
        stiffness: 100
      }}
      className={`absolute ${isLeft ? 'right-1/2 pr-8' : 'left-1/2 pl-8'} w-1/2`}
      style={{ top: `${position * 180 + 60}px` }}
    >
      <Card className={`${importanceConfig[entry.importance]} bg-white/90 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{entry.title}</h3>
                <Badge className={`${config.bgColor} ${config.textColor} border-0 text-xs font-medium`}>
                  {entry.category}
                </Badge>
              </div>
              
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                {entry.description}
              </p>
              
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Calendar className="w-3 h-3" />
                {format(parseISO(entry.date), "MMMM d, yyyy")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Connection line to timeline */}
      <div 
        className={`absolute top-8 ${isLeft ? '-right-2' : '-left-2'} w-4 h-4 rounded-full ${config.color} border-4 border-white shadow-lg z-10`}
      />
    </motion.div>
  );
}