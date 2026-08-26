require("dotenv").config();

const { driver } = require("../config/db");

async function seedDatabase() {
  const session = driver.session();

  try {
    console.log("Clearing existing database...");

    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `);

    console.log("Creating skills...");

    await session.run(`
      CREATE
        (:Skill {id: "javascript", name: "JavaScript", category: "Programming"}),
        (:Skill {id: "react", name: "React", category: "Frontend"}),
        (:Skill {id: "nodejs", name: "Node.js", category: "Backend"}),
        (:Skill {id: "express", name: "Express.js", category: "Backend"}),
        (:Skill {id: "python", name: "Python", category: "Programming"}),
        (:Skill {id: "sql", name: "SQL", category: "Database"}),
        (:Skill {id: "mongodb", name: "MongoDB", category: "Database"}),
        (:Skill {id: "git", name: "Git", category: "Tools"}),
        (:Skill {id: "aws", name: "AWS", category: "Cloud"}),
        (:Skill {id: "docker", name: "Docker", category: "DevOps"}),
        (:Skill {id: "machine-learning", name: "Machine Learning", category: "AI"}),
        (:Skill {id: "statistics", name: "Statistics", category: "Mathematics"}),
        (:Skill {id: "pandas", name: "Pandas", category: "Data Science"}),
        (:Skill {id: "scikit-learn", name: "Scikit-learn", category: "Machine Learning"}),
        (:Skill {id: "tensorflow", name: "TensorFlow", category: "Deep Learning"})
    `);

    console.log("Creating job roles...");

    await session.run(`
      CREATE
        (:JobRole {
          id: "software-engineer",
          title: "Software Engineer",
          description: "Build and maintain software applications."
        }),

        (:JobRole {
          id: "frontend-developer",
          title: "Frontend Developer",
          description: "Build modern web interfaces."
        }),

        (:JobRole {
          id: "backend-developer",
          title: "Backend Developer",
          description: "Build APIs and backend systems."
        }),

        (:JobRole {
          id: "data-scientist",
          title: "Data Scientist",
          description: "Analyze data and build predictive models."
        }),

        (:JobRole {
          id: "ml-engineer",
          title: "Machine Learning Engineer",
          description: "Build and deploy machine learning systems."
        }),

        (:JobRole {
          id: "devops-engineer",
          title: "DevOps Engineer",
          description: "Automate infrastructure and deployment."
        })
    `);

    console.log("Creating courses...");

    await session.run(`
      CREATE
        (:Course {
          id: "react-course",
          title: "Modern React Development",
          provider: "CareerGraph Academy"
        }),

        (:Course {
          id: "node-course",
          title: "Node.js Backend Development",
          provider: "CareerGraph Academy"
        }),

        (:Course {
          id: "python-course",
          title: "Python Programming Fundamentals",
          provider: "CareerGraph Academy"
        }),

        (:Course {
          id: "ml-course",
          title: "Machine Learning Fundamentals",
          provider: "CareerGraph Academy"
        }),

        (:Course {
          id: "statistics-course",
          title: "Statistics for Data Science",
          provider: "CareerGraph Academy"
        }),

        (:Course {
          id: "aws-course",
          title: "AWS Cloud Fundamentals",
          provider: "CareerGraph Academy"
        }),

        (:Course {
          id: "docker-course",
          title: "Docker & Containers",
          provider: "CareerGraph Academy"
        })
    `);

    console.log("Creating projects...");

    await session.run(`
      CREATE
        (:Project {
          id: "ecommerce",
          title: "E-Commerce Platform",
          difficulty: "Intermediate"
        }),

        (:Project {
          id: "task-manager",
          title: "Task Management App",
          difficulty: "Beginner"
        }),

        (:Project {
          id: "churn-prediction",
          title: "Customer Churn Prediction",
          difficulty: "Intermediate"
        }),

        (:Project {
          id: "recommendation-system",
          title: "Movie Recommendation System",
          difficulty: "Advanced"
        }),

        (:Project {
          id: "cloud-deployment",
          title: "Cloud Deployment Pipeline",
          difficulty: "Advanced"
        })
    `);

    console.log("Creating relationships...");

    // Job -> Skills
    await session.run(`
      MATCH
        (software:JobRole {id: "software-engineer"}),
        (javascript:Skill {id: "javascript"}),
        (git:Skill {id: "git"}),
        (sql:Skill {id: "sql"}),
        (node:Skill {id: "nodejs"})
      CREATE
        (software)-[:REQUIRES]->(javascript),
        (software)-[:REQUIRES]->(git),
        (software)-[:REQUIRES]->(sql),
        (software)-[:REQUIRES]->(node)
    `);

    await session.run(`
      MATCH
        (frontend:JobRole {id: "frontend-developer"}),
        (javascript:Skill {id: "javascript"}),
        (react:Skill {id: "react"}),
        (git:Skill {id: "git"})
      CREATE
        (frontend)-[:REQUIRES]->(javascript),
        (frontend)-[:REQUIRES]->(react),
        (frontend)-[:REQUIRES]->(git)
    `);

    await session.run(`
      MATCH
        (backend:JobRole {id: "backend-developer"}),
        (node:Skill {id: "nodejs"}),
        (express:Skill {id: "express"}),
        (sql:Skill {id: "sql"}),
        (git:Skill {id: "git"}),
        (docker:Skill {id: "docker"})
      CREATE
        (backend)-[:REQUIRES]->(node),
        (backend)-[:REQUIRES]->(express),
        (backend)-[:REQUIRES]->(sql),
        (backend)-[:REQUIRES]->(git),
        (backend)-[:REQUIRES]->(docker)
    `);

    await session.run(`
      MATCH
        (data:JobRole {id: "data-scientist"}),
        (python:Skill {id: "python"}),
        (sql:Skill {id: "sql"}),
        (statistics:Skill {id: "statistics"}),
        (pandas:Skill {id: "pandas"}),
        (ml:Skill {id: "machine-learning"})
      CREATE
        (data)-[:REQUIRES]->(python),
        (data)-[:REQUIRES]->(sql),
        (data)-[:REQUIRES]->(statistics),
        (data)-[:REQUIRES]->(pandas),
        (data)-[:REQUIRES]->(ml)
    `);

    await session.run(`
      MATCH
        (mljob:JobRole {id: "ml-engineer"}),
        (python:Skill {id: "python"}),
        (statistics:Skill {id: "statistics"}),
        (ml:Skill {id: "machine-learning"}),
        (scikit:Skill {id: "scikit-learn"}),
        (tensorflow:Skill {id: "tensorflow"}),
        (docker:Skill {id: "docker"})
      CREATE
        (mljob)-[:REQUIRES]->(python),
        (mljob)-[:REQUIRES]->(statistics),
        (mljob)-[:REQUIRES]->(ml),
        (mljob)-[:REQUIRES]->(scikit),
        (mljob)-[:REQUIRES]->(tensorflow),
        (mljob)-[:REQUIRES]->(docker)
    `);

    await session.run(`
      MATCH
        (devops:JobRole {id: "devops-engineer"}),
        (aws:Skill {id: "aws"}),
        (docker:Skill {id: "docker"}),
        (git:Skill {id: "git"})
      CREATE
        (devops)-[:REQUIRES]->(aws),
        (devops)-[:REQUIRES]->(docker),
        (devops)-[:REQUIRES]->(git)
    `);

    // Skill relationships
    await session.run(`
      MATCH
        (python:Skill {id: "python"}),
        (ml:Skill {id: "machine-learning"}),
        (statistics:Skill {id: "statistics"}),
        (pandas:Skill {id: "pandas"}),
        (scikit:Skill {id: "scikit-learn"}),
        (tensorflow:Skill {id: "tensorflow"})
      CREATE
        (python)-[:RELATED_TO]->(ml),
        (python)-[:RELATED_TO]->(pandas),
        (statistics)-[:RELATED_TO]->(ml),
        (pandas)-[:RELATED_TO]->(ml),
        (ml)-[:RELATED_TO]->(scikit),
        (ml)-[:RELATED_TO]->(tensorflow)
    `);

    await session.run(`
      MATCH
        (javascript:Skill {id: "javascript"}),
        (react:Skill {id: "react"}),
        (node:Skill {id: "nodejs"}),
        (express:Skill {id: "express"}),
        (mongodb:Skill {id: "mongodb"})
      CREATE
        (javascript)-[:RELATED_TO]->(react),
        (javascript)-[:RELATED_TO]->(node),
        (node)-[:RELATED_TO]->(express),
        (node)-[:RELATED_TO]->(mongodb)
    `);

    // Courses -> Skills
    await session.run(`
      MATCH
        (reactCourse:Course {id: "react-course"}),
        (react:Skill {id: "react"})
      CREATE
        (reactCourse)-[:TEACHES]->(react)
    `);

    await session.run(`
      MATCH
        (nodeCourse:Course {id: "node-course"}),
        (node:Skill {id: "nodejs"}),
        (express:Skill {id: "express"})
      CREATE
        (nodeCourse)-[:TEACHES]->(node),
        (nodeCourse)-[:TEACHES]->(express)
    `);

    await session.run(`
      MATCH
        (pythonCourse:Course {id: "python-course"}),
        (python:Skill {id: "python"})
      CREATE
        (pythonCourse)-[:TEACHES]->(python)
    `);

    await session.run(`
      MATCH
        (mlCourse:Course {id: "ml-course"}),
        (ml:Skill {id: "machine-learning"}),
        (scikit:Skill {id: "scikit-learn"})
      CREATE
        (mlCourse)-[:TEACHES]->(ml),
        (mlCourse)-[:TEACHES]->(scikit)
    `);

    await session.run(`
      MATCH
        (statsCourse:Course {id: "statistics-course"}),
        (statistics:Skill {id: "statistics"})
      CREATE
        (statsCourse)-[:TEACHES]->(statistics)
    `);

    await session.run(`
      MATCH
        (awsCourse:Course {id: "aws-course"}),
        (aws:Skill {id: "aws"})
      CREATE
        (awsCourse)-[:TEACHES]->(aws)
    `);

    await session.run(`
      MATCH
        (dockerCourse:Course {id: "docker-course"}),
        (docker:Skill {id: "docker"})
      CREATE
        (dockerCourse)-[:TEACHES]->(docker)
    `);

    // Projects -> Skills
    await session.run(`
      MATCH
        (project:Project {id: "ecommerce"}),
        (react:Skill {id: "react"}),
        (node:Skill {id: "nodejs"}),
        (sql:Skill {id: "sql"})
      CREATE
        (project)-[:USES]->(react),
        (project)-[:USES]->(node),
        (project)-[:USES]->(sql)
    `);

    await session.run(`
      MATCH
        (project:Project {id: "task-manager"}),
        (react:Skill {id: "react"}),
        (node:Skill {id: "nodejs"})
      CREATE
        (project)-[:USES]->(react),
        (project)-[:USES]->(node)
    `);

    await session.run(`
      MATCH
        (project:Project {id: "churn-prediction"}),
        (python:Skill {id: "python"}),
        (pandas:Skill {id: "pandas"}),
        (ml:Skill {id: "machine-learning"})
      CREATE
        (project)-[:USES]->(python),
        (project)-[:USES]->(pandas),
        (project)-[:USES]->(ml)
    `);

    await session.run(`
      MATCH
        (project:Project {id: "recommendation-system"}),
        (python:Skill {id: "python"}),
        (ml:Skill {id: "machine-learning"}),
        (scikit:Skill {id: "scikit-learn"})
      CREATE
        (project)-[:USES]->(python),
        (project)-[:USES]->(ml),
        (project)-[:USES]->(scikit)
    `);

    await session.run(`
      MATCH
        (project:Project {id: "cloud-deployment"}),
        (aws:Skill {id: "aws"}),
        (docker:Skill {id: "docker"}),
        (git:Skill {id: "git"})
      CREATE
        (project)-[:USES]->(aws),
        (project)-[:USES]->(docker),
        (project)-[:USES]->(git)
    `);

    console.log("Creating demo user...");

    await session.run(`
      CREATE (u:User {
        id: "demo-user",
        name: "Demo User"
      })
    `);

   const query = `
  MATCH
    (u:User {id: "demo-user"}),
    (python:Skill {id: "python"}),
    (sql:Skill {id: "sql"}),
    (git:Skill {id: "git"}),
    (mlJob:JobRole {id: "ml-engineer"})
  CREATE
    (u)-[:HAS_SKILL]->(python),
    (u)-[:HAS_SKILL]->(sql),
    (u)-[:HAS_SKILL]->(git),
    (u)-[:TARGETS]->(mlJob)
`;
    console.log("✅ Database seeded successfully!");

  } catch (error) {
    console.error("❌ Seeding failed:");
    console.error(error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();