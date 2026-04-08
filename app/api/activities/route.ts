import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Activity from '@/models/Activity';

export async function POST(request: Request) {
    try {
        // 1. Connect to the database
        await dbConnect();

        // 2. Parse the incoming JSON from the frontend
        const body = await request.json();

        // 3. Create a new Activity document
        // Mongoose will automatically validate this against our Schema
        const newActivity = await Activity.create(body);

        // 4. Return a success response
        return NextResponse.json({ success: true, data: newActivity }, { status: 201 });

    } catch (error: any) {
        console.error("Failed to save activity:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}