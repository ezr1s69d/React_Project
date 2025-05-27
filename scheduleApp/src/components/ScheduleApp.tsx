import { ScheduleProvider } from "./ScheduleContext";
import ScheduleLayout from "./ScheduleLayout";

function ScheduleApp() {
  return (
    <ScheduleProvider>
      <ScheduleLayout />
    </ScheduleProvider>
  );
}

export default ScheduleApp;
