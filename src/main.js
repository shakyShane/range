/**
 * First, we need to bring in the actions
 * & RXjs
 */
import create from './range';
import Rx     from 'rx';

/**
 * Then we'll save a reference to only the handle
 * & the main events wrapper
 * @type {Element}
 */
const $wrapper         = document.querySelector('#range');
const $handle          = document.querySelector('#handle');
document.querySelector('#default')
    .addEventListener('change', function (evt) {
        console.log(evt.target.value);
    });
const activateHandle   = () => $handle.classList.add('active');
const deactivateHandle = () => $handle.classList.remove('active');

/**
 * We created an API for the range calculations
 * that accepted width properties. getBoundingClientRect gives
 * us not only those properties, but also the left/top offsets
 * of the element which can often come in handy.
 * @type {ClientRect}
 */
const wrapper  = $wrapper.getBoundingClientRect();
const handle   = $handle.getBoundingClientRect();

/**
 * Now, we create an instance of the range caculator
 * by passing the bonding rect of the wrapper, handle & how many steps
 * we would like
 * @type {wrapper}
 */
const range    = create(wrapper, handle, 100, 200, 1);

/**
 * We need an initial value to start with, which we could read from a
 * data-attribute or other config, but for this lesson we'll just keep
 * it hardcoded at 0
 * @type {number}
 */
const initial  = 50;

/**
 * Next, we need a way to keep track of the handles X position. Whenever
 * that value changes we'll need to update the left: <px>px value
 * of the handle, so we'll use a BehaviorSubject. If we look at the docs
 * a BehaviorSubject should represent a value that changes over time.
 * @type {Rx.BehaviorSubject}
 */
const handle$  = new Rx.BehaviorSubject(range.handleOffset(initial));

/**
 * Now because we have the BehaviorSubject, we can subscribe to it and
 * update the DOM element appropriately
 */
handle$.subscribe(x => $handle.style.left = x + 'px');

/**
 * Next we need to track mouse down, mouse move & mouse up events -
 * although we don't want to be tracking move & up events unless a down
 * event happened. So the flow looks like
 *    -> mousedown on wrapper
 *       -> start listening to mouse move all over the document
 *          -> stop listening when there's finally a mouse up
 * We'll store all three events in a DOM object, just for clarity so that
 * we know for sure we're dealing with DOM events
 * @type {{down: *, move: *, up: *}}
 */
const MOUSE = {
    down: Rx.Observable.fromEvent($wrapper, 'mousedown'),
    move: Rx.Observable.fromEvent(document, 'mousemove'),
    up:   Rx.Observable.fromEvent(document, 'mouseup')
};

/**
 * Now we can start describing, in a declarative fashion, what
 * we would like to happen. So we'll create a variable named drag$
 * that is going to represent a sequence of mouse left positions only.
 *
 * We do that by first taking a mouse down event
 *  -> once a down event has triggered, we then want to begin listening
 *     to mouse movements, so, we return a sequence of move events via flatMap,
 *     plucking out the `clientX` property from each event. We want the mouse
 *     down event to *start* the sequence, but it's actually the values
 *     from the mousemove event that we're interested in sharing, which is why flatMap
 *     here is the perfect fit.
 *
 *     Now, because we'll want to update the handle position immediately (meaning the moment
 *     a mouse down occurs, actually before any movements), we'll start this
 *     sequence with the clientX position of that initial mouse down event.
 *     Finally, because we only want to receive these event whilst the mouse is dragging
 *     (eg: until a single mouse up event occurs), we can say takeUntil(DOM.up) which will end
 *     the sequence the moment a sinlge mouseup event occurs. Rx will also handle removing all event
 *     listeners at this point too, so no need to worry about any of that.
 */
const drag$ = MOUSE.down
    .do()
    .flatMap(md => {
        return MOUSE.move
            .pluck('clientX')
            .startWith(md.clientX)
            .takeUntil(MOUSE.up)
    })
    /**
     * Next, because the slider could be anywhere on the screen,
     * and we only care about the offset inside the slider container,
     * we can simply subtract the left offset of the wrapper, which will give
     * us a value from 0 -> wrapper width
     */
    .map(val => val - wrapper.left);

/**
 * Now we need to update the handle each time our drag$ sequence emits a value.
 * We know that each of these values will be the offset from the left side of the wrapper
 * so we need to translate that offset into the nearest snapping point. We created that
 * functionality previsouly, so we can simply pass the offset left value into our
 * handlePositionFromOffset function and then pump that into our handle$ behaviour
 * subject.
 */
drag$
    .map(left => range.handlePositionFromOffset(left))
    .subscribe(handle$);

/**
 * To finish up we need to solve 2 more problems.
 *
 * Firstly, we want to add a CSS class to the handle whenever
 * dragging begins (to show the user visually that the
 * handle is active) and then remove that class when dragging has ended.
 *
 * Because a hot observable sequence can have many subscribers that all
 * receive the same events, we can add another 1 to activate the handle,
 */
MOUSE.down.subscribe(activateHandle);
/**
 * ... and then a further one that fires once a mouse up has occurred (This is very
 * similar how we setup the drag$ observable)
 */
MOUSE.down.flatMap(MOUSE.up.take(1)).subscribe(deactivateHandle);

/**
 * Finally, we need to actually produce a value that be used.
 */
MOUSE.down.flatMap(MOUSE.up.take(1))
    .withLatestFrom(drag$, (_, left) => range.valueFromOffset(left))
    .do((x) => console.log('Value emitted', x))
    .subscribe();


