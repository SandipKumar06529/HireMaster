const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Client = require('../models/Client');

const root = {
  createUser: async ({ userInput }) => {
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) throw new Error('User exists already.');

    const hashedPassword = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      first_name: userInput.first_name,
      last_name: userInput.last_name,
      email: userInput.email,
      password: hashedPassword,
      account_type: userInput.account_type
    });

    const result = await user.save();
    const token = jwt.sign(
      { userId: result.id, email: result.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { userId: result.id, token: token, tokenExpiration: 1 };
  },

  createClient: async ({ clientInput }) => {
    const client = new Client({
      user_id: clientInput.user_id,
      company_name: clientInput.company_name,
      linkedin: clientInput.linkedin,
      company_domain: clientInput.company_domain,
      about_company: clientInput.about_company,
      email: clientInput.email,
      phone_number: clientInput.phone_number,
      profile_picture: clientInput.profile_picture 
    });

    const result = await client.save();
    return {
      id: result.id,
      ...result._doc
    };
  },

  loginUser: async ({ email, password }) => {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) throw new Error("User not found");
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");
  
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  
    return {
      userId: user.id,
      token,
      tokenExpiration: 1
    };
  },

  getClientByUserId: async ({ userId }) => {
    const client = await Client.findOne({ user_id: userId }).populate('user_id');
    if (!client) throw new Error("Client not found");

    const user = client.user_id;
    return {
      ...client._doc,
      first_name: client.user_id.first_name,
      last_name: client.user_id.last_name,
    };
  },

  updateClientProfile: async ({ input }) => {
    const { user_id, first_name, last_name, password, ...clientFields } = input;
  
    // Update User
    const updateUser = { first_name, last_name };
    if (password && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 12);
      updateUser.password = hashed;
    }
  
    await User.findByIdAndUpdate(user_id, updateUser);
  
    // Update Client
    const updatedClient = await Client.findOneAndUpdate(
      { user_id },
      { ...clientFields },
      { new: true }
    ).populate('user_id');
    
    return {
      id: updatedClient._id.toString(),
      ...updatedClient._doc,
      user_id: updatedClient.user_id._id.toString(),
      first_name: updatedClient.user_id.first_name,
      last_name: updatedClient.user_id.last_name,
    };
  },
  
  
  
  users: async () => await User.find(),
  clients: async () => await Client.find()
};

module.exports = root;
