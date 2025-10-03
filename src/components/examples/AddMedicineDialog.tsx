import { useState } from 'react';
import { AddMedicineDialog } from '../AddMedicineDialog';
import { Button } from '@/components/ui/button';

export default function AddMedicineDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <AddMedicineDialog 
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => console.log('Submitted:', data)}
      />
    </div>
  );
}
