import { Workbox } from "workbox-window";

const register = () => {
  if ("serviceWorker" in navigator) {
    const wb = new Workbox(`${process.env.PUBLIC_URL}/service-worker.js`);

    wb.addEventListener("installed", (event) => {
      if (event.isUpdate) {
        if (confirm("New app is available, click to refresh")) {
          window.location.reload();
        }
        // console.log('Service worker installed for the first time');
      }
    });

    wb.addEventListener("activated", (event) => {
      console.log("Service worker activated");
    });

    wb.register();
  }
};

export { register };
