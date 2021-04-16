import { useState, useEffect } from 'react';

export type UpdaterHook = () => void;
export type UpdaterFunction = () => void;
export type Updater = readonly [UpdaterHook, UpdaterFunction];

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

	const updateStates: Array<() => void> = [];

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

		useEffect(() => {
			const updateState = () => {
				setState(currentState);
			};

			updateState._index = updateStates.push(updateState) - 1;

			return () => {
				// Delete `updateState` from `updateStates` in O(1) by popping the last item and swapping it into this item's place (unless this item is the popped item).
				const lastUpdateState = updateStates.pop() as typeof updateState;
				if (lastUpdateState !== updateState) {
					updateStates[updateState._index] = lastUpdateState;
					lastUpdateState._index = updateState._index;
				}
			};
		}, []);
	};

	return [useUpdater, update] as const;
};

export default createUpdater;