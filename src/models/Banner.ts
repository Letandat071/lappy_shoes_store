import mongoose from "mongoose";

export interface IBanner {
  title: string;
  description?: string;
  image: string;
  link?: string;
  position: string;
  priority: number;
  status: "active" | "inactive";
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new mongoose.Schema<IBanner>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      enum: ["hero", "collection", "category", "feature"],
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
  },
  {
    timestamps: true,
  }
);

// Middleware to check date validity
bannerSchema.pre("save", function(next) {
  if (this.startDate && this.endDate && this.startDate > this.endDate) {
    next(new Error("End date must be after start date"));
  }
  next();
});

// Virtual for checking if banner is currently active
bannerSchema.virtual("isActive").get(function() {
  const now = new Date();
  if (this.status !== "active") return false;
  if (this.startDate && this.startDate > now) return false;
  if (this.endDate && this.endDate < now) return false;
  return true;
});

const Banner = mongoose.models.Banner || mongoose.model<IBanner>("Banner", bannerSchema);

export default Banner; 