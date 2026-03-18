'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';
import Image from 'next/image';

export default function PastEventsPage() {
  const events = useStore((state) => state.content.events);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

  // Filter for past events and sort by date, newest first
  const pastEvents = events
    .filter((event) => isPast(parseISO(event.date)))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pt-24">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 max-w-5xl py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Past Events Archive</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A look back at our previous workshops, seminars, and career fairs.
          </p>
        </div>

        <div className="grid gap-8">
          {pastEvents.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Past Events</h3>
              <p className="text-gray-500">There are currently no past events in the archive.</p>
            </div>
          ) : (
            pastEvents.map((event, index) => {
              const eventDate = parseISO(event.date);

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 opacity-90 transition-all hover:opacity-100"
                >
                  <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                    {/* Date Block */}
                    <div className="flex-shrink-0 w-24 h-24 rounded-2xl flex flex-col items-center justify-center text-center shadow-inner bg-gray-100 text-gray-600">
                      <span className="text-sm font-bold uppercase tracking-wider">{format(eventDate, 'MMM')}</span>
                      <span className="text-3xl font-black leading-none my-1">{format(eventDate, 'dd')}</span>
                      <span className="text-xs font-semibold">{format(eventDate, 'yyyy')}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-800">
                          {event.title}
                        </h2>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full border border-gray-200">
                          Concluded
                        </span>
                      </div>
                      
                      <p className="text-lg leading-relaxed mb-6 text-gray-600">
                        {event.description}
                      </p>

                      {event.image && (
                        <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-6">
                          <Image src={event.image} alt={event.title} fill className="object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm font-medium">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock size={16} />
                          <span>9:00 AM - 4:00 PM</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin size={16} />
                          <span>TSU Main Campus</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
