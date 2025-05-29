import { useWorkFlowState } from "./WorkFlowContext";
import TableTitle from "./TableTitle";
import ColumnButton from "./ColumnButton";
import SubmitButton from "./SubmitButton";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import WorkFlowTree from "./WorkFlowTree";
import { findTableById } from "./WorkFlowContext";

function WorkFlowLayout() {
  const state = useWorkFlowState();
  const table = findTableById(state.Tables, state.currentTableId)
  const currentTableTitle = table?.title
  const currentTableFields = table?.fields
  const currentTableData = table?.tableData

  return (
    <div className="p-1 h-screen">
      <div className="mb-4 flex justify-center gap-4">
        <TableTitle title={currentTableTitle} />
        <ColumnButton />
        {/* <SubmitButton handleSubmit={() => {}} /> */}
      </div>
      <div className="flex items-start h-[calc(100vh-100px)]">
        <div className="w-[300px] p-4 overflow-auto border-r h-full">
          <WorkFlowTree />
        </div>
        <div className="flex-1 p-4 overflow-auto h-full">
          <div className="h-full overflow-auto border rounded">
            <table className="border-collapse w-100">
              <TableHead field={currentTableFields} />
              <TableBody table={currentTableData} field={currentTableFields} />
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkFlowLayout;
