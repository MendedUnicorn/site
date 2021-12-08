import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useRef } from 'react';

export const useCollection = (col, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const q = useRef(_query).current;
  const ob = useRef(_orderBy).current;

  useEffect(() => {
    let ref = collection(db, col);

    if (q) {
      ref = query(ref, where(...q));
    }
    if (ob) {
      ref = query(ref, orderBy(...ob));
    }
    const unsub = onSnapshot(
      ref,
      (snap) => {
        let res = [];
        snap.forEach((post) => {
          console.log(post.data());
          res.push({ ...post.data(), id: post.id });
        });
        setDocuments(res);
        console.log(res);
        setError(null);
      },
      (err) => {
        console.log(err);
        setError(err.message);
      }
    );

    return () => {
      unsub();
    };
  }, [q, ob]);
  return { documents, error };
};
