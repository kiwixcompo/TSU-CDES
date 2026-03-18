'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import Image from 'next/image';
import { motion } from 'motion/react';
import { CheckCircle2, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Home() {
  const content = useStore((state) => state.content);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

  // Separate VC from the rest of the staff
  const vc = content.staff.find(s => s.title.includes('Vice-Chancellor')) || {
    id: 'vc',
    name: 'Prof. Sunday Paul Bako',
    title: 'Vice-Chancellor',
    image: content.vcImage
  };
  
  const director = content.staff.find(s => s.title.includes('Director') && !s.title.includes('Deputy')) || {
    id: 'dir',
    name: 'Prof. Naomi Nuhu Adamu',
    title: 'Director',
    image: content.directorImage
  };

  const otherStaff = content.staff.filter(s => s.id !== vc.id && s.id !== director.id);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />

      {/* Hero Banner */}
      <section id="home" className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {content.bannerImage && (
          <Image
            src={content.bannerImage}
            alt="Taraba State University Campus"
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-gray-900/40" />
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/30 text-white text-sm font-semibold tracking-wider uppercase mb-6 border border-blue-400/50 backdrop-blur-md shadow-sm">
              Taraba State University
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight drop-shadow-lg">
              Directorate of Career Development and Employability Services
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto font-medium drop-shadow-md">
              Empowering students and graduates with skills, knowledge, and opportunities for successful careers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-24 bg-white relative -mt-10 rounded-t-[3rem] shadow-sm z-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Welcome</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  Shaping the Future of Our Graduates
                </h3>
              </div>
              
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="text-blue-500" size={20} />
                    Our Mission
                  </h4>
                  <p>{content.mission}</p>
                </div>
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                    Our Vision
                  </h4>
                  <p>{content.vision}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/5] relative rounded-3xl overflow-hidden shadow-2xl bg-gray-200">
                {content.directorImage && (
                  <Image
                    src={content.directorImage}
                    alt={director.name}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <p className="text-sm font-medium text-blue-200 uppercase tracking-wider mb-1">Director, CDES</p>
                  <p className="text-3xl font-bold">{director.name}</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About / Services Section */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">What We Do</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Services Offered</h3>
            <p className="mt-4 text-lg text-gray-600">Comprehensive support to guide you from campus to career.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ChevronRight size={24} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{service}</h4>
                <p className="text-gray-600 leading-relaxed">
                  Professional guidance and resources tailored to help you excel in this area of your career development.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Directory */}
      <section id="staff" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Our Team</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Staff Directory</h3>
          </div>

          {/* VC Card */}
          <div className="flex justify-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 max-w-4xl w-full shadow-sm border border-gray-100"
            >
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-8 border-white shadow-xl flex-shrink-0 bg-gray-200">
                {vc.image && (
                  <Image
                    src={vc.image}
                    alt={vc.name}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              <div className="text-center md:text-left space-y-4">
                <div className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-800 text-sm font-bold uppercase tracking-wider">
                  University Leadership
                </div>
                <h4 className="text-3xl md:text-4xl font-bold text-gray-900">{vc.name}</h4>
                <p className="text-xl text-blue-600 font-medium">{vc.title}</p>
                <p className="text-gray-600 leading-relaxed max-w-lg">
                  Providing visionary leadership and unwavering support for the career development initiatives at Taraba State University.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Staff Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {otherStaff.map((staff, index) => (
              <motion.div
                key={staff.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden mb-6 bg-gray-200">
                  {staff.image && (
                    <Image
                      src={staff.image}
                      alt={staff.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h5 className="text-xl font-bold text-gray-900 mb-1">{staff.name}</h5>
                <p className="text-blue-600 font-medium text-sm">{staff.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Organogram */}
          <div className="max-w-7xl mx-auto bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 overflow-x-auto">
            <h4 className="text-2xl font-bold text-center mb-12 text-gray-900">Directorate Organogram</h4>
            
            <div className="min-w-[900px] flex flex-col items-center">
              {/* Level 1: VC */}
              <div className="bg-blue-900 text-white py-3 px-8 rounded-xl font-bold shadow-md relative z-10 text-center">
                VICE CHANCELLOR
              </div>
              <div className="w-0.5 h-8 bg-blue-300"></div>
              
              {/* Level 2: Director */}
              <div className="bg-blue-700 text-white py-3 px-8 rounded-xl font-bold shadow-md relative z-10 text-center">
                DIRECTOR
              </div>
              <div className="w-0.5 h-8 bg-blue-300"></div>
              
              {/* Level 3: Deputy Directors & Facilitators */}
              <div className="w-full relative">
                <div className="absolute top-0 left-[16.66%] right-[16.66%] h-0.5 bg-blue-300"></div>
                
                <div className="flex justify-between pt-8 relative">
                  {/* Left Branch: Admin */}
                  <div className="flex flex-col items-center w-1/3 relative px-2">
                    <div className="absolute top-[-2rem] left-1/2 w-0.5 h-8 bg-blue-300 -translate-x-1/2"></div>
                    <div className="bg-blue-600 text-white py-3 px-4 rounded-xl font-bold shadow-md text-center text-sm w-full h-16 flex items-center justify-center">
                      DEPUTY DIRECTOR<br/>ADMINISTRATION
                    </div>
                    <div className="w-0.5 h-8 bg-blue-300"></div>
                    
                    {/* Level 4: Admin Coordinators */}
                    <div className="w-full relative">
                      <div className="absolute top-0 left-[10%] right-[10%] h-0.5 bg-blue-300"></div>
                      <div className="flex justify-between pt-8 relative gap-2">
                        {/* Employability */}
                        <div className="flex flex-col items-center flex-1 relative">
                          <div className="absolute top-[-2rem] left-1/2 w-0.5 h-8 bg-blue-300 -translate-x-1/2"></div>
                          <div className="bg-white border border-blue-200 text-blue-900 py-2 px-1 rounded-lg font-semibold shadow-sm text-center text-[10px] w-full h-16 flex items-center justify-center leading-tight">
                            EMPLOYABILITY<br/>SKILLS<br/>COORDINATOR
                          </div>
                          <div className="w-0.5 h-6 bg-blue-300"></div>
                          <div className="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-1 rounded-lg font-medium shadow-sm text-center text-[10px] w-full h-12 flex items-center justify-center leading-tight">
                            INTERNSHIP<br/>COORDINATOR
                          </div>
                        </div>
                        
                        {/* Industry Liason */}
                        <div className="flex flex-col items-center flex-1 relative">
                          <div className="absolute top-[-2rem] left-1/2 w-0.5 h-8 bg-blue-300 -translate-x-1/2"></div>
                          <div className="bg-white border border-blue-200 text-blue-900 py-2 px-1 rounded-lg font-semibold shadow-sm text-center text-[10px] w-full h-16 flex items-center justify-center leading-tight">
                            INDUSTRY LIASON/<br/>LINKAGES<br/>COORDINATOR
                          </div>
                          <div className="w-0.5 h-6 bg-blue-300"></div>
                          <div className="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-1 rounded-lg font-medium shadow-sm text-center text-[10px] w-full h-12 flex items-center justify-center leading-tight">
                            MARKETING &<br/>COMMUNICATION<br/>COORDINATOR
                          </div>
                        </div>

                        {/* Alumni */}
                        <div className="flex flex-col items-center flex-1 relative">
                          <div className="absolute top-[-2rem] left-1/2 w-0.5 h-8 bg-blue-300 -translate-x-1/2"></div>
                          <div className="bg-white border border-blue-200 text-blue-900 py-2 px-1 rounded-lg font-semibold shadow-sm text-center text-[10px] w-full h-16 flex items-center justify-center leading-tight">
                            ALUMNI<br/>RELATIONS<br/>COORDINATOR
                          </div>
                        </div>

                        {/* Tech */}
                        <div className="flex flex-col items-center flex-1 relative">
                          <div className="absolute top-[-2rem] left-1/2 w-0.5 h-8 bg-blue-300 -translate-x-1/2"></div>
                          <div className="bg-white border border-blue-200 text-blue-900 py-2 px-1 rounded-lg font-semibold shadow-sm text-center text-[10px] w-full h-16 flex items-center justify-center leading-tight">
                            TECHNOLOGY<br/>RESOURCES<br/>SPECIALIST
                          </div>
                        </div>

                        {/* Admin Assistant */}
                        <div className="flex flex-col items-center flex-1 relative">
                          <div className="absolute top-[-2rem] left-1/2 w-0.5 h-8 bg-blue-300 -translate-x-1/2"></div>
                          <div className="bg-white border border-blue-200 text-blue-900 py-2 px-1 rounded-lg font-semibold shadow-sm text-center text-[10px] w-full h-16 flex items-center justify-center leading-tight">
                            ADMINISTRATIVE<br/>ASSISTANT
                          </div>
                          <div className="w-0.5 h-6 bg-blue-300"></div>
                          <div className="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-1 rounded-lg font-medium shadow-sm text-center text-[10px] w-full h-12 flex items-center justify-center leading-tight">
                            CLEANERS
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Branch: Facilitators */}
                  <div className="flex flex-col items-center w-1/3 relative px-2">
                    <div className="absolute top-[-2rem] left-1/2 w-0.5 h-8 bg-blue-300 -translate-x-1/2"></div>
                    <div className="bg-blue-500 text-white py-3 px-4 rounded-xl font-bold shadow-md text-center text-sm w-3/4 h-16 flex items-center justify-center">
                      FACILITATORS/<br/>TRAINERS
                    </div>
                  </div>

                  {/* Right Branch: Career Services */}
                  <div className="flex flex-col items-center w-1/3 relative px-2">
                    <div className="absolute top-[-2rem] left-1/2 w-0.5 h-8 bg-blue-300 -translate-x-1/2"></div>
                    <div className="bg-blue-600 text-white py-3 px-4 rounded-xl font-bold shadow-md text-center text-sm w-3/4 h-16 flex items-center justify-center">
                      DEPUTY DIRECTOR<br/>CAREER SERVICES
                    </div>
                    <div className="w-0.5 h-8 bg-blue-300"></div>
                    
                    {/* Level 4: Career Counsellors */}
                    <div className="bg-white border border-blue-200 text-blue-900 py-3 px-4 rounded-xl font-bold shadow-sm text-center text-sm w-3/4 h-16 flex items-center justify-center">
                      CAREER COUNSELLORS
                    </div>
                  </div>
                </div>
              </div>

              {/* Level 6: Students */}
              <div className="w-full max-w-4xl mt-12 flex flex-col items-center relative">
                <div className="w-0.5 h-12 border-l-2 border-dashed border-blue-400"></div>
                <div className="bg-emerald-600 text-white py-4 px-16 rounded-2xl font-black shadow-lg text-center text-2xl tracking-widest uppercase">
                  STUDENTS
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-blue-900 text-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-sm font-bold text-blue-300 uppercase tracking-widest mb-2">Get in Touch</h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-8">Contact Us</h3>
              <p className="text-blue-100 text-lg mb-12 max-w-md leading-relaxed">
                Have questions about our services or want to partner with us? We&apos;d love to hear from you.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-blue-300" size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-lg mb-1">Email</h5>
                    <p className="text-blue-200">{content.contactEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-blue-300" size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-lg mb-1">Phone</h5>
                    <p className="text-blue-200">{content.contactPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-blue-300" size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-lg mb-1">Location</h5>
                    <p className="text-blue-200">{content.contactAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl text-gray-900">
              <h4 className="text-2xl font-bold mb-6">Send a Message</h4>
              <form 
                className="space-y-6" 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const name = formData.get('name');
                  const email = formData.get('email');
                  const message = formData.get('message');
                  window.location.href = `mailto:cdes@tsuniversity.edu.ng?subject=Contact from ${name}&body=${message}%0A%0AFrom: ${name} (${email})`;
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-md hover:shadow-lg">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-16 border-t border-gray-900">
        <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center md:text-left">
            <p className="text-white font-bold text-xl mb-4">CDES Taraba State University</p>
            <p className="mb-4">Directorate of Career Development and Employability Services.</p>
            <p>© {new Date().getFullYear()} All rights reserved.</p>
          </div>
          
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold text-lg mb-4">Archives</h4>
            <ul className="space-y-3">
              <li>
                <a href="/archives/past-events" className="hover:text-white transition-colors">Past Events</a>
              </li>
              <li>
                <a href="/archives/previous-directors" className="hover:text-white transition-colors">Previous Directors</a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-right flex flex-col justify-between">
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/admin" className="hover:text-white transition-colors">Admin Login</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
