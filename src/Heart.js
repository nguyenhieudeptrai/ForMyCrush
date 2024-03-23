import { useEffect, useRef, useState } from "react"

export const Heart = ({ className, imgs = [] }) => {
    const [index, setIndex] = useState(0);
    const time = useRef(0);

    useEffect(() => {
        clearTimeout(time.current);
        if (index < imgs.length - 1) {
            loop();
        }
    }, [index, imgs]);

    const loop = () => {
        time.current = setTimeout(() => {
            setIndex(p => p + 1);
        }, 50);
    }
    return (<img src={imgs[index]} alt=""
        className={className}
    />)
}