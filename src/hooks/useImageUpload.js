import { useState } from 'react';
import { useFirestore } from './useFirestore';

export const useImageUpload = async () => {
  const [document, setDocument] = useState(null);
  const { response, addDocument } = useFirestore('posts');

  try {
    await addDocument({
      id: user.uid,
      text: post,
      imageURL: '',
      likes: 0,
      comments: [],
    });
    useEffect(async () => {
      const res = await response;

      console.log(res);

      const filePath = `${user.uid}/${await response.document.id}/${file.name}`;
      console.log(filePath);
      const imageRef = ref(storage, filePath);
      const fileSnapshot = await uploadBytesResumable(imageRef, file);

      const imageURL = await getDownloadURL(imageRef);

      await updateDoc(await response.document, {
        imageURL,
      });
    }, [response]);
  } catch (err) {
    setError(err.message);
  }
};
