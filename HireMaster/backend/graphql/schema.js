const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type User {
    id: ID!
    email: String!
    account_type: String!
    first_name: String
    last_name: String
  }

  type Client {
    id: ID!
    user_id: ID!
    first_name: String
    last_name: String
    company_name: String!
    linkedin: String
    company_domain: String
    about_company: String
    email: String!
    phone_number: String
    profile_picture: String
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  input UserInput {
    email: String!
    password: String!
    account_type: String!
    first_name: String
    last_name: String
  }

  input ClientInput {
    user_id: ID!
    company_name: String!
    linkedin: String
    company_domain: String
    about_company: String
    email: String!
    phone_number: String
    profile_picture: String
  }

  input UpdateClientInput {
  user_id: ID!
  first_name: String
  last_name: String
  password: String
  company_name: String
  linkedin: String
  company_domain: String
  about_company: String
  phone_number: String
  profile_picture: String
}
  input ProjectInput {
  client_id: ID!
  title: String!
  description: String
  responsibilities: String
  requiredSkills: String
  preferredSkills: String
  budget: Float
  deadline: String
}

type Project {
  id: ID!
  client_id: ID!
  title: String!
  description: String
  responsibilities: String
  requiredSkills: String
  preferredSkills: String
  budget: Float
  deadline: String
  project_status: String
  createdAt: String
  updatedAt: String
}



  type Mutation {
    createUser(userInput: UserInput): AuthData!
    createClient(clientInput: ClientInput): Client!
    loginUser(email: String!, password: String!): AuthData!
    updateClientProfile(input: UpdateClientInput!): Client!
    createProject(projectInput: ProjectInput!): Project!
    deleteProject(projectId: ID!): Boolean!
  }

  type Query {
    users: [User!]!
    clients: [Client!]!
    getClientByUserId(userId: ID!): Client
    getProjectsByClientId(clientId: ID!): [Project!]!
    getProjectById(id: ID!): Project
  }
`);

module.exports = schema;
