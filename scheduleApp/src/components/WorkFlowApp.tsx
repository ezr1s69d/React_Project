import { WorkFlowProvider } from "./WorkFlowContext";
import WorkFlowLayout from "./WorkFlowLayout";

function WorkFlowApp() {
  return (
    <WorkFlowProvider>
      <WorkFlowLayout />
    </WorkFlowProvider>
  );
}

export default WorkFlowApp;
