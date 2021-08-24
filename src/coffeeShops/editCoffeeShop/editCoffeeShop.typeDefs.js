import { gql } from "apollo-server";

export default gql`
  type Mutation {
    editCoffeeShop(
      id: Int!
      name: String
      latitude: String
      longitude: String
      url: Upload
      categoryName: String
      categorySlug: String
    ): MutationResult!
  }
`;