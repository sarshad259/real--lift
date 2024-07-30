// Select all relevant elements
let lift = document.getElementById("lift");
let buttons = document.querySelectorAll(".btn");

// Store the current floor of the lift
let currentFloor = 0;

// Queue to keep track of requested floors
let requestQueue = [];
let isMoving = false;

// Function to open lift doors
function openLiftDoors() {
    lift.classList.add("open");
}

// Function to close lift doors
function closeLiftDoors() {
    lift.classList.remove("open");
}

// Function to move lift to the specified floor
function moveLift(toFloor, bottomPosition) {
    closeLiftDoors(); // Close doors before moving
    lift.style.transition = `bottom 0.5s ease-in-out`;
    lift.style.bottom = bottomPosition;
    lift.style.zIndex = "90";

    // Update current floor and isMoving status
    currentFloor = toFloor;
    isMoving = true;

    // Open lift doors after moving
    setTimeout(() => {
        openLiftDoors();
        // Keep doors open for 5 seconds
        setTimeout(() => {
            closeLiftDoors();
            isMoving = false;
            // Process the next request in the queue
            if (requestQueue.length > 0) {
                processNextRequest();
            }
        }, 5000); // Keep doors open for 5 seconds
    }, 500); // Delay to match the transition duration
}

// Function to process the next request in the queue
function processNextRequest() {
    if (requestQueue.length > 0 && !isMoving) {
        const { floor, bottomPosition } = requestQueue.shift(); // Get the next requested floor
        moveLift(floor, bottomPosition); // Move lift to the requested floor
    }
}

// Function to handle button clicks
function handleButtonClick(event) {
    const floor = event.target.dataset.floor;
    const bottomPosition = {
        "-1": "0px",
        "0": "100px",
        "1": "200px",
        "2": "300px",
        "3": "400px"
    }[floor];

    // Add request to the queue if it's not already in the queue
    if (!requestQueue.some(req => req.floor === floor)) {
        // Disable all buttons while the lift is moving
        toggleButtons(false);
        
        requestQueue.push({ floor, bottomPosition });
        // Start processing requests if it's the only request in the queue
        if (!isMoving && requestQueue.length === 1) {
            processNextRequest();
        }
    }
}

// Function to enable or disable all buttons
function toggleButtons(enabled) {
    buttons.forEach(button => {
        button.disabled = !enabled;
    });
}

// Add event listeners to buttons
buttons.forEach(button => button.addEventListener("click", handleButtonClick));

// Ensure buttons are re-enabled after lift has stopped moving
lift.addEventListener("transitionend", () => {
    if (!isMoving) {
        toggleButtons(true);
    }
});
