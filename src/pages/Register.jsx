import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Slaptažodžiai nesutampa.');
            return;
        }

        const success = await register(email, password);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Registracija nepavyko. Bandykite dar kartą arba el. paštas jau naudojamas.');
        }
    };

    return (
        <div>
            <h2>Registracija</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>El. paštas:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Slaptažodis:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Pakartoti slaptažodį:</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Registruotis</button>
            </form>
            <p>Jau turite paskyrą? <Link to="/login">Prisijunkite čia</Link></p>
        </div>
    );
}

export default Register;