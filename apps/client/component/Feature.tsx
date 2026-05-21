import { Pencil, Users, Lock, Zap, Download, Palette } from 'lucide-react';

const features = [
  {
    icon: Pencil,
    title: 'Hand-Drawn Style',
    description: 'Create beautiful diagrams with a hand-drawn, sketch-like aesthetic that feels natural and engaging.',
    color: 'blue',
  },
  {
    icon: Users,
    title: 'Real-time Collaboration',
    description: 'Work together with your team in real-time. See changes as they happen and collaborate seamlessly.',
    color: 'purple',
  },
  {
    icon: Lock,
    title: 'End-to-End Encrypted',
    description: 'Your data is encrypted and secure. Privacy is built into every feature we create.',
    color: 'green',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built for speed and performance. No lag, no delays, just smooth drawing experience.',
    color: 'yellow',
  },
  {
    icon: Download,
    title: 'Export Anywhere',
    description: 'Export your drawings as PNG, SVG, or clipboard. Integrate with your favorite tools.',
    color: 'pink',
  },
  {
    icon: Palette,
    title: 'Customizable',
    description: 'Choose from multiple themes, colors, and styles to make your drawings truly yours.',
    color: 'indigo',
  },
];

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200' },
  yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', border: 'border-yellow-200' },
  pink: { bg: 'bg-pink-50', icon: 'text-pink-600', border: 'border-pink-200' },
  indigo: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-200' },
};

export default function Feature(){

    return(
      <div id='feature' className="w-full min-h-screen bg-linear-to-r from-[#2D3844] via-[#62240C] to-[#2D3844]">
         <div className="w-full max-w-7xl mx-auto px-5">
             <div className="space-y-8 py-4">
                <div className="flex flex-col items-center gap-2">
                    <h1 className='text-2xl md:text-5xl font-bold text-center text-gray-200'>Everything you need to sketch</h1>
                    <span className='text-gray-400 text-xl text-center max-w-2xl mx-auto'>Powerful features wrapped in a simple, intuitive interface</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <>
                  {features.map((f,idx)=>{
                    const Icon=f.icon
                    const color=colorMap[f.color]
                    return (
                      <div key={idx} className={`w-full max-w-xl shadow-2xs bg-gray-200 flex flex-col gap-3 p-5 rounded-xl`}>
                        <div className={`w-14 h-14 ${color.border} ${color.bg} rounded-2xl flex items-center justify-center`}><Icon className={`${color.icon} w-8 h-8}`}/></div>
                        <h1 className='text-xl font-semibold'>{f.title}</h1>
                        <span className='text-sm font-medium text-gray-600'>{f.description}</span>
                      </div>
                    )
                  })}
                  </>
                </div>
             </div>
         </div>
      </div>
    )
}