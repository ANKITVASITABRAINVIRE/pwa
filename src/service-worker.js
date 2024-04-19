/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from "workbox-precaching";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { registerRoute } from "workbox-routing";

// Define the current version of the application
const CURRENT_VERSION = 0.1;

// Precache and route all assets defined in the __WB_MANIFEST variable
precacheAndRoute(self.__WB_MANIFEST);

// Define caching strategies for specific routes
// Network first strategy for requests to 'https://jsonplaceholder.typicode.com'
registerRoute(
  ({ url }) => url.origin === "https://jsonplaceholder.typicode.com",
  new NetworkFirst()
);

// Stale-While-Revalidate strategy for JavaScript, CSS, and HTML files
registerRoute(/\.(?:js|css|html)$/, new StaleWhileRevalidate());

// Event listener for activating the service worker
self.addEventListener("activate", (event) => {
  // Check if a new version is available
  event.waitUntil(checkAndNotify());
});

// Function to check if a new version is available and send notification
async function checkAndNotify() {
  try {
    // Fetch the current version from the server
    const response = await fetch("/meta.json"); // Assuming version is stored in a JSON file
    const data = await response.json();
    const latestVersion = data.version;
    console.log("Version105", latestVersion);
    // Compare the current version with the latest version
    if (latestVersion !== CURRENT_VERSION) {
      // Display a notification to notify the user to reload the page
      self.registration.showNotification("New Build Available", {
        body: "A new version of the application is available. Please reload the page to apply the latest changes.",
      });
    }
  } catch (error) {
    console.error("Error checking for updates:", error);
  }
}

// Event listener for push events
self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.text() : "Default push notification";

  event.waitUntil(
    self.registration.showNotification("Push Notification", {
      body: payload,
    })
  );
});

// Event listener for notification click events
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Add logic here to handle what happens when the user clicks the notification
  // For example, you can open a specific URL

  event.waitUntil(clients.openWindow(process.env.PUBLIC_URL));
});
