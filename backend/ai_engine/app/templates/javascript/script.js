const videoData = {};
let currentVideo = null;
let currentSegment = null;
let responseData = {};
let videoUrls = [];
let pendingUploads = 0;
let defaultSegments = 0;
let defaultQuestions = 0;
let videoDurations = {};
let modifiedResponseData = {};
let hierarchyData = null;
let selectedSectionId = null;
const config = {};
// the above is the global variables that are used in the script
// IndexedDB Storage Utility

class QuestionIndexedDB {
  // Class for IndexedDB storage. This is used to store the video data.
  constructor(dbName = "VideoQuestionDB", version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  async openDatabase() {
    // Function to open the database.
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        // Event listener for when the database is upgraded.
        const db = event.target.result;
        if (!db.objectStoreNames.contains("videos")) {
          const videoStore = db.createObjectStore("videos", {
            keyPath: "video_url",
          });
          videoStore.createIndex("section_id", "section_id", { unique: false });
        }
      };

      request.onsuccess = (event) => {
        // Event listener for when the database is successfully opened.
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        // Event listener for when there is an error opening the database.
        reject(`IndexedDB error: ${event.target.error}`);
      };
    });
  }

  async saveVideoData(videoData) {
    // Function to save video data to the database.
    await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["videos"], "readwrite");
      const store = transaction.objectStore("videos");
      const request = store.put(videoData);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject("Failed to save video data");
    });
  }

  async getVideoData(videoUrl) {
    // Function to get video data from the database. This is used to retrieve the video data on the uploading portal.
    await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["videos"], "readonly");
      const store = transaction.objectStore("videos");
      const request = store.get(videoUrl);

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = () => reject("Failed to retrieve video data");
    });
  }

  async getAllVideos() {
    await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["videos"], "readonly");
      const store = transaction.objectStore("videos");
      const request = store.getAll();

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = () => reject("Failed to retrieve all videos");
    });
  }
}

const questionDB = new QuestionIndexedDB();
const configLoaded = fetch("/config")
  .then((response) => response.json())
  .then((data) => {
    config.LMS_GET_URL = data.LMS_GET_URL;
    config.VIDEO_UPLOAD_URL = data.VIDEO_UPLOAD_URL;
    config.ASSESSMENT_UPLOAD_URL = data.ASSESSMENT_UPLOAD_URL;
    config.QUESTIONS_UPLOAD_URL = data.QUESTIONS_UPLOAD_URL;
    config.Authorization = data.Authorization;

    console.log("Config Loaded:", config); // Debugging log
  })
  .catch((error) => console.error("Error fetching config:", error));

configLoaded.then(() => {
  // Function to fetch the course hierarchy when the page loads.
  console.log("2 GET KA URLLLL: ", config.LMS_GET_URL);
  console.log("2 UPLOAD KA URLLLL: ", config.LMS_UPLOAD_URL);
  console.log("2 QUESTION KA URLLLL: ", config.QUESTIONS_UPLOAD_URL);
  console.log("2 AUTHORIZATION", config.Authorization);
});

