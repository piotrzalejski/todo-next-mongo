import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: { type: String, required: [true, 'Password is required'] },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
