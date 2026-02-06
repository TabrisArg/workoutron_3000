import React, { useEffect, useState } from 'react';
import { WorkoutRoutine } from '../types';

interface DebugMenuProps {
    routine: WorkoutRoutine | null;
}

const DebugMenu: React.FC<DebugMenuProps> = ({ routine }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'd' || e.key === 'D') {
                setIsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed top-20 right-4 z-[9999] max-w-md w-full">
            <div className="bg-black/95 backdrop-blur-xl border border-green-500/50 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-rounded text-green-500 text-2xl">bug_report</span>
                        <h3 className="text-green-500 font-black text-sm uppercase tracking-widest">Debug Menu</h3>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="size-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                    >
                        <span className="material-symbols-rounded text-sm">close</span>
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="text-xs text-gray-400 font-mono">
                        <div className="text-green-400 mb-1">Press 'D' to toggle this menu</div>
                    </div>

                    {routine ? (
                        <div className="space-y-3">
                            <div>
                                <div className="text-xs text-green-400 font-bold mb-1">Equipment Name:</div>
                                <div className="text-xs text-white font-mono bg-black/50 p-2 rounded border border-green-500/20">
                                    {routine.equipmentName}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-green-400 font-bold mb-1">Raw AI Response:</div>
                                <div className="text-xs text-white font-mono bg-black/50 p-3 rounded border border-green-500/20 max-h-96 overflow-y-auto no-scrollbar">
                                    {routine.debugRawResponse ? (
                                        <pre className="whitespace-pre-wrap break-words">
                                            {JSON.stringify(JSON.parse(routine.debugRawResponse), null, 2)}
                                        </pre>
                                    ) : (
                                        <span className="text-red-400">No debug data available</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-green-400 font-bold mb-1">Exercise Count:</div>
                                <div className="text-xs text-white font-mono bg-black/50 p-2 rounded border border-green-500/20">
                                    {routine.exercises.length} exercises
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-green-400 font-bold mb-1">Language:</div>
                                <div className="text-xs text-white font-mono bg-black/50 p-2 rounded border border-green-500/20">
                                    {routine.generatedLanguage || 'en'}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs text-gray-500 italic">
                            No routine data available. Scan equipment to see debug info.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DebugMenu;
