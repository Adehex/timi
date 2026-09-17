export function FieldError({ messages }: { messages?: string[] }) {
  if (!messages || messages.length === 0) return null;
  return (
    <p role="alert" className="mt-1 text-xs text-danger-500">
      {messages[0]}
    </p>
  );
}
