import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    # unfollowUser(id: Int!): MutationOutput!
    unfollowUser(username: String!): MutationOutput!
  }
`;