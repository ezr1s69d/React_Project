import { useScheduleState } from "./ScheduleContext";

const ScheduleTree = () => {
  const state = useScheduleState();

  const renderTree = (node: typeof state) => (
    <div key={node.id} className="ml-2">
      <div className="cursor-pointer hover:underline">{node.title}</div>
      {node.childTable.map(child => (
        <div className="ml-4">{renderTree(child)}</div>
      ))}
    </div>
  );

  return <div>{renderTree(state)}</div>;
};

export default ScheduleTree;


// export default ScheduleTree;

// function ScheduleTree() {
//     return (
//         <div className="float-left font-bold text-l">
//             ScheduleTree
//         </div>
//     )
// }

// export default ScheduleTree;