import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // ✅ Use bcryptjs — works better with ESM

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["user", "restaurant", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// 🔹 Create compound unique index for email + role combination
// This allows same email to have multiple roles (user, restaurant, admin)
userSchema.index({ email: 1, role: 1 }, { unique: true });

// 🔹 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔹 Compare entered password with stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔹 Create & export User model
const User = mongoose.model("User", userSchema);
export default User;
