import React, { useState } from 'react';
import { Action } from '@/utils/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Trash2, Plus, Save } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ShowSuggestAiPlansProps {
    actions: Action[];
}

const ShowSuggestAiPlans: React.FC<ShowSuggestAiPlansProps> = ({ actions }) => {
    const [editableActions, setEditableActions] = useState<Action[]>(actions);

    const handleChange = (index: number, field: keyof Action, value: any) => {
        const updatedActions = [...editableActions];
        updatedActions[index] = { ...updatedActions[index], [field]: value };
        setEditableActions(updatedActions);
    };

    const handleDelete = (index: number) => {
        const updatedActions = [...editableActions];
        updatedActions.splice(index, 1);
        setEditableActions(updatedActions);
    };

    const handleSubmit = async () => {
        try {
            // TODO: Implement action creation API call
            alert('Actions saved successfully!');
        } catch (error) {
            console.error('Error saving actions:', error);
            alert('Failed to save actions.');
        }
    };

    const addNewAction = () => {
        const newAction: Partial<Action> = {
            title: '',
            duration: 30,
            completed: false,
            note: ''
        };
        setEditableActions([...editableActions, newAction as Action]);
    };

    return (
        <ScrollArea className="h-[calc(100vh-340px)]"> 
        <div className="w-full max-w-3xl mx-auto p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-light tracking-tight text-gray-800">Daily Actions</h1>
                    <p className="text-sm text-gray-500">Curate your day with intention</p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        onClick={addNewAction} 
                        size="sm" 
                        variant="ghost"
                        className="text-gray-600 hover:bg-gray-50 transition-colors duration-200 ease-in-out"
                    >
                        <Plus className="h-4 w-4 mr-2 opacity-70" />
                        Add Action
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        size="sm"
                        className="bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200 ease-in-out"
                    >
                        <Save className="h-4 w-4 mr-2 opacity-80" />
                        Save Plan
                    </Button>
                </div>
            </div>

            <ScrollArea className="h-[calc(100vh-240px)]">
                <div className="space-y-3 pr-2">
                    {editableActions.map((action, index) => (
                        <div 
                            key={index}
                            className={cn(
                                "group relative p-4 rounded-xl border border-transparent",
                                "bg-gray-50/50 hover:border-gray-200 transition-all duration-300 ease-in-out",
                                action.completed && "opacity-60 bg-gray-100/50"
                            )}
                        >
                            <div className="flex items-start gap-4">
                                <Checkbox
                                    checked={action.completed}
                                    onCheckedChange={(checked) => handleChange(index, 'completed', checked)}
                                    className="mt-2 border-gray-300"
                                />
                                
                                <div className="flex-1 space-y-3">
                                    <Input
                                        value={action.title}
                                        onChange={(e) => handleChange(index, 'title', e.target.value)}
                                        placeholder="What's your next meaningful action?"
                                        className="h-10 px-0 text-lg font-light text-gray-800 border-none shadow-none focus-visible:ring-0"
                                    />
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 opacity-70" />
                                            <Input
                                                type="number"
                                                value={action.duration}
                                                onChange={(e) => handleChange(index, 'duration', Number(e.target.value))}
                                                className="w-16 h-8 px-2 text-center bg-white/50 border-gray-200"
                                                min={1}
                                            />
                                            <span>min</span>
                                        </div>
                                    </div>
                                    
                                    {action.note || true && (
                                        <Textarea
                                            value={action.note}
                                            onChange={(e) => handleChange(index, 'note', e.target.value)}
                                            placeholder="Add a thoughtful note..."
                                            className="text-sm resize-none min-h-[60px] bg-white/50 border-gray-200 placeholder-gray-400"
                                        />
                                    )}
                                </div>
                                
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all"
                                    onClick={() => handleDelete(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {editableActions.length === 0 && (
                <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
                    <div className="space-y-3 text-center">
                        <Plus className="h-8 w-8 mx-auto text-gray-400" />
                        <h3 className="text-lg font-light text-gray-800">No actions planned</h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                            Your day is a canvas. Start painting your intentions.
                        </p>
                    </div>
                    <Button 
                        onClick={addNewAction} 
                        size="sm" 
                        className="bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                    >
                        Add First Action
                    </Button>
                </div>
            )}
        </div>
        </ScrollArea>
    );
};

export default ShowSuggestAiPlans;