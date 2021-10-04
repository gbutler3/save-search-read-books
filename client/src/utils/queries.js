//This will hold the query `GET_ME`, which will execute the `me` query set up using Apollo Server.

import { gql } from '@apollo/client';

//reference typeDefs on serverside
export const GET_ME = gql `
  query me{
    me {
      _id
      username
      email
      newBook
    }
  }`;