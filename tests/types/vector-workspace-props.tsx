// Compile-only regression coverage for standalone and embedded callers.
import { VectorLab } from "../../components/vectors/VectorLab";
import { VectorWorkbench } from "../../components/vectors/VectorWorkbench";

export const workspacePropChecks = (
  <>
    <VectorLab />
    <VectorLab embedded />
    <VectorWorkbench />
    <VectorWorkbench embedded vectorOnly title="Vector Explorer" />
  </>
);
