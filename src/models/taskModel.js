import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    title: {
      type: String,
     require:true

    },
    description: {
      type: String,
      require:true
    },
    price: {
      type: Number,
      required: true
    }
    

      
  }); 

const Tasks = mongoose.models.tasks ||mongoose.model("tasks",userSchema);
export default Tasks;
