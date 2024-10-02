import { createContext } from "react";

export enum ModalType {
  DELETE = "DELETE",
  TEMPLATE = "TEMPLATE",
}

export interface ModalState {
  visibility: boolean;
  type: ModalType.DELETE | ModalType.TEMPLATE | null;
  template_updated?: boolean;
  delete_updated?: boolean;
}
export const ModalCtx = createContext<{
  modal_status: ModalState;
  setModalStatus: (modal: ModalState) => void;
}>({
  modal_status: { visibility: false, type: null, template_updated: false, delete_updated: false },
  setModalStatus: (modal: ModalState) => {},
});
