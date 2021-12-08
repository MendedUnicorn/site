import { useAuthContext } from './useAuthContext';
import { useEffect, useState } from 'react';
import { auth, storage } from '../firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { useFirestore } from './useFirestore';

export const useSignup = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const { dispatch } = useAuthContext();

  // function that will sign up
  const signup = async (email, password, displayName, profilePic) => {
    const {
      response,
      addDocument: addUser,
      updateDocument: updateUser,
    } = useFirestore('users');

    setIsPending(true);
    setError(null);
    try {
      // try to signup new user in firebase
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (!res) {
        throw new Error('Could not sigup new user');
      }
      console.log('res', res);

      // try to update profile name of the new user
      await updateProfile(res.user, { displayName });

      //upload profile pic
      const filePath = `/users/${user.uid}/profile/${profilePic.name}`;
      console.log(filePath);
      const imageRef = ref(storage, filePath);
      const fileSnapshot = await uploadBytesResumable(imageRef, profilePic);

      const imageURL = await getDownloadURL(imageRef);

      addUser({
        displayName: displayName,
        uid: res.user.uid,
        profilePic: profilePic,
      });

      //addUser({ userId: res.user.uid });

      // dispatch login
      dispatch({ type: 'LOGIN', payload: res.user });

      if (!isCancelled) {
        setError(null);
        setIsPending(false);
      }
    } catch (error) {
      console.log(error.message);
      setError(error.message);
      setIsPending(false);
    }
    // if component is unmounted then set cancelled true so signup doesnt go through
  };
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { isPending, error, signup };
};
