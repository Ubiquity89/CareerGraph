# CareerGraph

CareerGraph is a graph-based career recommendation application that helps users identify the skills needed for their target job role.

Users can select a target role and their existing skills to get:

- Skill match percentage
- Missing skills
- Related skill recommendations
- Recommended courses
- Recommended projects
- Interactive career skill graph

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Flow
- **Backend:** Node.js, Express.js
- **Database:** CognoDB / Neo4j, Cypher
- **Deployment:** Vercel + Render

## Architecture

React Frontend
      ↓
Express REST API
      ↓
Neo4j Driver
      ↓
CognoDB
      ↓
Cypher Queries

Graph Model
JobRole ──REQUIRES──> Skill
Skill ──RELATED_TO──> Skill
Course ──TEACHES──> Skill
Project ──USES──> Skill

The graph database is useful because career recommendations require traversing relationships between jobs, skills, courses, and projects.

Main API
GET  /api/jobs
GET  /api/skills
POST /api/analyze
GET  /api/graph/:jobId
Run Locally

Backend
cd server
npm install
npm run dev

Frontend
cd client
npm install
npm run dev

Create client/.env:

VITE_API_URL=http://localhost:5000/api

Live Demo

Frontend:
https://career-graph-lilac.vercel.app/

Backend:
https://careergraph-6ywd.onrender.com/
