// Import anime.js with different approaches depending on environment
import animeDefault from 'animejs';

// Create a wrapper function that matches the anime API
const anime = (params: any) => {
  return animeDefault(params);
};

// Add stagger and other utilities
anime.stagger = animeDefault.stagger;
anime.random = animeDefault.random;
anime.timeline = animeDefault.timeline;

export default anime; 