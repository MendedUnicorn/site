import { Navigate } from 'react-router';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router';

import styles from './Profile.module.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  return (
    <div>
      <h1>Profile</h1>
      <h2>Hello, {user.displayName}</h2>
      <button className='btn' onClick={() => navigate('/add-post')}>
        Add Post
      </button>
    </div>
  );
}
