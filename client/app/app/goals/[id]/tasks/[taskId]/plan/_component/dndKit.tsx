"use client";
import { useState } from "react";
import { Action } from "@/utils/types";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export function SortableActions({ actions }: { actions ?: Action[] }) {
  const [items, setItems] = useState([
    {
        id: "adf",
        title: "Action 1",
        duration: 0,
        completed: false,
        task_id: "",
        day_id: "",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: "sadfs",
        title: "Action 2",
        duration: 0,
        completed: false,
        task_id: "",
        day_id: "",
        created_at: new Date(),
        updated_at: new Date()
    }
]);
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={() => {}}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((action) => (
          <div key={action.id} className="p-2 h-12 w-28 bg-white rounded-md border border-gray-300">
            {action.title}
          </div>
        ))}
      </SortableContext>
    </DndContext>
  );
}