// 'use client';

// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { FaPaperPlane, FaTwitter, FaLink } from 'react-icons/fa';

// export default function WaitlistForm() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     role: 'user',
//     explanation: '',
//     socialPost: '',
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     // Validate explanation (required)
//     if (!formData.explanation) {
//       setError('Please provide an explanation of why you want to join Sophex.');
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const response = await fetch('/api/submit-waitlist', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const { error } = await response.json();
//         throw new Error(error || 'Failed to submit form');
//       }

//       setIsSubmitted(true);
//       setFormData({
//         name: '',
//         email: '',
//         role: 'user',
//         explanation: '',
//         socialPost: '',
//       });
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         setError(error.message);
//       } else {
//         setError('Something went wrong. Please try again.');
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isSubmitted) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-center p-8 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl border border-orange-500/30"
//       >
//         <div className="text-6xl mb-4 text-orange-500">🎉</div>
//         <h3 className="text-2xl font-bold mb-2 text-orange-400">Thank You!</h3>
//         <p className="text-neutral-300 mb-4">
//           Your application has been received. Our team will review your
//           submission and you&apos;ll hear from us soon about the next steps.
//         </p>
//         <button
//           onClick={() => setIsSubmitted(false)}
//           className="mt-4 text-orange-500 hover:text-orange-400 underline"
//         >
//           Submit another response
//         </button>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.form
//       onSubmit={handleSubmit}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-gradient-to-br from-neutral-800 to-neutral-900 p-6 rounded-2xl border border-neutral-700 shadow-lg"
//     >
//       <h3 className="text-2xl font-bold mb-6 text-center text-orange-400">
//         Join the Sophex Movement
//       </h3>

//       {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//       <div className="mb-4">
//         <label className="block text-neutral-300 mb-2">Your Name (Optional)</label>
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
//           placeholder="Enter your name"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block text-neutral-300 mb-2">Your Email (Optional)</label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
//           placeholder="your.email@example.com"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block text-neutral-300 mb-2">You&apos;re joining as</label>
//         <select
//           name="role"
//           value={formData.role}
//           onChange={handleChange}
//           className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white appearance-none"
//         >
//           <option value="user">User (I want to earn rewards)</option>
//           <option value="project">Project (I want to onboard my project)</option>
//           <option value="ambassador">Community Ambassador</option>
//           <option value="other">Other</option>
//         </select>
//       </div>

//       <div className="mb-4">
//         <label className="block text-neutral-300 mb-2">
//           Why do you love Sophex and how will you support our community?
//           <span className="text-orange-500 ml-1">*</span>
//         </label>
//         <textarea
//           name="explanation"
//           value={formData.explanation}
//           onChange={handleChange}
//           required
//           rows={4}
//           className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
//           placeholder="Tell us why you're excited about Sophex and what you can contribute..."
//         />
//       </div>

//       <div className="mb-6">
//         <label className="block text-neutral-300 mb-2  items-center">
//           <FaTwitter className="text-blue-400 mr-2" />
//           Share your X/Twitter post about Sophex (Optional)
//         </label>
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
//             <FaLink />
//           </div>
//           <input
//             type="url"
//             name="socialPost"
//             value={formData.socialPost}
//             onChange={handleChange}
//             className="w-full pl-10 px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
//             placeholder="https://x.com/yourusername/status/..."
//           />
//         </div>
//         <p className="text-sm text-neutral-500 mt-1">
//           Share a link to your post about Sophex for bonus consideration!
//         </p>
//       </div>

//       <div className="bg-neutral-700/50 p-4 rounded-lg mb-6">
//         <h4 className="font-bold text-orange-400 mb-2 flex items-center">
//           <FaTwitter className="mr-2" /> Why share on X?
//         </h4>
//         <ul className="text-sm text-neutral-300 space-y-1">
//           <li className="flex items-start">
//             <span className="text-orange-500 mr-2">•</span>
//             <span>Get priority in waitlist processing</span>
//           </li>
//           <li className="flex items-start">
//             <span className="text-orange-500 mr-2">•</span>
//             <span>Show your enthusiasm for the Sophex vision</span>
//           </li>
//           <li className="flex items-start">
//             <span className="text-orange-500 mr-2">•</span>
//             <span>Help spread the word about Web3 made invisible</span>
//           </li>
//           <li className="flex items-start">
//             <span className="text-orange-500 mr-2">•</span>
//             <span>Potential rewards for top contributors</span>
//           </li>
//         </ul>
//       </div>

//       <button
//         type="submit"
//         disabled={isSubmitting}
//         className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-3 rounded-lg transition-all hover:from-orange-600 hover:to-orange-700 ${
//           isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
//         }`}
//       >
//         {isSubmitting ? (
//           'Submitting...'
//         ) : (
//           <>
//             <FaPaperPlane /> Submit Application
//           </>
//         )}
//       </button>
//     </motion.form>
//   );
// }