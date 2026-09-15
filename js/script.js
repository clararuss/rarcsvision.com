// Video hover play/pause and visibility control
document.addEventListener('DOMContentLoaded', function() {
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    
    // Store video states
    const videoStates = new Map();
    
    videoWrappers.forEach((wrapper, index) => {
        const iframe = wrapper.querySelector('iframe');
        
        if (!iframe) return;
        
        // Initialize state for each video
        videoStates.set(iframe, {
            isHovered: false,
            isVisible: false,
            isPlaying: false
        });
        
        // Mouse enter - play video
        wrapper.addEventListener('mouseenter', function() {
            const state = videoStates.get(iframe);
            state.isHovered = true;
            
            // Only play if video is visible
            if (state.isVisible) {
                playVideo(iframe);
                state.isPlaying = true;
            }
        });
        
        // Mouse leave - pause video
        wrapper.addEventListener('mouseleave', function() {
            const state = videoStates.get(iframe);
            state.isHovered = false;
            pauseVideo(iframe);
            state.isPlaying = false;
        });
    });
    
    // Intersection Observer to pause videos when out of view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Video must be at least 50% visible
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const iframe = entry.target.querySelector('iframe');
            if (!iframe) return;
            
            const state = videoStates.get(iframe);
            
            if (entry.isIntersecting) {
                // Video is in view
                state.isVisible = true;
                // Only play if hovered
                if (state.isHovered) {
                    playVideo(iframe);
                    state.isPlaying = true;
                }
            } else {
                // Video is out of view - pause it
                state.isVisible = false;
                if (state.isPlaying) {
                    pauseVideo(iframe);
                    state.isPlaying = false;
                }
            }
        });
    }, observerOptions);
    
    // Observe all video wrappers
    videoWrappers.forEach(wrapper => {
        observer.observe(wrapper);
    });
    
    // Helper functions to control Mux player via postMessage
    function playVideo(iframe) {
        try {
            iframe.contentWindow.postMessage(JSON.stringify({
                method: 'play'
            }), '*');
        } catch (e) {
            console.log('Could not play video:', e);
        }
    }
    
    function pauseVideo(iframe) {
        try {
            iframe.contentWindow.postMessage(JSON.stringify({
                method: 'pause'
            }), '*');
        } catch (e) {
            console.log('Could not pause video:', e);
        }
    }
});