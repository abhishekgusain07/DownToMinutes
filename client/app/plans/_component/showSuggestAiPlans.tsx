import React, { useState } from 'react';
import { Plan } from '@/utils/types';
import { createPlan } from '@/utils/data/plans/createPlan';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ShowSuggestAiPlansProps {
    plans: Plan[];
}

const ShowSuggestAiPlans: React.FC<ShowSuggestAiPlansProps> = ({ plans }) => {
    const [editablePlans, setEditablePlans] = useState<Plan[]>(plans.map(plan => ({ ...plan, from_time: plan.from_time || '', to_time: plan.to_time || '' })));

    const handleChange = (index: number, field: keyof Plan, value: Plan[keyof Plan]) => {
        const updatedPlans = [...editablePlans];
        updatedPlans[index] = { ...updatedPlans[index], [field]: value };
        setEditablePlans(updatedPlans);
    };

    const handleDelete = (index: number) => {
        const updatedPlans = [...editablePlans];
        updatedPlans.splice(index, 1);
        setEditablePlans(updatedPlans);
    };

    const handleSubmit = async () => {
        try {
            // await Promise.all(editablePlans.map(plan => createPlan(plan)));
            alert('Plans saved successfully!');
        } catch (error) {
            console.error('Error saving plans:', error);
            alert('Failed to save plans.');
        }
    };

    return (
        <div className='w-full h-full'>
            <h2>Suggested AI Plans</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Effectiveness</TableHead>
                        <TableHead>Distractions</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {editablePlans.map((plan, index) => (
                        <TableRow key={index+1}>
                            <TableCell>{plan.id}</TableCell>
                            <TableCell>
                                <input
                                    type="text"
                                    value={plan.task}
                                    onChange={(e) => handleChange(index, 'task', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <input
                                    type="text"
                                    value={plan.description}
                                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <input
                                    type="datetime-local"
                                    value={plan.from_time}
                                    onChange={(e) => handleChange(index, 'from_time', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <input
                                    type="datetime-local"
                                    value={plan.to_time}
                                    onChange={(e) => handleChange(index, 'to_time', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <select
                                    value={plan.status}
                                    onChange={(e) => handleChange(index, 'status', e.target.value)}
                                >
                                    <option value="NOT_STARTED">Not Started</option>
                                    <option value="STARTED">Started</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                </select>
                            </TableCell>
                            <TableCell>
                                <input
                                    type="number"
                                    value={plan.effectiveness}
                                    onChange={(e) => handleChange(index, 'effectiveness', Number(e.target.value))}
                                />
                            </TableCell>
                            <TableCell>
                                <input
                                    type="number"
                                    value={plan.distractions}
                                    onChange={(e) => handleChange(index, 'distractions', Number(e.target.value))}
                                />
                            </TableCell>
                            <TableCell>
                                <button onClick={() => handleDelete(index)}>Delete</button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <button onClick={handleSubmit}>Create Plans</button>
        </div>
    );
};

export default ShowSuggestAiPlans;