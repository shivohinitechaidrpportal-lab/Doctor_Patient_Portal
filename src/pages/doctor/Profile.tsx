import React, { useState } from 'react';
import { User, Save, Edit3, Stethoscope, GraduationCap, FileText, TrendingUp, Users, Calendar, Star, Award, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { categories, appointments } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    category: user?.category || '',
    bio: user?.bio || '',
    experience: user?.experience || '',
    degrees: user?.degrees || '',
  });

  if (!user || user.role !== 'doctor') return null;

  // Calculate KPIs
  const doctorAppointments = appointments.filter(apt => apt.doctorId === user.id);
  const completedAppointments = doctorAppointments.filter(apt => apt.status === 'completed');
  const totalPatients = new Set(doctorAppointments.map(apt => apt.patientId)).size;
  const thisMonthAppointments = doctorAppointments.filter(apt => {
    const appointmentDate = new Date(apt.datetime);
    const now = new Date();
    return appointmentDate.getMonth() === now.getMonth() && 
           appointmentDate.getFullYear() === now.getFullYear();
  }).length;
  
  const averageRating = 4.7 + Math.random() * 0.3; // Mock rating
  const responseTime = Math.floor(Math.random() * 30) + 15; // Mock response time in minutes
  const experienceYears = user.experience ? parseInt(user.experience.match(/\d+/)?.[0] || '0') : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = () => {
    updateUser({
      name: formData.name,
      email: formData.email,
      category: formData.category,
      bio: formData.bio,
      experience: formData.experience,
      degrees: formData.degrees,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      category: user?.category || '',
      bio: user?.bio || '',
      experience: user?.experience || '',
      degrees: user?.degrees || '',
    });
    setIsEditing(false);
  };

  const getCategoryName = (slug: string) => {
    const category = categories.find(cat => cat.slug === slug);
    return category?.name || slug;
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'indigo';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    };

    return (
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6 hover:shadow-medium transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <TrendingUp className="h-4 w-4 text-success-500" />
        </div>
        <div>
          <p className="text-2xl font-bold text-neutral-900 mb-1">{value}</p>
          <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
          {subtitle && <p className="text-xs text-neutral-500">{subtitle}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Profile</h1>
          <p className="text-neutral-600">Manage your professional information and credentials</p>
        </div>

        {/* KPI Dashboard */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Users}
              title="Total Patients"
              value={totalPatients}
              subtitle="Unique patients served"
              color="blue"
            />
            <StatCard
              icon={Calendar}
              title="Completed Sessions"
              value={completedAppointments.length}
              subtitle="All-time appointments"
              color="green"
            />
            <StatCard
              icon={Star}
              title="Patient Rating"
              value={averageRating.toFixed(1)}
              subtitle="Based on patient feedback"
              color="orange"
            />
            <StatCard
              icon={Clock}
              title="Avg Response Time"
              value={`${responseTime}m`}
              subtitle="Message response time"
              color="purple"
            />
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
              This Month's Activity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-900 mb-1">{thisMonthAppointments}</div>
                <div className="text-sm text-primary-700">Appointments</div>
              </div>
              <div className="text-center p-4 bg-success-50 rounded-lg">
                <div className="text-2xl font-bold text-success-900 mb-1">{Math.floor(thisMonthAppointments * 0.85)}</div>
                <div className="text-sm text-success-700">Completed</div>
              </div>
              <div className="text-center p-4 bg-secondary-50 rounded-lg">
                <div className="text-2xl font-bold text-secondary-900 mb-1">{experienceYears}+</div>
                <div className="text-sm text-secondary-700">Years Experience</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">Dr. {user.name}</h2>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-neutral-500 capitalize">{user.role}</p>
                  {!user.isApproved && (
                    <span className="status-pending">
                      Pending Approval
                    </span>
                  )}
                  {user.isApproved && (
                    <span className="status-success">
                      Approved
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-primary"
            >
              <Edit3 className="h-4 w-4" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                      />
                    ) : (
                      <p className="text-neutral-900">Dr. {user.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                      />
                    ) : (
                      <p className="text-neutral-900">{user.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2 text-primary-500" />
                  Professional Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Medical Specialty</label>
                    {isEditing ? (
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="">Select your specialty</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.slug}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-neutral-900">{getCategoryName(user.category || '')}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">
                      <GraduationCap className="h-4 w-4 inline mr-1" />
                      Degrees & Certifications
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="degrees"
                        value={formData.degrees}
                        onChange={handleChange}
                        placeholder="e.g., MD, MBBS, MS, Fellowship in Cardiology"
                        className="form-input"
                      />
                    ) : (
                      <p className="text-neutral-900">{user.degrees || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Years of Experience</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="e.g., 10 years"
                        className="form-input"
                      />
                    ) : (
                      <p className="text-neutral-900">{user.experience || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">
                      <FileText className="h-4 w-4 inline mr-1" />
                      Professional Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell patients about your background, expertise, and approach to healthcare..."
                        className="form-input"
                      />
                    ) : (
                      <p className="text-neutral-900">{user.bio || 'No bio provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Approval Status */}
              <div className="bg-neutral-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Account Status</h3>
                {user.isApproved ? (
                  <div className="flex items-center space-x-2 text-success-700">
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                    <span className="text-sm">Your account is approved and visible to patients</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-warning-700">
                    <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                    <span className="text-sm">Your account is pending admin approval</span>
                  </div>
                )}
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;