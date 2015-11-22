/**
 * @param {ClientRect} wrapper
 * @param {ClientRect} handle
 * @param {number} min
 * @param {number} max
 * @param {number} step
 * @returns {{handleOffset: handleOffset, stepFromOffset: stepFromOffset, valueFromOffset: valueFromOffset, handlePositionFromOffset: handlePositionFromOffset}}
 */
export default function create (wrapper, handle, min, max, step) {

    /**
     * @type {number}
     */
    const numSteps    = Math.ceil(((max - min) + step) / step);
    const innerWidth  = wrapper.width - handle.width;
    const segmentSize = innerWidth / (numSteps - 1);

    /**
     * @param {number} step
     * @returns {number}
     */
    const handleOffset = (step) => {
        if (step > (numSteps - 1)) {
            step = numSteps - 1;
        }
        if (step < 0) {
            step = 0;
        }
        return step * segmentSize;
    };

    /**
     * @param {number} offset
     * @returns {number}
     */
    const stepFromOffset = (offset) => {
        const nearest = Math.round((offset - handle.width/2) / segmentSize);
        if (nearest <= 0) {
            return 0;
        }
        if (nearest >= numSteps - 1) {
            return numSteps - 1;
        }
        return nearest;
    };

    /**
     * @param {number} offset
     * @returns {number}
     */
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
