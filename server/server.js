const express = require('express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes'); don't think I'll need it but leaving in just in case
//import ApolloServer
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
// Import `authMiddleware()` function to be configured with the Apollo Server
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;
//instantiate ApolloServer and then passing typeDefs and Rsolvers
const server = new ApolloServer({
  typeDefs, 
  resolvers,
  // Add context to our server so data from the `authMiddleware()` function can pass data to our resolver functions
  context: authMiddleware,
});

//applyMiddleware is coming off of Apollo Server, this is how they get joined
server.applyMiddleware({ app }); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes); I don't think I'll need this, but leaving it in just in case

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => 
  console.log(`🌍 Now listening on localhost:${PORT}`));
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
});