configLoaded.then(() => {
  // Fetch course hierarchy when page loads
  fetch(`${config.LMS_GET_URL}courses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: config.Authorization,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("API Response:", data); // ✅ Debugging
      if (!Array.isArray(data.results)) {
        throw new Error("Invalid data format received from server");
      }
      populateCourseDropdown(data.results);
    })
    .catch((error) => console.error("Error fetching courses:", error));
});

function populateCourseDropdown(courses) {
  // Function to populate the course dropdown with the courses fetched from the API.
  const courseSelect = document.getElementById("course-select");
  courseSelect.innerHTML = '<option value="">Select Course</option>';

  if (!Array.isArray(courses)) {
    console.error("⚠️ Expected courses to be an array");
    return;
  }

  courses.forEach((course) => {
    if (!course.course_id) {
      // ✅ Fix: Using `course_id` instead of `id`
      console.error("⚠️ Course missing ID:", course);
      return;
    }

    const option = document.createElement("option");
    option.value = course.course_id; // ✅ Fix: Use `course_id`
    option.textContent = course.name || "Unnamed Course";
    courseSelect.appendChild(option);
  });

  console.log(
    "📌 Course dropdown options:",
    [...courseSelect.options].map((opt) => opt.value)
  ); // ✅ Debugging
}

function deepCopy(obj) {
  // Function to create a deep copy of an object.
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepCopy(item));
  }

  const copy = {};
  Object.keys(obj).forEach((key) => {
    copy[key] = deepCopy(obj[key]);
  });
  return copy;
}

function updateModuleDropdown(courseId) {
  // Function to update the module dropdown based on the selected course.
  const moduleSelect = document.getElementById("module-select");
  moduleSelect.innerHTML = '<option value="">Select Module</option>';
  moduleSelect.disabled = true;

  const numericCourseId = parseInt(courseId, 10);
  if (isNaN(numericCourseId)) {
    console.error("⚠️ Invalid Course ID:", courseId);
    return;
  }

  moduleSelect.disabled = false;

  fetch(`${config.LMS_GET_URL}modules?course_id=${numericCourseId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: config.Authorization,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("📌 Modules API Response:", data); // ✅ Debugging

      if (!data || !Array.isArray(data.results)) {
        // ✅ Fix: Checking for `results` instead of `modules`
        throw new Error("Invalid data format received from server");
      }

      data.results.forEach((module) => {
        if (!module.module_id) {
          // ✅ Fix: Using `module_id` instead of `id`
          console.error("⚠️ Module missing ID:", module);
          return;
        }

        const option = document.createElement("option");
        option.value = module.module_id; // ✅ Fix: Use `module_id`
        option.textContent = module.title || "Unnamed Module";
        moduleSelect.appendChild(option);
      });
    })

    .catch((error) => {
      console.error("Error fetching modules:", error);
      moduleSelect.innerHTML =
        '<option value="">Error loading modules</option>';
    });
}

function updateSectionDropdown(moduleId) {
  // Function to update the section dropdown based on the selected module.
  const sectionSelect = document.getElementById("section-select");
  sectionSelect.innerHTML = '<option value="">Select Section</option>';
  sectionSelect.disabled = true;

  // Ensure moduleId is a valid number
  const numericModuleId = parseInt(moduleId, 10);
  if (isNaN(numericModuleId)) {
    console.error("⚠️ Invalid module ID:", moduleId);
    return;
  }

  sectionSelect.disabled = false;

  fetch(`${config.LMS_GET_URL}sections?module_id=${numericModuleId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: config.Authorization,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("📌 SECTION YAHAN HAI:", data); // ✅ Debugging

      if (!data || !Array.isArray(data.results)) {
        // ✅ Fix: Checking for `results` instead of `sections`
        throw new Error("Invalid data format received from server");
      }

      data.results.forEach((section) => {
        if (!section.id) {
          // ✅ Fix: Using `id` (not `section_id`)
          console.error("⚠️ Section missing ID:", section);
          return;
        }

        const option = document.createElement("option");
        option.value = section.id; // ✅ Fix: Use `id`
        option.textContent = section.title || "Unnamed Section";
        sectionSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching sections:", error);
      sectionSelect.innerHTML =
        '<option value="">Error loading sections</option>';
    });
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Event listener to load the course dropdown when the page loads.
  const courseSelect = document.getElementById("course-select");

  // ✅ Remove any existing listeners to prevent duplication
  courseSelect.replaceWith(courseSelect.cloneNode(true));

  // ✅ Add event listener correctly
  document.getElementById("course-select").addEventListener("change", (e) => {
    const courseId = e.target.value;

    // ✅ Debugging: Check if the selected course ID is captured
    console.log("✅ Selected Course ID:", courseId);

    if (courseId) {
      console.log("Yahan dekho", courseId);
      updateModuleDropdown(courseId);
    }

    // ✅ Reset the section dropdown
    const sectionSelect = document.getElementById("section-select");
    sectionSelect.disabled = true;
    sectionSelect.innerHTML = '<option value="">Select Section</option>';
  });
});

document.getElementById("module-select").addEventListener("change", (e) => {
  // Event listener to update the section dropdown when the module is selected.
  const moduleId = e.target.value;
  if (moduleId) {
    updateSectionDropdown(moduleId);
  }
});

document.getElementById("section-select").addEventListener("change", (e) => {
  // Event listener to update the selected section ID.
  selectedSectionId = e.target.value ? parseInt(e.target.value, 10) : null;
});

function secondsToHMS(seconds) {
  // Function to convert seconds to hours, minutes, and seconds.
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return { hrs, mins, secs };
}

function hmsToSeconds(hrs, mins, secs) {
  // Function to convert hours, minutes, and seconds to seconds.
  return hrs * 3600 + mins * 60 + secs;
}

function updateSegmentTimestamps(videoIndex, numSegments) {
  // Function to update the timestamps of the segments based on the number of segments.
  const videoDuration = videoDurations[videoIndex];
  const segmentDuration = videoDuration / numSegments;

  for (let i = 1; i <= numSegments; i++) {
    if (videoData[videoIndex].segments[i]) {
      videoData[videoIndex].segments[i].timestamp =
        i === 1 ? 0 : (i - 1) * segmentDuration;
    }
  }
}

function isPlaylistUrl(url) {
  // Function to check if the URL is a YouTube playlist URL.
  return url.includes("playlist?list=") || url.includes("&list=");
}

// Load YouTube API
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player; // YouTube player object
function onYouTubeIframeAPIReady() {
  // Function to initialize the YouTube player.
  player = new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: "",
    playerVars: {
      playsinline: 1,
    },
  });
}

async function getVideoDuration(videoId) {
  // Function to get the duration of a YouTube video.
  return new Promise((resolve) => {
    const tempPlayer = new YT.Player("temp-player", {
      videoId: videoId,
      events: {
        onReady: (event) => {
          const duration = event.target.getDuration();
          event.target.destroy();
          resolve(duration);
        },
      },
    });
  });
}

function selectVideo(index) {
  // Function to select a video from the list of videos.
  currentVideo = index;

  // Extract video ID from URL and load it
  const videoUrl = videoUrls[index];
  const videoId = videoUrl.match(
    /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/
  );
  if (videoId && videoId[1]) {
    if (player && player.loadVideoById) {
      player.loadVideoById(videoId[1]);
    }
  }

  const blocks = document.getElementsByClassName("video-block");
  Array.from(blocks).forEach((block) => block.classList.remove("active"));
  blocks[index].classList.add("active");

  const videoForm = document.getElementById("video-form");
  videoForm.style.display = "block";

  document.getElementById("num-segments-container").style.display = "block";

  if (!videoData[index]) {
    videoData[index] = {
      segments: {},
    };
    document.getElementById("num-segments").value = "";
    document.getElementById("segments-container").innerHTML = "";
    document.getElementById("details-form").style.display = "none";
  } else {
    const numSegments = Object.keys(videoData[index].segments).length;
    document.getElementById("num-segments").value = numSegments;

    // Rebuild segments UI without recalculating timestamps
    const segmentsContainer = document.getElementById("segments-container");
    segmentsContainer.innerHTML = "";

    for (let i = 1; i <= numSegments; i++) {
      const segmentBlock = document.createElement("div");
      segmentBlock.className = "segment-block";
      segmentBlock.textContent = `Segment ${i}`;
      segmentBlock.setAttribute("data-segment", i);
      segmentBlock.addEventListener("click", () => openSegmentForm(i));
      segmentsContainer.appendChild(segmentBlock);
    }
  }

  if (Object.keys(videoData[currentVideo].segments).length > 0) {
    openSegmentForm(1); // First segment is 1-based index
    const segmentBlocks = document.getElementsByClassName("segment-block");
    Array.from(segmentBlocks).forEach((block) =>
      block.classList.remove("active")
    );
    if (segmentBlocks.length > 0) {
      segmentBlocks[0].classList.add("active"); // Highlight first segment block
    }
  }
}

document.getElementById("fetch-videos").addEventListener("click", async () => {
  // Event listener for when the user submits the playlist URL.
  const playlistUrl = document.getElementById("playlist-url").value;
  defaultSegments =
    parseInt(document.getElementById("default-segments").value) || 0;
  defaultQuestions =
    parseInt(document.getElementById("default-questions").value) || 0;

  if (!defaultSegments) {
    alert("Please enter default number of segments");
    return;
  }
  if (!defaultQuestions) {
    alert("Please enter default number of questions");
    return;
  }

  try {
    if (isPlaylistUrl(playlistUrl)) {
      // Existing playlist handling
      const response = await fetch("/questions/get_urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: playlistUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      videoUrls = data.video_urls;
    } else {
      // Single video handling
      videoUrls = [playlistUrl];
    }

    // Get durations for all videos
    for (let i = 0; i < videoUrls.length; i++) {
      const videoId = videoUrls[i].match(
        /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/
      )[1];
      videoDurations[i] = await getVideoDuration(videoId);
    }

    displayVideoBlocks();
    document.getElementById("video-form").style.display = "block";

    // Auto-populate all videos with default segments
    videoUrls.forEach((_, index) => {
      videoData[index] = {
        segments: {},
      };
      if (defaultSegments > 0) {
        const numSegments = defaultSegments;
        for (let i = 1; i <= numSegments; i++) {
          const segmentDuration = videoDurations[index] / numSegments;
          videoData[index].segments[i] = {
            timestamp: (i - 1) * segmentDuration,
            questions: defaultQuestions || null,
            type: "analytical",
          };
        }
        document.getElementById("num-segments").value = numSegments;
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
});

function displayVideoBlocks() {
  // Function to display the video blocks on the page.
  const container = document.getElementById("videos-container");
  container.innerHTML = "";

  videoUrls.forEach((_, index) => {
    const videoBlock = document.createElement("div");
    videoBlock.className = "video-block";
    videoBlock.textContent = `Video ${index + 1}`;
    videoBlock.addEventListener("click", () => selectVideo(index));
    container.appendChild(videoBlock);
  });
}

const numSegmentsInput = document.getElementById("num-segments");
numSegmentsInput.addEventListener("input", () => {
  if (currentVideo === null) return;

  const numSegments = parseInt(numSegmentsInput.value) || 0;
  const segmentsContainer = document.getElementById("segments-container");
  const currentSegments = videoData[currentVideo].segments;

  // Clear container
  segmentsContainer.innerHTML = "";

  // Calculate segment duration based on video duration
  const videoDuration = videoDurations[currentVideo];
  const segmentDuration = videoDuration / numSegments;

  // Create new segments object
  const newSegments = {};

  for (let i = 1; i <= numSegments; i++) {
    const segmentBlock = document.createElement("div");
    segmentBlock.className = "segment-block";
    segmentBlock.textContent = `Segment ${i}`;
    segmentBlock.setAttribute("data-segment", i);
    segmentBlock.addEventListener("click", () => openSegmentForm(i));
    segmentsContainer.appendChild(segmentBlock);

    // Preserve existing segment data if available
    if (currentSegments[i]) {
      newSegments[i] = {
        ...currentSegments[i],
      };
    } else {
      // Only calculate new timestamp for new segments
      newSegments[i] = {
        timestamp: i === 1 ? 0 : (i - 1) * segmentDuration,
        questions: defaultQuestions || null,
        type: "analytical",
      };
    }
  }

  // Replace old segments with new ones
  videoData[currentVideo].segments = newSegments;
});

function openSegmentForm(segmentNumber) {
  currentSegment = segmentNumber;
  const data = videoData[currentVideo].segments[segmentNumber];

  const formTitle = document.getElementById("form-title");
  const questionsInput = document.getElementById("questions");
  const typeInput = document.getElementById("type");

  const timestampFields = document.querySelectorAll(
    "#timestamp-hr, #timestamp-min, #timestamp-sec"
  );
  if (segmentNumber === 1) {
    timestampFields.forEach((field) => {
      field.value = "0";
      field.disabled = true;
    });
  } else {
    const timestamp = data.timestamp || 0;
    const { hrs, mins, secs } = secondsToHMS(timestamp);
    document.getElementById("timestamp-hr").value = hrs;
    document.getElementById("timestamp-min").value = mins;
    document.getElementById("timestamp-sec").value = secs;
    timestampFields.forEach((field) => (field.disabled = false));
  }

  formTitle.textContent = `Segment ${segmentNumber} Details`;
  questionsInput.value = data.questions || "";
  typeInput.value = data.type || "";

  document.getElementById("details-form").style.display = "block";

  const segmentBlocks = document.getElementsByClassName("segment-block");
  Array.from(segmentBlocks).forEach((block) =>
    block.classList.remove("active")
  );
  document
    .querySelector(`[data-segment="${segmentNumber}"]`)
    ?.classList.add("active");
}

function saveSegmentData() {
  if (currentVideo === null || currentSegment === null) return;

  const hrs = parseInt(document.getElementById("timestamp-hr").value) || 0;
  const mins = parseInt(document.getElementById("timestamp-min").value) || 0;
  const secs = parseInt(document.getElementById("timestamp-sec").value) || 0;
  const questionsInput = document.getElementById("questions");
  const typeInput = document.getElementById("type");

  videoData[currentVideo].segments[currentSegment] = {
    timestamp: currentSegment === 1 ? 0 : hmsToSeconds(hrs, mins, secs),
    questions: parseInt(questionsInput.value) || null,
    type: typeInput.value || "",
  };
}

function validateTimestamps() {
  for (let videoIndex in videoData) {
    const segments = videoData[videoIndex].segments;
    const segmentNumbers = Object.keys(segments).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    let previousTimestamp = -1;

    for (let segNum of segmentNumbers) {
      const currentTimestamp = segments[segNum].timestamp;

      // Check if timestamps are in order
      if (currentTimestamp <= previousTimestamp && segNum !== "1") {
        alert(
          `Video ${
            parseInt(videoIndex) + 1
          }, Segment ${segNum}: Timestamp (${currentTimestamp}s) must be greater than previous segment's timestamp (${previousTimestamp}s)`
        );
        return false;
      }

      // Check if last segment timestamp is less than video duration
      if (segNum === segmentNumbers[segmentNumbers.length - 1]) {
        if (currentTimestamp >= videoDurations[videoIndex]) {
          alert(
            `Video ${
              parseInt(videoIndex) + 1
            }, Segment ${segNum}: Last segment timestamp (${currentTimestamp}s) must be less than video duration (${
              videoDurations[videoIndex]
            }s)`
          );
          return false;
        }
      }

      previousTimestamp = currentTimestamp;
    }
  }
  return true;
}

