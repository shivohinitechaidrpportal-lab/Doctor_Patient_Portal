import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Clock, X, Heart, Brain, Eye, Bone, Baby, Stethoscope, Activity, Pill, Scissors, PawPrint, Zap, Settings as Lungs, Dumbbell, UserCheck, Utensils } from 'lucide-react';

const Landing: React.FC = () => {
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);

  const medicalCategories = [
    {
      name: 'General Physician',
      icon: Stethoscope,
      description: 'Primary healthcare and general medical consultations',
      image: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Gynaecology and Sexology',
      icon: Heart,
      description: 'Women\'s health and reproductive care',
      image: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-pink-500 to-rose-600'
    },
    {
      name: 'Dermatology',
      icon: Activity,
      description: 'Skin, hair, and nail conditions',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-orange-500 to-amber-600'
    },
    {
      name: 'Psychiatry and Psychology',
      icon: Brain,
      description: 'Mental health and behavioral disorders',
      image: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      name: 'Gastroenterology',
      icon: Activity,
      description: 'Digestive system disorders',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'Pediatrics',
      icon: Baby,
      description: 'Children\'s healthcare',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      name: 'ENT',
      icon: Activity,
      description: 'Ear, nose, and throat conditions',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-teal-500 to-cyan-600'
    },
    {
      name: 'Urology and Nephrology',
      icon: Activity,
      description: 'Urinary system and kidney care',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-blue-600 to-indigo-700'
    },
    {
      name: 'Orthopedics',
      icon: Bone,
      description: 'Bone and joint disorders',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-gray-600 to-slate-700'
    },
    {
      name: 'Neurology',
      icon: Brain,
      description: 'Brain and nervous system disorders',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-violet-500 to-purple-600'
    },
    {
      name: 'Cardiology',
      icon: Heart,
      description: 'Heart and cardiovascular conditions',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-red-500 to-rose-600'
    },
    {
      name: 'Diet and Nutrition / Diabetology',
      icon: Utensils,
      description: 'Nutrition counseling and diabetes care',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-lime-500 to-green-600'
    },
    {
      name: 'Ophthalmology',
      icon: Eye,
      description: 'Eye and vision care',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-sky-500 to-blue-600'
    },
    {
      name: 'Dentistry',
      icon: UserCheck,
      description: 'Oral and dental health',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-cyan-500 to-teal-600'
    },
    {
      name: 'Pulmonology',
      icon: Lungs,
      description: 'Lung and respiratory conditions',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-emerald-500 to-green-600'
    },
    {
      name: 'Oncology',
      icon: Zap,
      description: 'Cancer diagnosis and treatment',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-indigo-600 to-purple-700'
    },
    {
      name: 'Physiotherapy',
      icon: Dumbbell,
      description: 'Physical therapy and rehabilitation',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-orange-600 to-red-600'
    },
    {
      name: 'General Surgery',
      icon: Scissors,
      description: 'Surgical procedures and interventions',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-slate-600 to-gray-700'
    },
    {
      name: 'Veterinary',
      icon: PawPrint,
      description: 'Animal healthcare',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-amber-500 to-yellow-600'
    }
  ];

  const LearnMoreModal = () => (
    <div className="modal-backdrop" onClick={() => setShowLearnMoreModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-black mb-2">Medical Specialties</h2>
              <p className="text-primary-100 text-lg font-medium">Comprehensive healthcare services across all medical disciplines</p>
            </div>
            <button 
              onClick={() => setShowLearnMoreModal(false)}
              className="text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              <X className="h-8 w-8" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicalCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div 
                  key={category.name} 
                  className="category-card group animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="relative mb-4 overflow-hidden rounded-xl">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80`}></div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <Icon className="h-5 w-5 text-gray-700" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-8 border border-primary-200">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Connect with Healthcare Experts?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Our platform connects you with qualified medical professionals across all specialties. 
              Get the care you deserve, when you need it.
            </p>
            <Link 
              to="/login"
              onClick={() => setShowLearnMoreModal(false)}
              className="btn-primary text-lg px-8 py-4"
            >
              <span>Start Your Healthcare Journey</span>
              <ArrowRight className="w-6 h-6 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <div className="container-width section-padding py-20">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-3 mb-8 animate-slide-up">
            <div className="relative">
              <Heart className="h-16 w-16 text-primary-600" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-500 rounded-full animate-pulse-soft flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span className="text-4xl font-black text-gray-900 tracking-tight">HealthBook</span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-black text-gray-900 mb-8 animate-slide-up leading-tight" style={{ animationDelay: '0.1s' }}>
            Your Health,<br />
            <span className="text-gradient">Our Priority</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up font-medium" style={{ animationDelay: '0.2s' }}>
            Connect with qualified healthcare professionals from the comfort of your home. 
            Book appointments, get consultations, and manage your health journey seamlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link 
              to="/login"
              className="btn-primary text-lg px-10 py-5"
            >
              Get Started Today
              <ArrowRight className="w-6 h-6 ml-2" />
            </Link>
            <button 
              onClick={() => setShowLearnMoreModal(true)}
              className="btn-secondary text-lg px-10 py-5"
            >
              Explore Specialties
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="professional-card text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Secure & Private</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Your health data is protected with enterprise-grade security and privacy measures that exceed industry standards.
            </p>
          </div>

          <div className="professional-card text-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="bg-gradient-to-br from-success-500 to-success-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Expert Doctors</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Access to a network of qualified and experienced healthcare professionals across 19+ medical specialties.
            </p>
          </div>

          <div className="professional-card text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">24/7 Available</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Get medical consultations and support whenever you need it, with flexible scheduling that fits your lifestyle.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="professional-card text-center animate-slide-up bg-gradient-to-r from-primary-600 to-secondary-600 text-white border-0" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of patients who trust us with their healthcare needs. 
            Experience the future of healthcare today.
          </p>
          <Link 
            to="/login"
            className="inline-flex items-center space-x-3 bg-white text-primary-600 px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 hover:bg-primary-50 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Learn More Modal */}
      {showLearnMoreModal && <LearnMoreModal />}
    </div>
  );
};

export default Landing;