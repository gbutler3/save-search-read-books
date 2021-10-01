//TODO: * `SavedBooks.js`:
  // Remove the `useEffect()` Hook that sets the state for `UserData`.
	// Instead, use the `useQuery()` Hook to execute the `GET_ME` query on load and 
      //save it to a variable named `userData`.
	// Use the `useMutation()` Hook to execute the `REMOVE_BOOK` mutation in 
    //the `handleDeleteBook()` function instead of the `deleteBook()` function that's imported from `API` file. 
    //(Make sure you keep the `removeBookId()` function in place!)

import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';


// import { getMe, deleteBook } from '../utils/API'; Don't need any more
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  // Execute the query on component load
  const {loading, data} = useQuery(GET_ME)
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);
  // Use optional chaining to check if data exists and if it has a data property. If not, return an empty array to use.
  const userData = data?.me || []; 


  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

  //* Remove the `useEffect()` Hook that sets the state for `UserData`.
  // useEffect(() => {
  //   const getUserData = async () => {
  //     try {
  //       const token = Auth.loggedIn() ? Auth.getToken() : null;

  //       if (!token) {
  //         return false;
  //       }

  //       const response = await getMe(token);

  //       if (!response.ok) {
  //         throw new Error('something went wrong!');
  //       }

  //       const user = await response.json();
  //       setUserData(user);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   getUserData();
  // }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const {data} = await removeBook({
        variables: {bookId},
      });

      removeBookId(bookId);
      // if (!response.ok) {
      //   throw new Error('something went wrong!');
      // }
      // const updatedUser = await response.json();
      // setUserData(updatedUser);
      // upon success, remove book's id from localStorage
    } catch (err) {
      console.error(err);
    }
  };
  // if data isn't here yet, say so
  if ( loading ) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
