import { useState } from "react";
import { useWorkFlowState } from "./WorkFlowContext";
import TableTitle from "./TableTitle";
import TableHead from "./TableField";
import TableBody from "./TableBody";
import WorkFlowTree from "./WorkFlowTree";
import { findTableById } from "./WorkFlowContext";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function WorkFlowLayout() {
  const state = useWorkFlowState();
  const [searchTerm, setSearchTerm] = useState("");
  const table = findTableById(state.Tables, state.currentTableId);

  // Filter table data based on search term
  const filteredTable = table ? {
    ...table,
    tableData: table.tableData.filter(row => {
      if (row.length === 1) return true; // Always show link rows
      return row.some(cell => 
        cell.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
  } : undefined;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="w-fit max-w-md mx-auto">
            <TableTitle id={table?.id} title={table?.title} />
          </div>
        </div>
        <div className="flex gap-6 h-[calc(100vh-160px)]">
          {/* Sidebar */}
          <div className="w-[280px] bg-gray-800 rounded-2xl shadow-lg p-5">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Workflow Tree</h3>
              <div className="h-px bg-gray-700 w-full"></div>
            </div>
            <WorkFlowTree />
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-gray-800 rounded-2xl shadow-lg p-5">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in table..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl 
                           text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <TableHead field={table?.fields} />
                  <TableBody table={filteredTable} />
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkFlowLayout;


