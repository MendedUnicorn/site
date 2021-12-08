import styles from './Home.module.css';
import { useFirestore } from '../../hooks/useFirestore';
import ImageCard from '../../components/ImageCard';
import { useCollection } from '../../hooks/useCollection';

export default function Home() {
  const { addDocument, updateDocument, deleteDocument } = useFirestore('posts');
  const { documents, error } = useCollection('posts');

  return (
    <div>
      <h1>Hello and welcome</h1>
      <button
        className='btn'
        onClick={() => addDocument({ user: '', text: 'lol', likes: 1 })}
      >
        Try to add
      </button>
      <button
        className='btn'
        onClick={() =>
          deleteDocument('Ryy0c16jmdz2raftFqDq', {
            user: 'yeah',
            text: 'lol yourself',
            likes: 2,
          })
        }
      >
        Try to delete
      </button>
      {documents &&
        documents.map((doc) => <ImageCard data={doc} key={doc.id} />)}
    </div>
  );
}