document.getElementById("questions").addEventListener("input", saveSegmentData);
document.getElementById("type").addEventListener("change", saveSegmentData);

["timestamp-hr", "timestamp-min", "timestamp-sec"].forEach((id) => {
  document.getElementById(id).addEventListener("input", saveSegmentData);
});

function getTotalSegments(videoIndex) {
  return Object.keys(videoData[videoIndex]?.segments || {}).length;
}

function createBatches(videoIndices) {
  const batches = [];
  let currentBatch = [];
  let currentBatchSegments = 0;

  for (const videoIndex of videoIndices) {
    const videoSegments = getTotalSegments(videoIndex);

    if (currentBatchSegments + videoSegments > 15) {
      if (currentBatch.length > 0) {
        batches.push(currentBatch);
      }
      currentBatch = [videoIndex];
      currentBatchSegments = videoSegments;
    } else {
      currentBatch.push(videoIndex);
      currentBatchSegments += videoSegments;
    }
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
}

async function processBatches(batches) {
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];

    // Process all videos in current batch concurrently
    const batchPromises = batch.map(async (videoIndex) => {
      const videoURL = videoUrls[videoIndex];
      const segments = videoData[videoIndex].segments;

      const timestamps = [];
      const segmentWiseQNo = [];
      const segmentWiseQModel = [];

      Object.values(segments).forEach((data) => {
        if (data.timestamp !== null)
          timestamps.push(parseInt(data.timestamp, 10));
        if (data.questions !== null) segmentWiseQNo.push(data.questions);
        if (data.type !== null) segmentWiseQModel.push(data.type);
      });

      const payload = {
        url: videoURL,
        user_api_key: document.getElementById("user-api-key").value,
        timestamps,
        segment_wise_q_no: segmentWiseQNo,
        segment_wise_q_model: segmentWiseQModel,
      };

      console.log("SUMN SUS GOIN' ON HERE:", payload);

      const response = await fetch("/questions/process_video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      responseData[videoIndex] = data;

      // Save to IndexedDB
      await questionDB.saveVideoData({
        ...data,
        video_url: videoURL,
      });

      return data;
    });

    await Promise.all(batchPromises);

    // Wait 90 seconds before processing next batch
    if (i < batches.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 90000));
    }
  }
}

