const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');

// 1
let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]


let idCount = links.length;
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    // 2
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany();
    },
    link: (parent, args) => links.find(link => link.id == args.id),
  },
  Mutation: {
    // 2
    post: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      })
      return newLink
    },
    updateLink: (parent, args) => {
      const link = links.find(link => link.id == args.id);
      if(link){
        link.url = args.url;
        link.description = args.description;
      }
      return link;
    },
    deleteLink: (parent, args) => {
      let deletedLink;
      links = links.filter(link => {
        if(link.id == args.id){
          deletedLink = link;
        }
        return link.id != args.id;
      });
      return deletedLink;
    }
  }
}

const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: {
    prisma,
  }
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );
