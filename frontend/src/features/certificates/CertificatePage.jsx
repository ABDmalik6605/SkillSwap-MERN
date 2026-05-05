import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchBookings } from '../bookings/bookingsSlice.js';
import { Icons, Icon } from '../../utils/icons.jsx';
import Button from '../../components/ui/Button.jsx';
import toast from 'react-hot-toast';

const generateCertificate = async (booking, userName) => {
  // Dynamically import jsPDF so it's only loaded when needed
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // --- Background ---
  doc.setFillColor(245, 243, 255); // light purple
  doc.rect(0, 0, W, H, 'F');

  // Decorative border
  doc.setDrawColor(124, 58, 237); // purple-600
  doc.setLineWidth(4);
  doc.rect(8, 8, W - 16, H - 16, 'S');
  doc.setLineWidth(1);
  doc.setDrawColor(167, 139, 250); // purple-400
  doc.rect(12, 12, W - 24, H - 24, 'S');

  // --- Header accent bar ---
  doc.setFillColor(124, 58, 237);
  doc.rect(0, 0, W, 18, 'F');

  // --- Logo text in accent bar ---
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('🎓 SkillSwap', W / 2, 12, { align: 'center' });

  // --- Title ---
  doc.setTextColor(76, 29, 149); // purple-900
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('Certificate of Completion', W / 2, 55, { align: 'center' });

  // Decorative line
  doc.setDrawColor(124, 58, 237);
  doc.setLineWidth(1.5);
  doc.line(W / 2 - 70, 62, W / 2 + 70, 62);

  // --- "This certifies that" ---
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('This is to certify that', W / 2, 78, { align: 'center' });

  // --- Recipient Name ---
  doc.setFontSize(30);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(124, 58, 237);
  doc.text(userName, W / 2, 96, { align: 'center' });

  // Underline for name
  const nameWidth = doc.getTextWidth(userName);
  doc.setDrawColor(167, 139, 250);
  doc.setLineWidth(0.8);
  doc.line(W / 2 - nameWidth / 2, 99, W / 2 + nameWidth / 2, 99);

  // --- Body text ---
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);
  doc.text('has successfully completed a Skill Swap session on the SkillSwap platform.', W / 2, 114, { align: 'center' });

  // --- Session details box ---
  doc.setFillColor(237, 233, 254); // purple-100
  doc.setDrawColor(167, 139, 250);
  doc.setLineWidth(0.5);
  doc.roundedRect(W / 2 - 70, 122, 140, 30, 4, 4, 'FD');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(76, 29, 149);
  doc.text('Session Details', W / 2, 131, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);
  const sessionDate = booking.confirmedSchedule
    ? new Date(booking.confirmedSchedule).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';
  doc.text(`Date: ${sessionDate}   |   Mode: ${booking.meetingType || 'Online'}`, W / 2, 142, { align: 'center' });

  // --- Footer ---
  doc.setFillColor(124, 58, 237);
  doc.rect(0, H - 18, W, 18, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text(
    `Issued on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}   |   SkillSwap Platform   |   Certificate ID: SS-${booking._id?.slice(-8).toUpperCase()}`,
    W / 2,
    H - 8,
    { align: 'center' }
  );

  doc.save(`SkillSwap-Certificate-${userName.replace(/\s/g, '_')}.pdf`);
};

const CertificatePage = () => {
  const dispatch = useDispatch();
  const { items: bookings, status } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const completedBookings = bookings.filter((b) => b.isCompleted);

  const handleGenerate = async (booking) => {
    try {
      await generateCertificate(booking, user?.name || 'Learner');
      toast.success('Certificate downloaded! 🎓');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate certificate. Please try again.');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold gradient-text flex items-center gap-2">
          <Icon icon={Icons.academicCap} size="lg" />
          My Certificates
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Download PDF certificates for your completed skill-swap sessions.
        </p>
      </div>

      {/* How it works */}
      <div className="glass rounded-2xl p-5 shadow-md flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md flex-shrink-0">
          <Icon icon={Icons.lightbulb} size="md" className="text-white" />
        </div>
        <div>
          <p className="font-bold text-slate-900 text-sm">How to earn certificates</p>
          <p className="text-slate-600 text-xs mt-1">
            Complete a booking session — once a host marks it as completed, a certificate becomes
            available for you to download here as a PDF.
          </p>
        </div>
      </div>

      {/* Loading */}
      {status === 'loading' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="glass rounded-2xl p-6 space-y-3 animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-1/2" />
              <div className="h-3 bg-slate-200 rounded w-3/4" />
              <div className="h-10 bg-slate-200 rounded-xl w-40 mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Completed Sessions */}
      {status !== 'loading' && completedBookings.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {completedBookings.map((booking) => (
            <div
              key={booking._id}
              className="glass rounded-2xl p-5 shadow-lg card-hover space-y-4 border-l-4 border-green-400"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    <Icon icon={Icons.checkSolid} size="sm" />
                    Completed
                  </span>
                  <p className="font-bold text-slate-900 text-sm mt-1">
                    {booking.confirmedSchedule
                      ? new Date(booking.confirmedSchedule).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Date not set'}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    Mode: {booking.meetingType || 'Online'} · Duration: {booking.duration || 60} min
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <Icon icon={Icons.academicCap} size="lg" className="text-white" />
                </div>
              </div>
              <Button
                onClick={() => handleGenerate(booking)}
                className="btn-gradient w-full flex items-center justify-center gap-2 text-sm"
              >
                <Icon icon={Icons.paperAirplane} size="sm" />
                Download PDF Certificate
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {status !== 'loading' && completedBookings.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
            <Icon icon={Icons.academicCap} size="3xl" className="text-slate-400" />
          </div>
          <p className="text-slate-600 text-lg font-medium">No completed sessions yet</p>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Complete a booking to unlock your first certificate. Head to the Bookings page to view
            your upcoming sessions.
          </p>
        </div>
      )}
    </div>
  );
};

export default CertificatePage;
