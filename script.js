document.addEventListener('DOMContentLoaded', function() {
    const photoElement = document.getElementById('random-photo');
    const loadingElement = document.getElementById('loading');
    
    // Array of different random photo APIs for variety
    const photoApis = [
        {
            name: 'Lorem Picsum',
            getUrl: () => `https://picsum.photos/800/800?random=${Math.random()}`
        },
        {
            name: 'Unsplash Source',
            getUrl: () => `https://source.unsplash.com/800x800/?random&${Math.random()}`
        },
        {
            name: 'PlaceIMG',
            getUrl: () => `https://placeimg.com/800/800/any?random=${Math.random()}`
        }
    ];
    
    function loadRandomPhoto() {
        // Reset loading state
        photoElement.classList.remove('loaded');
        loadingElement.style.display = 'block';
        
        // Choose a random API
        const randomApi = photoApis[Math.floor(Math.random() * photoApis.length)];
        const imageUrl = randomApi.getUrl();
        
        // Create new image to preload
        const img = new Image();
        
        img.onload = function() {
            photoElement.src = imageUrl;
            photoElement.classList.add('loaded');
            loadingElement.style.display = 'none';
        };
        
        img.onerror = function() {
            // If this API fails, try another one
            console.error(`Failed to load image from ${randomApi.name}`);
            setTimeout(loadRandomPhoto, 1000); // Retry after 1 second
        };
        
        img.src = imageUrl;
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
        refreshButton.addEventListener('click', function() {
            location.reload();
        });
    }
});
