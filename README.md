# Portview

A desktop app for developers to see which processes are using local ports and kill them — without touching the terminal.

![Portview screenshot](docs/screenshot.png)

## Features

- Live port scanning (macOS via `lsof`, Windows via `netstat`)
- Kill and force-kill processes by port
- Search and filter by port number, process name, PID, or state
- Pinned ports for your most-used dev servers (3000, 5173, 8080, …)
- Auto-refresh at a configurable interval
- Menu bar / system tray for quick access without opening the full window
- Window size and position persistence

## Download

Grab the latest installer from [Releases](https://github.com/tsikatawill/portview/releases):

- **macOS** — `Portview-<version>-universal.dmg`
- **Windows** — `Portview-Setup-<version>.exe`

> macOS: right-click → Open to bypass Gatekeeper on first launch.  
> Windows: click "More info → Run anyway" to bypass SmartScreen.

## Building from source

**Prerequisites:** Node.js ≥ 20, npm

```bash
git clone https://github.com/tsikatawill/portview.git
cd portview
npm install
npm run dev          # start in dev mode
npm run build        # compile
npm run dist         # package installers (output: dist/)
```

## Running tests

```bash
npm test             # run all tests once
npm run test:watch   # watch mode
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[ISC](LICENSE) © William M. Tsikata
