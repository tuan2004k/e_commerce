import React from 'react';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
        <p className="text-gray-700 mb-6">You do not have permission to access this page.</p>
        <p className="text-gray-500">Please contact your administrator if you believe this is an error.</p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
