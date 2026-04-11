import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
    userId: string;
    activityType: string;
    date: Date;
    durationMins: number;
    metrics: any; // This is the NoSQL magic that allows flexible data!
}

const ActivitySchema: Schema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            default: 'user_1' // Hardcoded for this assignment to keep things simple
        },
        activityType: {
            type: String,
            required: true,
            enum: ['Running', 'Weightlifting']
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        durationMins: {
            type: Number,
            required: true
        },
        // By using Schema.Types.Mixed, we tell Mongoose: 
        // "Accept any valid JSON structure here." 
        // This perfectly demonstrates NoSQL polymorphism for your assignment.
        metrics: {
            type: Schema.Types.Mixed,
            required: true
        },
    },
    { timestamps: true }
);

// This checks if the model already exists to prevent Next.js from recompiling it every time you save a file during development.
const Activity = mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity;