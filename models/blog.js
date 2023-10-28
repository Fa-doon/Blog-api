const mongoose = require("mongoose");
const format = require("date-fns/format");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    author: {
      type: String,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    timestamp: {
      type: String,
    },
    state: {
      type: String,
      value: ["draft", "published"],
      default: "draft",
      required: true,
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: {
      type: Number,
    },
    tags: {
      type: [String],
      default: ["general"],
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Formatting timestamp
blogSchema.pre("save", function (next) {
  this.timestamp = format(new Date(), "dd-MM-yyyy");
  next();
});

// Reading time based on word count
blogSchema.pre("save", function (next) {
  const wordCount = this.body.split(" ").length;
  const customizedWordsPerMinute = 150; // Adjust this value based on your content

  const estimatedReadingTime = Math.ceil(wordCount / customizedWordsPerMinute);
  this.reading_time = estimatedReadingTime;

  next();
});

blogSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Blog", blogSchema);
