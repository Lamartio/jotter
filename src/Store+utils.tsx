import {makeAutoObservable} from "mobx";
import React, {FunctionComponent} from "react";
import {storeOf} from "./models/Store";

const storeUtils = makeAutoObservable(storeOf())
const StoreContext = React.createContext(storeUtils)
export const StoreProvider: FunctionComponent = ({children}) =>
    <StoreContext.Provider value={storeUtils}>
        {children}
    </StoreContext.Provider>
export const useStore = () => React.useContext(StoreContext)

