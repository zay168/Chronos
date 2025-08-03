import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/src/i18n";

export default function EntryForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    precision: "day",
    recurrenceRule: "none",
    reminderAt: "",
  });
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { date, precision, reminderAt, recurrenceRule } = formData;
    let isoDate = "";
    if (precision === "year") isoDate = new Date(`${date}-01-01`).toISOString();
    else if (precision === "month") isoDate = new Date(`${date}-01`).toISOString();
    else isoDate = new Date(date).toISOString();
    const isoReminder = reminderAt ? new Date(reminderAt).toISOString() : null;
    const payload = {
      ...formData,
      date: isoDate,
      reminderAt: isoReminder,
      recurrenceRule: recurrenceRule === "none" ? null : recurrenceRule,
    };
    onSubmit(payload);
    setFormData({ title: "", description: "", date: "", precision: "day", recurrenceRule: "none", reminderAt: "" });
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
            {t('entryForm.title')}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
                  {t('entryForm.fields.title')}
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder={t('entryForm.fields.titlePlaceholder')}
                  required
                  className="border-slate-200 focus:border-amber-400 focus:ring-amber-400/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold text-slate-700">
                  {t('entryForm.fields.date')}
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
              <Label className="text-sm font-semibold text-slate-700">{t('entryForm.fields.precision')}</Label>
              <Select value={formData.precision} onValueChange={(value) => handleChange("precision", value)}>
                <SelectTrigger className="border-slate-200 focus:border-amber-400 focus:ring-amber-400/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">{t('entryForm.precision.year')}</SelectItem>
                  <SelectItem value="month">{t('entryForm.precision.month')}</SelectItem>
                  <SelectItem value="day">{t('entryForm.precision.day')}</SelectItem>
                  <SelectItem value="hour">{t('entryForm.precision.hour')}</SelectItem>
                  <SelectItem value="minute">{t('entryForm.precision.minute')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Recurrence</Label>
              <Select value={formData.recurrenceRule} onValueChange={(value) => handleChange("recurrenceRule", value)}>
                <SelectTrigger className="border-slate-200 focus:border-amber-400 focus:ring-amber-400/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder" className="text-sm font-semibold text-slate-700">Reminder</Label>
              <Input
                id="reminder"
                type="datetime-local"
                value={formData.reminderAt}
                onChange={(e) => handleChange("reminderAt", e.target.value)}
                className="border-slate-200 focus:border-amber-400 focus:ring-amber-400/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-slate-700">
                {t('entryForm.fields.description')}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder={t('entryForm.fields.descriptionPlaceholder')}
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
                  {t('entryForm.submitting')}
                </div>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  {t('entryForm.submit')}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
