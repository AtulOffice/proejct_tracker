import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const ProjectDetailsForm = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    projectId: '',
    bookingDate: '',
    client: '',
    endUser1: '',
    govtAuthority: '',
    endUser2: '',
    planningDate: '',
    siteAddress: '',
    notes: '',
    timelion: {
      industrial: true,
      commercial: false,
      itDigital: false
    },
    timeline: {
      residential: false,
      itDigital: false
    }
  });

  const [isLocationExpanded, setIsLocationExpanded] = useState(true);
  const [isNotesExpanded, setIsNotesExpanded] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (category, field) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your submit logic here
  };

  const handleCancel = () => {
    // Reset form or close modal
    setFormData({
      projectName: '',
      projectId: '',
      bookingDate: '',
      client: '',
      endUser1: '',
      govtAuthority: '',
      endUser2: '',
      planningDate: '',
      siteAddress: '',
      notes: '',
      timelion: {
        industrial: false,
        commercial: false,
        itDigital: false
      },
      timeline: {
        residential: false,
        itDigital: false
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Project Details
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Row 1 */}
              <input
                type="text"
                name="projectName"
                placeholder="Project Name"
                value={formData.projectName}
                onChange={handleInputChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <div className="relative">
                <select
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Client</option>
                  <option value="client1">Client 1</option>
                  <option value="client2">Client 2</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
              </div>

              <div className="relative">
                <select
                  name="endUser1"
                  value={formData.endUser1}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">End User</option>
                  <option value="user1">User 1</option>
                  <option value="user2">User 2</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
              </div>

              {/* Row 2 */}
              <input
                type="text"
                name="projectId"
                placeholder="Project ID"
                value={formData.projectId}
                onChange={handleInputChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="govtAuthority"
                placeholder="Govt Authority"
                value={formData.govtAuthority}
                onChange={handleInputChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="endUser2"
                placeholder="End User"
                value={formData.endUser2}
                onChange={handleInputChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Row 3 */}
              <div className="relative">
                <input
                  type="date"
                  name="bookingDate"
                  placeholder="Booking Date"
                  value={formData.bookingDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="date"
                  value="2-Jun-2026"
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
              </div>

              <div className="relative">
                <input
                  type="date"
                  name="planningDate"
                  placeholder="Planning"
                  value={formData.planningDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Location & Type and Timelion & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Location & Type */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Location & Type</h2>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setIsLocationExpanded(!isLocationExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <span className="text-gray-600">Site Address</span>
                  {isLocationExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {isLocationExpanded && (
                  <input
                    type="text"
                    name="siteAddress"
                    placeholder="Enter site address"
                    value={formData.siteAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                <button
                  type="button"
                  onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <span className="text-gray-600">Notes</span>
                  {isNotesExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {isNotesExpanded && (
                  <textarea
                    name="notes"
                    placeholder="Enter notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                )}
              </div>
            </section>

            {/* Timelion & Type */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Timelion & Type</h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.timelion.industrial}
                    onChange={() => handleCheckboxChange('timelion', 'industrial')}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Industrial</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.timelion.commercial}
                    onChange={() => handleCheckboxChange('timelion', 'commercial')}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Commercial</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.timelion.itDigital}
                    onChange={() => handleCheckboxChange('timelion', 'itDigital')}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">IT/Digital</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.timeline.residential}
                    onChange={() => handleCheckboxChange('timeline', 'residential')}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Residential</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.timeline.itDigital}
                    onChange={() => handleCheckboxChange('timeline', 'itDigital')}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">IT/Digital</span>
                </label>
              </div>
            </section>
          </div>

          {/* Additional Information */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Additional Information
            </h2>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors"
            >
              Submit Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectDetailsForm;
