import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Leaf, 
  MapPin, 
  BarChart3, 
  Users, 
  Shield, 
  Globe,
  ArrowRight,
  Camera,
  Database
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Camera className="h-8 w-8 text-primary-600" />,
      title: 'Report Sightings',
      description: 'Easily report invasive species sightings with photos and GPS coordinates.'
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary-600" />,
      title: 'Geographic Tracking',
      description: 'Track the spread of invasive species across Australia with interactive maps.'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary-600" />,
      title: 'Data Analytics',
      description: 'Access comprehensive analytics and insights about invasive species patterns.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: 'Community Engagement',
      description: 'Join a community of researchers, citizens, and conservationists.'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: 'Expert Verification',
      description: 'Reports are verified by experts to ensure data accuracy and reliability.'
    },
    {
      icon: <Database className="h-8 w-8 text-primary-600" />,
      title: 'Research Integration',
      description: 'Contribute to scientific research and conservation efforts.'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Species Tracked' },
    { number: '5000+', label: 'Reports Submitted' },
    { number: '100+', label: 'Active Researchers' },
    { number: '50+', label: 'Conservation Partners' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Leaf className="h-16 w-16 text-primary-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Stop Invasive Species
              <span className="text-primary-600"> Together</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join the fight against invasive species in Australia. Report sightings, 
              track their spread, and contribute to conservation efforts that protect 
              our unique biodiversity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/reports/new"
                  className="btn btn-primary btn-lg"
                >
                  Report a Sighting
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-lg"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-outline btn-lg"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose InvaStop?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive tools for tracking and managing 
              invasive species across Australia.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Protecting Australia's Biodiversity
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Invasive species pose a significant threat to Australia's unique 
                ecosystems. They can outcompete native species, alter habitats, 
                and cause economic damage to agriculture and infrastructure.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                InvaStop empowers citizens, researchers, and conservationists to 
                work together in early detection and rapid response to invasive 
                species threats. By reporting sightings and sharing data, we can 
                better understand and manage these threats.
              </p>
              <div className="flex items-center space-x-4">
                <Globe className="h-6 w-6 text-primary-600" />
                <span className="text-sm text-gray-600">
                  Supporting UN Sustainable Development Goal 13: Climate Action
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg p-8">
              <div className="text-center">
                <Leaf className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Join the Movement
                </h3>
                <p className="text-gray-600 mb-6">
                  Every report counts. Help us protect Australia's unique 
                  biodiversity for future generations.
                </p>
                {!isAuthenticated && (
                  <Link
                    to="/register"
                    className="btn btn-primary"
                  >
                    Start Contributing
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Australians who are already contributing to 
            invasive species monitoring and conservation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg"
                >
                  Sign Up Now
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 btn-lg"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
