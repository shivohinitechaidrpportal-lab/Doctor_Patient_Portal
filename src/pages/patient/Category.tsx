import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Star, MapPin, User, CheckCircle } from 'lucide-react';
import { X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Doctor } from '../../types';
import BookingModal from '../../components/BookingModal';

// Success notification component
const SuccessNotification = ({ doctorName, onClose }: { doctorName: string; onClose: () => void }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-md p-4 shadow-lg z-50 max-w-sm">
      <div className="flex items-start space-x-3">
        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-green-800">Appointment Sent!</h4>
          <p className="text-sm text-green-700 mt-1">
            Appointment sent to Dr. {doctorName}. You will be notified once it's accepted.
          </p>
        </div>
        <button onClick={onClose} className="text-green-400 hover:text-green-600">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const { categories, createAppointment, getDoctors } = useData();
  const { user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [bookedDoctorName, setBookedDoctorName] = useState('');

  const category = categories.find(cat => cat.slug === slug);

  // Get approved doctors for this category
  const allDoctors = getDoctors();
  const doctors = allDoctors.filter((doctor: Doctor) => 
    doctor.category === slug && doctor.isApproved
  ).map((doctor: Doctor) => ({
    ...doctor,
    rating: 4.5 + Math.random() * 0.5, // Mock rating
    totalReviews: Math.floor(Math.random() * 200) + 50, // Mock reviews
    nextAvailableSlot: new Date(Date.now() + (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    location: 'Medical Center', // Mock location
  }));

  const handleBookAppointment = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = (datetime: Date, vitals?: { bloodPressure?: string; temperature?: string }) => {
    if (!selectedDoctor || !user) return;

    createAppointment({
      patientId: user.id,
      doctorId: selectedDoctor.id,
      patientName: user.name,
      doctorName: selectedDoctor.name,
      doctorCategory: category?.name || '',
      datetime,
      status: 'pending',
      patientVitals: vitals,
    });

    setBookedDoctorName(selectedDoctor.name);
    setShowBookingModal(false);
    setSelectedDoctor(null);
    setShowSuccessNotification(true);
  };

  const formatNextAvailable = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays === 2) return 'In 2 days';
    if (diffInDays <= 7) return `In ${diffInDays} days`;
    return date.toLocaleDateString();
  };

  if (!category) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
          <Link to="/patient/browse" className="text-blue-600 hover:text-blue-700">
            ← Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/patient/browse" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
        <p className="text-gray-600">{category.description}</p>
      </div>

      {/* Filters */}
      <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-4">
          <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Sort by</option>
            <option>Next Available</option>
            <option>Rating</option>
            <option>Experience</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All Locations</option>
            <option>Downtown Medical Center</option>
            <option>City Health Clinic</option>
            <option>Riverside Medical Group</option>
          </select>
        </div>
      </div>

      {/* Doctors List */}
      <div className="space-y-6">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{doctor.name}</h3>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{doctor.rating}</span>
                        <span className="text-sm text-gray-500">({doctor.totalReviews} reviews)</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {doctor.experience} experience
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{doctor.bio}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{doctor.location}</span>
                      </div>
                      {doctor.degrees && (
                        <div className="flex items-center space-x-1">
                          <span>{doctor.degrees}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Next available: {formatNextAvailable(doctor.nextAvailableSlot)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 lg:mt-0 lg:ml-6">
                <button
                  onClick={() => handleBookAppointment(doctor)}
                  className="w-full lg:w-auto bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {doctors.length === 0 && (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors available</h3>
          <p className="text-gray-500">There are currently no approved doctors in this specialty.</p>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => setShowBookingModal(false)}
          onConfirm={handleConfirmBooking}
        />
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <SuccessNotification
          doctorName={bookedDoctorName}
          onClose={() => setShowSuccessNotification(false)}
        />
      )}
    </div>
  );
};

export default Category;