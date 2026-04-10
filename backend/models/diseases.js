import mongoose from "mongoose";

const DiseaseSchema = new mongoose.Schema({
  disease_name: String,
  symptoms: [String],
  specialist: String,
  cure: String,
  prevention: String,
  created_by: String
});

export default mongoose.model("Diseases", DiseaseSchema);
