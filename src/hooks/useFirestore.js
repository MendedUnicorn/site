import { ActionCodeOperation } from '@firebase/auth';
import {
  addDoc,
  collection,
  Timestamp,
  updateDoc,
  doc,
  deleteDoc,
} from '@firebase/firestore';
import { useEffect, useReducer, useState } from 'react';
import { db } from '../firebase/config';

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'ADDED_DOCUMENT':
      return {
        document: action.payload,
        isPending: false,
        error: null,
        success: true,
      };
    case 'DELETED_DOCUMENT':
      return {
        document: null,
        isPending: false,
        error: null,
        success: true,
      };
    case 'UPDATED_DOCUMENT':
      return {
        document: action.payload,
        isPending: false,
        error: null,
        success: true,
      };
    case 'IS_PENDING':
      return { document: null, isPending: true, error: null, success: false };
    case 'ERROR':
      return {
        document: null,
        isPending: false,
        error: action.payload,
        success: false,
      };
    default:
      return state;
  }
};

export const useFirestore = (col) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  // reference to collection
  const ref = collection(db, col);

  // warp dispatch in a check to make sure action is not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // add a document
  const addDocument = async (doc) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const dateAdded = Timestamp.now();

      const docRes = await addDoc(ref, { ...doc, dateAdded });
      dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: docRes });
    } catch (error) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: error.message });
    }
  };

  //update document

  const updateDocument = async (id, updatedDoc) => {
    dispatchIfNotCancelled({ type: 'IS_PENDING' });
    const docRef = doc(db, col, id);

    try {
      const doc = await updateDoc(docRef, updatedDoc);
      dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: doc });
    } catch (error) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: error.message });
    }
  };

  const deleteDocument = async (id) => {
    dispatchIfNotCancelled({ type: 'IS_PENDING' });
    const docRef = doc(db, col, id);

    try {
      await deleteDoc(docRef);
      dispatchIfNotCancelled({ type: 'DELETED_DCUMENT' });
    } catch (error) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: error.message });
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { addDocument, updateDocument, deleteDocument, response };
};
