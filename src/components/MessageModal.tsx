import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, Calendar, Clock } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

interface MessageModalProps {
  appointmentId: string;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ appointmentId, onClose }) => {
  const { user } = useAuth();
  const { appointments, getAppointmentMessages, sendMessage, markMessagesAsRead } = useData();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const appointment = appointments.find(apt => apt.id === appointmentId);

  useEffect(() => {
    if (appointmentId && user) {
      const appointmentMessages = getAppointmentMessages(appointmentId);
      setMessages(appointmentMessages);
      markMessagesAsRead(appointmentId, user.id);
    }
  }, [appointmentId, user, getAppointmentMessages, markMessagesAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !appointmentId) return;

    sendMessage(appointmentId, message);
    setMessage('');
    
    // Refresh messages
    const updatedMessages = getAppointmentMessages(appointmentId);
    setMessages(updatedMessages);
  };

  if (!appointment || !user) {
    return null;
  }

  const canSendMessages = appointment.status === 'accepted';
  const isDoctor = user.role === 'doctor';
  const otherPartyName = isDoctor ? appointment.patientName : appointment.doctorName;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content max-w-2xl w-full h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{otherPartyName}</h2>
                <p className="text-primary-100">{appointment.doctorCategory}</p>
                <div className="flex items-center space-x-4 text-sm text-primary-100 mt-1">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{appointment.datetime.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                appointment.status === 'accepted' ? 'bg-success-500/20 text-success-100 border border-success-400/30' :
                appointment.status === 'pending' ? 'bg-warning-500/20 text-warning-100 border border-warning-400/30' :
                'bg-white/20 text-white border border-white/30'
              }`}>
                {appointment.status === 'accepted' ? 'Confirmed' :
                 appointment.status === 'pending' ? (isDoctor ? 'Awaiting Your Approval' : 'Awaiting Confirmation') :
                 appointment.status}
              </div>
              <button 
                onClick={onClose}
                className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-white">
          {/* Messages List */}
          <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
            {!canSendMessages && (
              <div className="text-center py-8">
                <div className="bg-warning-50 border border-warning-200 rounded-xl p-6 mb-4">
                  <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-warning-600" />
                  </div>
                  <p className="text-sm text-warning-800 font-medium">
                    {appointment.status === 'pending' 
                      ? (isDoctor 
                          ? 'Accept the appointment first to enable messaging.'
                          : 'Messaging will be available once the doctor confirms your appointment.'
                        )
                      : 'Messaging is not available for this appointment.'
                    }
                  </p>
                </div>
              </div>
            )}

            {messages.length === 0 && canSendMessages && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Start the conversation</h3>
                <p className="text-neutral-500">Send your first message to begin chatting with {otherPartyName}.</p>
              </div>
            )}

            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'} animate-slide-up`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-soft ${
                      msg.senderId === user.id
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                        : 'bg-white text-neutral-900 border border-neutral-200 shadow-sm'
                    }`}
                  >
                    <p className={`text-sm leading-relaxed font-medium ${
                      msg.senderId === user.id ? 'text-white' : 'text-neutral-900'
                    }`}>{msg.content}</p>
                    <p className={`text-xs mt-2 ${
                      msg.senderId === user.id ? 'text-white/80' : 'text-neutral-500'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          {canSendMessages && (
            <div className="flex-shrink-0 border-t border-neutral-200 p-6 bg-neutral-50">
              <form onSubmit={handleSendMessage} className="flex space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Message ${otherPartyName}...`}
                  className="flex-1 form-input bg-white shadow-sm"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageModal;