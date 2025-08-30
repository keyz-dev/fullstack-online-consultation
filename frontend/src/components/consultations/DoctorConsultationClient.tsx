"use client";

import React, { useState, useEffect } from 'react';
import { consultationsAPI } from '@/api/consultations';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Consultation } from '@/types';

// Mock data until the backend endpoint is implemented
const mockConsultations: Consultation[] = [
  {
    id: '1',
    patientId: 'patient-123',
    doctorId: 'doctor-456',
    status: 'scheduled',
    type: 'video',
    scheduledAt: new Date().toISOString(),
    patient: {
        id: 'patient-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://i.pravatar.cc/150?u=patient-123'
    }
  },
  {
    id: '2',
    patientId: 'patient-789',
    doctorId: 'doctor-456',
    status: 'completed',
    type: 'video',
    scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    patient: {
        id: 'patient-789',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        avatar: 'https://i.pravatar.cc/150?u=patient-789'
    }
  },
];

export default function DoctorConsultationClient() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      if (!user) return;
      try {
        // TODO: Replace mock data with API call once GET /consultations is ready
        // const response = await consultationsAPI.getConsultations({ filters: { doctorId: user.id } });
        // setConsultations(response.consultations);
        setConsultations(mockConsultations.filter(c => c.doctorId === 'doctor-456')); // Mock filter
      } catch (err) {
        setError('Failed to fetch consultations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [user]);

  const handleStartCall = async (consultationId: string) => {
    try {
      const response = await consultationsAPI.initiateCall(consultationId);
      if (response.success) {
        // TODO: Navigate to video call room
        console.log('Call initiated! Room ID:', response.data?.roomId);
        alert(`Call initiated for consultation ${consultationId}. Room: ${response.data?.roomId}`);
      } else {
        alert(`Failed to start call: ${response.message}`);
      }
    } catch (err) {
      alert('An error occurred while starting the call.');
      console.error(err);
    }
  };

  if (loading) return <div>Loading consultations...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Consultations</h1>
      <div className="space-y-4">
        {consultations.map((consultation) => (
          <div key={consultation.id} className="p-4 border rounded-lg flex items-center justify-between">
            <div>
              <p className="font-semibold">Patient: {consultation.patient?.name}</p>
              <p>Status: {consultation.status}</p>
              <p>Type: {consultation.type}</p>
              <p>Scheduled: {new Date(consultation.scheduledAt).toLocaleString()}</p>
            </div>
            {consultation.status === 'scheduled' && consultation.type === 'video' && (
              <Button onClick={() => handleStartCall(consultation.id)}>
                Start Call
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
