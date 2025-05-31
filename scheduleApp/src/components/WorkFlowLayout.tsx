import { useWorkFlowState } from "./WorkFlowContext";
import TableTitle from "./TableTitle";
import TableHead from "./TableField";
import TableBody from "./TableBody";
import WorkFlowTree from "./WorkFlowTree";
import { findTableById } from "./WorkFlowContext";

function WorkFlowLayout() {
  const state = useWorkFlowState();
  const table = findTableById(state.Tables, state.currentTableId)

  return (
    <div className="p-4 bg-gray-100 h-screen">
      <div className="mb-4">
        <div className="w-fit max-w-md mx-auto">
          <TableTitle id={table?.id} title={table?.title} />
        </div>
      </div>
      <div className="flex h-[calc(100vh-120px)] rounded-lg overflow-hidden shadow-lg">
        <div className="w-[250px] p-4 bg-white border-r">
          <WorkFlowTree />
        </div>
        <div className="flex-1 p-4 bg-white overflow-auto">
          <div className="h-full border rounded-xl shadow-sm bg-white overflow-auto">
            <table className="table-fixed w-full text-left border-collapse">
              <TableHead field={table?.fields} />
              <TableBody table={table} />
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkFlowLayout;


