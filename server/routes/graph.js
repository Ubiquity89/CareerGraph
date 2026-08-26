const express = require("express");
const { driver } = require("../config/db");

const router = express.Router();

router.get("/graph/:jobId", async (req, res) => {
  const session = driver.session();

  try {
    const { jobId } = req.params;

    const result = await session.run(
      `
      MATCH (job:JobRole {id: $jobId})-[:REQUIRES]->(skill:Skill)
      OPTIONAL MATCH (skill)-[:RELATED_TO]->(related:Skill)

      RETURN
        job,
        collect(DISTINCT skill) AS skills,
        collect(DISTINCT related) AS relatedSkills
      `,
      { jobId }
    );

    if (result.records.length === 0) {
      return res.status(404).json({
        error: "Job role not found",
      });
    }

    const record = result.records[0];

    const job = record.get("job");
    const skills = record.get("skills");
    const relatedSkills = record.get("relatedSkills");

    const nodes = [];
    const edges = [];

    nodes.push({
      id: job.properties.id,
      type: "default",
      data: {
        label: job.properties.title,
      },
      position: {
        x: 400,
        y: 50,
      },
    });

    skills.forEach((skill, index) => {
      nodes.push({
        id: skill.properties.id,
        data: {
          label: skill.properties.name,
        },
        position: {
          x: 100 + (index % 3) * 300,
          y: 200 + Math.floor(index / 3) * 150,
        },
      });

      edges.push({
        id: `${job.properties.id}-${skill.properties.id}`,
        source: job.properties.id,
        target: skill.properties.id,
        label: "REQUIRES",
      });
    });

    relatedSkills
      .filter((skill) => skill.properties)
      .forEach((skill, index) => {
        const exists = nodes.some(
          (node) => node.id === skill.properties.id
        );

        if (!exists) {
          nodes.push({
            id: skill.properties.id,
            data: {
              label: skill.properties.name,
            },
            position: {
              x: 150 + (index % 3) * 300,
              y: 500 + Math.floor(index / 3) * 150,
            },
          });
        }
      });

    res.json({
      nodes,
      edges,
    });

  } catch (error) {
    console.error("Graph error:", error);

    res.status(500).json({
      error: "Failed to load graph",
    });

  } finally {
    await session.close();
  }
});

module.exports = router;