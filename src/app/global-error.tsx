'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Lỗi hệ thống!
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {error.message || 'Đã xảy ra lỗi nghiêm trọng. Vui lòng thử lại.'}
              </p>
            </div>
            <div>
              <button
                onClick={() => reset()}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 