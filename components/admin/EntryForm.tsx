import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function EntryForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    precision: "day",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { date, precision } = formData;
    let isoDate = "";
    if (precision === "year") isoDate = new Date(`${date}-01-01`).toISOString();
    else if (precision === "month") isoDate = new Date(`${date}-01`).toISOString();
    else isoDate = new Date(date).toISOString();
    onSubmit({ ...formData, date: isoDate });
    setFormData({ title: "", description: "", date: "", precision: "day" });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const dateInputType = formData.precision === "hour" || formData.precision === "minute" ? "datetime-local" :
    formData.precision === "day" ? "date" :
    formData.precision === "month" ? "month" : "number";

  const step = formData.precision === "hour" ? 3600 :
    formData.precision === "minute" ? 60 : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Add Schedule Item
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
                  Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter event title..."
                  required
                  className="border-slate-200 focus:border-amber-400 focus:ring-amber-400/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold text-slate-700">
                  Date
                </Label>
                <Input
                  id="date"
                  type={dateInputType}
                  step={step}
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                  className="border-slate-200 focus:border-amber-400 focus:ring-amber-400/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Precision</Label>
              <Select value={formData.precision} onValueChange={(value) => handleChange("precision", value)}>
                <SelectTrigger className="border-slate-200 focus:border-amber-400 focus:ring-amber-400/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="hour">Hour</SelectItem>
                  <SelectItem value="minute">Minute</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-slate-700">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe this scheduled activity..."
                rows={3}
                className="border-slate-200 focus:border-amber-400 focus:ring-amber-400/20 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding to Schedule...
                </div>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Add to Schedule
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
