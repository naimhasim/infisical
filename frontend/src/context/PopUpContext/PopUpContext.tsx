import { createContext, ReactNode, useContext } from "react";

import { usePopUp as usePopUpHook } from "@app/hooks/usePopUp";

interface UsePopUpProps {
  name: Readonly<string>;
  isOpen: boolean;
}

interface PopUpProviderProps {
  popUpNames: Readonly<string[]> | UsePopUpProps[];
  children: ReactNode;
}

export type UsePopUpState<T extends Readonly<string[]> | UsePopUpProps[]> = {
  [P in T extends UsePopUpProps[] ? T[number]["name"] : T[number]]: {
    isOpen: boolean;
    data?: unknown;
  };
};

export interface UsePopUpReturn<T extends Readonly<string[]> | UsePopUpProps[]> {
  popUp: UsePopUpState<T>;
  handlePopUpOpen: (popUpName: keyof UsePopUpState<T>, data?: unknown) => void;
  handlePopUpClose: (popUpName: keyof UsePopUpState<T>) => void;
  handlePopUpToggle: (popUpName: keyof UsePopUpState<T>, state?: boolean) => void;
}

const PopUpContext = createContext<UsePopUpReturn<any>>({} as UsePopUpReturn<any>);

export const usePopUp = () => {
  const ctx = useContext(PopUpContext);
  if (!ctx) {
    throw new Error("usePopUpContext to be used within <PopUpContext.Provider>");
  }

  return ctx;
};

export const PopUpProvider: React.FC<PopUpProviderProps> = ({ popUpNames, children }:PopUpProviderProps) => {
  const popUpState = usePopUpHook(popUpNames);

  return (
    <PopUpContext.Provider value={popUpState}>
      {children}
    </PopUpContext.Provider>
  );
};
