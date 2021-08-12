import { gql } from "apollo-server";

export default gql`
  type SeeUserFollowersResult {
    ok: Boolean!
    error: String
    followers: [User]
    totalPages: Int
  }
  type Query {
    seeUserFollowers(username: String!, page: Int!): SeeUserFollowersResult!
  }

  type SeeUserFollowingResult {
    ok: Boolean!
    error: String
    following: [User]
  }
  type Query {
    seeUserFollowing(username: String!, lastId: Int): SeeUserFollowingResult!
  }
`;