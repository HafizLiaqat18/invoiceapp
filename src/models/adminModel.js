import mongoose from "mongoose";

// Define the Admin Schema
const adminSchema = new mongoose.Schema({
  username:{
    type:String
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Minimum length of 8 characters
    validate: {
      validator: function (value) {
        // Regular expression to check for at least one special character
        return /[!@#$%^&*(),.?":{}|<>]/.test(value);
      },
      message: "Password must contain at least one special character.",
    },
  },
});

// Create or use existing Admin model
const Admin = mongoose.models.admin || mongoose.model("admin", adminSchema);

export default Admin;
