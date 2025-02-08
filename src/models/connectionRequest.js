const mongoose = require("mongoose");
const { validate } = require("moongose/models/user_model");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
      required: true,
    },
    requestStatus: {
      type: String,
      enum: {
        values: ["accept", "ignore", "reject", "interested"],
        message: `{VALUE} is not Allowed`,
      },
      validate(value) {
        if (!["accept", "ignore", "reject", "interested"].includes(value)) {
          throw new Error("Status Not Allowed");
        }
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("You can not send Request To Yourself");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
