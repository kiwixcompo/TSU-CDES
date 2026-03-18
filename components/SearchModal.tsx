'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Briefcase, Building, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

declare global {
  interface Window {
    puter: any;
  }
}

const COURSES = [
  "B. Agric - Agric Economics", "B. Agric - Agric Extension", "B. Agric- Agronomy", "B. Agric- Animal Science", "B. Agric. Crop protection", "B. Forest Resource and Wild life Management", "B.Sc- Home Economics", "B. Agric- Soil Science & Land Resources Mgmt", "B. A. English", "B. A. Theatre & Film Studies", "B. A. French", "B. A. History", "B. A. Arabic", "B. A. Hausa", "B. A. Linguistic (English)", "B. A. Linguistic Mumuye", "B. A. Linguistic Hausa", "B. Sc. Mass Communication", "B. A. (Ed) English", "B. A. (Ed) CRS", "B. A. (Ed) Hausa", "B. A. (Ed) History", "B. A. (Ed) ISL", "B. Ed Education Admin & Planning", "B. Ed Guidance & Counselling", "B. Ed Primary Education", "B. Sc. (Ed) Biology", "B. Sc. (Ed) Chemistry", "B. Sc. (Ed) Integrated Science", "B. Sc. (Ed) Mathematics", "B. Sc. (Ed) Physics", "B. Sc. (Ed) Human Kinetics", "B. Sc. (Ed) Health Education", "B. Sc. (Ed) Economics", "B. Sc. (Ed) Geography", "B. Sc. (Ed) Political Science", "B. Sc. (Ed) Social Studies Education", "B. Agric (Ed) Agric Education", "B. Ed Bussiness Education", "B. Sc. (Ed) Computer Science", "B. Sc. (Ed) Industrial Technology Education", "B. Library & Info Science", "B. Eng (Hons) Agric & Bio-Resources Engineering", "B. Eng (Hons) Electrical/Electronics Engineering", "B. Eng (Hons) Civil Engineering", "B. Eng (Hons) Mechanical Engineering", "B. Eng (Hons) Mining and Mineral Processing Engineering", "B. Sc. Environmental Health", "B. Sc. Public Health", "BNSc Nursing", "BMLS Medical Lab Science", "LLB Law", "B. Sc. Accounting", "B. Sc. Business Administration", "B. Sc. Public Administration", "B. Sc. Tourism and Hospitality Management", "B. Sc. Biochemistry", "B. Sc. Biotechnology", "B. Sc. Botany", "B Sc. Microbiology", "B. Sc. Zoology", "B. Sc. Chemistry", "B. Sc. Industrial Chemistry", "B. Sc. Mathematics", "B. Sc. Statistics", "B. Sc. Physics", "B. Sc. Computer Science", "B. Sc. Data Science", "B. Sc. Information and Communication Technology", "B. Sc. Software Engineering", "B. Sc. Economics", "B. Sc. Geography", "B. Sc. Political & International Relations", "B. Sc. Peace & Conflict Studies", "B. Sc. Sociology", "B. A. ISL", "B. A. CRS"
];

