import { createContext } from "react";

export enum ModalType {
  DELETE = "DELETE",
  TEMPLATE = "TEMPLATE",
}

export interface ModalState {
  visibility: boolean;
  type: ModalType.DELETE | ModalType.TEMPLATE | null;
  updated: boolean;
}
export const ModalCtx = createContext<{
  modal_status: ModalState;
  setModalStatus: (modal: ModalState) => void;
}>({
  modal_status: { visibility: false, type: null, updated: false },
  setModalStatus: (modal: ModalState) => {},
});
