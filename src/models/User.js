const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    apiKey: {
      type: String,
      required: true,
      trim: true,
    },
    owner_discordtag: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    apibanned: {
      type: Boolean,
      default: false,
    },
    apiban_reason: {
      type: String,
      trim: true,
    },
    robloxapi_access: { // roblox ban api
      type: Boolean,
      default: false,
    },
    instaapi_access: { // insta ban api
      type: Boolean,
      default: false,
    },
    kahootapi_access: { // kahoot bomb api
      type: Boolean,
      default: false,
    },
    usage: [
      {
        date: { type: Date },
        count: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
