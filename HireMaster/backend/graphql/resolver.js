const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Client = require('../models/Client');
const Project = require('../models/Project');
const Freelancer = require('../models/Freelancer');
const Bid = require("../models/Bid");
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const Rating = require('../models/Rating');


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
      gender: userInput.gender,
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
      id: client._id.toString(),
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

  createProject: async ({ projectInput }) => {
    const project = new Project({
      client_id: projectInput.client_id,
      title: projectInput.title,
      description: projectInput.description,
      responsibilities: projectInput.responsibilities,
      requiredSkills: projectInput.requiredSkills,
      preferredSkills: projectInput.preferredSkills,
      budget: projectInput.budget,
      deadline: new Date(projectInput.deadline),
    });

    const savedProject = await project.save();
    return {
      id: savedProject._id,
      ...savedProject._doc
    };
  },

  getProjectsByClientId: async ({ clientId }) => {
    return await Project.find({ client_id: clientId }).sort({ createdAt: -1 });
  },

  deleteProject: async ({ projectId }) => {
    try {
      await Project.findByIdAndDelete(projectId);
      return true;
    } catch (err) {
      console.error("Delete Error:", err);
      throw new Error("Failed to delete project");
    }
  },

  getProjectById: async ({ id }) => {
    return await Project.findById(id);
  },
  registerFreelancer: async ({ userInput, freelancerInput }) => {
    // 1. Check if email exists
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) throw new Error('User already exists.');

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(userInput.password, 12);

    // 3. Create User
    const newUser = new User({
      first_name: userInput.first_name,
      last_name: userInput.last_name,
      gender: userInput.gender,
      email: userInput.email,
      password: hashedPassword,
      account_type: "Freelancer",
    });

    const savedUser = await newUser.save();

    // 4. Create Freelancer linked to user
    const newFreelancer = new Freelancer({
      user_id: savedUser._id,
      university_name: freelancerInput.university_name,
      degree: freelancerInput.degree,
      major_of_undergrad: freelancerInput.major_of_undergrad,
      major_of_grad: freelancerInput.major_of_grad,
      skills: freelancerInput.skills,
      resume: freelancerInput.resume,
      email: userInput.email,
      phone_number: freelancerInput.phone_number,
      linkedin: freelancerInput.linkedin,
      github: freelancerInput.github,
      experience_level: freelancerInput.experience_level,
      profile_created: true
    });

    await newFreelancer.save();

    // 5. Return AuthData (optional: for future auto-login after signup)
    const token = jwt.sign(
      { userId: savedUser.id, email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { userId: savedUser.id, token: token, tokenExpiration: 1 };
  },
  getFreelancerByUserId: async ({ userId }) => {
    const freelancer = await Freelancer.findOne({ user_id: userId }).populate("user_id");

    if (!freelancer) {
      throw new Error("Freelancer not found");
    }

    return {
      id: freelancer._id.toString(),
      ...freelancer._doc,
      first_name: freelancer.user_id.first_name,
      last_name: freelancer.user_id.last_name,
    };
  },
  updateFreelancerProfile: async ({ input }) => {
    const { user_id, first_name, last_name, password, ...freelancerFields } = input;

    // Update User
    const updateUser = { first_name, last_name };
    if (password && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 12);
      updateUser.password = hashed;
    }

    await User.findByIdAndUpdate(user_id, updateUser);

    // Update Freelancer
    const updatedFreelancer = await Freelancer.findOneAndUpdate(
      { user_id },
      { ...freelancerFields },
      { new: true }
    ).populate('user_id');

    return {
      id: updatedFreelancer._id.toString(),
      ...updatedFreelancer._doc,
      user_id: updatedFreelancer.user_id._id.toString(),
      first_name: updatedFreelancer.user_id.first_name,
      last_name: updatedFreelancer.user_id.last_name,
    };
  },
  getAllProjects: async () => {
    return await Project.find({ project_status: "Active" }).sort({ createdAt: -1 });
  },
  submitBid: async ({ bidInput }) => {
    const newBid = new Bid({
      project_id: bidInput.project_id,
      freelancer_id: bidInput.freelancer_id,
      proposal: bidInput.proposal,
      bid_amount: bidInput.bid_amount
    });

    const savedBid = await newBid.save();

    // ✅ Fetch the project to get the client ID
    const project = await Project.findById(bidInput.project_id);
    if (!project) throw new Error("Project not found");

    // ✅ Fetch the client to get the associated user ID
    const client = await Client.findById(project.client_id);
    if (!client) throw new Error("Client not found");

    const userId = client.user_id;

    // ✅ Create notification for the client user
    await new Notification({
      user_id: userId,
      reference_type: "Bid",
      reference_id: savedBid._id,
      notification_message: `New bid received on your project.`,
      notification_type: "info"
    }).save();

    return {
      id: savedBid._id.toString(),
      ...savedBid._doc
    };
  },
  getBidsByFreelancerId: async ({ freelancerId }) => {
    return await Bid.find({ freelancer_id: freelancerId, bid_status: "Pending" })
      .populate("project_id")
      .sort({ createdAt: -1 });
  },

  cancelBid: async ({ bidId }) => {
    const bid = await Bid.findById(bidId);
    if (!bid) throw new Error("Bid not found");
    if (bid.bid_status !== "Pending") throw new Error("Only pending bids can be cancelled");

    await Bid.findByIdAndDelete(bidId);

    const project = await Project.findById(bid.project_id);
    if (!project) throw new Error("Project not found");

    const client = await Client.findById(project.client_id);
    if (!client) throw new Error("Client not found");

    const userId = client.user_id;

    await new Notification({
      user_id: userId, // ✅ Correct: now using the client’s associated user_id
      reference_type: "Bid",
      reference_id: bidId,
      notification_message: `A freelancer withdrew their bid.`,
      notification_type: "warning"
    }).save();

    return true;
  },

  acceptBid: async ({ bidId, projectId }) => {
    // Step 1: Find selected bid
    const selectedBid = await Bid.findById(bidId);
    if (!selectedBid) throw new Error("Bid not found");

    // Step 2: Prevent multiple accepted bids for the same project
    const existingAccepted = await Bid.findOne({ project_id: projectId, bid_status: "Accepted" });
    if (existingAccepted) throw new Error("A bid has already been accepted for this project.");

    // Step 3: Mark selected bid as accepted
    selectedBid.bid_status = "Accepted";
    await selectedBid.save();

    // Step 4: Get the project to retrieve the client ID
    const project = await Project.findById(selectedBid.project_id);
    if (!project) throw new Error("Project not found");

    // Step 5: Generate unique invoice number
    const generateInvoiceNumber = () => {
      const timestamp = Date.now();
      const random = Math.floor(1000 + Math.random() * 9000); // e.g. INV-1714824729172-4390
      return `INV-${timestamp}-${random}`;
    };

    const invoiceNumber = generateInvoiceNumber();

    // Step 6: Create new payment
    const payment = new Payment({
      invoice_number: invoiceNumber,
      project_id: selectedBid.project_id,
      client_id: project.client_id,
      freelancer_id: selectedBid.freelancer_id,
      amount: selectedBid.bid_amount,
      payment_status: 'unpaid',
      payment_date_initiated: new Date()
    });

    await payment.save();
    console.log("✅ Payment created:", payment);

    // Step 7: Reject all other bids for this project
    await Bid.updateMany(
      { project_id: projectId, _id: { $ne: bidId } },
      { $set: { bid_status: "Rejected" } }
    );
    const freelancer = await Freelancer.findById(selectedBid.freelancer_id);
    await new Notification({
      user_id: freelancer.user_id,
      reference_type: "Bid",
      reference_id: selectedBid._id,
      notification_message: `Your bid was accepted! 🎉`,
      notification_type: "info",
    }).save();

    // Reject others:
    const rejectedBids = await Bid.find({
      project_id: projectId,
      _id: { $ne: bidId }
    });
    for (const rb of rejectedBids) {
      const rejectedFreelancer = await Freelancer.findById(rb.freelancer_id);
      await new Notification({
        user_id: rejectedFreelancer.user_id,  // ✅ fix
        reference_type: "Bid",
        reference_id: rb._id,
        notification_message: `Your bid was rejected.`,
        notification_type: "error"
      }).save();
    }


    return true;
  },


  getBidsByProjectId: async ({ projectId }) => {
    return await Bid.find({ project_id: projectId })
      .populate({
        path: "freelancer_id",
        populate: {
          path: "user_id",
          model: "User"
        }
      });
  },
  // PAYMENT QUERIES
  getClientPayments: async ({ clientId }) => {
    return await Payment.find({ client_id: clientId }).populate({
      path: 'freelancer_id',
      populate: { path: 'user_id' } // to get freelancer name
    });
  },

  // PAYMENT MUTATIONS
  createPayment: async ({ projectId, clientId, freelancerId, amount }) => {
    const payment = new Payment({
      project_id: projectId,
      client_id: clientId,
      freelancer_id: freelancerId,
      amount,
      payment_status: 'unpaid',
      payment_date_initiated: new Date(),
    });
    await payment.save();
    return payment;
  },

  markPaymentAsPaid: async ({ paymentId }) => {
    console.log("Received paymentId:", paymentId);

    try {
      const updatedPayment = await Payment.findByIdAndUpdate(
        paymentId,
        {
          payment_status: "paid",
          payment_date_completed: new Date(),
        },
        { new: true }
      );

      if (!updatedPayment) {
        console.log("No payment found to update.");
        return null;
      }

      console.log("Successfully updated payment:", updatedPayment);
      const freelancer = await Freelancer.findById(updatedPayment.freelancer_id);
      await new Notification({
        user_id: freelancer.user_id,  // ✅ fixed from freelancer_id to user_id
        reference_type: "Payment",
        reference_id: updatedPayment._id,
        notification_message: `Client marked your payment as paid.`,
        notification_type: "info"
      }).save();

      return {
        _id: updatedPayment._id,
        payment_status: updatedPayment.payment_status,
        payment_date_completed: updatedPayment.payment_date_completed,
      };

    } catch (error) {
      console.error("Error in markPaymentAsPaid:", error);
      throw new Error("Failed to mark payment as paid.");
    }
  },
  getFreelancerPayments: async ({ freelancerId }) => {
    return await Payment.find({ freelancer_id: freelancerId }).populate({
      path: 'client_id',
      populate: { path: 'user_id' }
    });
  },
  getFreelancerDashboardStats: async ({ freelancerId }) => {
    const freelancer = await Freelancer.findById(freelancerId).populate("user_id");
    if (!freelancer) throw new Error("Freelancer not found");

    const fullName = `${freelancer.user_id.first_name} ${freelancer.user_id.last_name}`;

    // Get accepted bids
    const acceptedBids = await Bid.find({ freelancer_id: freelancerId, bid_status: "Accepted" }).populate("project_id");
    const acceptedProjectIds = acceptedBids.map(bid => bid.project_id?._id?.toString()).filter(Boolean);

    // Get related payments
    const payments = await Payment.find({ freelancer_id: freelancerId }).populate({
      path: "client_id",
      populate: { path: "user_id" }
    }).populate("project_id");

    // Total clients (unique client IDs from accepted bids)
    const clientSet = new Set();
    payments.forEach(payment => {
      if (payment.payment_status === "unpaid" || payment.payment_status === "paid") {
        clientSet.add(payment.client_id._id.toString());
      }
    });

    // Active projects: unpaid and accepted
    const activeProjects = payments.filter(p => p.payment_status === "unpaid").length;

    // Payments received: count of payments with status = paid
    const paymentsReceived = payments.filter(p => p.payment_status === "paid").length;

    // Build current projects list
    const projects = payments.map(p => ({
      title: p.project_id.title,
      clientName: `${p.client_id?.user_id?.first_name || ''} ${p.client_id?.user_id?.last_name || ''}`.trim(),
      bidAmount: p.amount,
      status: p.payment_status === "paid" ? "Inactive" : "Active"
    }));

    return {
      freelancerName: fullName,
      totalBidsAccepted: acceptedBids.length,
      totalClientsWorkedWith: clientSet.size,
      totalActiveProjects: activeProjects,
      totalPaymentsReceived: paymentsReceived,
      projects
    };
  },

  getClientDashboardStats: async ({ clientId }) => {
    const client = await Client.findById(clientId).populate("user_id");
    if (!client) throw new Error("Client not found");

    const clientName = `${client.user_id.first_name} ${client.user_id.last_name}`;

    // 1. Get all projects posted by the client
    const projects = await Project.find({ client_id: clientId });

    // 2. Count total bids received for these projects
    const projectIds = projects.map(p => p._id);
    const allBids = await Bid.find({ project_id: { $in: projectIds } });

    // 3. Get all payments made by client
    const payments = await Payment.find({ client_id: clientId }).populate({
      path: "freelancer_id",
      populate: { path: "user_id" }
    }).populate("project_id");

    const activeProjects = payments.filter(p => p.payment_status === "unpaid").length;
    const totalPayments = payments.filter(p => p.payment_status === "paid").length;

    // 4. Build recent projects list
    const recentProjects = payments.map(p => ({
      title: p.project_id.title,
      freelancerName: `${p.freelancer_id?.user_id?.first_name || ""} ${p.freelancer_id?.user_id?.last_name || ""}`.trim(),
      bidAmount: p.amount,
      status: p.payment_status === "paid" ? "Inactive" : "Active"
    }));

    return {
      clientName,
      totalProjectsPosted: projects.length,
      totalBidsReceived: allBids.length,
      totalActiveProjects: activeProjects,
      totalPaymentsMade: totalPayments,
      projects: recentProjects
    };
  },
  createNotification: async ({
    user_id,
    reference_type,
    reference_id,
    notification_message,
    notification_type,
    is_action_required
  }) => {
    const notification = new Notification({
      user_id,
      reference_type,
      reference_id,
      notification_message,
      notification_type,
      is_action_required: is_action_required || false
    });
    const saved = await notification.save();
    return {
      id: saved._id.toString(),
      ...saved._doc
    };
  },
  getNotifications: async ({ userId }) => {
    return await Notification.find({ user_id: userId }).sort({ createdAt: -1 });
  },
  markNotificationAsRead: async ({ notificationId }) => {
    const notification = await Notification.findById(notificationId);
    if (!notification) return false;
    notification.notification_status = 'read'; // add this field in schema/model
    await notification.save();
    return true;
  },

  submitRating: async ({ input }) => {
    const { project_id, client_id, freelancer_id, rating, feedback, skill_endorsement } = input;
  
    const newRating = new Rating({
      project_id,
      client_id,
      freelancer_id,
      rating,                  // ⭐ Make sure this line exists
      feedback,
      skill_endorsement,
      rating_date: new Date()
    });
  
    const saved = await newRating.save();
    return {
      id: saved._id.toString(),
      ...saved._doc
    };
  },
  getFreelancerRatingStats: async ({ freelancerId }) => {
    const result = await Rating.aggregate([
      { $match: { freelancer_id: new mongoose.Types.ObjectId(freelancerId) } },
      {
        $group: {
          _id: "$freelancer_id",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
  
    if (result.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }
  
    return {
      averageRating: parseFloat(result[0].averageRating.toFixed(1)),
      totalReviews: result[0].totalReviews
    };
  },
  
  

  users: async () => await User.find(),
  clients: async () => await Client.find()
};

module.exports = root;
