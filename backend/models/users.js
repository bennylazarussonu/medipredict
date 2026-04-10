import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  age: Number,
  gender: String,
  medical_license_no: String,
  created_at: Date
});

export default mongoose.model("Users", UserSchema);