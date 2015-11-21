export default function create (box, handle, steps) {

    const inner = box.width - handle.width;
    const seg   = inner / (steps - 1);

    /**
     * @param step
     * @returns {string}
     */
    const handleOffset = (step) => {
        if (step > (steps - 1)) step = steps - 1;
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
        if (nearest >= steps - 1) {
            return steps - 1;
        }
        return nearest;
    };

    return {
        handleOffset,
        stepFromOffset,
        handlePositionFromOffset: (offset) => handleOffset(stepFromOffset(offset))
    };
}
