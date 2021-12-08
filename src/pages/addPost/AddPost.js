import { useEffect, useState } from 'react';
import styles from './AddPost.module.css';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import { storage } from '../../firebase/config';
import { getDownloadURL, uploadBytesResumable, ref } from '@firebase/storage';
import { updateDoc } from '@firebase/firestore';

export default function AddPost() {
  const [fileError, setFileError] = useState(null);
  const [post, setPost] = useState('');
  const [file, setFile] = useState(null);
  const { user } = useAuthContext();
  const { response, addDocument, updateDocument } = useFirestore('posts');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  console.log({ user });

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
    setFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDocument({
        uid: user.uid,
        text: post,
        imageURL: '',
        likes: 0,
        comments: [],
        //user: user.uid
      });
      //const res = await response;
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(async () => {
    if (response && response.document) {
      const filePath = `${user.uid}/${await response.document.id}/${file.name}`;
      console.log(filePath);
      const imageRef = ref(storage, filePath);
      const fileSnapshot = await uploadBytesResumable(imageRef, file);

      const imageURL = await getDownloadURL(imageRef);

      await updateDocument(await response.document.id, {
        imageURL,
      });
    }
  }, [response]);

  return (
    <div>
      <form className={styles['add-post-form']} onSubmit={handleSubmit}>
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
        <label>
          <span>Description</span>
          <textarea
            className={styles.text}
            type='text'
            onChange={(e) => setPost(e.target.value)}
            value={post}
            required
          />
        </label>
        {!response.isPending ? (
          <button className='btn'>Post</button>
        ) : (
          <button className='btn' disabled>
            Loading...
          </button>
        )}
        {fileError && <p className='error'>{fileError}</p>}
        {response.error && <p className='error'>{response.error}</p>}
      </form>
      {error && <p className='error'>{error}</p>}
    </div>
  );
}
