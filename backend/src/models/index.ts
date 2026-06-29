import Users        from "./user";
import Applications from "./application";
import Candidates   from "./candidate";
import JobPositions from "./jobposition";
import Interviews   from "./interview";
import Recruiters   from "./recruiter";

const Models = {
  Users,
  Candidates,
  JobPositions,
  Applications,
  Interviews,
  Recruiters,
};

// Applications ↔ Interviews
Applications.hasMany(Interviews, { foreignKey: "applicationId", as: "Interviews" });
Interviews.belongsTo(Applications, { foreignKey: "applicationId", as: "Application" });

// Users ↔ Candidates
Candidates.belongsTo(Users, { foreignKey: "userId", as: "User" });
Users.hasOne(Candidates, { foreignKey: "userId", as: "Candidate" });

// Candidates ↔ Applications
Candidates.hasMany(Applications, { foreignKey: "candidateId", as: "Applications" });
Applications.belongsTo(Candidates, { foreignKey: "candidateId", as: "Candidate" });

// JobPositions ↔ Applications
JobPositions.hasMany(Applications, { foreignKey: "jobId", as: "Applications" });
Applications.belongsTo(JobPositions, { foreignKey: "jobId", as: "Job" });

// Candidates ↔ Interviews
Candidates.hasMany(Interviews, { foreignKey: "candidateId", as: "Interviews" });
Interviews.belongsTo(Candidates, { foreignKey: "candidateId", as: "Candidate" });

// Recruiters ↔ Interviews (recruiterId = Recruiters.id)
Recruiters.hasMany(Interviews, { foreignKey: "recruiterId", as: "Interviews" });
Interviews.belongsTo(Recruiters, { foreignKey: "recruiterId", as: "Recruiter" });

// Recruiters ↔ JobPositions (recruiterId = Recruiters.id)
Recruiters.hasMany(JobPositions, { foreignKey: "recruiterId", as: "JobPositions" });
JobPositions.belongsTo(Recruiters, { foreignKey: "recruiterId", as: "Recruiter" });

export default Models;