document.getElementById("video-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateTimestamps()) {
      return;
    }

    const userApiKey = document.getElementById("user-api-key").value;
    const generatingSign = document.getElementById("generating-sign");
    const outputDiv = document.getElementById("output");
    const confirmButton = document.getElementById("confirm-btn");

    generatingSign.style.display = "block";
    outputDiv.style.display = "none";
    confirmButton.style.display = "none";

    try {
      const videoIndices = Object.keys(videoData).map(Number);
      const batches = createBatches(videoIndices);
      await processBatches(batches);

      modifiedResponseData = deepCopy(responseData);

      console.log("Original responseData:", responseData);
      console.log("Modified responseData:", modifiedResponseData);

      generatingSign.style.display = "none";
      outputDiv.style.display = "block";
      displayOutput(modifiedResponseData[currentVideo]);
      confirmButton.style.display = "inline-block";
    } catch (error) {
      generatingSign.style.display = "none";
      outputDiv.textContent = `Error processing videos: ${error.message}`;
    }
  });

function displayOutput(data) {
  // Add logging to track data
  console.log("Raw data entering displayOutput:", data);

  // Display output video blocks
  const outputVideosContainer = document.getElementById(
    "output-videos-container"
  );
  if (!outputVideosContainer.hasChildNodes()) {
    videoUrls.forEach((_, index) => {
      const videoBlock = document.createElement("div");
      videoBlock.className = "video-block";
      videoBlock.textContent = `Video ${index + 1}`;
      videoBlock.addEventListener("click", () => {
        // Add logging before calling showVideoOutput
        console.log(
          "Data before showing video output:",
          modifiedResponseData[index]
        );
        showVideoOutput(index);
      });
      outputVideosContainer.appendChild(videoBlock);
    });
  }

  // Ensure data is passed correctly to showVideoOutput
  if (data) {
    console.log("Data before initial showVideoOutput:", data);
    showVideoOutput(currentVideo);
  }
}

