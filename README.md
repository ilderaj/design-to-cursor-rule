# Design to Cursor Rule

A powerful web application that analyzes design images and automatically generates Cursor rules for frontend development. This tool bridges the gap between design and development by extracting design elements from mockups and creating standardized rules that enforce design consistency in your code.

## Features

- **Intuitive Drag & Drop Interface**: Easy upload of design images with real-time visual feedback
- **Advanced Design Analysis**: Extract colors, typography, spacing, and component styles using TensorFlow.js
- **Smart Element Detection**: Automatically identifies UI components, color schemes, and design patterns
- **Cursor Rule Generation**: Creates formatted rules compatible with Cursor's design enforcement system
- **Clipboard Integration**: One-click copy of generated rules for seamless workflow

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **UI Components**: Material UI 7
- **Design Analysis**: TensorFlow.js for image processing
- **File Handling**: react-dropzone for drag & drop functionality
- **Build System**: Parcel for zero-configuration bundling
- **Version Control**: Conventional Commits with automatic CHANGELOG generation

## Installation

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ilderaj/design-to-cursor-rule.git
   cd design-to-cursor-rule
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to the localhost URL shown in your terminal (typically http://localhost:1234)

## Usage Guide

1. **Upload Design**: Drag and drop your design image (PNG, JPG, JPEG, WebP) onto the upload area or click to select a file
2. **Analysis**: The system will automatically analyze the image and extract design elements
3. **Review Elements**: Examine the extracted colors, typography, components, and other design elements
4. **Copy Rule**: Click the "Copy Code" button to copy the generated Cursor rule to your clipboard
5. **Implement**: Paste the rule into your Cursor project settings to enforce consistent design

## Project Structure

```
design-to-cursor-rule/
├── src/
│   ├── components/      # React components
│   ├── services/        # Analysis and rule generation logic
│   ├── utils/           # Helper functions and types
│   └── index.tsx        # Application entry point
├── public/              # Static assets and HTML template
└── ...                  # Configuration files
```

## Development

This project follows strict version management with automatic changelog generation:

- Use `npm run commit` to create properly formatted commit messages
- Run `npm run release` to automatically bump version and update changelog

For more details on the version management system, see [VERSION_MANAGEMENT.md](./VERSION_MANAGEMENT.md).

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using the commit script (`npm run commit`)
4. Push to your branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- TensorFlow.js for image processing capabilities
- React and Material UI for providing the component framework
- The open source community for inspiration and tools
