import React, { useId, useState } from "react";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { EditIcon } from "@/app/icons/EditIcon";
import { TrashIcon } from "@/app/icons/TrashIcon";

interface FieldName {
  name: string;
  placeholder?: string;
}

interface ToggleFieldProps extends React.PropsWithChildren {
  title: string;
  initialOpen?: boolean;
  onToggle?: () => void;
  name?: string;
  editable?: boolean;
  setFieldNames?: React.Dispatch<React.SetStateAction<FieldName[]>>;
  idx?: number;
  blockToggleState?: boolean;
  setUpgradeOpen?: (open: boolean) => void;
  placeholder?: string;
}

export const ToggleField: React.FC<ToggleFieldProps> = ({
  title,
  children,
  initialOpen = false,
  onToggle,
  name,
  editable,
  setFieldNames,
  idx,
  blockToggleState,
  setUpgradeOpen,
  placeholder,
}) => {
  const id = useId();
  const [open, setOpen] = useState(initialOpen);
  const [editLabel, setEditLabel] = useState(false);

  return (
    <div className="my-3">
      <div className="flex">
        <Label htmlFor={id} className="grow">
          {title}
        </Label>
        {editable && (
          <>
            <EditIcon
              className="w-5 h-5 mr-4"
              size={5}
              onClick={() => setEditLabel(!editLabel)}
            />

            <TrashIcon
              className="mr-4"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                setFieldNames?.((prev) => {
                  const updatedFieldNames = [...prev];
                  updatedFieldNames.splice(idx!, 1);
                  setEditLabel(false);
                  return updatedFieldNames;
                });
              }}
            />
          </>
        )}
        <Switch
          id={id}
          name={name}
          checked={open}
          onCheckedChange={
            blockToggleState
              ? () => setUpgradeOpen?.(true)
              : (x) => {
                  setOpen(x);
                  onToggle?.();
                }
          }
        />
      </div>
      {editLabel && (
        <div className="p-2">
          <div className="mt-2">
            <Input
              defaultValue={title}
              label="Field Name"
              onChange={(e) => {
                e.preventDefault();
                setFieldNames?.((prev) => {
                  const updatedFieldNames = [...prev];
                  if (idx !== undefined) {
                    updatedFieldNames[idx].name = e.target.value;
                  }
                  return updatedFieldNames;
                });
              }}
            />
          </div>
          <div className="mt-4">
            <Input
              defaultValue={placeholder}
              label="Placeholder"
              className="p-2"
              onChange={(e) => {
                e.preventDefault();
                setFieldNames?.((prev) => {
                  const updatedFieldNames = [...prev];
                  if (idx !== undefined) {
                    updatedFieldNames[idx].placeholder = e.target.value;
                  }
                  return updatedFieldNames;
                });
              }}
            />
          </div>
        </div>
      )}
      {open && children && <div className="py-2 mb-2">{children}</div>}
    </div>
  );
};
