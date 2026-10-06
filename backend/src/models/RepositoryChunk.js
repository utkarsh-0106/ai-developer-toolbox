import mongoose from "mongoose";

const repositoryChunkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
      index: true,
    },

    githubRepositoryId: {
      type: String,
      required: true,
      index: true,
    },

    commitSha: {
      type: String,
      required: true,
      index: true,
    },

    owner: {
      type: String,
      required: true,
    },

    repo: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },

    path: {
      type: String,
      required: true,
    },

    fileSha: {
      type: String,
      default: null,
    },

    chunkIndex: {
      type: Number,
      required: true,
    },

    start: {
      type: Number,
      required: true,
    },

    end: {
      type: Number,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

repositoryChunkSchema.index({
  userId: 1,
  repositoryId: 1,
  commitSha: 1,
});

repositoryChunkSchema.index({
  repositoryId: 1,
  commitSha: 1,
  path: 1,
  chunkIndex: 1,
});

const RepositoryChunk = mongoose.model(
  "RepositoryChunk",
  repositoryChunkSchema
);

export default RepositoryChunk;
