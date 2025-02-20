import mongoose from "mongoose";

export interface IAnnouncement {
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "error";
  priority: number;
  status: "active" | "inactive";
  startDate?: Date;
  endDate?: Date;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new mongoose.Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["info", "warning", "success", "error"],
      default: "info",
    },
    priority: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    link: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to check date validity
announcementSchema.pre("save", function(next) {
  if (this.startDate && this.endDate && this.startDate > this.endDate) {
    next(new Error("End date must be after start date"));
  }
  next();
});

// Virtual for checking if announcement is currently active
announcementSchema.virtual("isActive").get(function() {
  const now = new Date();
  if (this.status !== "active") return false;
  if (this.startDate && this.startDate > now) return false;
  if (this.endDate && this.endDate < now) return false;
  return true;
});

const Announcement = mongoose.models.Announcement || mongoose.model<IAnnouncement>("Announcement", announcementSchema);

export default Announcement; 