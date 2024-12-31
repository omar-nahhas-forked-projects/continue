import { ToolCall, ToolCallState } from "core";
import { CreateFile } from "./CreateFile";
import { RunTerminalCommand } from "./RunTerminalCommand";

function FunctionSpecificToolCallDiv({
  toolCall,
  toolCallState,
}: {
  toolCall: ToolCall;
  toolCallState: ToolCallState;
}) {
  const args = toolCallState.parsedArgs;

  switch (toolCall.function.name) {
    case "builtin_create_new_file":
      return (
        <CreateFile
          relativeFilepath={args.filepath}
          fileContents={args.contents}
        />
      );
    case "builtin_run_terminal_command":
      return (
        <RunTerminalCommand
          command={args.command}
          toolCallState={toolCallState}
        />
      );
    default:
      return null;
  }
}

export default FunctionSpecificToolCallDiv;
