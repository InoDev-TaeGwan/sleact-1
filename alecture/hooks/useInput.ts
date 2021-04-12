import React, {Dispatch, SetStateAction, useCallback, useState} from "react";

const useInput = <T = any>(initialData:T): [T, (e:any) => void, Dispatch<SetStateAction<T>>] => {
    const [value, setvalue] = useState(initialData);
    const handler = useCallback((e) => {
        setvalue(e.target.value)
    },[])
    return [value,handler, setvalue]
}

export default useInput
