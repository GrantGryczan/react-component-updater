import { useState, useEffect } from 'react';

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
const createUpdater = () => {
	let currentState = false;
	
	const updateStates: Array<() => void> = [];
	
	/** Call this to update any hooked components. */
	const update = () => {
		currentState = !currentState;
		for (let i = 0; i < updateStates.length; i++) {
			updateStates[i]();
		}
	};
	
	/** Call this inside any component you want to update. */
	const useUpdater = () => {
		const [, setState] = useState(currentState);
		
		useEffect(() => {
			const updateState = () => {
				setState(currentState);
			};
			
			updateState._index = updateStates.push(updateState) - 1;
			
			return () => {
				// Delete `updateState` from `updateStates` in O(1) by swapping the last item into its place and popping the last item.
				const lastUpdateState = updateStates.pop() as typeof updateState;
				updateStates[updateState._index] = lastUpdateState;
				lastUpdateState._index = updateState._index;
			};
		}, []);
	};
	
	return [useUpdater, update] as const;
};

export default createUpdater;