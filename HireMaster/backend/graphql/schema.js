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
    user_id: User!
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

  input FreelancerInput {
  university_name: String
  degree: String
  major_of_undergrad: String
  major_of_grad: String
  skills: [String]
  resume: String
  phone_number: String
  linkedin: String
  email: String 
  github: String
  experience_level: String
}
  type Freelancer {
  id: ID!
  user_id: User!
  first_name: String
  last_name: String
  university_name: String
  degree: String
  major_of_undergrad: String
  major_of_grad: String
  skills: [String]
  resume: String
  email: String
  phone_number: String
  linkedin: String
  github: String
  experience_level: String
  profile_created: Boolean
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
    gender: String 
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

input UpdateFreelancerInput {
  user_id: ID!
  first_name: String
  last_name: String
  password: String
  university_name: String
  degree: String
  major_of_undergrad: String
  major_of_grad: String
  skills: [String]
  phone_number: String
  linkedin: String
  github: String
  experience_level: String
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

input BidInput {
  project_id: ID!
  freelancer_id: ID!
  proposal: String
  bid_amount: Float
}

type Bid {
  id: ID!
  project_id: Project!
  freelancer_id: Freelancer!
  proposal: String
  bid_amount: Float
  submission_date: String
  bid_status: String
}
  type Payment {
  _id: ID!
  payment_id: ID!
  project_id: ID!
  client_id: Client!
  freelancer_id: Freelancer!
  amount: Float!
  payment_status: String!
  payment_date_initiated: String!
  payment_date_completed: String
  invoice_number: String!  
}
type FreelancerDashboardStats {
  freelancerName: String!
  totalBidsAccepted: Int!
  totalClientsWorkedWith: Int!
  totalActiveProjects: Int!
  totalPaymentsReceived: Int!
  projects: [FreelancerProject!]!
}

type FreelancerProject {
  title: String!
  clientName: String!
  bidAmount: Float!
  status: String!
}

type ClientDashboardStats {
  clientName: String!
  totalProjectsPosted: Int!
  totalBidsReceived: Int!
  totalActiveProjects: Int!
  totalPaymentsMade: Int!
  projects: [ClientProject!]!
}

type ClientProject {
  title: String!
  freelancerName: String!
  bidAmount: Float!
  status: String!
}

  type Mutation {
    createUser(userInput: UserInput): AuthData!
    createClient(clientInput: ClientInput): Client!
    loginUser(email: String!, password: String!): AuthData!
    updateClientProfile(input: UpdateClientInput!): Client!
    createProject(projectInput: ProjectInput!): Project!
    deleteProject(projectId: ID!): Boolean!
    registerFreelancer(userInput: UserInput!, freelancerInput: FreelancerInput!): AuthData!
    updateFreelancerProfile(input: UpdateFreelancerInput!): Freelancer!
    submitBid(bidInput: BidInput!): Bid!
    cancelBid(bidId: ID!): Boolean!
    acceptBid(bidId: ID!, projectId: ID!): Boolean!
    createPayment(projectId: ID!, clientId: ID!, freelancerId: ID!, amount: Float!): Payment
    markPaymentAsPaid(paymentId: ID!): Payment

  }

  type Query {
    users: [User!]!
    clients: [Client!]!
    getClientByUserId(userId: ID!): Client
    getProjectsByClientId(clientId: ID!): [Project!]!
    getProjectById(id: ID!): Project
    getFreelancerByUserId(userId: ID!): Freelancer
    getAllProjects: [Project!]!
    getBidsByFreelancerId(freelancerId: ID!): [Bid!]!
    getBidsByProjectId(projectId: ID!): [Bid!]!
    getClientPayments(clientId: ID!): [Payment]
    getFreelancerPayments(freelancerId: ID!): [Payment]
    getFreelancerDashboardStats(freelancerId: ID!): FreelancerDashboardStats!
    getClientDashboardStats(clientId: ID!): ClientDashboardStats!

  }
`);

module.exports = schema;
