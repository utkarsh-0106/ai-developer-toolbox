import { Link } from "react-router-dom";

function Privacy() {
  return (
    <div className="min-h-screen bg-[#f6f7f9] text-[#111318]">
      <header className="border-b border-black/10 bg-white">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-semibold tracking-tight">
            AI Developer Toolbox
          </Link>
          <Link to="/" className="text-sm text-gray-600 hover:underline">
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          Legal
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Privacy Policy
        </h1>

        <p className="mt-6 text-gray-600 leading-7">
          AI Developer Toolbox processes prompts submitted through the
          application so that the service can generate responses and maintain
          prompt history.
        </p>

        <section className="mt-10 space-y-8 text-gray-700 leading-7">
          <div>
            <h2 className="font-semibold text-gray-900">Information stored</h2>
            <p className="mt-2">
              Submitted prompts and generated responses may be stored in the
              application's database for history functionality.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">API processing</h2>
            <p className="mt-2">
              Prompts may be sent to the configured AI provider to generate a
              response.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">Data deletion</h2>
            <p className="mt-2">
              Users can delete stored prompt history through the application.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Privacy;
