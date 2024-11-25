const UNSPLASH_API_URL = 'https://api.unsplash.com';
const ACCESS_KEY = 'oRz__lKi7bWKvEFhKhT2ighN2aJcWZ_BwPB-JIkelBk';

const headers = {
  Authorization: `Client-ID ${ACCESS_KEY}`,
  'Content-Type': 'application/json',
};

export const getRandomPhotos = async (count = 5, query = 'landscape nature') => {
  try {
    const params = new URLSearchParams({
      count: count.toString(),
      query,
      orientation: 'landscape',
      featured: 'true'
    }).toString();

    const response = await fetch(
      `${UNSPLASH_API_URL}/photos/random?${params}`,
      { headers }
    );
    
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching random photos:', error);
    return [];
  }
};

export const searchPhotos = async (query, page = 1, perPage = 30) => {
  try {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      per_page: perPage.toString()
    }).toString();

    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?${params}`,
      { headers }
    );
    
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching photos:', error);
    return { results: [], total: 0 };
  }
};

export const getPhotos = async (page = 1, perPage = 30) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      order_by: 'latest'
    }).toString();

    const response = await fetch(
      `${UNSPLASH_API_URL}/photos?${params}`,
      { headers }
    );
    
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
}; 