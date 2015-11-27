/**
 * @param {ClientRect} wrapper
 * @param {ClientRect} handle
 * @param {number} steps
 * @returns {{handleOffset: function, stepFromOffset: function, handlePositionFromOffset: function}}
 */
export default function create (wrapper, handle, steps) {

    const maxStep     = steps - 1;
    const segmentSize = (wrapper.width - handle.width) / (maxStep);

    /**
     * @param step
     * @returns {number}
     */
    const handleOffset = (step) => {
        if (step > (maxStep)) step = maxStep;
        if (step < 0) step = 0;
        return step * segmentSize;
    };

    /**
     * @param offset
     * @returns {number}
     */
    const stepFromOffset = (offset) => {
        const nearest = Math.round((offset - handle.width/2) / segmentSize);

        if (nearest <= 0) return 0;
        if (nearest >= maxStep) return maxStep;
        return nearest;
    };

    return {
        handleOffset,
        stepFromOffset,
        handlePositionFromOffset: (offset) => handleOffset(stepFromOffset(offset))
    };
}
