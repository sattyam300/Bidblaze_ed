
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface EnvConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EnvConfigDialog = ({ open, onOpenChange }: EnvConfigDialogProps) => {
  // Check if Supabase client is properly initialized
  const isSupabaseConfigured = Boolean(supabase);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isSupabaseConfigured ? "Supabase Connected" : "Environment Setup Required"}
          </DialogTitle>
          <DialogDescription>
            {isSupabaseConfigured 
              ? "Your Supabase project is connected. You can now use Supabase functionality."
              : "To use the Supabase integration, you need to connect your Supabase project in the Lovable dashboard."
            }
          </DialogDescription>
        </DialogHeader>
        
        {!isSupabaseConfigured && (
          <div className="space-y-4 my-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <p className="font-mono text-sm">
                <strong>Step 1:</strong> Click on the Supabase menu at the top right of the Lovable interface
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <p className="font-mono text-sm">
                <strong>Step 2:</strong> Connect to your Supabase project
              </p>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            {isSupabaseConfigured ? "Continue" : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnvConfigDialog;
