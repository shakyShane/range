import {create} from './actions';
import Rx from 'rx';

const $wrapper = document.querySelector('#events');
const $handle  = document.querySelector('#handle');

const wrapper  = $wrapper.getBoundingClientRect();
const handle   = $handle.getBoundingClientRect();
const range    = create(wrapper, handle, 1000);
const initial  = 650;
const handle$  = new Rx.BehaviorSubject(range.handleOffset(initial));

handle$.subscribe(x => $handle.style.left = x + 'px');

const DOM = {
    move: Rx.Observable.fromEvent(document, 'mousemove'),
    down: Rx.Observable.fromEvent($wrapper, 'mousedown'),
    up:   Rx.Observable.fromEvent(document, 'mouseup')
};

const drag$ = DOM.down
    .flatMap(md => {
        return DOM.move
            .pluck('clientX')
            .startWith(md.clientX)
            .takeUntil(DOM.up)
    })
    .map(val => val - wrapper.left)
    .share();

/**
* Track down -> up events
*/

const values$ = DOM.up.withLatestFrom(drag$, (_, left) => range.stepFromOffset(left));

/**
 * Each time there's a 'down' event, add a single 'up' event
 */
const up$ = DOM.down.flatMapLatest(values$.take(1)).share();

/**
 * Active/inactive classes
 */
DOM.down.subscribe(x => $handle.classList.add('active'));
up$.subscribe(x => $handle.classList.remove('active'));

/**
 * Remove active class
 */
up$.distinctUntilChanged().subscribe(x => console.log('Value given', x));


/**
 * Update mouse position
 */
drag$
    .map(range.handlePositionFromOffset)
    .subscribe(handle$);
