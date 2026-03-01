document.addEventListener('DOMContentLoaded', function() {
    const photoElement = document.getElementById('random-photo');
    const loadingElement = document.getElementById('loading');
    
    // Array of diverse random photo APIs for true randomness
    const photoApis = [
        {
            name: 'Lorem Picsum',
            getUrl: () => {
                const seed = Math.random().toString(36).substring(7) + Date.now();
                return `https://picsum.photos/800/800?random=${Math.random()}&blur=0&seed=${seed}`;
            }
        },
        {
            name: 'Unsplash Source',
            getUrl: () => {
                const keywords = ['nature', 'city', 'people', 'animals', 'architecture', 'food', 'travel', 'abstract', 'technology', 'sports'];
                const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
                return `https://source.unsplash.com/800x800/?${randomKeyword},${Math.random()}`;
            }
        },
        {
            name: 'PlaceIMG',
            getUrl: () => {
                const categories = ['any', 'people', 'nature', 'tech', 'animals', 'architecture'];
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                return `https://placeimg.com/800/800/${randomCategory}?random=${Math.random() * 10000}`;
            }
        },
        {
            name: 'Picsum Photos',
            getUrl: () => {
                const id = Math.floor(Math.random() * 1000);
                return `https://picsum.photos/id/${id}/800/800?random=${Date.now()}`;
            }
        },
        {
            name: 'Lorem Flickr',
            getUrl: () => {
                const tags = ['nature', 'city', 'people', 'animals', 'abstract', 'colorful'];
                const randomTag = tags[Math.floor(Math.random() * tags.length)];
                return `https://loremflickr.com/800/800/${randomTag}?random=${Math.random() * 1000}`;
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
        
        function tryLoadImage() {
            if (attempts >= maxAttempts) {
                loadingElement.textContent = 'Failed to load image. Please refresh.';
                return;
            }
            
            attempts++;
            
            // Choose a random API
            const randomApi = photoApis[Math.floor(Math.random() * photoApis.length)];
            const imageUrl = randomApi.getUrl();
            
            // Check if we've recently used this exact URL
            if (recentImages.includes(imageUrl)) {
                tryLoadImage();
                return;
            }
            
            // Create new image to preload
            const img = new Image();
            
            img.onload = function() {
                photoElement.src = imageUrl;
                photoElement.classList.add('loaded');
                loadingElement.style.display = 'none';
                
                // Add to recent images and maintain array size
                recentImages.push(imageUrl);
                if (recentImages.length > maxRecentImages) {
                    recentImages.shift();
                }
            };
            
            img.onerror = function() {
                console.error(`Failed to load image from ${randomApi.name}`);
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