function saveVideoEdits(videoIndex) {
  if (!modifiedResponseData[videoIndex]) return;

  const data = modifiedResponseData[videoIndex];

  // Save title and description
  const titleEl = document.getElementById("title");
  const descEl = document.getElementById("description");
  if (titleEl) data.title = titleEl.value;
  if (descEl) data.description = descEl.value;

  // Save segment modifications
  data.segments.forEach((segment, i) => {
    const textEl = document.getElementById(`segment-text-${i}`);
    if (textEl) segment.text = textEl.value;
  });

  // Save question modifications
  data.questions = data.questions.map((question, i) => {
    const newQuestion = { ...question };
    const questionTextEl = document.getElementById(`question-text-${i}`);
    const option1El = document.getElementById(`option-${i}-0`);
    const option2El = document.getElementById(`option-${i}-1`);
    const option3El = document.getElementById(`option-${i}-2`);
    const option4El = document.getElementById(`option-${i}-3`);
    const correctAnswerEl = document.getElementById(`correct-answer-${i}`);

    if (questionTextEl) newQuestion.question = questionTextEl.value;
    if (option1El) newQuestion.option_1 = option1El.value;
    if (option2El) newQuestion.option_2 = option2El.value;
    if (option3El) newQuestion.option_3 = option3El.value;
    if (option4El) newQuestion.option_4 = option4El.value;
    if (correctAnswerEl)
      newQuestion.correct_answer = parseInt(correctAnswerEl.value);

    return newQuestion;
  });

  questionDB.saveVideoData(data);
}

