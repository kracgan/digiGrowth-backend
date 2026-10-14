import mongoose, { Document, Schema } from "mongoose";

export interface IContentBlock {
  type: "text" | "heading" | "list" | "callout" | "tip" | "example";
  heading?: string;
  text?: string;
  items?: string[];
  tip?: string;
  callout?: string;
}

export interface IPracticalTask {
  title: string;
  description: string;
  defaultPlatform?: string;
  defaultType?: string;
}

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface ILesson extends Document {
  courseId: mongoose.Types.ObjectId;
  order: number;
  title: string;
  durationMinutes: number;
  objectives: string[];
  contentBlocks: IContentBlock[];
  practicalTask: IPracticalTask;
  quizQuestions: IQuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    order: { type: Number, required: true },
    title: { type: String, required: true },
    durationMinutes: { type: Number, default: 5 },
    objectives: [{ type: String }],
    contentBlocks: [
      {
        type: { type: String, default: "text" },
        heading: { type: String },
        text: { type: String },
        items: [{ type: String }],
        tip: { type: String },
        callout: { type: String },
      },
    ],
    practicalTask: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      defaultPlatform: { type: String, default: "Instagram" },
      defaultType: { type: String, default: "Educational / Tip" },
    },
    quizQuestions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOptionIndex: { type: Number, required: true },
        explanation: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

LessonSchema.index({ courseId: 1, order: 1 });

export const Lesson = mongoose.model<ILesson>("Lesson", LessonSchema);
