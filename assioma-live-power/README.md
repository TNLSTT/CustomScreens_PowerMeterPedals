# Assioma Live Power

A minimal Web Bluetooth dashboard that connects to a cycling power meter (such as Favero Assioma pedals) and displays live watts.

## 1) Setup instructions

1. Install [Node.js](https://nodejs.org/) (v16+ recommended).
2. Open a terminal in this folder:
   ```bash
   cd assioma-live-power
   ```

## 2) How to run server

Start the local static server:

```bash
npm start
```

Then open:

- <http://localhost:8000>

> Web Bluetooth requires a secure context. `http://localhost` is allowed for local development.

## 3) Browser requirements

- Use a Chromium-based browser with Web Bluetooth support:
  - Google Chrome (recommended)
  - Microsoft Edge
- Bluetooth must be enabled on your computer.
- The page must be opened from `localhost` or HTTPS.

## 4) How to connect Assioma pedals

1. Wake up your pedals by rotating them.
2. Ensure pedals are not connected to another app/device (bike computer, phone app, etc.).
3. On the webpage, click **Connect Assioma Pedals**.
4. In the Bluetooth picker, select your Assioma device.
5. Once connected, live watts should update several times per second.

## 5) Troubleshooting Bluetooth issues

- **No device appears in picker**
  - Wake the pedals again by spinning cranks.
  - Move closer to the pedals.
  - Turn Bluetooth off/on on your computer.
- **Connection fails immediately**
  - Close other apps connected to the pedals (Zwift, TrainerRoad, Garmin/Wahoo apps).
  - Refresh the page and retry.
- **Watts do not update**
  - Reconnect and ensure you selected the power meter, not another BLE sensor.
  - Check browser console for errors.
- **Web Bluetooth unavailable**
  - Confirm you are on Chrome/Edge and using `http://localhost:8000`.
