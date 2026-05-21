import { GitBranchIcon} from 'lucide-react';
import Link from 'next/link';

export function Bottom() {
  return (
    <section id='github' className="py-20 px-6 bg-linear-to-r from-[#2D3844] via-[#62240C] to-[#2D3844] ">
      <div className="max-w-4xl mx-auto text-center space-y-6 ">
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Ready to start drawing?
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          First sign-up required. Start creating beautiful diagrams in seconds.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {/* <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-blue-700 transition-all transform hover:scale-105 hover:shadow-xl flex items-center gap-2 group">
            Launch Excalidraw
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button> */}
          <Link href={"https://github.com/Codersintu/Excailedraw"}>
          <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all transform hover:scale-105 hover:shadow-xl flex items-center gap-2">
            <GitBranchIcon className="w-5 h-5" />
            View on GitHub
          </button>
          </Link>
        </div>

        <div className="pt-12 border-t border-gray-200 mt-12">
          <p className="text-teal-500 text-sm">
            Open source and free forever. Made with love by the community ❤️
          </p>
        </div>
      </div>
    </section>
  );
}