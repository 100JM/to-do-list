import { ReactNode } from "react";

interface DialogContentsDivInterface {
    children: ReactNode
}

const DialogContentsDiv:React.FC<DialogContentsDivInterface> = ({children}) => {

    return (
        <div className="border-gray-300 border-b py-2 text-sm sm:text-base">
            {children}
        </div>
    )
}

export default DialogContentsDiv;