async function showVideoOutput(index) {
  // First, try to get data from IndexedDB
  const storedVideoData = await questionDB.getVideoData(videoUrls[index]);

  if (storedVideoData) {
    // If data exists in IndexedDB, use it
    modifiedResponseData[index] = storedVideoData;
  }

  if (!modifiedResponseData[index]) return;

  if (currentVideo !== null) {
    saveVideoEdits(currentVideo);
  }

  const data = modifiedResponseData[index];

  // Store the current video index for the download
  currentVideo = index;

  const blocks = document
    .getElementById("output-videos-container")
    .getElementsByClassName("video-block");
  Array.from(blocks).forEach((block) => block.classList.remove("active"));
  blocks[index].classList.add("active");

  // Display video information
  const videoInfo = document.getElementById("video-info");
  videoInfo.innerHTML = `
    <label for="video-url">Video URL</label>
    <input type="text" id="video-url" value="${data.video_url}" disabled />

    <label for="title">Title</label>
    <input type="text" id="title" value="${data.title}" />

    <label for="description">Description</label>
    <textarea id="description">${data.description}</textarea>

    <label for="section-info">Selected Section</label>
    <input type="text" id="section-info" value="${
      hierarchyData?.results
        .find((course) =>
          course.modules.some((module) =>
            module.sections.some((section) => section.id === selectedSectionId)
          )
        )
        ?.modules.find((module) =>
          module.sections.some((section) => section.id === selectedSectionId)
        )
        ?.sections.find((section) => section.id === selectedSectionId)?.title ||
      "No section selected"
    }" disabled />
  `;

  // Display segments
  const segmentsContainer = document.getElementById(
    "output-segments-container"
  );
  const segmentDetailsContainer = document.getElementById(
    "segment-details-container"
  );

  segmentsContainer.innerHTML = "";
  segmentDetailsContainer.innerHTML = "";

  data.segments.forEach((segment, i) => {
    const segmentBlock = document.createElement("div");
    segmentBlock.className = "segment-block";
    segmentBlock.textContent = `Segment ${i + 1}`;
    segmentBlock.dataset.segment = i;
    segmentBlock.addEventListener("click", () => showSegmentDetails(i));
    segmentsContainer.appendChild(segmentBlock);

    const segmentDetails = document.createElement("div");
    segmentDetails.className = "segment-details";
    segmentDetails.id = `segment-${i}`;
    segmentDetails.innerHTML = `
      <h5>Segment ${i + 1}</h5>
      <label for="segment-text-${i}">Text</label>
      <textarea id="segment-text-${i}">${segment.text}</textarea>

      <label for="start-time-${i}">Start Time</label>
      <div style="display: flex; gap: 10px;">
        <input type="number" id="start-time-hr-${i}" value="${Math.floor(
      i === 0 ? 0 : segment.start_time / 3600
    )}" disabled style="width: 33%;" />
        <input type="number" id="start-time-min-${i}" value="${Math.floor(
      (i === 0 ? 0 : segment.start_time % 3600) / 60
    )}" disabled style="width: 33%;" />
        <input type="number" id="start-time-sec-${i}" value="${Math.floor(
      (i === 0 ? 0 : segment.start_time) % 60
    )}" disabled style="width: 33%;" />
      </div>

      <label for="end-time-${i}">End Time</label>
      <div style="display: flex; gap: 10px;">
        <input type="number" id="end-time-hr-${i}" value="${Math.floor(
      segment.end_time / 3600
    )}" disabled style="width: 33%;" />
        <input type="number" id="end-time-min-${i}" value="${Math.floor(
      (segment.end_time % 3600) / 60
    )}" disabled style="width: 33%;" />
        <input type="number" id="end-time-sec-${i}" value="${Math.floor(
      segment.end_time % 60
    )}" disabled style="width: 33%;" />
      </div>
    `;
    segmentDetailsContainer.appendChild(segmentDetails);
  });

  // Display questions
  const questionsContainer = document.getElementById(
    "output-questions-container"
  );
  const questionDetailsContainer = document.getElementById(
    "question-details-container"
  );

  questionsContainer.innerHTML = "";
  questionDetailsContainer.innerHTML = "";
  console.log("Data", data);

  data.questions.forEach((question, i) => {
    const questionBlock = document.createElement("div");
    questionBlock.className = "question-block";
    questionBlock.textContent = `Question ${i + 1}`;
    questionBlock.dataset.question = i;
    questionBlock.addEventListener("click", () => showQuestionDetails(i));
    questionsContainer.appendChild(questionBlock);

    const questionDetails = document.createElement("div");
    questionDetails.className = "question-details";
    questionDetails.id = `question-${i}`;

    questionDetails.innerHTML = `
      <h5>Question ${i + 1}</h5>
      <label for="question-text-${i}">Question Text</label>
      <textarea id="question-text-${i}">${question.question}</textarea>
      
      <h6>Options</h6>
      <label for="option-${i}-0">Option 1</label>
      <input type="text" id="option-${i}-0" value="${
      question.option_1 || ""
    }" />
      <label for="option-${i}-1">Option 2</label>
      <input type="text" id="option-${i}-1" value="${
      question.option_2 || ""
    }" />
      <label for="option-${i}-2">Option 3</label>
      <input type="text" id="option-${i}-2" value="${
      question.option_3 || ""
    }" />
      <label for="option-${i}-3">Option 4</label>
      <input type="text" id="option-${i}-3" value="${
      question.option_4 || ""
    }" />

      <label for="correct-answer-${i}">Correct Answer</label>
      <input type="number" id="correct-answer-${i}" value="${
      question.correct_answer
    }" />

      <label for="segment-index-${i}">Segment</label>
      <input type="number" id="segment-index-${i}" value="${
      question.segment
    }" disabled />
    `;
    questionDetailsContainer.appendChild(questionDetails);
  });

  // Show first segment and question by default
  if (data.segments.length > 0) showSegmentDetails(0);
  if (data.questions.length > 0) showQuestionDetails(0);
}

