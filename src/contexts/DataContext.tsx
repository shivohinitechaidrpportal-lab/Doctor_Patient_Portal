import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appointment, Message, ActivityLog, Category, Doctor, AppStats } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  // Categories
  categories: Category[];
  
  // Appointments
  appointments: Appointment[];
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  
  // Messages
  messages: Message[];
  sendMessage: (appointmentId: string, content: string) => void;
  markMessagesAsRead: (appointmentId: string, userId: string) => void;
  
  // Activity Logs
  activityLogs: ActivityLog[];
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  
  // Admin functions
  getDoctors: () => Doctor[];
  approveDoctor: (doctorId: string) => void;
  getAppStats: () => AppStats;
  
  // Helper functions
  getUnreadMessageCount: (appointmentId: string, userId: string) => number;
  getAppointmentMessages: (appointmentId: string) => Message[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

const MEDICAL_CATEGORIES: Category[] = [
  { id: '1', name: 'General Physician', slug: 'general-physician', description: 'General healthcare and primary care' },
  { id: '2', name: 'Gynaecology and Sexology', slug: 'gynaecology-sexology', description: 'Women\'s health and reproductive care' },
  { id: '3', name: 'Dermatology', slug: 'dermatology', description: 'Skin, hair, and nail conditions' },
  { id: '4', name: 'Psychiatry and Psychology', slug: 'psychiatry-psychology', description: 'Mental health and behavioral disorders' },
  { id: '5', name: 'Gastroenterology', slug: 'gastroenterology', description: 'Digestive system disorders' },
  { id: '6', name: 'Pediatrics', slug: 'pediatrics', description: 'Children\'s healthcare' },
  { id: '7', name: 'ENT', slug: 'ent', description: 'Ear, nose, and throat conditions' },
  { id: '8', name: 'Urology and Nephrology', slug: 'urology-nephrology', description: 'Urinary system and kidney care' },
  { id: '9', name: 'Orthopedics', slug: 'orthopedics', description: 'Bone and joint disorders' },
  { id: '10', name: 'Neurology', slug: 'neurology', description: 'Brain and nervous system disorders' },
  { id: '11', name: 'Cardiology', slug: 'cardiology', description: 'Heart and cardiovascular conditions' },
  { id: '12', name: 'Diet and Nutrition / Diabetology', slug: 'nutrition-diabetology', description: 'Nutrition counseling and diabetes care' },
  { id: '13', name: 'Ophthalmology', slug: 'ophthalmology', description: 'Eye and vision care' },
  { id: '14', name: 'Dentistry', slug: 'dentistry', description: 'Oral and dental health' },
  { id: '15', name: 'Pulmonology', slug: 'pulmonology', description: 'Lung and respiratory conditions' },
  { id: '16', name: 'Oncology', slug: 'oncology', description: 'Cancer diagnosis and treatment' },
  { id: '17', name: 'Physiotherapy', slug: 'physiotherapy', description: 'Physical therapy and rehabilitation' },
  { id: '18', name: 'General Surgery', slug: 'general-surgery', description: 'Surgical procedures and interventions' },
  { id: '19', name: 'Veterinary', slug: 'veterinary', description: 'Animal healthcare' },
];

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Initialize sample data
  useEffect(() => {
    initializeSampleData();
    loadStoredData();
  }, []);
      // Convert timestamp strings back to Date objects
  const loadStoredData = () => {
    // Load appointments
    const storedAppointments = localStorage.getItem('appointments');
    if (storedAppointments) {
      try {
        const parsedAppointments = JSON.parse(storedAppointments).map((apt: any) => ({
          ...apt,
          datetime: new Date(apt.datetime),
          createdAt: new Date(apt.createdAt),
          updatedAt: new Date(apt.updatedAt),
        }));
        setAppointments(parsedAppointments);
      } catch (error) {
        console.error('Error parsing appointments:', error);
      }
    }

    // Load messages
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error parsing messages:', error);
      }
    }

    // Load activity logs
    const storedLogs = localStorage.getItem('activityLogs');
    if (storedLogs) {
      try {
        const parsedLogs = JSON.parse(storedLogs).map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
        setActivityLogs(parsedLogs);
      } catch (error) {
        console.error('Error parsing activity logs:', error);
      }
    }
  };

  const initializeSampleData = () => {
    // Initialize with sample admin user if no users exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      const adminUser = {
        id: 'admin-1',
        name: 'System Admin',
        email: 'admin@healthbook.com',
        role: 'admin',
        createdAt: new Date(),
      };
      localStorage.setItem('users', JSON.stringify([adminUser]));
    }
  };

  const createAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    // Add activity log
    if (user) {
      addActivityLog({
        userId: user.id,
        userRole: user.role,
        userName: user.name,
        action: 'APPOINTMENT_CREATED',
        details: `Appointment booked with ${appointment.doctorName} for ${appointment.datetime.toLocaleDateString()}`,
      });
    }
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === id ? { ...apt, ...updates, updatedAt: new Date() } : apt
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    // Add activity log
    if (user && updates.status) {
      const appointment = appointments.find(apt => apt.id === id);
      if (appointment) {
        addActivityLog({
          userId: user.id,
          userRole: user.role,
          userName: user.name,
          action: `APPOINTMENT_${updates.status?.toUpperCase()}`,
          details: `Appointment ${updates.status} - ${appointment.patientName} with Dr. ${appointment.doctorName}`,
        });
      }
    }
  };

  const sendMessage = (appointmentId: string, content: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      appointmentId,
      senderId: user.id,
      senderRole: user.role as 'patient' | 'doctor',
      content,
      timestamp: new Date(),
      read: false,
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  const markMessagesAsRead = (appointmentId: string, userId: string) => {
    const updatedMessages = messages.map(msg =>
      msg.appointmentId === appointmentId && msg.senderId !== userId
        ? { ...msg, read: true }
        : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  const addActivityLog = (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    const updatedLogs = [newLog, ...activityLogs];
    setActivityLogs(updatedLogs);
    localStorage.setItem('activityLogs', JSON.stringify(updatedLogs));
  };

  const getDoctors = (): Doctor[] => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.filter((u: any) => u.role === 'doctor');
  };

  const approveDoctor = (doctorId: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) =>
      u.id === doctorId ? { ...u, isApproved: !u.isApproved } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Add activity log
    if (user) {
      const doctor = users.find((u: any) => u.id === doctorId);
      if (doctor) {
        addActivityLog({
          userId: user.id,
          userRole: user.role,
          userName: user.name,
          action: doctor.isApproved ? 'DOCTOR_UNAPPROVED' : 'DOCTOR_APPROVED',
          details: `Dr. ${doctor.name} has been ${doctor.isApproved ? 'unapproved' : 'approved'}`,
        });
      }
    }
  };

  const getAppStats = (): AppStats => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const doctors = users.filter((u: any) => u.role === 'doctor');
    const patients = users.filter((u: any) => u.role === 'patient');
    
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayAppointments = appointments.filter(apt => 
      apt.datetime.toDateString() === today.toDateString()
    );
    
    const weekAppointments = appointments.filter(apt => 
      apt.datetime >= weekAgo
    );

    const todayMessages = messages.filter(msg => 
      msg.timestamp.toDateString() === today.toDateString()
    );

    const appointmentsByStatus = appointments.reduce((acc, apt) => {
      acc[apt.status] = (acc[apt.status] || 0) + 1;
      return acc;
    }, {} as any);

    return {
      totalDoctors: doctors.length,
      approvedDoctors: doctors.filter((d: any) => d.isApproved).length,
      pendingDoctors: doctors.filter((d: any) => !d.isApproved).length,
      totalPatients: patients.length,
      todayAppointments: todayAppointments.length,
      weekAppointments: weekAppointments.length,
      todayMessages: todayMessages.length,
      appointmentsByStatus: {
        pending: appointmentsByStatus.pending || 0,
        accepted: appointmentsByStatus.accepted || 0,
        completed: appointmentsByStatus.completed || 0,
        cancelled: appointmentsByStatus.cancelled || 0,
        no_show: appointmentsByStatus.no_show || 0,
      },
    };
  };

  const getUnreadMessageCount = (appointmentId: string, userId: string): number => {
    return messages.filter(msg => 
      msg.appointmentId === appointmentId && 
      msg.senderId !== userId && 
      !msg.read
    ).length;
  };

  const getAppointmentMessages = (appointmentId: string): Message[] => {
    return messages
      .filter(msg => msg.appointmentId === appointmentId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  };

  const value = {
    categories: MEDICAL_CATEGORIES,
    appointments,
    createAppointment,
    updateAppointment,
    messages,
    sendMessage,
    markMessagesAsRead,
    activityLogs,
    addActivityLog,
    getDoctors,
    approveDoctor,
    getAppStats,
    getUnreadMessageCount,
    getAppointmentMessages,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};