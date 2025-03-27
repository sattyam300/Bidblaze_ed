
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EnvConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EnvConfigDialog = ({ open, onOpenChange }: EnvConfigDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Environment Setup Required</DialogTitle>
          <DialogDescription>
            To use the Supabase integration, you need to configure the following environment variables:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 my-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <p className="font-mono text-sm"><strong>VITE_SUPABASE_URL</strong>: Your Supabase project URL</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <p className="font-mono text-sm"><strong>VITE_SUPABASE_ANON_KEY</strong>: Your Supabase anonymous key</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnvConfigDialog;
