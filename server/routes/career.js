const express = require("express");
const router = express.Router();

const {
  getJobRoles,
  getSkills,
  getMatchPercentage,
  getMissingSkills,
  getRecommendedSkills,
  getRecommendedCourses,
  getRecommendedProjects,
} = require("../queries/recommendations");

// GET /api/jobs - Get all job roles
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await getJobRoles();
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch job roles",
    });
  }
});

// GET /api/skills - Get all skills
router.get("/skills", async (req, res) => {
  try {
    const skills = await getSkills();
    res.json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch skills",
    });
  }
});

router.post("/analyze", async (req, res) => {
  try {
    const { jobId, skills } = req.body;

    if (!jobId || !Array.isArray(skills)) {
      return res.status(400).json({
        error: "jobId and skills are required",
      });
    }

    const [
      match,
      missingSkills,
      recommendedSkills,
      courses,
      projects,
    ] = await Promise.all([
      getMatchPercentage(jobId, skills),
      getMissingSkills(jobId, skills),
      getRecommendedSkills(skills),
      getRecommendedCourses(jobId, skills),
      getRecommendedProjects(jobId),
    ]);

    res.json({
      match,
      missingSkills,
      recommendedSkills,
      courses,
      projects,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to analyze career path",
    });
  }
});
module.exports = router;