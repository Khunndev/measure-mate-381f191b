import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const MeasurementCard = ({ children, onClear, onSave, showConfirmDialog, setShowConfirmDialog, confirmSave, saveButtonRef }) => {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-4 sm:p-6">
        {children}
      </CardContent>
      
      <CardFooter className="flex justify-center space-x-4 p-4 sm:p-6">
        <Button variant="outline" onClick={onClear} className="w-full sm:w-32">
          <Trash2 className="mr-2 h-4 w-4" /> Clear
        </Button>
        <Button onClick={onSave} className="w-full sm:w-32 bg-primary hover:bg-primary-dark" ref={saveButtonRef}>
          <Save className="mr-2 h-4 w-4" /> บันทึก
        </Button>
      </CardFooter>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Save</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการที่จะบันทึกข้อมูลหรือไม่ ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave}>บันทึก</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default MeasurementCard;
