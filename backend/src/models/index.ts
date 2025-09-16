import Users from "./user"
import Applications from "./application";
import Candidates from "./candidate";
import JobPositions from "./jobposition";
import Interviews from "./interview";


const Models = {
  Users,
  Candidates,
  JobPositions,
  Applications,
  Interviews
}

// An Application can have many Interviews
Applications.hasMany(Interviews, {
  foreignKey: "applicationId",
  as: "Interviews"
});

// An Interview belongs to one Application
Interviews.belongsTo(Applications, {
  foreignKey: "applicationId",
  as: "Application"
});

export default Models;