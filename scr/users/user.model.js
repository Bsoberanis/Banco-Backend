import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "The name is required!"],
    maxlength: [25, "25 characters maximum!"],
  },

  surname: {
    type: String,
    required: [true, "The surname is required!"],
    maxlength: [25, "25 characters maximum!"],
  },

  username: {
    type: String,
    unique: true,
    required: [true, "The username is required!"],
  },

  email: {
    type: String,
    required: [true, "The email is required!"],
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: [true, "The password is required!"],
    minlength: [8, "8 minimum characters!"],
  },

  profile: {
    type: String,
    default: "",
  },

  phone: {
    type: String,
    minlength: [8, "Phone number must be 8 characters"],
    maxlength: [8, "Phone number must be 8 characters"],
    required: [true, "The phone is required!"],
  },

  role: {
    type: String,
    required: [true, "The role is required!"],
    enum: ["ADMIN_ROLE", "USER_ROLE"],
    default: "USER_ROLE",
  },

  estado: {
    type: Boolean,
    default: true,
  },

  google: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,
  versionKey: false,
});

// Para que no se devuelva el password y _id en las respuestas, y en su lugar se use uid
UserSchema.methods.toJSON = function () {
  const { password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
}

export default model('User', UserSchema);
