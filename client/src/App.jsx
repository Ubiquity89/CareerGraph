
import { useEffect, useState } from "react";
import GraphExplorer from "./components/GraphExplorer";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function App() {
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);

  const [selectedJob, setSelectedJob] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  const [results, setResults] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsResponse, skillsResponse] = await Promise.all([
          fetch(`${API_URL}/jobs`),
          fetch(`${API_URL}/skills`),
        ]);

        if (!jobsResponse.ok || !skillsResponse.ok) {
          throw new Error("Failed to load data");
        }

        const jobsData = await jobsResponse.json();
        const skillsData = await skillsResponse.json();

        setJobs(jobsData);
        setSkills(skillsData);

        if (jobsData.length > 0) {
          setSelectedJob(jobsData[0].id);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to connect to CareerGraph.");
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, []);

  function toggleSkill(skillId) {
    setSelectedSkills((current) => {
      if (current.includes(skillId)) {
        return current.filter((id) => id !== skillId);
      }

      return [...current, skillId];
    });
  }

  async function analyzeCareer() {
    if (!selectedJob) {
      setError("Please select a target role.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: selectedJob,
          skills: selectedSkills,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();

      setResults(data);
    } catch (err) {
      console.error(err);
      setError("Unable to analyze your career path.");
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-xl font-bold text-slate-900">
            CareerGraph
          </div>

          <p className="text-sm text-slate-500 mt-2">
            Loading your career data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}

      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              CareerGraph
            </h1>

            <p className="text-xs text-slate-500">
              Your skills. Your path.
            </p>
          </div>

          <div className="hidden sm:block text-sm text-slate-500">
            Career Intelligence
          </div>

        </div>
      </nav>


      {/* MAIN */}

      <main className="max-w-6xl mx-auto px-6 py-12">

        {!results ? (

          /* =========================
             SETUP SCREEN
             ========================= */

          <div className="max-w-3xl mx-auto">

            {/* HERO */}

            <div className="text-center mb-12">

              <div className="inline-flex px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-5">
                Career path analysis
              </div>

              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                Build your path to
                <span className="text-indigo-600">
                  {" "}your next role.
                </span>
              </h2>

              <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto">
                Tell us what you know and where you want to go.
                We'll show you the skills that connect the two.
              </p>

            </div>


            {/* FORM */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">

              {/* TARGET ROLE */}

              <div className="mb-8">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Target role
                </label>

                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                >

                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}

                </select>

              </div>


              {/* SKILLS */}

              <div>

                <div className="flex items-center justify-between mb-3">

                  <label className="text-sm font-semibold text-slate-700">
                    Your skills
                  </label>

                  <span className="text-xs text-slate-400">
                    {selectedSkills.length} selected
                  </span>

                </div>


                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                  {skills.map((skill) => {

                    const selected =
                      selectedSkills.includes(skill.id);

                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => toggleSkill(skill.id)}
                        className={`text-left p-4 rounded-xl border transition ${
                          selected
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >

                        <div className="flex items-center justify-between">

                          <span className="font-medium text-sm text-slate-800">
                            {skill.name}
                          </span>

                          {selected && (
                            <span className="text-indigo-600 font-bold">
                              ✓
                            </span>
                          )}

                        </div>

                        <span className="text-xs text-slate-400">
                          {skill.category}
                        </span>

                      </button>
                    );
                  })}

                </div>

              </div>


              {/* ERROR */}

              {error && (
                <div className="mt-5 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                  {error}
                </div>
              )}


              {/* ANALYZE BUTTON */}

              <button
                type="button"
                onClick={analyzeCareer}
                disabled={loading}
                className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition"
              >

                {loading
                  ? "Analyzing your path..."
                  : "Analyze My Career Path →"}

              </button>

            </div>

          </div>

        ) : (

          /* =========================
             RESULTS SCREEN
             ========================= */

          <Results
            results={results}
            jobs={jobs}
            selectedJob={selectedJob}
            onBack={() => setResults(null)}
          />

        )}

      </main>

    </div>
  );
}


/* =========================================================
   RESULTS COMPONENT
   ========================================================= */

function Results({
  results,
  jobs,
  selectedJob,
  onBack,
}) {

  const [graph, setGraph] = useState(null);
  const [graphLoading, setGraphLoading] = useState(false);
  const [graphError, setGraphError] = useState("");

  const job = jobs.find(
    (item) => item.id === selectedJob
  );


  /* LOAD GRAPH */

  useEffect(() => {

    async function loadGraph() {

      setGraphLoading(true);
      setGraphError("");

      try {

        const response = await fetch(
          `http://localhost:5000/graph/${selectedJob}`
        );

        if (!response.ok) {
          throw new Error("Failed to load graph");
        }

        const data = await response.json();

        setGraph(data);

      } catch (error) {

        console.error("Graph loading failed:", error);

        setGraphError(
          "Unable to load the career graph."
        );

      } finally {

        setGraphLoading(false);

      }
    }

    if (selectedJob) {
      loadGraph();
    }

  }, [selectedJob]);


  return (
    <div>

      {/* BACK BUTTON */}

      <button
        type="button"
        onClick={onBack}
        className="text-sm text-slate-500 hover:text-slate-900 mb-8 transition"
      >
        ← Change your inputs
      </button>


      {/* HEADER */}

      <div className="mb-10">

        <p className="text-sm text-indigo-600 font-semibold mb-2">
          YOUR CAREER PATH
        </p>

        <h2 className="text-4xl font-bold text-slate-900">
          {job?.title}
        </h2>

        <p className="mt-2 text-slate-500">
          Here's what connects your current skills to your target role.
        </p>

      </div>


      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-5 mb-12">

        <Stat
          label="Match"
          value={`${results.match.percentage}%`}
        />

        <Stat
          label="Skills you have"
          value={results.match.matchingSkills}
        />

        <Stat
          label="Skills to learn"
          value={results.missingSkills.length}
        />

      </div>


      {/* SKILLS TO LEARN */}

      <Section title="Skills to learn">

        {results.missingSkills.length === 0 ? (

          <EmptyState
            message="You already have all the required skills for this role."
          />

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

            {results.missingSkills.map((skill) => (

              <div
                key={skill.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition"
              >

                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  +
                </div>

                <div className="font-semibold text-slate-900">
                  {skill.name}
                </div>

                <div className="text-sm text-slate-400 mt-1">
                  {skill.category}
                </div>

              </div>

            ))}

          </div>

        )}

      </Section>


      {/* RECOMMENDED SKILLS */}

      {results.recommendedSkills?.length > 0 && (

        <Section title="Skills worth exploring">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

            {results.recommendedSkills.map((skill) => (

              <div
                key={skill.id}
                className="bg-white border border-slate-200 rounded-xl p-5"
              >

                <div className="flex items-center justify-between">

                  <h3 className="font-semibold text-slate-900">
                    {skill.name}
                  </h3>

                  <span className="text-indigo-600">
                    →
                  </span>

                </div>

                <p className="text-sm text-slate-400 mt-1">
                  {skill.category}
                </p>

                {skill.usefulFor?.length > 0 && (

                  <div className="mt-4">

                    <p className="text-xs text-slate-400 mb-2">
                      Useful for
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {skill.usefulFor.map((role) => (

                        <span
                          key={role}
                          className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600"
                        >
                          {role}
                        </span>

                      ))}

                    </div>

                  </div>

                )}

              </div>

            ))}

          </div>

        </Section>

      )}


      {/* COURSES */}

      <Section title="Recommended courses">

        {results.courses.length === 0 ? (

          <EmptyState
            message="No course recommendations found."
          />

        ) : (

          <div className="grid md:grid-cols-2 gap-4">

            {results.courses.map((course) => (

              <div
                key={course.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition"
              >

                <div className="text-xs text-indigo-600 font-semibold mb-2">
                  COURSE
                </div>

                <h3 className="font-semibold text-lg text-slate-900">
                  {course.title}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {course.provider}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">

                  {course.skills.map((skill) => (

                    <span
                      key={skill}
                      className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600"
                    >
                      {skill}
                    </span>

                  ))}

                </div>

              </div>

            ))}

          </div>

        )}

      </Section>


      {/* PROJECTS */}

      <Section title="Recommended projects">

        {results.projects.length === 0 ? (

          <EmptyState
            message="No project recommendations found."
          />

        ) : (

          <div className="grid md:grid-cols-3 gap-4">

            {results.projects.map((project) => (

              <div
                key={project.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition"
              >

                <div className="flex items-center justify-between">

                  <span className="text-xs text-slate-400">
                    PROJECT
                  </span>

                  <span className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-500">
                    {project.difficulty}
                  </span>

                </div>

                <h3 className="font-semibold mt-4 text-slate-900">
                  {project.title}
                </h3>

                <div className="flex flex-wrap gap-2 mt-4">

                  {project.skills.map((skill) => (

                    <span
                      key={skill}
                      className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600"
                    >
                      {skill}
                    </span>

                  ))}

                </div>

              </div>

            ))}

          </div>

        )}

      </Section>


      {/* GRAPH */}

      <Section title="Explore the skill graph">

        <div className="mb-4 text-sm text-slate-500">
          See how your target role connects to the skills required for it.
        </div>

        {graphLoading ? (

          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

            <div className="text-slate-900 font-semibold">
              Loading career graph...
            </div>

            <p className="text-sm text-slate-400 mt-2">
              Traversing the connected skill network.
            </p>

          </div>

        ) : graphError ? (

          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-600">
            {graphError}
          </div>

        ) : (

          <GraphExplorer graph={graph} />

        )}

      </Section>


    </div>
  );
}


/* =========================================================
   STAT CARD
   ========================================================= */

function Stat({ label, value }) {

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">

      <div className="text-3xl font-bold text-slate-900">
        {value}
      </div>

      <div className="text-sm text-slate-500 mt-1">
        {label}
      </div>

    </div>
  );
}


/* =========================================================
   SECTION
   ========================================================= */

function Section({ title, children }) {

  return (
    <section className="mb-12">

      <h3 className="text-xl font-bold text-slate-900 mb-5">
        {title}
      </h3>

      {children}

    </section>
  );
}


/* =========================================================
   EMPTY STATE
   ========================================================= */

function EmptyState({ message }) {

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">

      <div className="text-slate-400 text-sm">
        {message}
      </div>

    </div>
  );
}


export default App;
