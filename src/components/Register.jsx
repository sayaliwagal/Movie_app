import React, {useState} from 'react';
import {registerUser} from '../appwrite';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

            // Basic validation
    if (!email || !password) {
      setError("Email and password are required.")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      setIsLoading(false)
      return
    }

        try {
            console.log("Attempting to register user with:", { email, name })
            const user = await registerUser(email, password, name);
            setMessage('Registration successful! You can now log in.');
            setEmail('');
            setPassword('');
            setName('');
            console.log("User registered successfully:", user);
       // Optionally redirect to dashboard or home page
      // window.location.href = '/dashboard';
        } catch(err) {
            console.error("Registration error:", err);
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false)
        }
    };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name (Optional)
                </label>
                <input 
                     type="text"
                     id="name" 
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm-text-sm" 
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     disabled = {isLoading}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input 
                     type="email"
                     id='email' 
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required 
                     disabled={isLoading}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input 
                     type="password"
                     id='password' 
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                     minLength={8}
                     disabled={isLoading}
                />
            </div>
            <button
                  type="submit" 
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow- text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {isLoading ? "Registering..." : "Register"}
            </button>
        </form>
            {message && <p className='mt-4 text-green-600 text-center'>{message}</p>}
            {error && <p className='mt-4 text-red-600 text-center'>{error}</p>}
    </div>
  )
}

export default Register;
