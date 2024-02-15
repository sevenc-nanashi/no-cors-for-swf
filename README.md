# No CORS for Flash

![Demo](./static/demo.png)
"No CORS for Flash" removes the CORS restriction from all Flash (SWF) files, allowing you to play games and watch videos on websites that have disabled Flash due to the end of support.
This extension is intended for use with the [Ruffle](https://ruffle.rs/) project, which is a Flash Player emulator written in Rust.

## Installation

- Firefox Add-ons: <https://addons.mozilla.org/ja/firefox/addon/no-cors-for-swf/>
- Chrome Web Store: <https://chromewebstore.google.com/detail/no-cors-for-swf/cpnmooclkmhdbbmlidadgmiidombgiab>

## Building

To build the extension, you will need to have Node.js and pnpm installed.

```bash
# Live re-build, for development
pnpm dev

# Build for production
pnpm build
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
