import dbConnect from '@/lib/dbConnect';
import ProjectModel from '@/model/Project';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { title, datestart, dateEnd, timeSlotStart, timeSlotEnd, daysSelected } = await request.json();

    // need to work on this data after making sure how we are going to store relevant data in the backend. 
    // This is the most important route alongside get-details (where we manage how to fetch details from API)
    
    return Response.json(
        {
          success: true,
          message:
            'Details fetched successfully',
        },
        { status: 200 }
      );
  } catch (error) {
    console.error('Error getting details:', error);
    return Response.json(
      { success: false, message: 'Error getting details' },
      { status: 500 }
    );
  }
}
