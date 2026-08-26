# CareerGraph

A career intelligence platform that helps users analyze their career path by comparing their current skills with desired job roles. Built with React, Express, and Neo4j.

## Features

- **Career Path Analysis**: Compare your skills against job requirements
- **Skill Gap Analysis**: Identify missing skills for your target role
- **Personalized Recommendations**: Get recommended skills, courses, and projects
- **Interactive Graph Visualization**: Explore how skills connect to career paths
- **Smart Recommendations**: AI-powered suggestions based on your current skillset

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- @xyflow/react (for graph visualization)

### Backend
- Node.js
- Express
- Neo4j (CognoDB)
- dotenv for environment management

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Neo4j database (CognoDB)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ubiquity89/CareerGraph.git
cd CareerGraph
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

### Configuration

1. Create environment files:

**Server (server/.env):**
```bash
cp server/.env.example server/.env
```
Edit `server/.env` with your Neo4j credentials:
```
COGNODB_URI=bolt+s://your-cognodb-uri
COGNODB_USER=your-username
COGNODB_PASSWORD=your-password
PORT=5000
```

**Client (client/.env):**
```bash
cp client/.env.example client/.env
```

2. Seed the database:
```bash
cd server
npm run seed
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend development server (in a new terminal):
```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Career Analysis
- `GET /api/jobs` - Get all available job roles
- `GET /api/skills` - Get all available skills
- `POST /api/analyze` - Analyze career path
  - Body: `{ "jobId": "string", "skills": ["string"] }`

### Graph Visualization
- `GET /graph/:jobId` - Get skill graph for a specific job role

## Project Structure

```
careergraph/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx        # Main application
│   │   └── index.css      # Global styles
│   ├── .env.example       # Environment variables template
│   └── package.json
├── server/                # Express backend
│   ├── config/           # Database configuration
│   ├── queries/          # Neo4j queries
│   ├── routes/           # API routes
│   ├── seed/             # Database seeding
│   ├── .env.example      # Environment variables template
│   └── package.json
└── README.md
```

## Development

### Server Scripts
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed the database with sample data

### Client Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.