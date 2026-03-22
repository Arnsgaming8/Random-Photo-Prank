document.addEventListener('DOMContentLoaded', function() {
    const photoElement = document.getElementById('random-photo');
    const loadingElement = document.getElementById('loading');
    
    // Helper to get random dimensions between 400-800
    function getRandomDimensions() {
        const width = Math.floor(Math.random() * 401) + 400; // 400-800
        const height = Math.floor(Math.random() * 401) + 400; // 400-800
        return { width, height };
    }

    // Expanded keywords for more variety
    const extendedKeywords = ['nature', 'city', 'people', 'animals', 'architecture', 'food', 'travel', 
        'abstract', 'technology', 'sports', 'ocean', 'mountains', 'forest', 'space', 'vintage', 
        'minimal', 'dark', 'colorful', 'sky', 'flowers', 'sunset', 'night', 'water', 'art'];
    
    // Expanded tags for Lorem Flickr
    const extendedTags = ['nature', 'city', 'people', 'animals', 'abstract', 'colorful', 'water', 
        'night', 'sunset', 'clouds', 'street', 'art', 'beauty', 'macro', 'landscape', 'portrait'];
    
    // Expanded categories for PlaceIMG
    const extendedCategories = ['any', 'people', 'nature', 'tech', 'animals', 'architecture', 
        'food', 'city', 'transport', 'sports'];

    // Array of diverse random photo APIs for true randomness
    const photoApis = [
        {
            name: 'Lorem Picsum',
            getUrl: () => {
                const seed = Math.random().toString(36).substring(7) + Date.now();
                const { width, height } = getRandomDimensions();
                return `https://picsum.photos/${width}/${height}?random=${Math.random()}&blur=0&seed=${seed}`;
            }
        },
        {
            name: 'Unsplash Source',
            getUrl: () => {
                // Combine 2 random keywords for more specific results
                const keyword1 = extendedKeywords[Math.floor(Math.random() * extendedKeywords.length)];
                const keyword2 = extendedKeywords[Math.floor(Math.random() * extendedKeywords.length)];
                return `https://source.unsplash.com/800x800/?${keyword1},${keyword2},${Math.random()}`;
            }
        },
        {
            name: 'PlaceIMG',
            getUrl: () => {
                const randomCategory = extendedCategories[Math.floor(Math.random() * extendedCategories.length)];
                const { width, height } = getRandomDimensions();
                return `https://placeimg.com/${width}/${height}/${randomCategory}?random=${Math.random() * 10000}`;
            }
        },
        {
            name: 'Picsum Photos',
            getUrl: () => {
                const id = Math.floor(Math.random() * 1084); // Picsum has 1084 photos
                return `https://picsum.photos/id/${id}/800/800?random=${Date.now()}`;
            }
        },
        {
            name: 'Lorem Flickr',
            getUrl: () => {
                // Combine 2 random tags
                const tag1 = extendedTags[Math.floor(Math.random() * extendedTags.length)];
                const tag2 = extendedTags[Math.floor(Math.random() * extendedTags.length)];
                return `https://loremflickr.com/800/800/${tag1},${tag2}?random=${Math.random() * 1000}`;
            }
        },
        {
            name: 'Dog CEO',
            getUrl: () => {
                return `https://dog.ceo/api/breeds/image/random?_=${Date.now()}`;
            }
        },
        {
            name: 'Cataas (Cat as a Service)',
            getUrl: () => {
                const tags = ['cute', 'funny', 'sleepy', 'playing', 'eating', 'white', 'black', 'orange', 'gray'];
                const randomTag = tags[Math.floor(Math.random() * tags.length)];
                return `https://cataas.com/cat/${randomTag}?${Math.random()}`;
            }
        },
        {
            name: 'RoboHash',
            getUrl: () => {
                const sets = ['set1', 'set2', 'set3', 'set4']; // robots, monsters, aliens, head-ears
                const randomSet = sets[Math.floor(Math.random() * sets.length)];
                const seed = Math.random().toString(36).substring(2);
                return `https://robohash.org/${seed}?size=800x800&set=${randomSet}`;
            }
        }
    ];
    
    // Track previously used images to avoid immediate duplicates
    let recentImages = [];
    const maxRecentImages = 5;
    
    function generateUniqueImageId() {
        return Math.random().toString(36).substring(2) + Date.now() + Math.random();
    }
    
    function loadRandomPhoto() {
        // Reset loading state
        photoElement.classList.remove('loaded');
        loadingElement.style.display = 'block';
        
        let attempts = 0;
        const maxAttempts = 10;
        
        // APIs that return JSON and need special handling
        const jsonApis = ['Dog CEO'];
        
        function tryLoadImage() {
            if (attempts >= maxAttempts) {
                loadingElement.textContent = 'Failed to load image. Please refresh.';
                return;
            }
            
            attempts++;
            
            // Choose a random API
            const randomApi = photoApis[Math.floor(Math.random() * photoApis.length)];
            const apiUrl = randomApi.getUrl();
            
            // Check if we've recently used this exact URL
            if (recentImages.includes(apiUrl)) {
                tryLoadImage();
                return;
            }
            
            // Handle JSON APIs (like Dog CEO) that return image URL in JSON
            if (jsonApis.includes(randomApi.name)) {
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        const imageUrl = data.message;
                        loadImage(imageUrl, apiUrl, randomApi.name);
                    })
                    .catch(() => {
                        console.error(`Failed to fetch from ${randomApi.name}`);
                        tryLoadImage();
                    });
                return;
            }
            
            // Handle regular image URLs
            loadImage(apiUrl, apiUrl, randomApi.name);
        }
        
        function loadImage(imageUrl, trackingUrl, apiName) {
            // Create new image to preload
            const img = new Image();
            
            img.onload = function() {
                photoElement.src = imageUrl;
                photoElement.classList.add('loaded');
                loadingElement.style.display = 'none';
                
                // Add to recent images and maintain array size
                recentImages.push(trackingUrl);
                if (recentImages.length > maxRecentImages) {
                    recentImages.shift();
                }
            };
            
            img.onerror = function() {
                console.error(`Failed to load image from ${apiName}`);
                tryLoadImage();
            };
            
            img.src = imageUrl;
        }
        
        tryLoadImage();
    }
    
    // Load initial photo
    loadRandomPhoto();
    
    // Optional: Add refresh button functionality
    document.addEventListener('keydown', function(event) {
        if (event.key === 'r' || event.key === 'R') {
            loadRandomPhoto();
        }
    });
    
    // Optional: Click to reload
    document.getElementById('photo-container').addEventListener('click', loadRandomPhoto);
    
    // Rainbow button click to refresh page
    const refreshButton = document.getElementById('refresh-button');
    if (refreshButton) {
        console.log('Refresh button found, adding click listener');
        refreshButton.addEventListener('click', function(event) {
            console.log('Button clicked, refreshing page');
            event.preventDefault();
            location.reload();
        });
    } else {
        console.log('Refresh button not found');
    }
});
