import {makeAutoObservable} from "mobx";
import React, {FunctionComponent} from "react";
import {storeOf} from "./models/Store";

const store = makeAutoObservable(storeOf())
const StoreContext = React.createContext(store)
export const StoreProvider: FunctionComponent = ({children}) =>
    <StoreContext.Provider value={store}>
        {children}
    </StoreContext.Provider>
export const useStore = () => React.useContext(StoreContext)

