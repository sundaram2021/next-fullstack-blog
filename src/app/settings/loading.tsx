import React, { FC } from "react";
import { VscLoading } from 'react-icons/vsc'

interface IProps {};

const Loading:FC<IProps> = (props) => {
    return <div className="flex justify-center items-center h-[70vh] w-[100vw]">
        <button disabled className="flex justify-center items-center">
            <VscLoading className="animate-spin text-5xl duration-50" />
        </button>
    </div>
};

export default Loading;