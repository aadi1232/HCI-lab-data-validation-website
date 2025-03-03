# HCI Lab - Hand Sign Validation Website

A web application for validating hand sign detection data for the HCI lab. This platform allows users to view videos of hand signs and validate the correct sign being performed.

## Project Structure

The project consists of two main parts:

1. **Server**: A Node.js/Express backend that serves the API and static files
2. **Client**: A React frontend built with TypeScript and Vite

## Features

- User authentication with hardcoded accounts
- Video playback of hand signs
- Selection of correct hand sign from a list of options
- Progress tracking for each user
- Local storage of validation results

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd HCI-lab-website
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd ../client
   npm install
   ```

### Video Setup

1. Place your hand sign videos in the `server/videos` directory
2. Update the `server/data/videos.json` file to match your video filenames
3. Update the `server/data/handsigns.json` file with your list of hand signs

### Running the Application

1. Start the server:
   ```
   cd server
   npm run dev
   ```

2. Start the client:
   ```
   cd ../client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

### Test Accounts

The application comes with 4 hardcoded user accounts:

- Username: user1, Password: password1
- Username: user2, Password: password2
- Username: user3, Password: password3
- Username: user4, Password: password4

## Data Storage

All validation data is stored locally in JSON files:

- Hand signs list: `server/data/handsigns.json`
- Videos list: `server/data/videos.json`
- Validation results: `server/data/results/user_[id]_results.json`

## Development

### Server

The server is built with Express and provides the following endpoints:

- `POST /api/login`: Authenticate a user
- `GET /api/handsigns`: Get the list of hand signs
- `GET /api/videos`: Get the list of videos for validation
- `POST /api/submit`: Submit a validation result
- `GET /api/progress/:userId`: Get a user's validation progress

### Client

The client is built with React and TypeScript, using the following main components:

- `App`: Main application component with routing
- `Login`: User authentication component
- `ValidationPage`: Main validation interface
- `ProgressBar`: Shows validation progress

## License

This project is licensed under the MIT License. 