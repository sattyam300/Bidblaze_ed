
import { Checkbox } from "@/components/ui/checkbox";

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const TermsCheckbox = ({ checked, onChange }: TermsCheckboxProps) => {
  return (
    <div className="flex items-start space-x-2">
      <input 
        type="checkbox" 
        id="terms" 
        className="rounded border-gray-300 text-primary focus:ring-primary mt-1"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
        I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a>, <a href="#" className="text-primary hover:underline">Privacy Policy</a>, and understand that my application will be reviewed before approval
      </label>
    </div>
  );
};

export default TermsCheckbox;
