import { Icons, Icon } from '../utils/icons.jsx';

const ContactPage = () => (
  <div className="min-h-screen">
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text">
          Contact Us
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Have a question, suggestion, or just want to say hello? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="glass rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon icon={Icons.send} size="lg" className="text-brand-500" />
            Send us a message
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.target);
              alert(`Thanks ${data.get('name')}! We'll get back to you soon. ✅`);
              e.target.reset();
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:outline-none transition-all text-slate-900 bg-white/80"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:outline-none transition-all text-slate-900 bg-white/80"
              />
            </div>
            <div>
              <label htmlFor="contact-subject" className="block text-sm font-semibold text-slate-700 mb-1">
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                required
                placeholder="How can we help?"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:outline-none transition-all text-slate-900 bg-white/80"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-700 mb-1">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                placeholder="Tell us more..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:outline-none transition-all text-slate-900 bg-white/80 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Icon icon={Icons.send} size="md" />
              Send Message
            </button>
          </form>
        </div>

        {/* Info + Map */}
        <div className="space-y-6">
          {/* Contact Info Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Icons.mapPin, title: 'Our Location', text: 'FAST NUCES, Lahore, Pakistan', color: 'from-blue-500 to-cyan-500' },
              { icon: Icons.chat, title: 'Email Us', text: 'hello@skillswap.app', color: 'from-purple-500 to-pink-500' },
              { icon: Icons.globe, title: 'Platform', text: 'Available worldwide, 24/7', color: 'from-green-500 to-teal-500' },
              { icon: Icons.clock, title: 'Support Hours', text: 'Mon–Fri, 9am – 6pm PKT', color: 'from-orange-500 to-yellow-500' }
            ].map(({ icon, title, text, color }) => (
              <div key={title} className="glass rounded-xl p-4 shadow-md flex items-start gap-3 card-hover">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <Icon icon={icon} size="md" className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">{title}</p>
                  <p className="text-xs text-slate-600">{text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Google Maps Embed */}
          <div className="glass rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/30 flex items-center gap-2">
              <Icon icon={Icons.mapPin} size="md" className="text-brand-500" />
              <span className="font-bold text-slate-900 text-sm">Find Us on the Map</span>
            </div>
            <iframe
              title="SkillSwap Location — FAST NUCES Lahore"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3403.111!2d74.301!3d31.4815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391903f08ebc7e35%3A0x27f9b0f18c64273c!2sFAST%20NUCES%20Lahore!5e0!3m2!1sen!2s!4v1715100000000!5m2!1sen!2s"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default ContactPage;
