import { createPortal } from "react-dom";

function CreatePortal({ children }: any) {
  return createPortal(children, document.getElementById("modal")!);
}

export default CreatePortal;
