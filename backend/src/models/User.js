import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    tags: [{ type: String }]
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    bio: { type: String, maxlength: 500 },
    location: { type: String },
    avatarUrl: { type: String },
    whatsappNumber: { type: String },
    skillsToTeach: [skillSchema],
    skillsToLearn: [skillSchema],
    rating: { type: Number, default: 0 },
    badges: [{ type: String }],
    stats: {
      swapsCompleted: { type: Number, default: 0 },
      hoursShared: { type: Number, default: 0 }
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
