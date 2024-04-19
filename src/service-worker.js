/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from "workbox-precaching";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { registerRoute } from "workbox-routing";

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

// Listen for a message from the main thread to indicate new changes
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "NEW_CHANGES") {
    // Display an alert to notify the user to reload the page
    self.registration.showNotification("New Changes Available", {
      body: "Please reload the page to apply the latest changes.",
    });
  }
});

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
  if (caches) {
    // Service worker cache should be cleared with caches.delete()
    caches.keys().then(function (names) {
      for (let name of names) caches.delete(name);
    });
    console.log("reload from cache buster ....");
  }
  event.waitUntil(clients.openWindow(process.env.PUBLIC_URL));
});
