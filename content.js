// Fetch sponsor segments for a given YouTube video using the SponsorBlock API
const checkSponsorBlock = async (videoID) => {
  const url = `https://sponsor.ajay.app/api/skipSegments?videoID=${videoID}&categories=["sponsor","selfpromo"]`;

  try {
    const res = await fetch(url); // Make an API request
    const data = await res.json(); // Parse the JSON response

    // Extract only the start and end times of the sponsor segments
    return data.map((seg) => seg.segment); // Example: [[start1, end1], [start2, end2], ...]
  } catch (err) {
    console.error("SponsorBlock API error:", err);
    return []; // Return an empty array on error
  }
};

// Helper function to extract the video ID from the current YouTube URL
const getVideoID = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("v"); // Gets the "v" parameter from ?v=VIDEO_ID
};

// Main function to automatically skip sponsor segments
const skipSponsorSegments = async () => {
  const video = document.querySelector("video"); // Get the <video> element
  if (!video) return; // Exit if the video element isn't found

  const videoID = getVideoID(); // Get the current video ID
  if (!videoID) return;

  const segments = await checkSponsorBlock(videoID); // Get sponsor segments from API
  if (!segments.length) return; // Exit if no segments found

  // Check the video playback position every 500ms
  setInterval(() => {
    const currentTime = video.currentTime; // Get the current playback time

    // Loop through all sponsor segments
    for (const [start, end] of segments) {
      // If the current time is within a sponsor segment
      if (currentTime >= start && currentTime < end) {
        video.currentTime = end; // Skip to the end of the sponsor segment
        break; // Break out of the loop after skipping
      }
    }
  }, 500); // Run this check every half second
};

// Wait until the page fully loads, then delay 3 seconds before running the skip logic
window.addEventListener("load", () => {
  setTimeout(skipSponsorSegments, 3000); // This ensures the video is ready
});
