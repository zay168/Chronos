import React from 'react';

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="border rounded px-2 py-1 w-full" {...props} />;
}
export default Textarea;
