import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Admin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      console.log(password);
      const res = await axios.post(
        'http://localhost:3000/admin',
        { password },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (res.data.success) {
        navigate('/quiz'); // ✅ redirect if password is correct
      } else {
        setError('Invalid password ❌');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message); // backend error message
      } else {
        setError('Something went wrong ⚠️');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Admin Panel
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
          >
            Confirm Password
          </button>

          {error && <p className="text-red-600 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Admin;
