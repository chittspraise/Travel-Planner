import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { typeDefs } from './types/schema';
import { resolvers } from './resolvers';
import { OpenMeteoAPI } from './datasources/OpenMeteoAPI';
import { ActivityRankingService } from './services/ActivityRankingService';
import { config } from './config';


async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: config.nodeEnv !== 'production',
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  });

  
  const { url } = await startStandaloneServer(server, {
    listen: { port: config.port },
  
    context: async () => ({
      dataSources: {
        openMeteoAPI: new OpenMeteoAPI(),
        activityRankingService: new ActivityRankingService(),
      },
    }),
  });

  // log some info so we know it's running
  console.log(`🚀 Server ready at: ${url}`);
  console.log(`📊 GraphQL Playground: ${url}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);

  return server;
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export { startServer };