interface JobProspect {
  title: string;
  type: 'Government' | 'Self-Employed/Skilled';
  salaryRange: string;
  description: string;
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prospects, setProspects] = useState<JobProspect[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setSuggestions([]);
      setSelectedCourse(null);
      setProspects([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = COURSES.filter(c => c.toLowerCase().includes(query.toLowerCase())).slice(0, 8);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSelectCourse = async (course: string) => {
    setQuery(course);
    setSuggestions([]);
    setSelectedCourse(course);
    setLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Given the university course '${course}' at Taraba State University Nigeria, provide a list of exactly 10 possible government jobs and exactly 10 skilled/self-employed jobs for a graduate in Nigeria. Use REAL, ACCURATE, and CURRENT data obtained online for the job titles, descriptions, and realistic potential monthly salary ranges in Nigerian Naira (₦) for each job based on the current economic reality in Nigeria. Ensure the results are diverse and vary each time this is asked by pulling the latest data.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt + " Return ONLY a valid JSON array of objects with keys: 'title' (string), 'type' ('Government' or 'Self-Employed/Skilled'), 'salaryRange' (string), and 'description' (string). Do not include markdown formatting or backticks.",
          config: {
            temperature: 0.9,
            tools: [{ googleSearch: {} }]
          }
        });

        if (response.text) {
          let jsonStr = response.text;
          if (jsonStr.startsWith('\`\`\`json')) {
            jsonStr = jsonStr.replace(/\`\`\`json\n?/, '').replace(/\`\`\`\n?$/, '');
          } else if (jsonStr.startsWith('\`\`\`')) {
            jsonStr = jsonStr.replace(/\`\`\`\n?/, '').replace(/\`\`\`\n?$/, '');
          }
          const parsed = JSON.parse(jsonStr);
          setProspects(parsed);
        }
      } else if (typeof window !== 'undefined' && window.puter && window.puter.ai) {
        // Fallback to puter.js if Gemini API key is missing
        const prompt = `Given the university course '${course}' at Taraba State University Nigeria, provide a list of exactly 10 possible government jobs and exactly 10 skilled/self-employed jobs for a graduate in Nigeria. Use REAL, ACCURATE data for the job titles, descriptions, and realistic potential monthly salary ranges in Nigerian Naira (₦) for each job based on the current economic reality in Nigeria. Return ONLY a valid JSON array of objects with keys: 'title' (string), 'type' ('Government' or 'Self-Employed/Skilled'), 'salaryRange' (string), and 'description' (string). Do not include markdown formatting or backticks.`;
        
        const response = await window.puter.ai.chat(prompt);
        let jsonStr = response.message.content;
        
        // Clean up potential markdown formatting
        if (jsonStr.startsWith('```json')) {
          jsonStr = jsonStr.replace(/```json\n?/, '').replace(/```\n?$/, '');
        } else if (jsonStr.startsWith('```')) {
          jsonStr = jsonStr.replace(/```\n?/, '').replace(/```\n?$/, '');
        }

        const parsed = JSON.parse(jsonStr);
        setProspects(parsed);
      } else {
        throw new Error("API Key Missing");
      }
    } catch (error: any) {
      console.error('Failed to fetch prospects:', error);
      if (error.message === "API Key Missing" || !process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
         setProspects([
          { title: 'Configuration Required', type: 'Government', salaryRange: 'N/A', description: 'Please add your NEXT_PUBLIC_GEMINI_API_KEY to your Netlify environment variables to see real career data.' },
          { title: 'Configuration Required', type: 'Self-Employed/Skilled', salaryRange: 'N/A', description: 'Please add your NEXT_PUBLIC_GEMINI_API_KEY to your Netlify environment variables to see real career data.' }
        ]);
      } else {
        setProspects([
          { title: 'Error loading data', type: 'Government', salaryRange: 'N/A', description: 'There was an error connecting to the AI service. Please try again later.' },
          { title: 'Error loading data', type: 'Self-Employed/Skilled', salaryRange: 'N/A', description: 'There was an error connecting to the AI service. Please try again later.' }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 overflow-y-auto"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden mb-20 flex flex-col max-h-[85vh]"
          >
            <div className="p-4 border-b border-gray-100 flex items-center gap-3 relative">
              <Search className="text-blue-500" size={24} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for a course (e.g., Computer Science)..."
                className="flex-1 text-lg md:text-xl outline-none bg-transparent py-2 text-gray-800 placeholder-gray-400"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedCourse(null);
                }}
              />
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            {!selectedCourse && suggestions.length > 0 && (
              <div className="max-h-96 overflow-y-auto p-2">
                {suggestions.map((course, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectCourse(course)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl transition-colors text-gray-700 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <Briefcase size={16} />
                    </div>
                    <span>{course}</span>
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="p-12 flex flex-col items-center justify-center text-gray-500 space-y-4">
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="text-lg font-medium">Analyzing career prospects...</p>
              </div>
            )}

            {selectedCourse && !loading && prospects.length > 0 && (
              <div className="p-6 md:p-8 bg-gray-50 overflow-y-auto flex-1">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Career Prospects</h3>
                  <p className="text-gray-600">Insights for <strong>{selectedCourse}</strong></p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Government Jobs */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-800 font-semibold border-b border-blue-200 pb-2">
                      <Landmark size={20} />
                      <h4>Government Roles</h4>
                    </div>
                    {prospects.filter(p => p.type === 'Government').map((job, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <h5 className="font-bold text-gray-800">{job.title}</h5>
                        <p className="text-sm text-emerald-600 font-medium my-1">{job.salaryRange}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Skilled/Self-Employed Jobs */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-orange-800 font-semibold border-b border-orange-200 pb-2">
                      <Building size={20} />
                      <h4>Skilled / Self-Employed</h4>
                    </div>
                    {prospects.filter(p => p.type === 'Self-Employed/Skilled').map((job, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <h5 className="font-bold text-gray-800">{job.title}</h5>
                        <p className="text-sm text-emerald-600 font-medium my-1">{job.salaryRange}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
