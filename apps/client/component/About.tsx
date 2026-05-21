import { Code, Presentation, GitBranch, Lightbulb } from 'lucide-react';

const showcases = [
  {
    icon: Code,
    title: 'Technical Diagrams',
    description: 'Architecture diagrams, flowcharts, and system designs',
  },
  {
    icon: Presentation,
    title: 'Presentations',
    description: 'Visual slides and interactive presentations',
  },
  {
    icon: GitBranch,
    title: 'Wireframes',
    description: 'UI/UX mockups and user flow diagrams',
  },
  {
    icon: Lightbulb,
    title: 'Brainstorming',
    description: 'Mind maps and creative thinking sessions',
  },
];

export function About() {
  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Built for every use case
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From quick sketches to detailed diagrams, Pencildraw adapts to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {showcases.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-3 hover:rotate-6 transition-transform">
                  <Icon className="w-8 h-8" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-float"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full animate-float-delayed"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full animate-pulse-slow"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold">
              Trusted by millions worldwide
            </h3>
            <p className="text-xl text-blue-100">
              Join developers, designers, and teams from companies of all sizes
            </p>
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">10M+</div>
                <div className="text-blue-100">Monthly Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">50M+</div>
                <div className="text-blue-100">Drawings Created</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">100K+</div>
                <div className="text-blue-100">GitHub Stars</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}