import React, { useState, useEffect } from 'react';
export const ProgressBar = ({ formData }) => {
    return (
        < div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4" >
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Document</span>
                    <span className="text-lg">📄</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{formData.document.rows.filter(row => row.completed).length}/7</div>
                <div className="text-sm text-gray-500">{Math.round((formData.document.rows.filter(row => row.completed).length / 7) * 100)}% Complete</div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Screen</span>
                    <span className="text-lg">🖥️</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{formData.screen.rows.filter(row => row.completed).length}/7</div>
                <div className="text-sm text-gray-500">{Math.round((formData.screen.rows.filter(row => row.completed).length / 7) * 100)}% Complete</div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Logic</span>
                    <span className="text-lg">⚡</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{formData.logic.rows.filter(row => row.completed).length}/7</div>
                <div className="text-sm text-gray-500">{Math.round((formData.logic.rows.filter(row => row.completed).length / 7) * 100)}% Complete</div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Testing</span>
                    <span className="text-lg">🧪</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{formData.testing.rows.filter(row => row.completed).length}/8</div>
                <div className="text-sm text-gray-500">{Math.round((formData.testing.rows.filter(row => row.completed).length / 8) * 100)}% Complete</div>
            </div>
        </div >
    );
}