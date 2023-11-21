import { z } from 'zod';

//generic fetch and validate to easily fetch and validate data from the graph and camelot endpoints
async function fetchAndValidate<T>(url: string, schema: z.ZodSchema<T>): Promise<T> {
    
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return schema.parse(data);
  } catch (error) {
    // Handle or rethrow the error as per your application's error handling policy
    console.error('Error in fetchAndValidate:', error);
    throw error;
  }
}

export default fetchAndValidate;
