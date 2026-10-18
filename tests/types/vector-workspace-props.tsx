// Compile-only regression coverage. Checked by npm run typecheck and next build.
import { VectorLab } from "../../components/vectors/VectorLab";
import { VectorWorkbench } from "../../components/vectors/VectorWorkbench";

export const workspacePropChecks = (
  <>
    <VectorLab />
    <VectorLab embedded />
    <VectorLab embedded={false} />
    <VectorWorkbench />
    <VectorWorkbench embedded vectorOnly title="Vector Explorer" />
    <VectorWorkbench embedded={false} vectorOnly={false} />
  </>
);
