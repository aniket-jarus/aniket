import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  GraduationCap, BookOpen, Users, Calendar, Briefcase, Phone, 
  FileText, Bell, ClipboardList, LogIn, Menu, X, ChevronRight,
  Download, Upload, CheckCircle, Clock, MapPin, Mail,
  Moon, Sun, Bookmark, BookmarkCheck, Trash2, Plus, Shield
} from 'lucide-react';
import React, { useEffect, useState, createContext, useContext } from 'react';

// --- Auth Context ---
type User = {
  username: string;
  role: 'student' | 'admin';
  course?: string;
  semester?: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, role: 'student' | 'admin', course?: string, semester?: string) => void;
  logout: () => void;
  updateCourseInfo: (course: string, semester: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateCourseInfo: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('app_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to read user from localStorage', e);
      return null;
    }
  });

  const login = (username: string, role: 'student' | 'admin', course?: string, semester?: string) => {
    const newUser: User = { username, role, course, semester };
    setUser(newUser);
    try {
      localStorage.setItem('app_user', JSON.stringify(newUser));
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('app_user');
    } catch (e) {
      console.error('Failed to remove user from localStorage', e);
    }
  };

  const updateCourseInfo = (course: string, semester: string) => {
    if (user) {
      const updatedUser = { ...user, course, semester };
      setUser(updatedUser);
      try {
        localStorage.setItem('app_user', JSON.stringify(updatedUser));
      } catch (e) {
        console.error('Failed to save user to localStorage', e);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateCourseInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Theme Context ---
export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return { isDark, toggleTheme };
};

// --- Components ---

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Home', path: '/', icon: <GraduationCap className="w-4 h-4 mr-2" /> },
    { name: 'Courses', path: '/courses', icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { name: 'Portal', path: '/portal', icon: <LogIn className="w-4 h-4 mr-2" /> },
    { name: 'Notices', path: '/notices', icon: <Bell className="w-4 h-4 mr-2" /> },
    { name: 'Faculty', path: '/faculty', icon: <Users className="w-4 h-4 mr-2" /> },
    { name: 'Events', path: '/events', icon: <Calendar className="w-4 h-4 mr-2" /> },
    { name: 'Contact', path: '/contact', icon: <Phone className="w-4 h-4 mr-2" /> },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/admin', icon: <Shield className="w-4 h-4 mr-2" /> });
  }

  return (
    <nav className="bg-indigo-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-indigo-300" />
              <span className="font-bold text-xl tracking-tight">Sharanabasveshwar College of Science</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-1 overflow-x-auto pb-2 scrollbar-hide">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex items-center transition-colors ${
                    location.pathname === link.path
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
            <button 
              onClick={toggleTheme} 
              className="ml-4 p-2 rounded-full bg-indigo-800 text-indigo-200 hover:text-white hover:bg-indigo-700 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user && (
              <button 
                onClick={logout}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-indigo-100 bg-red-600 hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-indigo-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-indigo-900 text-white'
                    : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <div className="flex items-center justify-between px-3 py-2">
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full bg-indigo-700 text-indigo-200 hover:text-white transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {user && (
                <button 
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-6 w-6 text-indigo-400" />
            <span className="font-bold text-lg">Sharanabasveshwar College of Science</span>
          </div>
          <p className="text-gray-400 text-sm">
            Empowering students to achieve excellence through quality education and innovative learning.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4 border-b border-gray-700 pb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/courses" className="hover:text-indigo-400">Programs & Courses</Link></li>
            <li><Link to="/portal" className="hover:text-indigo-400">Student Portal</Link></li>
            <li><Link to="/faculty" className="hover:text-indigo-400">Faculty Directory</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4 border-b border-gray-700 pb-2">Resources</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/portal" className="hover:text-indigo-400">Study Materials</Link></li>
            <li><Link to="/notices" className="hover:text-indigo-400">Notices & Circulars</Link></li>
            <li><Link to="/events" className="hover:text-indigo-400">Academic Calendar</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4 border-b border-gray-700 pb-2">Contact Us</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-indigo-400" />
              <span>Kalaburagi, Karnataka 585103</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-indigo-400" />
              <span>+91 8472 221942</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>info@sharanabasveshwarscience.edu</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Sharanabasveshwar College of Science. All rights reserved.
      </div>
    </footer>
  );
}

// --- Pages ---

function Home() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero Section */}
      <div className="relative bg-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="College Campus"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            Shape Your Future at <br />
            <span className="text-indigo-400">Sharanabasveshwar College of Science</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mb-8">
            Discover a world of opportunities with our world-class faculty, cutting-edge facilities, and vibrant campus life.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/courses" className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
              Explore Courses
            </Link>
            <Link to="/portal" className="bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors border border-indigo-600">
              Student Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Links & Announcements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Important Links */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen className="text-indigo-600" /> Important Links
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Admissions 2026', desc: 'Apply now for undergraduate programs', icon: <GraduationCap />, path: '/courses' },
                { title: 'Student Portal', desc: 'Login to access study materials', icon: <LogIn />, path: '/portal' },
                { title: 'Notices & Updates', desc: 'Latest college announcements', icon: <Bell />, path: '/notices' },
                { title: 'Faculty Directory', desc: 'Meet our distinguished professors', icon: <Users />, path: '/faculty' },
              ].map((item, i) => (
                <Link key={i} to={item.path} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all group">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Bell className="text-indigo-600" /> Latest Announcements
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {[
                  { date: 'Mar 15', title: 'Mid-term Examination Schedule Released', type: 'Exam' },
                  { date: 'Mar 10', title: 'Annual Tech Symposium Registration Open', type: 'Event' },
                  { date: 'Mar 05', title: 'Campus Placement Drive: Tech Giants', type: 'Career' },
                  { date: 'Feb 28', title: 'Holiday Notice: Spring Break', type: 'General' },
                ].map((notice, i) => (
                  <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{notice.type}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {notice.date}</span>
                    </div>
                    <Link to="/notices" className="font-medium text-gray-900 hover:text-indigo-600 text-sm block mt-2">
                      {notice.title}
                    </Link>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                <Link to="/notices" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1">
                  View All Notices <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News and Events */}
      <div className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="text-indigo-600" /> News & Events
            </h2>
            <Link to="/events" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center">
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Annual Cultural Fest 2026', date: 'April 10-12, 2026' },
              { img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'International Conference on AI', date: 'May 5, 2026' },
              { img: 'https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Inter-College Sports Meet', date: 'June 15-20, 2026' },
            ].map((event, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer">
                <div className="h-48 overflow-hidden">
                  <img src={event.img} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                </div>
                <div className="p-5">
                  <p className="text-sm text-indigo-600 font-medium mb-2">{event.date}</p>
                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Courses() {
  const departments = [
    {
      name: 'Faculty of Arts',
      courses: [
        { name: 'Bachelor of Arts (BA)', duration: '3 Years', syllabus: 'History, Literature, Sociology, Economics' },
        { name: 'Master of Arts (MA)', duration: '2 Years', syllabus: 'Advanced studies in chosen specialization' }
      ]
    },
    {
      name: 'Faculty of Commerce',
      courses: [
        { name: 'Bachelor of Commerce (BCom)', duration: '3 Years', syllabus: 'Accounting, Finance, Business Law, Economics' },
        { name: 'Master of Commerce (MCom)', duration: '2 Years', syllabus: 'Advanced Accounting, Corporate Finance' }
      ]
    },
    {
      name: 'Faculty of Science',
      courses: [
        { name: 'Bachelor of Science (BSc)', duration: '3 Years', syllabus: 'Physics, Chemistry, Mathematics, Biology' },
        { name: 'Master of Science (MSc)', duration: '2 Years', syllabus: 'Research methodologies, Advanced scientific concepts' }
      ]
    },
    {
      name: 'Faculty of Computer Applications',
      courses: [
        { name: 'Bachelor of Computer Applications (BCA)', duration: '3 Years', syllabus: 'Programming, Databases, Web Dev, Networking' },
        { name: 'Master of Computer Applications (MCA)', duration: '2 Years', syllabus: 'AI, Machine Learning, Cloud Computing, Software Engg' }
      ]
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Courses & Departments</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Explore our wide range of undergraduate and postgraduate programs designed to equip you with the skills needed for the modern world.</p>
      </div>

      <div className="space-y-12">
        {departments.map((dept, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
              <h2 className="text-xl font-bold text-indigo-900">{dept.name}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dept.courses.map((course, cIdx) => (
                  <div key={cIdx} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow bg-gray-50/50">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{course.name}</h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-gray-600"><strong className="text-gray-700">Duration:</strong> {course.duration}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <BookOpen className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-gray-600"><strong className="text-gray-700">Core Syllabus:</strong> {course.syllabus}</span>
                      </p>
                    </div>
                    <button className="mt-4 text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1">
                      Download Full Syllabus <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Portal() {
  const { user, login, logout, updateCourseInfo } = useAuth();
  const [loginType, setLoginType] = useState<'student' | 'admin'>('student');
  const [selectedCourse, setSelectedCourse] = useState('BCA');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPassword = password.trim().toLowerCase();

    // Mock authentication
    setTimeout(() => {
      try {
        if (loginType === 'admin') {
          if (trimmedUsername === 'sb56' && trimmedPassword === 'sb56') {
            login(trimmedUsername, 'admin');
          } else {
            setError('Invalid admin credentials.');
          }
        } else {
          if (trimmedUsername === 'sb56') {
            setError('Please use the Admin Login tab for administrator access.');
          } else if (trimmedUsername === '075' && trimmedPassword === '075') {
            if (!selectedCourse) {
              setError('Please select your course before signing in.');
              setIsLoading(false);
              return;
            }
            login(trimmedUsername, 'student', selectedCourse, '6');
          } else {
            setError('Invalid student credentials.');
          }
        }
      } catch (err) {
        console.error("Login error:", err);
        setError('An error occurred during login.');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  if (!user) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div>
            <div className="mx-auto h-12 w-12 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
              {loginType === 'admin' ? <Shield className="h-6 w-6" /> : <LogIn className="h-6 w-6" />}
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              {loginType === 'admin' ? 'Admin Portal' : 'Student Portal'}
            </h2>
          </div>

          <div className="flex border-b border-gray-200 dark:border-gray-700 mt-4">
            <button
              type="button"
              onClick={() => { setLoginType('student'); setError(''); }}
              className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${loginType === 'student' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
              Student Login
            </button>
            <button
              type="button"
              onClick={() => { setLoginType('admin'); setError(''); }}
              className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${loginType === 'admin' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
              Admin Login
            </button>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleLogin}>
            {error && <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">{error}</p>}
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label className="sr-only">Username</label>
                <input 
                  type="text" 
                  required 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder={loginType === 'admin' ? "Admin Username" : "Student Username"} 
                />
              </div>
              <div>
                <label className="sr-only">Password</label>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Password" 
                />
              </div>
              {loginType === 'student' && (
                <div>
                  <label className="sr-only">Select Course</label>
                  <select 
                    value={selectedCourse} 
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="" disabled>Select your course</option>
                    <option value="BCA">BCA</option>
                    <option value="BSc">BSc</option>
                    <option value="BA">BA</option>
                    <option value="BCom">BCom</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 items-center gap-3 shadow-sm transition-all disabled:opacity-50">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-500 dark:text-gray-400 font-medium">{user.username}</p>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <p className="text-gray-500 dark:text-gray-400">Course: {user.course}</p>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <div className="flex items-center gap-2">
              <label htmlFor="semester" className="text-sm text-gray-500 dark:text-gray-400">Semester:</label>
              <select 
                id="semester"
                value={user.semester || '6'}
                onChange={(e) => updateCourseInfo(user.course || '', e.target.value)}
                className="text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-1 pl-2 pr-8"
              >
                {[6].map(sem => (
                  <option key={sem} value={sem.toString()}>Sem {sem}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <Materials courseFilter={user.course} semesterFilter={user.semester} />
    </motion.div>
  );
}

function Materials({ courseFilter, semesterFilter }: { courseFilter?: string, semesterFilter?: string }) {
  const categories = ['All', 'Notes', 'PDF Books', 'Question Papers', 'Saved'];
  const [activeCat, setActiveCat] = useState('All');
  const [savedItems, setSavedItems] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('saved_materials');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to read saved materials from localStorage', e);
      return [];
    }
  });

  const toggleSave = (id: number) => {
    const newSaved = savedItems.includes(id) 
      ? savedItems.filter(itemId => itemId !== id)
      : [...savedItems, id];
    setSavedItems(newSaved);
    try {
      localStorage.setItem('saved_materials', JSON.stringify(newSaved));
    } catch (e) {
      console.error('Failed to save materials to localStorage', e);
    }
  };

  const allMaterials = [
    { id: 1, title: 'Data Structures & Algorithms - Lecture Notes', course: 'BCA', semester: '1', type: 'Notes', size: '2.4 MB' },
    { id: 2, title: 'Operating Systems - Lab Manual', course: 'BCA', semester: '1', type: 'PDF Books', size: '1.8 MB' },
    { id: 3, title: 'Database Management Systems - Slide Deck', course: 'BCA', semester: '1', type: 'Notes', size: '5.1 MB' },
    { id: 4, title: '2025 Mid-Term Question Paper - OS', course: 'BCA', semester: '1', type: 'Question Papers', size: '1.1 MB' },
    { id: 5, title: 'Quantum Physics Fundamentals', course: 'BSc', semester: '1', type: 'Notes', size: '4.2 MB' },
    { id: 6, title: 'Organic Chemistry Reactions Guide', course: 'BSc', semester: '1', type: 'PDF Books', size: '4.5 MB' },
    { id: 7, title: 'Business Economics Chapter 1-3', course: 'BCom', semester: '1', type: 'Notes', size: '3.2 MB' },
    { id: 8, title: '2024 Final Exam - Corporate Law', course: 'BCom', semester: '1', type: 'Question Papers', size: '0.8 MB' },
    { id: 9, title: 'History of Modern India', course: 'BA', semester: '1', type: 'PDF Books', size: '5.5 MB' },
  ];

  let materials = courseFilter ? allMaterials.filter(m => m.course === courseFilter) : allMaterials;
  if (semesterFilter) {
    materials = materials.filter(m => m.semester === semesterFilter);
  }
  
  const filtered = activeCat === 'All' 
    ? materials 
    : activeCat === 'Saved' 
      ? materials.filter(m => savedItems.includes(m.id))
      : materials.filter(m => m.type === activeCat);

  return (
    <div className="py-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Study Materials {courseFilter ? `for ${courseFilter}` : ''}</h2>
        <p className="text-gray-600 dark:text-gray-400">Access your course notes, reference books, and previous papers.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCat === cat 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No materials found</h3>
          <p className="text-gray-500 dark:text-gray-400">Check back later for updates to your course materials.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col relative group">
              <button 
                onClick={() => toggleSave(item.id)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title={savedItems.includes(item.id) ? "Remove Bookmark" : "Bookmark"}
              >
                {savedItems.includes(item.id) ? <BookmarkCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> : <Bookmark className="w-5 h-5" />}
              </button>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  item.type === 'Notes' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                  item.type === 'PDF Books' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                  'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                }`}>
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 pr-8">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{item.type} • {item.size}</p>
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                <button className="w-full flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30 py-2 rounded-lg transition-colors">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Notices() {
  const notices = [
    { date: 'March 15, 2026', title: 'Mid-term Examination Schedule Released', desc: 'The schedule for the upcoming mid-term examinations for all undergraduate courses has been published. Exams will commence from April 5th.', type: 'Examination', link: 'https://drive.google.com/drive/folders/example' },
    { date: 'March 10, 2026', title: 'Annual Tech Symposium Registration Open', desc: 'Registrations are now open for the Annual Tech Symposium "Innovate 2026". Students can register through the portal.', type: 'Event', link: 'https://drive.google.com/drive/folders/example' },
    { date: 'March 05, 2026', title: 'Campus Placement Drive: Tech Giants', desc: 'Several leading tech companies will be visiting the campus for recruitment next week. Final year students must update their resumes.', type: 'Career', link: 'https://drive.google.com/drive/folders/example' },
    { date: 'February 28, 2026', title: 'Holiday Notice: Spring Break', desc: 'The college will remain closed for Spring Break from March 20th to March 27th. Classes will resume on March 28th.', type: 'General', link: 'https://drive.google.com/drive/folders/example' },
    { date: 'February 15, 2026', title: 'Library Book Return Deadline', desc: 'All students are requested to return or renew their issued library books before the end of the month to avoid late fees.', type: 'Library', link: 'https://drive.google.com/drive/folders/example' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="w-6 h-6 text-indigo-600" /> Notices & Announcements
        </h1>
        <p className="text-sm text-gray-600 mt-1">Stay updated with the latest information from the college administration.</p>
      </div>

      <div className="space-y-4">
        {notices.map((notice, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {notice.date}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                {notice.type}
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">{notice.title}</h2>
            <p className="text-sm text-gray-600 mb-3">{notice.desc}</p>
            <div className="pt-3 border-t border-gray-100">
              <a href={notice.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded hover:bg-indigo-100 transition-colors">
                <Download className="w-3 h-3" /> Drive Link
              </a>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}


function Faculty() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Faculty Directory</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">Soon we are uploading</p>
      </div>
    </motion.div>
  );
}

function Events() {
  const events = [
    { title: 'Annual Cultural Fest "Aura 2026"', date: 'April 10-12, 2026', time: '10:00 AM onwards', location: 'Main Campus Grounds', type: 'Festival' },
    { title: 'Workshop: Future of AI in Business', date: 'April 25, 2026', time: '2:00 PM - 5:00 PM', location: 'Auditorium A', type: 'Workshop' },
    { title: 'Inter-College Basketball Tournament', date: 'May 5-8, 2026', time: '9:00 AM - 4:00 PM', location: 'College Sports Complex', type: 'Sports' },
    { title: 'Seminar: Sustainable Development', date: 'May 15, 2026', time: '11:00 AM - 1:00 PM', location: 'Science Block, Room 402', type: 'Seminar' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Events & Activities</h1>
        <p className="text-gray-600">Discover what's happening around the campus. Join festivals, workshops, and sports events.</p>
      </div>

      <div className="relative border-l-2 border-indigo-100 pl-8 ml-4 space-y-12">
        {events.map((event, idx) => (
          <div key={idx} className="relative">
            {/* Timeline dot */}
            <div className="absolute -left-[41px] top-1 w-5 h-5 bg-indigo-600 rounded-full border-4 border-white shadow-sm"></div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                {event.type}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" /> {event.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" /> {event.time}
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <MapPin className="w-4 h-4 text-gray-400" /> {event.location}
                </div>
              </div>
              <button className="mt-4 text-indigo-600 font-medium text-sm hover:text-indigo-800">
                Register Now &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Contact() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Have questions? We're here to help. Reach out to us through any of the channels below.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Campus Address</h3>
              <p className="text-gray-600">Sharanabasveshwar College of Science<br />Kalaburagi<br />Karnataka 585103<br />India</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Phone Numbers</h3>
              <p className="text-gray-600">General Enquiries: +91 8472 221942</p>
              <p className="text-gray-600">Admissions: +91 8472 221943</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Email Addresses</h3>
              <p className="text-gray-600">Info: info@sharanabasveshwarscience.edu</p>
              <p className="text-gray-600">Admissions: admissions@sharanabasveshwarscience.edu</p>
            </div>
          </div>
        </div>

        {/* Map / Form placeholder */}
        <div className="bg-gray-200 rounded-2xl overflow-hidden min-h-[400px] relative flex items-center justify-center border border-gray-300">
           {/* In a real app, embed a Google Map here */}
           <div className="text-center p-6">
             <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-gray-700 mb-2">Interactive Map</h3>
             <p className="text-gray-500">Map integration would go here.</p>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'notices' | 'materials'>('notices');
  const [showSuccess, setShowSuccess] = useState(false);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/portal" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    // In a real app, this would send data to a backend
    (e.target as HTMLFormElement).reset();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage college notices and study materials.</p>
        </div>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Successfully uploaded and published!
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('notices')}
            className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-colors ${
              activeTab === 'notices'
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            Upload Notice
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-colors ${
              activeTab === 'materials'
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            Upload Study Material
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'notices' ? (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notice Title</label>
                <input type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" placeholder="e.g., Mid-term Examination Schedule" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow">
                    <option value="">Select Category</option>
                    <option value="Examination">Examination</option>
                    <option value="Event">Event</option>
                    <option value="Career">Career</option>
                    <option value="General">General</option>
                    <option value="Library">Library</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input type="date" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea required rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" placeholder="Enter the full details of the notice..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attachment Link (Google Drive, etc.)</label>
                <input type="url" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" placeholder="https://" />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  <Upload className="w-5 h-5" />
                  Publish Notice
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Material Title</label>
                <input type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" placeholder="e.g., Data Structures Chapter 1" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
                  <select required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow">
                    <option value="">Select Course</option>
                    <option value="BCA">BCA</option>
                    <option value="BSc">BSc</option>
                    <option value="BA">BA</option>
                    <option value="BCom">BCom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester</label>
                  <select required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow">
                    <option value="">Select Semester</option>
                    {[6].map(sem => (
                      <option key={sem} value={sem.toString()}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Material Type</label>
                <select required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow">
                  <option value="">Select Type</option>
                  <option value="Notes">Notes</option>
                  <option value="PDF Books">PDF Books</option>
                  <option value="Question Papers">Question Papers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File Link (Google Drive, Dropbox, etc.)</label>
                <input type="url" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" placeholder="https://" />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  <Upload className="w-5 h-5" />
                  Upload Material
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// --- Main App Component ---

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/portal" element={<Portal />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/faculty" element={<Faculty />} />
              <Route path="/events" element={<Events />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
