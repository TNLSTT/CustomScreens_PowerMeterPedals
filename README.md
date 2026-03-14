# Assioma Live Power

A minimal Web Bluetooth dashboard that connects to a cycling power meter (such as Favero Assioma pedals) and displays live watts.

It also shows rolling average power for the last **1**, **3**, **5**, **10**, and **20** minutes, plus rolling average heart rate and watts per heart rate over those same windows.

It also includes ride programming by target kilojoules (kJ), a ride recording control that hides once active, auto-reconnect attempts if pedals/heart rate disconnect, estimated breathing metrics (breaths/min and breaths per kJ), plus a 135 BPM guidance panel that suggests target watts from recent 5-minute response and ride-remaining work.

The Power Phase Explorer now includes an **Instant Pedal Feed** log so each incoming pedal packet is shown live with timestamp, power/cadence/HR, and left/right phase ranges.

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

## 5) How to connect a heart rate monitor

1. Ensure your heart rate monitor is awake (wear it or activate it as required by the manufacturer).
2. Ensure it is not already connected to another app/device.
3. Click **Connect Heart Rate Monitor**.
4. In the Bluetooth picker, choose your heart rate monitor.
5. Once connected, live BPM plus 3/5/10-minute rolling averages and watts-per-heart-rate values will populate.

## 6) Troubleshooting Bluetooth issues

- **No device appears in picker**
  - Wake the pedals/heart rate monitor again.
  - Move closer to the sensor.
  - Turn Bluetooth off/on on your computer.
- **Connection fails immediately**
  - Close other apps connected to the sensors (Zwift, TrainerRoad, Garmin/Wahoo apps).
  - Refresh the page and retry.
- **Watts or BPM do not update**
  - Reconnect and ensure you selected the expected BLE sensor.
  - Check browser console for errors.
- **Web Bluetooth unavailable**
  - Confirm you are on Chrome/Edge and using `http://localhost:8000`.
