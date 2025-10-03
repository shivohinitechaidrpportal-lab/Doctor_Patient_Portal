import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MessageCircle, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  Eye,
  Activity,
  Heart,
  Thermometer,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import MessageModal from '../../components/MessageModal';

const Dashboard = () => {
  const { user } = useAuth();
  const { appointments, updateAppointment, getUnreadMessageCount } = useData();
  const [activeTab, setActiveTab] = useState<'next' | 'upcoming' | 'past'>('next');
  const [prescriptions, setPrescriptions] = useState<{ [key: string]: string }>({});
  const [doctorNotes, setDoctorNotes] = useState<{ [key: string]: string }>({});
  const [selectedAppointmentForMessage, setSelectedAppointmentForMessage] = useState<string | null>(null);
  const [showPatientHistory, setShowPatientHistory] = useState<string | null>(null);

  // Initialize state when appointments change
  React.useEffect(() => {
    const newPrescriptions: { [key: string]: string } = {};
    const newDoctorNotes: { [key: string]: string } = {};
    
    appointments.forEach(apt => {
      if (apt.doctorId === user?.id) {
        // Only initialize if not already in state
        if (prescriptions[apt.id] === undefined) {
          newPrescriptions[apt.id] = apt.prescription || '';
        }
        if (doctorNotes[apt.id] === undefined) {
          newDoctorNotes[apt.id] = apt.doctorNotes || '';
        }
      }
    });
    
    if (Object.keys(newPrescriptions).length > 0) {
      setPrescriptions(prev => ({ ...prev, ...newPrescriptions }));
    }
    if (Object.keys(newDoctorNotes).length > 0) {
      setDoctorNotes(prev => ({ ...prev, ...newDoctorNotes }));
    }
  }, [appointments, user?.id]);
  if (!user || user.role !== 'doctor') return null;

  const doctorAppointments = appointments.filter(apt => apt.doctorId === user.id);

  // Next Booking - earliest pending appointment
  const nextBooking = doctorAppointments
    .filter(apt => apt.status === 'pending')
    .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())[0];

  // Upcoming - accepted future appointments
  const upcomingAppointments = doctorAppointments
    .filter(apt => apt.status === 'accepted' && !apt.prescription)
    .sort((a, b) => a.datetime.getTime() - b.datetime.getTime());

  // Past - completed/cancelled appointments
  const pastAppointments = doctorAppointments
    .filter(apt => 
      apt.status === 'completed' || 
      apt.status === 'cancelled' || 
      apt.status === 'no_show' ||
      apt.prescription
    )
    .sort((a, b) => b.datetime.getTime() - a.datetime.getTime());

  const handleAcceptAppointment = (appointmentId: string) => {
    updateAppointment(appointmentId, { status: 'accepted' });
  };

  const handleDeclineAppointment = (appointmentId: string) => {
    updateAppointment(appointmentId, { status: 'cancelled' });
  };

  const handleMarkCompleted = (appointmentId: string) => {
    const prescription = prescriptions[appointmentId] || '';
    if (prescription.trim()) {
      updateAppointment(appointmentId, { 
        status: 'completed',
        prescription: prescription
      });
      setPrescriptions({ ...prescriptions, [appointmentId]: '' });
    }
  };

  const handleMarkNoShow = (appointmentId: string) => {
    updateAppointment(appointmentId, { status: 'no_show' });
  };

  const prescribeMedicine = (appointmentId: string) => {
    const prescription = prescriptions[appointmentId];
    if (prescription && prescription.trim()) {
      updateAppointment(appointmentId, { 
        prescription: prescription,
        status: 'completed'
      });
    }
  };

  const updateDoctorNotes = (appointmentId: string, notes: string) => {
    updateAppointment(appointmentId, { doctorNotes: notes });
    // Update local state to reflect the saved notes
    setDoctorNotes(prev => ({ ...prev, [appointmentId]: notes }));
  };

  const isOverdue = (appointment: any) => {
    const appointmentTime = new Date(appointment.datetime);
    const now = new Date();
    const oneHourAfter = new Date(appointmentTime.getTime() + 60 * 60 * 1000);
    return now > oneHourAfter && appointment.status === 'accepted' && !appointment.prescription;
  };

  const mockPatientHistory = {
    'patient-1': [
      { date: new Date('2024-01-15'), summary: 'Annual checkup - all vitals normal' },
      { date: new Date('2023-11-20'), summary: 'Follow-up for blood pressure monitoring' },
      { date: new Date('2023-08-10'), summary: 'Initial consultation for hypertension' },
    ]
  };

  const PatientHistoryModal = ({ patientId, onClose }: { patientId: string; onClose: () => void }) => {
    const history = mockPatientHistory[patientId] || [];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Patient History</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="p-6 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No previous visits</p>
            ) : (
              <div className="space-y-4">
                {history.map((visit, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-4">
                    <div className="text-sm font-medium text-gray-900">
                      {visit.date.toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {visit.summary}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const NextBookingCard = ({ appointment }: { appointment: any }) => {
    const unreadCount = getUnreadMessageCount(appointment.id, user.id);
    
    // Mock patient history summary for demo
    const patientHistorySummary = "3 past visits - Last: Annual checkup (Jan 2024)";
    
    // Get patient details from users storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const patient = users.find((u: any) => u.id === appointment.patientId);
    
    return (
      <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-8 hover:shadow-medium transition-all duration-300">
        {/* Patient Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-medium">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-2xl font-bold text-neutral-900">{appointment.patientName}</h3>
                <span className="status-info text-xs">New Patient</span>
              </div>
              <p className="text-primary-600 font-semibold mb-2">{appointment.doctorCategory}</p>
              <div className="flex items-center space-x-2 text-sm text-neutral-600 mb-3">
                <FileText className="h-4 w-4" />
                <span>{patientHistorySummary}</span>
              </div>
              
              {/* Contact Info */}
              <div className="flex items-center space-x-4 text-sm text-neutral-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>patient@email.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPatientHistory(appointment.patientId)}
              className="p-3 text-neutral-400 hover:text-primary-600 transition-colors duration-200 rounded-xl hover:bg-primary-50"
              title="View patient history"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-neutral-50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">{appointment.datetime.toLocaleDateString()}</p>
                <p className="text-xs text-neutral-500">Appointment Date</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">{appointment.datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-xs text-neutral-500">Appointment Time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Vitals */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-error-500" />
            Current Vitals
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-error-50 rounded-lg border border-error-200">
              <Heart className="h-5 w-5 text-error-600" />
              <div>
                <p className="text-sm font-medium text-error-900">
                  {appointment.patientVitals?.bloodPressure || 'Not Provided'}
                </p>
                <p className="text-xs text-error-600">Blood Pressure</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-warning-50 rounded-lg border border-warning-200">
              <Thermometer className="h-5 w-5 text-warning-600" />
              <div>
                <p className="text-sm font-medium text-warning-900">
                  {appointment.patientVitals?.temperature ? `${appointment.patientVitals.temperature}°F` : 'Not Provided'}
                </p>
                <p className="text-xs text-warning-600">Temperature</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => handleAcceptAppointment(appointment.id)}
            className="flex-1 btn-success py-4 text-base font-semibold"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Accept
          </button>
          <button
            onClick={() => handleDeclineAppointment(appointment.id)}
            className="flex-1 btn-error py-4 text-base font-semibold"
          >
            <XCircle className="h-5 w-5 mr-2" />
            Decline
          </button>
        </div>
      </div>
    );
  };

  const AppointmentCard = ({ appointment, showActions = false }: { appointment: any; showActions?: boolean }) => {
    const unreadCount = getUnreadMessageCount(appointment.id, user.id);
    const isPastDue = appointment.datetime <= new Date() && appointment.status === 'accepted';
    
    // Get patient details from users storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const patient = users.find((u: any) => u.id === appointment.patientId);
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{appointment.patientName}</h3>
            <p className="text-sm text-gray-600">{appointment.doctorCategory}</p>
            
            {/* Patient Basic Info */}
            {patient && (
              <div className="mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  {patient.age && <span>Age: {patient.age}</span>}
                  {patient.sex && <span>Sex: {patient.sex}</span>}
                  {patient.height && <span>Height: {patient.height}</span>}
                  {patient.weight && <span>Weight: {patient.weight}</span>}
                </div>
                {(patient.medications || patient.allergies) && (
                  <div className="mt-1">
                    {patient.medications && <div><span className="font-medium">Medications:</span> {patient.medications}</div>}
                    {patient.allergies && <div><span className="font-medium">Allergies:</span> {patient.allergies}</div>}
                  </div>
                )}
              </div>
            )}
            
            {appointment.patientVitals && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Vitals: </span>
                {appointment.patientVitals.bloodPressure && (
                  <span>BP: {appointment.patientVitals.bloodPressure} </span>
                )}
                {appointment.patientVitals.temperature && (
                  <span>Temp: {appointment.patientVitals.temperature}°F</span>
                )}
              </div>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
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
          <button
            onClick={() => setShowPatientHistory(appointment.patientId)}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Eye className="h-4 w-4" />
            <span>History</span>
          </button>
        </div>

        {appointment.recommendations && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Recommendations:</h4>
                <p className="text-sm text-blue-800">{appointment.recommendations}</p>
              </div>
            </div>
          </div>
        )}

        {(appointment.status === 'accepted' || appointment.status === 'completed') && (
          <div className="mb-4 space-y-4">
            {!appointment.prescription && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prescribe Medicine:
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={prescriptions[appointment.id] || ''}
                    onChange={(e) => setPrescriptions({
                      ...prescriptions,
                      [appointment.id]: e.target.value
                    })}
                    placeholder="Medicine name, dosage, instructions..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => prescribeMedicine(appointment.id)}
                    disabled={!prescriptions[appointment.id]?.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prescribe
                  </button>
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Private Doctor Notes:
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={doctorNotes[appointment.id] || ''}
                  onChange={(e) => setDoctorNotes({
                    ...doctorNotes,
                    [appointment.id]: e.target.value
                  })}
                  placeholder="Private notes (not visible to patient)..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={() => {
                    const notes = doctorNotes[appointment.id] || '';
                    updateDoctorNotes(appointment.id, notes);
                  }}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors duration-200"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className={`text-xs px-2 py-1 rounded-full ${
            appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
            appointment.status === 'accepted' ? 'bg-green-100 text-green-800' :
            appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            appointment.status === 'no_show' ? 'bg-orange-100 text-orange-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {appointment.status === 'completed' ? 'Completed' :
             appointment.status === 'accepted' ? 'Confirmed' :
             appointment.status === 'cancelled' ? 'Cancelled' :
             appointment.status === 'no_show' ? 'No Show' :
             appointment.status}
          </div>
          
          <div className="flex items-center space-x-2">
            {isPastDue && showActions && (
              <>
                <button
                  onClick={() => handleMarkCompleted(appointment.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => handleMarkNoShow(appointment.id)}
                  className="bg-orange-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-orange-700 transition-colors duration-200"
                >
                  No Show
                </button>
              </>
            )}
            {appointment.status === 'accepted' && (
              <button
                onClick={() => setSelectedAppointmentForMessage(appointment.id)}
                className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                <MessageCircle className="h-3 w-3" />
                <span>Message</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center ml-1">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
        <p className="text-gray-600">Manage your appointments and patient care</p>
      </div>

      {/* Doctor Approval Status */}
      {!user.isApproved && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Account Pending Approval</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Your doctor account is pending admin approval. You won't be able to accept appointments until approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('next')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'next'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Next Booking {nextBooking ? '(1)' : '(0)'}
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upcoming ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'past'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Past ({pastAppointments.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'next' && (
          <div>
            {!nextBooking ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending appointments</h3>
                <p className="text-gray-500">New appointment requests will appear here</p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Booking to Review</h2>
                <NextBookingCard appointment={nextBooking} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
                <p className="text-gray-500">Accepted appointments will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
                {upcomingAppointments.map(appointment => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div>
            {pastAppointments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No past appointments</h3>
                <p className="text-gray-500">Completed appointments will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Past Appointments</h2>
                {pastAppointments.map(appointment => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Patient History Modal */}
      {showPatientHistory && (
        <PatientHistoryModal 
          patientId={showPatientHistory} 
          onClose={() => setShowPatientHistory(null)} 
        />
      )}

      {/* Message Modal */}
      {selectedAppointmentForMessage && (
        <MessageModal
          appointmentId={selectedAppointmentForMessage}
          onClose={() => setSelectedAppointmentForMessage(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;