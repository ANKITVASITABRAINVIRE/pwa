import { Workbox } from "workbox-window";

const promptForUpdate = () => {
  return new Promise((resolve) => {
    const confirmation = window.confirm(
      "New update available. Do you want to update?"
    );
    resolve(confirmation);
  });
};

const register = () => {
  if ("serviceWorker" in navigator) {
    const wb = new Workbox(`${process.env.PUBLIC_URL}/service-worker.js`);

    const showSkipWaitingPrompt = async (event) => {
      // Assuming the user accepted the update, set up a listener
      // that will reload the page as soon as the previously waiting
      // service worker has taken control.
      wb.addEventListener("controlling", () => {
        // At this point, reloading will ensure that the current
        // tab is loaded under the control of the new service worker.
        // Depending on your web app, you may want to auto-save or
        // persist transient state before triggering the reload.
        window.location.reload();
      });

      // When `event.wasWaitingBeforeRegister` is true, a previously
      // updated service worker is still waiting.
      // You may want to customize the UI prompt accordingly.

      // This code assumes your app has a promptForUpdate() method,
      // which returns true if the user wants to update.
      // Implementing this is app-specific; some examples are:
      // https://open-ui.org/components/alert.research or
      // https://open-ui.org/components/toast.research
      const updateAccepted = await promptForUpdate();

      if (updateAccepted) {
        wb.messageSkipWaiting();
      }
    };

    // Add an event listener to detect when the registered
    // service worker has installed but is waiting to activate.
    wb.addEventListener("waiting", (event) => {
      showSkipWaitingPrompt(event);
    });

    wb.addEventListener("installed", (event) => {
      if (!event.isUpdate) {
        console.log("Service worker installed for the first time");
      }
    });

    wb.addEventListener("activated", (event) => {
      console.log("Service worker activated");
    });

    wb.register();
  }
};

export { register };