function showSegmentDetails(index) {
  const allDetails = document.getElementsByClassName("segment-details");
  Array.from(allDetails).forEach((detail) => (detail.style.display = "none"));

  const allBlocks = document.getElementsByClassName("segment-block");
  Array.from(allBlocks).forEach((block) => block.classList.remove("active"));

  document.getElementById(`segment-${index}`).style.display = "block";
  document.querySelector(`[data-segment="${index}"]`).classList.add("active");

  saveVideoEdits(currentVideo);
}

function showQuestionDetails(index) {
  const allDetails = document.getElementsByClassName("question-details");
  Array.from(allDetails).forEach((detail) => (detail.style.display = "none"));

  const allBlocks = document.getElementsByClassName("question-block");
  Array.from(allBlocks).forEach((block) => block.classList.remove("active"));

  document.getElementById(`question-${index}`).style.display = "block";
  document.querySelector(`[data-question="${index}"]`).classList.add("active");

  saveVideoEdits(currentVideo);
}

document.getElementById("recalculate-timestamps").addEventListener("click", () => {
    if (currentVideo === null || !videoDurations[currentVideo]) return;

    const numSegments = Object.keys(videoData[currentVideo].segments).length;
    const videoDuration = videoDurations[currentVideo];
    const segmentDuration = videoDuration / numSegments;

    // Update all segments except the first one (which stays at 0)
    for (let i = 2; i <= numSegments; i++) {
      const newTimestamp = (i - 1) * segmentDuration;
      videoData[currentVideo].segments[i].timestamp = newTimestamp;

      // If this segment is currently open in the form, update the form fields
      if (currentSegment === i) {
        const { hrs, mins, secs } = secondsToHMS(newTimestamp);
        document.getElementById("timestamp-hr").value = hrs;
        document.getElementById("timestamp-min").value = mins;
        document.getElementById("timestamp-sec").value = secs;
      }
    }
  });
