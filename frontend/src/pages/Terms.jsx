import { Link } from "react-router-dom";

function Terms() {
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
          Terms of Service
        </h1>

        <section className="mt-8 space-y-8 text-gray-700 leading-7">
          <div>
            <h2 className="font-semibold text-gray-900">Use of the service</h2>
            <p className="mt-2">
              The application is provided as a developer productivity tool.
              Users are responsible for reviewing and validating generated
              technical responses before using them.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">Generated content</h2>
            <p className="mt-2">
              AI-generated responses can contain mistakes or incomplete
              information. They should not be treated as guaranteed technical
              advice.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">Availability</h2>
            <p className="mt-2">
              Service availability may change as infrastructure, providers,
              and application components are updated.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Terms;
