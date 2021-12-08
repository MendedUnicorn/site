import { useEffect, useState } from 'react';
import styles from './Signup.module.css';
import { useSignup } from '../../hooks/useSignup';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const { signup, isPending, error } = useSignup();
  const { user } = useAuthContext();
  const [fileError, setFileError] = useState(null);
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password, displayName, profilePic);
    // setEmail('');
    // setPassword('');
    // setDisplayName('');
  };
  const handleFileChange = (e) => {
    setFileError(null);
    const file = e.target.files[0];

    if (!file) {
      setFileError('Please select a picture to upload');
    }
    if (!file?.type.includes('image')) {
      setFileError('File needs to be an image');
    }
    if (file?.size > 10000000) {
      setFileError('Max file size is 10MB');
    }

    setFileError(null);
    setProfilePic(file);
  };

  return (
    <div>
      <h1>Signup motherfucker</h1>
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
        <label>
          <span>Display Name:</span>
          <input
            type='text'
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
          />
        </label>
        <label className={styles['file-input']}>
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt='preview'
              className={styles.preview}
            />
          )}
          <span>Add Image...</span>
          <input type='file' onChange={handleFileChange} required />
        </label>
        <button className={styles.btn}>Submit</button>
        {error && <p className='error'>{error}</p>}
        {isPending && <p>Loading....</p>}
      </form>
    </div>
  );
}
