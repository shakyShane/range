export default function create (box, handle, min, max, step) {

    const ceil  = Math.ceil(((max - min) + step) / step);
    const inner = box.width - handle.width;
    const seg   = inner / (ceil - 1);

    /**
     * @param step
     * @returns {string}
     */
    const handleOffset = (step) => {
        if (step > (ceil - 1)) step = ceil - 1;
        if (step < 0) step = 0;
        return String(step * seg);
    };

    /**
     * @param offset
     * @returns {number}
     */
    const stepFromOffset = (offset) => {
        const nearest = Math.round((offset - handle.width/2) / seg);
        if (nearest <= 0) {
            return 0;
        }
        if (nearest >= ceil - 1) {
            return ceil - 1;
        }
        return nearest;
    };

    const valueFromOffset = (offset) => {
        const nearest = stepFromOffset(offset);
        return min + (nearest * step);
    };

    return {
        handleOffset,
        stepFromOffset,
        valueFromOffset,
        handlePositionFromOffset: (offset) => handleOffset(stepFromOffset(offset))
    };
}
