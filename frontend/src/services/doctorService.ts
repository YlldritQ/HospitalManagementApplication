const API_URL = 'http://localhost:7058/api/Doctor';

export const getDoctors = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`API call failed with status ${response.status}: ${response.statusText}`);
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch failed:', error.message);
    } else {
      console.error('Unknown error occurred during fetch');
    }
    throw error;
  }
};
