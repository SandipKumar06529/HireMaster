require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

// 🔁 Replace this line:
// const { buildSchema } = require('graphql');

// ✅ Instead, import your modular files:
const schema = require('./graphql/schema');      // <--- schema.js
const root = require('./graphql/resolver');      // <--- resolver.js

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Initialize Express App
const app = express();
app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

const uploadRoutes = require("./routes/upload");
app.use("/api", uploadRoutes); // Now you can POST to /api/upload


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/graphql`));
