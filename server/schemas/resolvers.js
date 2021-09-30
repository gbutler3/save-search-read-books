const { AuthenticationError } = require('apollo-server-express');
const { Book, User } = require('../models');
const { signToken } = require('../utils/auth');

//we want to get all users and books?
const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('books');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('books');
    },
    books: async (parent, { username }) => {
      const params = username ? { username } : {};
      return book.find(params).sort({ createdAt: -1 });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('book');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
  //we want to alter the query by adding users, login, save book, & remove book from saved
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      //find by email
      const user = await User.findOne({ email }); 
      if (!user) {
        throw new AuthenticationError('Incorrect credentials'); 
      }
      //check if correct PW
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { newbook }, context) => {
      if (context.user) {
        const savebook = await User.findByIdAndUpdate(
          {_id: context.user._id},
          {$addToSet: {savedbooks: savedbook._id}}, //using add b/c it is used in examples
          //addtoSet vs pull; 
          //$addToSet doesn't add the item to the given field if it already contains it
          //$push will add the given object to field whether it exists or not
          {new: true}
          );
        return savedbook;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const savebook = await User.findByIdAndUpdate(
          {_id: context.user._id},
          {$pull: {savedbooks: savedbook._id}},
          {new: true}
          );
        return savedbook;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  }
}