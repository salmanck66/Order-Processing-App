import React from 'react';
import { Link } from 'react-router-dom';
const Products = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
          <Link to={'/admin/upload'}>
          <button
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Upload
          </button>
          </Link>
        </div>
        {/* Add product list or content here */}
      </div>
    </div>
  );
};

export default Products;
