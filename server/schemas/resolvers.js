const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query : {
        me: async(parent,args,context)=>{
            if(context.user){
                return User.findOne({_id:context.user._id});
            }
            throw new AuthenticationError('You need to log in!');
        },
    },

    Mutation : {
        addUser: async(parent,{username,email,password})=>{
            const user = await User.create({username,email,password});
            const token = signToken(user);

            return {token, user};
        },

        login: async(parent,{email,paswword})=>{
            const user = await user.findOne({email});

            if(!user){
                throw new AuthenticationError('No user found!');
            }
            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw){
                throw new AuthenticationError('password is incorrect!');
            }
            const token = signToken(user);

            return {token, user};
        },

        saveBook: async(parent, {userId, bookData}, context)=>{
            if(context.user){
                return User.findOneAndUpdate(
                    {_id:userId},
                    {$addToSet:{savedBooks: {book: bookData}}},
                    {new: true, runValidators: true}
                    );
            }
            throw new AuthenticationError('please login or signup!');
        },

        removeBook: async(parent,{book},context)=>{
            if(context.user){
                return User.findOneAndUpdate(
                    {_id:context.user._id},
                    {$pull:{saveBooks:book}},
                    {new: true}
                );
            }
            throw new AuthenticationError('please login or signup!')
        }
    }
};

module.exports = resolvers;