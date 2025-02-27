import dbConnect from '@/lib/dbConnect';
import ProjectModel from '@/model/Project';

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { url } = await request.json();

    // by making use of YT's api, fetch and return the required details
    
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