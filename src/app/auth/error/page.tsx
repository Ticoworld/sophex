// src/app/auth/error/page.tsx

interface AuthErrorPageProps {
  searchParams: {
    error?: string;
  };
}

export default function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const error = searchParams?.error || 'Unknown error';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Authentication Error</h1>
      <p className="text-lg mb-4">An error occurred: {error}</p>
      <a
        href="/spin"
        className="px-6 py-2 bg-orange-500 rounded-lg text-lg font-semibold hover:bg-orange-600 transition"
      >
        Back to Spin Page
      </a>
    </div>
  );
}