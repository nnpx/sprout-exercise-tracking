import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Activity from '@/models/Activity';

// 1. DELETE an activity
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const resolvedParams = await params; // Unwrap the promise here

        const deletedActivity = await Activity.findByIdAndDelete(resolvedParams.id);
        if (!deletedActivity) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// 2. GET a single activity (Used to pre-fill the Edit form)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const resolvedParams = await params; // Unwrap the promise here

        const activity = await Activity.findById(resolvedParams.id);

        if (!activity) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: activity });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// 3. PUT (Update) an activity
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const resolvedParams = await params; // Unwrap the promise here

        const body = await request.json();
        const updatedActivity = await Activity.findByIdAndUpdate(resolvedParams.id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedActivity) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: updatedActivity });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}