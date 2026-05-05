import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { Icons, Icon } from '../utils/icons.jsx';
import '../index.css';

const steps = [
  { icon: Icons.profile, title: 'Create Profile', desc: 'List skills you teach and want to learn' },
  { icon: Icons.search, title: 'Discover Peers', desc: 'Browse mentors and learners worldwide' },
  { icon: Icons.handshake, title: 'Start Swapping', desc: 'Send requests, schedule, and learn together' }
];

const features = [
  { icon: Icons.boltSolid, title: 'AI Match', desc: 'Smart skill matching' },
  { icon: Icons.chat, title: 'Chat & WhatsApp', desc: 'Connect how you want' },
  { icon: Icons.starSolid, title: 'Trust Reviews', desc: 'Verified peer ratings' },
  { icon: Icons.trophy, title: 'Skill Credits', desc: 'Earn by teaching' },
  { icon: Icons.lightbulb, title: 'Community Blog', desc: 'Share your insights' },
  { icon: Icons.academicCap, title: 'Certificates', desc: 'Get proof of learning' },
  { icon: Icons.mapPin, title: 'Local Search', desc: 'Find mentors nearby' },
  { icon: Icons.calendar, title: 'Smart Schedule', desc: 'Auto-synced sessions' }
];

const Landing = () => (
  <div className="min-h-screen">
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-20 space-y-12 sm:space-y-16 lg:space-y-20 animate-fade-in">
      {/* Hero */}
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <div className="space-y-6 sm:space-y-8 animate-slide-up">
          <div className="inline-block">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-brand-100 to-accent-100 text-brand-700 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2">
              <Icon icon={Icons.logoSolid} size="sm" />
              Peer tutoring reimagined
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            Trade <span className="gradient-text">knowledge</span>,<br />
            grow <span className="gradient-text">faster</span>.
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed">
            SkillSwap connects learners worldwide. Teach guitar for French, code for design—the possibilities are endless.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button className="btn-gradient text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 shadow-lg hover:shadow-xl w-full sm:w-auto">
                Get started free
              </Button>
            </Link>
            <Link to="/discover" className="w-full sm:w-auto">
              <Button variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-auto">
                Explore skills
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative mt-8 lg:mt-0" >
          <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl card-hover space-y-4 sm:space-y-6 glass-card">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg sm:text-xl">Upcoming Session</h3>
              <span className="px-2 sm:px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-xs font-semibold">
                Tomorrow
              </span>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white flex-shrink-0">
                  <Icon icon={Icons.sparklesSolid} size="lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">Spanish ↔️ Guitar</p>
                  <p className="text-xs sm:text-sm text-slate-500">Exchange session</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <Icon icon={Icons.calendar} size="sm" />
                <span>Tomorrow • 6:00 PM</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <Icon icon={Icons.computer} size="sm" />
                <span>Online meeting</span>
              </div>
            </div>
            <Button className="w-full btn-gradient-accent text-sm sm:text-base">Join Session</Button>
          </div>
          <div className="absolute -top-6 -right-6 w-24 h-24 sm:w-32 sm:h-32 bg-accent-200 rounded-full blur-3xl opacity-50 animate-pulse-slow"></div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 sm:w-32 sm:h-32 bg-brand-200 rounded-full blur-3xl opacity-50 animate-pulse-slow"></div>
        </div>
      </div>

      {/* How it works */}
      <div className="space-y-8 sm:space-y-12">
        <div className="text-center space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">How it works</h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600">Start swapping skills in three simple steps</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 card-hover text-center space-y-3 sm:space-y-4 glass-card"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="mb-3 sm:mb-4 flex justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-slow">
                  <Icon icon={step.icon} size="2xl" className="text-white" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">{step.title}</h3>
              <p className="text-sm sm:text-base text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-8 sm:space-y-12">
        <div className="text-center space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Why SkillSwap?</h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600">Everything you need to learn and teach</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="glass rounded-lg sm:rounded-xl p-4 sm:p-6 card-hover space-y-2 sm:space-y-3 glass-card">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center shadow-md">
                <Icon icon={feature.icon} size="lg" className="text-white" />
              </div>
              <h4 className="font-bold text-sm sm:text-base lg:text-lg">{feature.title}</h4>
              <p className="text-xs sm:text-sm text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center space-y-4 sm:space-y-6 shadow-2xl glass-card">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">Ready to start learning?</h2>
        <p className="text-base sm:text-lg lg:text-xl text-slate-600">Join thousands of learners trading skills every day</p>
        <Link to="/register" className="inline-block w-full sm:w-auto">
          <Button className="btn-gradient text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 shadow-lg hover:shadow-xl w-full sm:w-auto">
            Create free account
          </Button>
        </Link>
      </div>
    </section>
  </div>
);

export default Landing;
