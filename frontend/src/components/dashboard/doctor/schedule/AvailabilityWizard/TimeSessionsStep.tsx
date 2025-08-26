"use client";

import React, { useState } from "react";
import { Card, Button } from "@/components/ui";
import { TimeBlock } from "@/types/availability";
import { TimeSessionBuilder } from "../TimeSessionBuilder";
import { Clock, Plus, Trash2, Edit } from "lucide-react";
import { timeUtils, uiUtils } from "@/utils/availabilityHelpers";

interface TimeSessionsStepProps {
  selectedDays: number[];
  consultationDuration: number;
  timeSessions: Record<number, TimeBlock[]>;
  onTimeSessionsChange: (sessions: Record<number, TimeBlock[]>) => void;
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const CONSULTATION_TYPES = [
  { value: "online", label: "Online", icon: "🌐" },
  { value: "physical", label: "Physical", icon: "🏥" },
  { value: "both", label: "Both", icon: "🔄" },
];

export const TimeSessionsStep: React.FC<TimeSessionsStepProps> = ({
  selectedDays,
  consultationDuration,
  timeSessions,
  onTimeSessionsChange,
}) => {
  const [editingSession, setEditingSession] = useState<{
    dayOfWeek: number;
    sessionIndex: number;
    session: TimeBlock;
  } | null>(null);
  const [showSessionBuilder, setShowSessionBuilder] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleAddSession = (dayOfWeek: number) => {
    setSelectedDay(dayOfWeek);
    setEditingSession(null);
    setShowSessionBuilder(true);
  };

  const handleEditSession = (dayOfWeek: number, sessionIndex: number) => {
    const session = timeSessions[dayOfWeek]?.[sessionIndex];
    if (session) {
      setSelectedDay(dayOfWeek);
      setEditingSession({ dayOfWeek, sessionIndex, session });
      setShowSessionBuilder(true);
    }
  };

  const handleDeleteSession = (dayOfWeek: number, sessionIndex: number) => {
    const updatedSessions = { ...timeSessions };
    if (updatedSessions[dayOfWeek]) {
      updatedSessions[dayOfWeek] = updatedSessions[dayOfWeek].filter(
        (_, index) => index !== sessionIndex
      );
      if (updatedSessions[dayOfWeek].length === 0) {
        delete updatedSessions[dayOfWeek];
      }
    }
    onTimeSessionsChange(updatedSessions);
  };

  const handleSaveSession = (session: TimeBlock) => {
    const updatedSessions = { ...timeSessions };

    if (!updatedSessions[selectedDay!]) {
      updatedSessions[selectedDay!] = [];
    }

    if (editingSession) {
      // Update existing session
      updatedSessions[selectedDay!][editingSession.sessionIndex] = session;
    } else {
      // Add new session
      updatedSessions[selectedDay!].push(session);
    }

    // Sort sessions by start time
    updatedSessions[selectedDay!].sort(
      (a, b) =>
        timeUtils.timeToMinutes(a.startTime) -
        timeUtils.timeToMinutes(b.startTime)
    );

    onTimeSessionsChange(updatedSessions);
    setShowSessionBuilder(false);
    setEditingSession(null);
    setSelectedDay(null);
  };

  const calculateDayStats = (dayOfWeek: number) => {
    const sessions = timeSessions[dayOfWeek] || [];
    let totalHours = 0;
    let totalSlots = 0;
    let totalEarnings = 0;

    sessions.forEach((session) => {
      const hours =
        timeUtils.getTimeDifference(session.startTime, session.endTime) / 60;
      const slots = Math.floor((hours * 60) / consultationDuration);

      totalHours += hours;
      totalSlots += slots;
      totalEarnings += slots * session.consultationFee;
    });

    return { totalHours, totalSlots, totalEarnings };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Set your time sessions
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add time sessions for each selected day. You can have multiple
          sessions per day with breaks in between.
        </p>
      </div>

      {/* Days with Sessions */}
      <div className="space-y-6">
        {selectedDays.map((dayOfWeek) => {
          const daySessions = timeSessions[dayOfWeek] || [];
          const stats = calculateDayStats(dayOfWeek);

          return (
            <Card key={dayOfWeek} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {DAY_NAMES[dayOfWeek]}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {daySessions.length} session
                    {daySessions.length !== 1 ? "s" : ""} •{" "}
                    {stats.totalHours.toFixed(1)}h • {stats.totalSlots} slots
                  </p>
                </div>
                <Button
                  onClickHandler={() => handleAddSession(dayOfWeek)}
                  additionalClasses="outlinebtn"
                  leadingIcon={<Plus className="w-4 h-4" />}
                  text="Add Session"
                />
              </div>

              {daySessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No time sessions added yet</p>
                  <p className="text-sm">Click "Add Session" to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {daySessions.map((session, index) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {timeUtils.formatTime(session.startTime)} -{" "}
                          {timeUtils.formatTime(session.endTime)}
                        </div>
                        <div className="flex items-center space-x-2">
                          {
                            CONSULTATION_TYPES.find(
                              (type) => type.value === session.consultationType
                            )?.icon
                          }
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {
                              CONSULTATION_TYPES.find(
                                (type) =>
                                  type.value === session.consultationType
                              )?.label
                            }
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {uiUtils.formatCurrency(session.consultationFee)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          onClickHandler={() =>
                            handleEditSession(dayOfWeek, index)
                          }
                          additionalClasses="text-gray-600 hover:text-gray-800"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClickHandler={() =>
                            handleDeleteSession(dayOfWeek, index)
                          }
                          additionalClasses="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {daySessions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Potential earnings:{" "}
                      {uiUtils.formatCurrency(stats.totalEarnings)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {stats.totalSlots} consultation slots
                    </span>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Session Builder Modal */}
      {showSessionBuilder && selectedDay !== null && (
        <TimeSessionBuilder
          isOpen={showSessionBuilder}
          onClose={() => {
            setShowSessionBuilder(false);
            setEditingSession(null);
            setSelectedDay(null);
          }}
          onSave={handleSaveSession}
          dayOfWeek={selectedDay}
          consultationDuration={consultationDuration}
          existingSession={editingSession?.session}
          existingSessions={timeSessions[selectedDay] || []}
        />
      )}

      {/* Help Text */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Gaps between sessions will automatically become break times. Patients
          won't be able to book during breaks.
        </p>
      </div>
    </div>
  );
};