configLoaded.then(() => {
  document.getElementById("confirm-btn").addEventListener("click", async () => {
    if (!selectedSectionId) {
      alert("Please select a section before submitting");
      return;
    }

    // Save modifications before uploading
    if (currentVideo !== null) {
      saveVideoEdits(currentVideo);
    }

    const videoIndices = Object.keys(modifiedResponseData).map(Number);
    const errors = [];

    let sequenceCounter = 1; // Initialize sequence number counter

    for (const videoIndex of videoIndices) {
      const data = modifiedResponseData[videoIndex];
      console.log("keyboard smash", data.segments);

      // Step 1: Upload Video to LMS for each segment
      for (let i = 0; i < data.segments.length; i++) {
        const segment = data.segments[i];
        try {
          const videoPayload = {
            source: segment.video_url,
            title: segment.title,
            description: segment.description,
            section: selectedSectionId, // Add section_id here for each segment
            start_time: parseInt(segment.start_time, 10),
            end_time: parseInt(segment.end_time, 10),
            transcript: segment.text,
            sequence: sequenceCounter, // Assign sequence number for the video
          };
          sequenceCounter = sequenceCounter + 1;

          const videoResponse = await fetch(config.VIDEO_UPLOAD_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: config.Authorization,
            },
            body: JSON.stringify(videoPayload),
          });

          if (!videoResponse.ok)
            throw new Error(`Video Upload Failed: ${videoResponse.status}`);
          const videoResult = await videoResponse.json();
          const videoId = videoResult.video_id;

          // Step 2: Upload Assessment Data for the current video
          const assessmentPayload = {
            title: `Assessment number ${i + 1}`, // Title should be "Assessment number" = i (iteration number)
            question_visibility_limit: 9, // Set default question visibility limit
            time_limit: 9, // Set default time limit
            section: selectedSectionId, // Section is the same as the video to which this assessment belongs
            sequence: sequenceCounter, // Set sequence number for the assessment (next number after video)
          };
          sequenceCounter = sequenceCounter + 1;

          const assessmentResponse = await fetch(config.ASSESSMENT_UPLOAD_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: config.Authorization,
            },
            body: JSON.stringify(assessmentPayload),
          });

          if (!assessmentResponse.ok)
            throw new Error(
              `Assessment Upload Failed: ${assessmentResponse.status}`
            );
          const assessmentResult = await assessmentResponse.json();
          const assessmentId = assessmentResult.id; // Assuming API returns assessment_id

          // Step 3: Upload Questions for the current assessment (Only if segment matches)
          for (let j = 0; j < data.questions.length; j++) {
            const question = data.questions[j];
            if (question.segment === i + 1) {
              // Check if the question's segment matches the current segment number
              const questionPayload = {
                text: question.question,
                type: "MCQ", // Assuming it's an MCQ type
                marks: 1, // Default marks
                assessment: assessmentId, // Link question to the current assessment
                options: [
                  { option_text: question.option_1 },
                  { option_text: question.option_2 },
                  { option_text: question.option_3 },
                  { option_text: question.option_4 },
                ],
                solution_option_index: question.correct_answer, // Assuming correct_answer is the index of the correct option
              };

              const questionResponse = await fetch(
                config.QUESTIONS_UPLOAD_URL,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: config.Authorization,
                  },
                  body: JSON.stringify(questionPayload),
                }
              );

              if (!questionResponse.ok)
                throw new Error(
                  `Question Upload Failed: ${questionResponse.status}`
                );
            }
          }

          // Save data to IndexedDB for backup
          await questionDB.saveVideoData({
            ...data,
            video_id: videoId,
            assessment_id: assessmentId,
          });
        } catch (error) {
          console.error("Error:", error);
          errors.push(error.message);
        }
      }
    }

    // Display errors or success message
    if (errors.length > 0) {
      alert("Some uploads failed:\n" + errors.join("\n"));
    } else {
      alert("All videos, assessments, and questions submitted successfully!");
    }
  });
});
