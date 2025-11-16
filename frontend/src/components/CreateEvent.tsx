import { useState, useEffect } from "react";
import { X, Loader } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";

import { Member } from "../types/member";
import { EventData } from "./mobile/MobileApp";

interface CreateEventProps {
  onCancel: () => void;
  onCreate: (event: EventData, members: string[]) => void;
}

export function CreateEvent({ onCancel, onCreate }: CreateEventProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<EventData>({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  // ---------------------------
  // LOAD MEMBERS SAFELY
  // ---------------------------
  useEffect(() => {
    console.log("📡 Fetching members from backend...");

    fetch("http://localhost:8000/api/members")
      .then((res) => res.json())
      .then((data) => {
        console.log(
          "📌 Members API Response:",
          data,
          "IsArray:", Array.isArray(data)
        );

        if (Array.isArray(data)) {
          setMembers(data);
        } else {
          console.error("❌ Backend returned NON-ARRAY for members:", data);
          setMembers([]); // prevent crashes
        }
      })
      .catch((err) => {
        console.error("❌ Failed to load members:", err);
        setMembers([]); // safe fallback
      });
  }, []);

  // ---------------------------
  // TOGGLE MEMBER SELECTION
  // ---------------------------
  const toggleMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  // ---------------------------
  // SUBMIT EVENT
  // ---------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.date || !formData.time) {
      setError("Please fill in all required fields");
      return;
    }
    if (selectedMembers.length === 0) {
      setError("Please invite at least one member");
      return;
    }

    setLoading(true);
    try {
      console.log("📤 Creating event with data:", formData, selectedMembers);
      onCreate(formData, selectedMembers);
    } catch (err) {
      console.error("❌ Error creating event:", err);
      setError("Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen overflow-auto bg-[#020617]">
      <Card className="bg-[#020617] border border-[#1e293b] max-w-xl mx-auto rounded-3xl shadow-2xl shadow-[#020617]/60">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b]">
          <div>
            <p className="text-xs tracking-wide text-[#64748b] uppercase">
              Smart Event Creator
            </p>
            <h2 className="text-white text-xl font-semibold mt-1">
              Create a new club event
            </h2>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-[#64748b] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Event Name */}
          <div className="space-y-1.5">
            <Label className="text-[#94a3b8] text-xs uppercase tracking-wide">
              Event Name *
            </Label>
            <Input
              className="bg-[#020617] border-[#1f2937] text-white rounded-xl focus:border-[#38bdf8] focus:ring-0"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Debate Club Strategy Session"
              required
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[#94a3b8] text-xs uppercase tracking-wide">
                Date *
              </Label>
              <Input
                type="date"
                className="bg-[#020617] border-[#1f2937] text-white rounded-xl focus:border-[#38bdf8] focus:ring-0"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[#94a3b8] text-xs uppercase tracking-wide">
                Time *
              </Label>
              <Input
                type="time"
                className="bg-[#020617] border-[#1f2937] text-white rounded-xl focus:border-[#38bdf8] focus:ring-0"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label className="text-[#94a3b8] text-xs uppercase tracking-wide">
              Location
            </Label>
            <Input
              className="bg-[#020617] border-[#1f2937] text-white rounded-xl focus:border-[#38bdf8] focus:ring-0"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Room 302, Humanities Building"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-[#94a3b8] text-xs uppercase tracking-wide">
              Description
            </Label>
            <Textarea
              className="bg-[#020617] border-[#1f2937] text-white rounded-xl focus:border-[#38bdf8] focus:ring-0 min-h-[80px]"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add any context for members…"
            />
          </div>

          {/* Members */}
          <div className="space-y-2">
            <Label className="text-[#94a3b8] text-xs uppercase tracking-wide">
              Invite Members *
            </Label>

            <div className="grid grid-cols-2 gap-2">
              {Array.isArray(members) &&
                members.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleMember(member.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedMembers.includes(member.id)
                        ? "border-[#38bdf8] bg-[#0b1120]"
                        : "border-[#1f2937] bg-[#020617]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{member.emoji}</span>
                      <span className="text-sm text-white">{member.name}</span>
                    </div>
                  </button>
                ))}
            </div>

            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedMembers.map((id) => {
                  const m = members.find((mm) => mm.id === id);
                  return (
                    <Badge
                      key={id}
                      className="bg-[#0b1120] border border-[#1f2937] text-[#e5e7eb] rounded-full px-3 py-1 text-xs"
                    >
                      {m?.emoji} {m?.name}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 pb-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white rounded-2xl"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                "Create & Analyze"
              )}
            </Button>

            <Button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 border-[#1f2937] text-[#94a3b8] rounded-2xl"
              variant="outline"
            >
              Cancel
            </Button>
          </div>

          <p className="text-[11px] text-[#64748b] text-center pb-2">
            ClubPilot will run smart conflict analysis right after you create this event.
          </p>
        </form>
      </Card>
    </div>
  );
}
