import { useState, useRef, useEffect } from 'react';

export type UpdaterHook = () => void;
export type UpdaterFunction = () => void;
export type Updater = readonly [UpdaterHook, UpdaterFunction];

type UpdateState = (() => void) & {
	/** The index of this function in `updateStates`. */
	_index: number
};

/**
 * Creates a [React component updater](https://github.com/GrantGryczan/react-component-updater#react-component-updater).
 *
 * Usage:
 * ```
 * const [useMyComponentUpdater, updateMyComponent] = createUpdater();
 * ```
 *
 * ```
 * // Call this inside any component you want to update.
 * useMyComponentUpdater();
 * ```
 *
 * ```
 * // Call this to update any hooked components.
 * updateMyComponent();
 * ```
 */
const createUpdater = (): Updater => {
	let currentState = false;

	const updateStates: UpdateState[] = [];

	/** Call this to update any hooked components. */
	const update: UpdaterFunction = () => {
		currentState = !currentState;

		for (let i = 0; i < updateStates.length; i++) {
			updateStates[i]();
		}
	};

	/** Call this inside any component you want to update. */
	const useUpdater: UpdaterHook = () => {
		const [, setState] = useState(currentState);

		const updateStateRef = useRef<UpdateState>();

		// `updateState` must be set synchronously so that `setState` calls are effective even before the component is fully mounted.
		if (!updateStateRef.current) {
			const updateState: UpdateState = () => {
				setState(currentState);
			};

			updateState._index = updateStates.push(updateState) - 1;

			updateStateRef.current = updateState;
		}

		useEffect(() => () => {
			// Delete `updateState` from `updateStates` in O(1) by popping the last item and swapping it into this item's place (unless this item is the popped item).
			const lastUpdateState = updateStates.pop()!;
			if (lastUpdateState !== updateStateRef.current!) {
				updateStates[updateStateRef.current!._index] = lastUpdateState;
				lastUpdateState._index = updateStateRef.current!._index;
			}
		}, []);
	};

	return [useUpdater, update] as const;
};

export default createUpdater;