import { useLogin } from '../../hooks/useLogin';
import styles from './Login.module.css';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function Login() {
  const { login, error, isPending } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useAuthContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    login(email, password);
  };

  return (
    <div>
      <h1>Login motherfucker</h1>
      <form onSubmit={handleSubmit} className={styles.signup}>
        <label>
          <span>Email:</span>
          <input
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label>
          <span>Password:</span>
          <input
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>

        <button className={styles.btn}>Login</button>
        {error && <p className='error'>{error}</p>}
        {isPending && <p>Loading....</p>}
      </form>
    </div>
  );
}
