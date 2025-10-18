import React from 'react';

interface ReminderToastProps {
  message: string;
}

const ReminderToast: React.FC<ReminderToastProps> = ({ message }) => {
  return (
    <div className="fixed bottom-6 right-6 bg-slate-800 text-slate-100 shadow-lg rounded-lg px-4 py-3">
      {message}
    </div>
  );
};

export default ReminderToast;
