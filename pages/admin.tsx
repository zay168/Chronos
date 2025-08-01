import React, { useState, useEffect } from "react";
import { TimelineEntry } from "@/entities/TimelineEntry";
import { motion } from "framer-motion";
import EntryForm from "../components/admin/EntryForm";
import { Settings, Sparkles, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Admin() {
  const [isLoading, setIsLoading] = useState(false);
  const [recentEntries, setRecentEntries] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadRecentEntries();
  }, []);

  const loadRecentEntries = async () => {
    try {
      const data = await TimelineEntry.list();
      const recent = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
      setRecentEntries(recent);
    } catch (error) {
      console.error("Error loading recent entries:", error);
    }
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await TimelineEntry.create(formData);
      await loadRecentEntries();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error creating timeline entry:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-slate-200/60 mb-6">
            <Settings className="w-6 h-6 text-slate-700" />
            <span className="text-slate-600 font-medium">Admin Panel</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-amber-800 bg-clip-text text-transparent mb-4">
            Timeline Control
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Add new entries to your intelligent timeline. Each entry will automatically position itself based on date.
          </p>
        </motion.div>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center gap-3 text-emerald-800">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold">Timeline entry added successfully!</span>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EntryForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
          
          <div className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg font-bold text-slate-900">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Recent Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentEntries.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No entries yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentEntries.map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-100"
                      >
                        <h4 className="font-semibold text-slate-900 text-sm mb-1">
                          {entry.title}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/60 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                  <h3 className="font-bold text-amber-900 mb-2">Intelligent Positioning</h3>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Your timeline automatically sorts and positions entries by date, creating a beautiful chronological flow.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}