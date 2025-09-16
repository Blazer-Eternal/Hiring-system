import { Router } from "express";
import { CandidateController } from "../controllers/candidateControllers";
import { CandidateValidator } from "../../validators";
import { exceptionHandler, Validator } from "../../middleware";

const candidateRoutes = Router();

candidateRoutes.get("/", 
    exceptionHandler(Validator.check(CandidateValidator)),
    exceptionHandler(CandidateController.getAllCandidates)
);


candidateRoutes.get("/:id", CandidateController.getCandidateById);
candidateRoutes.post("/", CandidateController.createCandidate);
candidateRoutes.put("/:id", CandidateController.updateCandidate);
candidateRoutes.delete("/:id", CandidateController.deleteCandidate);

export default candidateRoutes;