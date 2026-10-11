export default function ErrorNotice({ message }: { message: string }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message}
    </p>
  );
}
