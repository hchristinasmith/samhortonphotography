// This file handles loading local photos from the shcaptured folder

export interface LocalPhoto {
  id: string;
  name: string;
  path: string;
}

// Function to get the list of photos from the shcaptured folder
export async function getLocalPhotos(): Promise<LocalPhoto[]> {
  try {
    // In a real implementation, we would use an API endpoint to get the list of files
    // For now, we'll create a static list based on the files we know exist
    
    // This would typically come from a server endpoint that reads the directory
    const photoFiles = [
      'Photo 01-01-2024, 12 00 41 AM (1).jpg',
      'Photo 01-01-2024, 12 00 41 AM.jpg',
      'Photo 02-06-2025, 6 23 01 PM.jpg',
      'Photo 02-06-2025, 6 23 05 PM.jpg',
      'Photo 02-06-2025, 6 23 57 PM.jpg',
      'Photo 02-06-2025, 6 25 12 PM.jpg',
      'Photo 04-07-2025, 9 26 43 AM.jpg',
      'Photo 05-04-2025, 9 58 18 AM.jpg',
      'Photo 06-07-2025, 1 16 27 PM.jpg',
      'Photo 06-07-2025, 1 17 41 PM.jpg',
      'Photo 06-07-2025, 1 18 30 PM.jpg',
      'Photo 06-07-2025, 1 26 15 PM.jpg',
      'Photo 06-07-2025, 6 28 54 PM.jpg',
      'Photo 07-06-2025, 10 22 23 AM.jpg',
      'Photo 08-04-2025, 2 12 41 PM.jpg',
      'Photo 08-04-2025, 2 19 25 PM (1).jpg',
      'Photo 08-04-2025, 2 19 25 PM (2).jpg',
      'Photo 08-04-2025, 2 19 25 PM (3).jpg',
      'Photo 08-04-2025, 2 19 25 PM.jpg',
      'Photo 08-04-2025, 2 43 39 PM.jpg',
      'Photo 08-04-2025, 2 43 40 PM.jpg',
      'Photo 08-04-2025, 2 43 43 PM.jpg',
      'Photo 08-06-2025, 12 43 42 PM.jpg',
      'Photo 08-06-2025, 12 50 13 PM.jpg',
      'Photo 08-06-2025, 12 50 21 PM.jpg',
      'Photo 08-06-2025, 12 50 30 PM.jpg',
      'Photo 09-09-2017, 5 02 30 PM.jpg',
      'Photo 10-04-2025, 6 31 22 PM.jpg',
      'Photo 10-04-2025, 6 57 11 PM.jpg',
      'Photo 10-07-2025, 3 25 21 PM.jpg'
    ];
    
    // Map the file names to photo objects
    const photos: LocalPhoto[] = photoFiles.map((fileName, index) => ({
      id: `local-${index}`,
      name: fileName,
      path: `/shcaptured/${fileName}`
    }));
    
    return photos;
  } catch (error) {
    console.error('Error loading local photos:', error);
    throw error;
  }
}
