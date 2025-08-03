import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { TimelineEntry } from "@/entities/TimelineEntry";
import { Timetable } from "@/entities/Timetable";

export default function ImportEntries({ onImported }) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
  };

  const handleImport = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      if (!Array.isArray(json.entries)) throw new Error("Invalid format");
      let timetableId = json.timetableId;
      if (!timetableId && json.timetable?.name) {
        const t = await Timetable.create(json.timetable.name);
        timetableId = t.id;
      }
      if (!timetableId) throw new Error('No timetable specified');
      await TimelineEntry.bulkCreate(json.entries, timetableId);
      if (onImported) onImported();
      setFile(null);
    } catch (err) {
      console.error("Import failed", err);
    }
    setIsLoading(false);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-xl mt-8">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          Import JSON
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input type="file" accept="application/json" onChange={handleFileChange} />
          <Button
            disabled={!file || isLoading}
            onClick={handleImport}
            className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3"
          >
            {isLoading ? "Importing..." : "Import"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

