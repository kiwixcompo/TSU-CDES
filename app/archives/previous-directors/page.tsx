'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Users } from 'lucide-react';

export default function PreviousDirectorsPage() {
  const previousDirectors = useStore((state) => state.content.previousDirectors || []);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pt-24">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 max-w-5xl py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Previous Directors</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Honoring the leadership that has guided the Directorate of Career Development and Employability Services.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {previousDirectors.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <Users className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Records Found</h3>
              <p className="text-gray-500">There are currently no previous directors in the archive.</p>
            </div>
          ) : (
            previousDirectors.map((director, index) => (
              <motion.div
                key={director.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center group hover:shadow-md transition-shadow"
              >
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-50 shadow-inner mb-6 bg-gray-200">
                  {director.image ? (
                    <Image
                      src={director.image}
                      alt={director.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Users size={40} />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{director.name}</h3>
                <div className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-700 text-sm font-bold tracking-wider mt-2">
                  {director.tenure}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
