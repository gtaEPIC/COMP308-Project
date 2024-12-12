# Nurse Assistant App

## Overview
The Nurse Assistant App is a web application designed to assist nurses in inputting patient symptoms into a chat interface. The application utilizes AI to analyze the symptoms and generate a list of possible medical conditions, advising patients to seek further medical attention when necessary.

## Features
- Input symptoms through a user-friendly chat interface.
- AI-driven analysis of symptoms to suggest possible medical conditions.
- GraphQL API for efficient data querying and mutation.
- Integration with deep learning models for enhanced accuracy.

## Project Structure
```
nurse-assistant-app
├── src
│   ├── app.ts                # Entry point of the application
│   ├── controllers
│   │   └── index.ts         # Main logic for processing symptoms
│   ├── routes
│   │   └── index.ts         # Route definitions
│   ├── graphql
│   │   ├── resolvers.ts     # GraphQL resolvers for data fetching
│   │   └── schema.ts        # GraphQL schema definition
│   ├── models
│   │   └── index.ts         # Data models and validation
│   ├── services
│   │   └── aiService.ts     # AI processing for symptoms
│   ├── utils
│   │   └── index.ts         # Utility functions
│   └── types
│       └── index.ts         # TypeScript interfaces and types
├── datasets
│   └── medical_conditions.csv # Dataset for medical conditions
├── package.json              # npm configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd nurse-assistant-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Start the application:
   ```
   npm start
   ```
2. Access the application in your web browser at `http://localhost:3000`.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.