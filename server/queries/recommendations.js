const { driver } = require("../config/db");

async function getJobRoles() {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (j:JobRole)
      RETURN
        j.id AS id,
        j.title AS title,
        j.description AS description
      ORDER BY j.title
    `);

    return result.records.map((record) => ({
      id: record.get("id"),
      title: record.get("title"),
      description: record.get("description"),
    }));
  } finally {
    await session.close();
  }
}


async function getSkills() {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (s:Skill)
      RETURN
        s.id AS id,
        s.name AS name,
        s.category AS category
      ORDER BY s.name
    `);

    return result.records.map((record) => ({
      id: record.get("id"),
      name: record.get("name"),
      category: record.get("category"),
    }));
  } finally {
    await session.close();
  }
}


async function getMissingSkills(jobId, userSkills) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (j:JobRole {id: $jobId})-[:REQUIRES]->(s:Skill)
      WHERE NOT s.id IN $userSkills
      RETURN
        s.id AS id,
        s.name AS name,
        s.category AS category
      ORDER BY s.name
      `,
      {
        jobId,
        userSkills,
      }
    );

    return result.records.map((record) => ({
      id: record.get("id"),
      name: record.get("name"),
      category: record.get("category"),
    }));
  } finally {
    await session.close();
  }
}


async function getMatchPercentage(jobId, userSkills) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (j:JobRole {id: $jobId})-[:REQUIRES]->(s:Skill)

      WITH
        count(s) AS totalSkills,
        count(CASE
          WHEN s.id IN $userSkills THEN 1
        END) AS matchingSkills

      RETURN
        totalSkills,
        matchingSkills,
        CASE
          WHEN totalSkills = 0 THEN 0
          ELSE round(toFloat(matchingSkills) / totalSkills * 100)
        END AS percentage
      `,
      {
        jobId,
        userSkills,
      }
    );

    const record = result.records[0];

    // Handle both Neo4j Integer objects and regular JavaScript numbers
    const toSafeNumber = (value) => {
      return value && typeof value.toNumber === 'function' ? value.toNumber() : value;
    };

    return {
      totalSkills: toSafeNumber(record.get("totalSkills")),
      matchingSkills: toSafeNumber(record.get("matchingSkills")),
      percentage: toSafeNumber(record.get("percentage")),
    };
  } finally {
    await session.close();
  }
}


async function getRecommendedSkills(userSkills) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (current:Skill)-[:RELATED_TO]->(recommended:Skill)

      WHERE current.id IN $userSkills
        AND NOT recommended.id IN $userSkills

      MATCH (job:JobRole)-[:REQUIRES]->(recommended)

      RETURN
        recommended.id AS id,
        recommended.name AS name,
        recommended.category AS category,
        collect(DISTINCT job.title) AS usefulFor

      ORDER BY size(usefulFor) DESC
      LIMIT 10
      `,
      {
        userSkills,
      }
    );

    return result.records.map((record) => ({
      id: record.get("id"),
      name: record.get("name"),
      category: record.get("category"),
      usefulFor: record.get("usefulFor"),
    }));
  } finally {
    await session.close();
  }
}


async function getRecommendedCourses(jobId, userSkills) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (job:JobRole {id: $jobId})-[:REQUIRES]->(skill:Skill)

      WHERE NOT skill.id IN $userSkills

      MATCH (course:Course)-[:TEACHES]->(skill)

      RETURN
        course.id AS id,
        course.title AS title,
        course.provider AS provider,
        collect(DISTINCT skill.name) AS skills

      ORDER BY size(skills) DESC
      LIMIT 10
      `,
      {
        jobId,
        userSkills,
      }
    );

    return result.records.map((record) => ({
      id: record.get("id"),
      title: record.get("title"),
      provider: record.get("provider"),
      skills: record.get("skills"),
    }));
  } finally {
    await session.close();
  }
}


async function getRecommendedProjects(jobId) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (job:JobRole {id: $jobId})-[:REQUIRES]->(skill:Skill)

      MATCH (project:Project)-[:USES]->(skill)

      RETURN
        project.id AS id,
        project.title AS title,
        project.difficulty AS difficulty,
        collect(DISTINCT skill.name) AS skills

      ORDER BY size(skills) DESC
      LIMIT 10
      `,
      {
        jobId,
      }
    );

    return result.records.map((record) => ({
      id: record.get("id"),
      title: record.get("title"),
      difficulty: record.get("difficulty"),
      skills: record.get("skills"),
    }));
  } finally {
    await session.close();
  }
}


module.exports = {
  getJobRoles,
  getSkills,
  getMissingSkills,
  getMatchPercentage,
  getRecommendedSkills,
  getRecommendedCourses,
  getRecommendedProjects,
};