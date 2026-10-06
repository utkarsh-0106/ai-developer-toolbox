import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    githubId: {
      type: String,
      required: true,
    },

    owner: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    defaultBranch: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: null,
    },

    language: {
      type: String,
      default: null,
    },

    lastIndexedCommitSha: {
      type: String,
      default: null,
    },

    lastIndexedAt: {
      type: Date,
      default: null,
    },

    indexingStatus: {
      type: String,
      enum: ["pending", "indexing", "ready", "failed"],
      default: "pending",
    },

    indexingError: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

repositorySchema.index(
  { userId: 1, githubId: 1 },
  { unique: true }
);

const Repository = mongoose.model("Repository", repositorySchema);

export default Repository;
