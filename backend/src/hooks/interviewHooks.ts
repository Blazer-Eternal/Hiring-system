import Applications from "../models/application";

export function attachInterviewHooks(Interviews: any) {
  Interviews.addHook("afterUpdate", async (interview: any) => {
    const ApplicationsModel = interview.sequelize?.models.Applications || Applications;

    if (!ApplicationsModel) return;

    switch (interview.status) {
      case "SCHEDULED":
        await ApplicationsModel.update(
          { status: "INTERVIEW" },
          { where: { id: interview.applicationId } }
        );
        break;

      case "COMPLETED":
        if (interview.rating && interview.rating >= 3) {
          await ApplicationsModel.update(
            { status: "HIRED" },
            { where: { id: interview.applicationId } }
          );
        } else {
          await ApplicationsModel.update(
            { status: "REJECTED" },
            { where: { id: interview.applicationId } }
          );
        }
        break;

      case "CANCELLED":
        await ApplicationsModel.update(
          { status: "UNDER_REVIEW" },
          { where: { id: interview.applicationId } }
        );
        break;
    }
  });
}
