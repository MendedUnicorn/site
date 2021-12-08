import { useState } from 'react/cjs/react.development';

import styles from './ImageCard.module.css';
import Favorite from '../assets/favorite_border.svg';
import Bookmark from '../assets/bookmark_border.svg';
import Location from '../assets/location_on_black.svg';
import Comment from '../assets/textsms_black.svg';
import { useAuthContext } from '../hooks/useAuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { useEffect } from 'react';

export default function ImageCard({ data }) {
  const { user } = useAuthContext();
  const [post, setPost] = useState('');
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(data.comments);
  const { addDocument, updateDocument, response } = useFirestore('posts');
  //const [id, setId] = useState(null);

  //setComments(data.comments);
  console.log(user);

  const handleAddComment = async (e) => {
    e.preventDefault();
    const id = e.target.dataset.id;
    setComments([...comments, post]);
    await updateDocument(id, { comments: [...comments, post] });
    console.log(await response);
  };
  // useEffect(async () => {
  //   if (data) {
  //     await updateDocument(id, { comments: [...comments, post] });
  //   }
  // }, [comments]);

  return (
    <div className={styles['image-card']}>
      <div className={styles['title-bar']}>
        <img src='./profile.jpg' alt='' /> <p>username</p>{' '}
      </div>
      <img src={data.imageURL} alt='image-card' />
      <div className={styles['button-bar']}>
        <img className={styles.favorite} src={Favorite} alt='favorite' />
        <img className={styles.comment} src={Comment} alt='Comment' />
        <img className={styles.location} src={Location} alt='Location' />
        <img className={styles.bookmark} src={Bookmark} alt='bookmark' />
      </div>
      <p className={styles.likes}>{data.likes} likes</p>
      <p className={styles.description}>{data.text}</p>
      <p className={styles['time-stamp']}>{data.dataAdded}</p>
      <ul>
        {data.comments.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <form onSubmit={(e) => handleAddComment(e)} data-id={data.id}>
        <input
          type='text'
          onChange={(e) => setPost(e.target.value)}
          value={post}
          placeholder='Add a comment...'
          required
          className={styles['comment-field']}
        />
        <button>Post...</button>
      </form>
    </div>
  );
}
