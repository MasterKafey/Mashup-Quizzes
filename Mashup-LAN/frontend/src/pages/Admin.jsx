import { useNavigate } from "react-router-dom";

function Admin() {
  
  const navigate = useNavigate();

  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Panel</h1>
        
        <div className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter password"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition">
            Confirm Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
