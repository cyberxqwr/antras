import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard'); // Redirect to dashboard on successful login
    } else {
      setError('Prisijungti nepavyko. Patikrinkite el. paštą ir slaptažodį.'); // Failed login message
    }
  };

  return (
    <div>
      <h2>Prisijungimas</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>El. paštas:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Slaptažodis:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Prisijungti</button>
      </form>
      <p>Neturite paskyros? <Link to="/register">Registruokitės čia</Link></p>
    </div>
  );
}

export default Login;